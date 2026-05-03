#!/usr/bin/env python3
"""
discogs_inventory_sync.py

Sincroniza el inventario público de un seller en Discogs con la tabla `records` de MAT32.

- Pagina /users/{username}/inventory de api.discogs.com
- UPSERT en records con seller_id='discogs-<username>'
- Marca como status='sold' los registros que estaban en BD pero ya no en Discogs
- Idempotente: se puede lanzar tantas veces como haga falta (cron)

Uso:
  python3 discogs_inventory_sync.py [username]  # por defecto: discos-ruzafa

Requiere: psycopg2-binary (`pip3 install psycopg2-binary`)
"""

import os
import sys
import time
import json
import urllib.request
import urllib.parse
import urllib.error
import psycopg2
import psycopg2.extras


USERNAME = sys.argv[1] if len(sys.argv) > 1 else 'discos-ruzafa'
SELLER_ID = f'discogs-{USERNAME}'
USER_AGENT = 'Mat32Bot/1.0 (+https://mat32.com)'
PER_PAGE = 100

DB_CONFIG = {
    'dbname':   os.environ.get('PGDATABASE', 'mat32db'),
    'user':     os.environ.get('PGUSER', 'ruzafa'),
    'password': os.environ.get('PGPASSWORD', 'ruzafa2025secure'),
    'host':     os.environ.get('PGHOST', 'localhost'),
    'port':     os.environ.get('PGPORT', '5432'),
}


# ── Discogs → MAT32 condition mapping ────────────────────────────
CONDITION_MAP = {
    'Mint (M)': 'M',
    'Near Mint (NM or M-)': 'NM',
    'Very Good Plus (VG+)': 'VG+',
    'Very Good (VG)': 'VG',
    'Good Plus (G+)': 'G+',
    'Good (G)': 'G',
    'Fair (F)': 'F',
    'Poor (P)': 'P',
    'Generic': 'Generic',
    'Not Graded': 'NM',
}


def fetch_page(username: str, page: int) -> dict:
    params = urllib.parse.urlencode({
        'per_page': PER_PAGE,
        'page': page,
        'sort': 'listed',
        'sort_order': 'desc',
    })
    url = f'https://api.discogs.com/users/{username}/inventory?{params}'
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode('utf-8'))


def fetch_release_full(release_id):
    """
    Descarga datos enriquecidos del release: cover, tracklist, videos YT, genres, styles, notes.
    Rate limit anónimo: 25/min → throttle en main loop.
    Devuelve dict con claves: cover_url, tracklist, videos, genres, styles, notes.
    """
    empty = {'cover_url': '', 'tracklist': [], 'videos': [], 'genres': [], 'styles': [], 'notes': ''}
    if not release_id:
        return empty
    url = f'https://api.discogs.com/releases/{release_id}'
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print('[discogs-sync] 429 en /releases, durmiendo 60s…', flush=True)
            time.sleep(60)
            return fetch_release_full(release_id)
        print(f'[discogs-sync] no se pudo obtener release {release_id}: {e}', flush=True)
        return empty
    except Exception as e:
        print(f'[discogs-sync] error release {release_id}: {e}', flush=True)
        return empty

    # Cover
    images = data.get('images') or []
    if images:
        primary = next((im for im in images if im.get('type') == 'primary'), images[0])
        cover = primary.get('uri') or primary.get('uri500') or ''
    else:
        cover = data.get('thumb') or ''

    # Tracklist → [{position, title, duration}]
    tracklist = []
    for t in (data.get('tracklist') or []):
        if t.get('type_') and t['type_'] != 'track':
            continue
        tracklist.append({
            'position': t.get('position') or '',
            'title':    t.get('title') or '',
            'duration': t.get('duration') or '',
            'artists':  [a.get('name') for a in (t.get('artists') or []) if a.get('name')],
        })

    # Videos Discogs-curated (YouTube)
    videos = []
    for v in (data.get('videos') or []):
        uri = v.get('uri') or ''
        if 'youtube.com' in uri or 'youtu.be' in uri:
            videos.append({
                'title':       v.get('title') or '',
                'uri':         uri,
                'duration':    v.get('duration') or 0,
                'description': (v.get('description') or '')[:500],
            })

    return {
        'cover_url': cover,
        'tracklist': tracklist,
        'videos':    videos,
        'genres':    data.get('genres') or [],
        'styles':    data.get('styles') or [],
        'notes':     (data.get('notes') or '')[:3000],
    }


def normalize_listing(l: dict) -> dict:
    """Convierte un listing de Discogs al shape de la tabla records."""
    release = l.get('release', {}) or {}
    price = l.get('price', {}) or {}
    artist = release.get('artist') or 'Unknown'
    title = release.get('title') or 'Untitled'
    year = release.get('year')
    # release.description suele ser "Label · Format · Country · Year" (rico para UI)
    description = release.get('description') or ''
    # Algunos valores vienen como 0 o None
    try:
        price_val = float(price.get('value') or 0)
    except (TypeError, ValueError):
        price_val = 0.0
    cover = release.get('thumbnail') or ''
    # Ocasionalmente la thumbnail está vacía; usar images[0].uri si está
    if not cover and isinstance(release.get('images'), list) and release['images']:
        cover = release['images'][0].get('uri') or cover

    listing_id = l.get('id')
    cond_raw = (l.get('condition') or '').strip()
    condition = CONDITION_MAP.get(cond_raw, 'NM')
    sleeve_cond_raw = (l.get('sleeve_condition') or '').strip()
    sleeve_cond = CONDITION_MAP.get(sleeve_cond_raw, '')

    slug = f'discogs-{listing_id}'

    # comments del LISTING = notas del vendedor
    comments = (l.get('comments') or '').strip()[:2000]
    if sleeve_cond:
        comments = (f'Funda: {sleeve_cond}. ' + comments).strip()

    return {
        'id':           f'discogs_{listing_id}',
        'sku':          f'DSC-{listing_id}',
        'artist':       artist[:500],
        'title':        title[:500],
        'price':        price_val,
        'genre':        '',
        'stock':        1,
        'cover_url':    cover,
        'status':       'published',
        'slug':         slug,
        'condition':    condition,
        'description':  description[:1500],
        'label':        '',
        'year':         str(year) if year else '',
        'format':       'LP',
        'discogs_link': l.get('uri') or f'https://www.discogs.com/sell/item/{listing_id}',
        'seller_id':    SELLER_ID,
        'tags':         json.dumps([]),
        'comments':     comments,
        'tracklist':    json.dumps([]),
        'videos':       json.dumps([]),
        'genres':       json.dumps([]),
        'styles':       json.dumps([]),
        'notes':        '',
    }


def upsert_record(cur, rec: dict):
    cur.execute(
        '''
        INSERT INTO records
          (id, sku, artist, title, price, genre, stock, cover_url, status, slug,
           condition, description, label, year, format, discogs_link, seller_id, tags,
           comments, tracklist, videos, genres, styles, notes)
        VALUES
          (%(id)s, %(sku)s, %(artist)s, %(title)s, %(price)s, %(genre)s, %(stock)s,
           %(cover_url)s, %(status)s, %(slug)s, %(condition)s, %(description)s,
           %(label)s, %(year)s, %(format)s, %(discogs_link)s, %(seller_id)s, %(tags)s,
           %(comments)s, %(tracklist)s, %(videos)s, %(genres)s, %(styles)s, %(notes)s)
        ON CONFLICT (id) DO UPDATE SET
          artist       = EXCLUDED.artist,
          title        = EXCLUDED.title,
          price        = EXCLUDED.price,
          stock        = EXCLUDED.stock,
          cover_url    = EXCLUDED.cover_url,
          status       = EXCLUDED.status,
          condition    = EXCLUDED.condition,
          description  = EXCLUDED.description,
          year         = EXCLUDED.year,
          genre        = EXCLUDED.genre,
          discogs_link = EXCLUDED.discogs_link,
          seller_id    = EXCLUDED.seller_id,
          comments     = EXCLUDED.comments,
          tracklist    = EXCLUDED.tracklist,
          videos       = EXCLUDED.videos,
          genres       = EXCLUDED.genres,
          styles       = EXCLUDED.styles,
          notes        = EXCLUDED.notes
        ''',
        rec,
    )


def main() -> int:
    # 1) Fetch todo el inventario (paginado)
    all_listings = []
    page = 1
    while True:
        try:
            data = fetch_page(USERNAME, page)
        except urllib.error.HTTPError as e:
            # Respeto básico al rate limit anónimo (25/min); si 429, dormir y reintentar
            if e.code == 429:
                print(f'[discogs-sync] 429 rate limit, durmiendo 60s…', flush=True)
                time.sleep(60)
                continue
            print(f'[discogs-sync] HTTP {e.code} en página {page}: {e.reason}', flush=True)
            return 2
        except Exception as e:
            print(f'[discogs-sync] error de red en página {page}: {e}', flush=True)
            return 2

        listings = data.get('listings') or []
        all_listings.extend(listings)

        pagination = data.get('pagination') or {}
        pages = int(pagination.get('pages') or 1)
        print(f'[discogs-sync] página {page}/{pages} — {len(listings)} listings (acumulado: {len(all_listings)})', flush=True)

        if page >= pages:
            break
        page += 1
        # Anti-rate-limit: pequeña pausa entre páginas
        time.sleep(1.5)

    print(f'[discogs-sync] total obtenido: {len(all_listings)}', flush=True)

    # 2) Normalizar y UPSERT
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        # Cache: qué records ya tenemos con cover → evitamos fetch al /releases/
        with conn.cursor() as cur_cache:
            cur_cache.execute(
                '''SELECT id, cover_url FROM records WHERE seller_id = %s''',
                (SELLER_ID,),
            )
            existing = {row[0]: row[1] for row in cur_cache.fetchall()}

        # Cache adicional: qué records ya tienen tracklist → para no re-fetch
        with conn.cursor() as cur_cache2:
            cur_cache2.execute(
                '''SELECT id FROM records
                   WHERE seller_id = %s
                     AND cover_url <> ''
                     AND tracklist IS NOT NULL
                     AND jsonb_array_length(COALESCE(tracklist, '[]'::jsonb)) > 0''',
                (SELLER_ID,),
            )
            enriched = {row[0] for row in cur_cache2.fetchall()}

        with conn:
            with conn.cursor() as cur:
                current_ids = set()
                fetched = 0
                for l in all_listings:
                    rec = normalize_listing(l)
                    release_id = (l.get('release') or {}).get('id')

                    if rec['id'] in enriched:
                        # Ya lo tenemos enriquecido. Skip fetch — pero forzamos conservar lo que hay en BD
                        # haciendo solo update de campos del listing (price, condition, comments).
                        cur.execute(
                            '''SELECT cover_url, tracklist, videos, genres, styles, notes
                               FROM records WHERE id = %s''',
                            (rec['id'],),
                        )
                        row = cur.fetchone()
                        if row:
                            rec['cover_url'] = row[0] or rec['cover_url']
                            rec['tracklist'] = json.dumps(row[1] or [])
                            rec['videos']    = json.dumps(row[2] or [])
                            rec['genres']    = json.dumps(row[3] or [])
                            rec['styles']    = json.dumps(row[4] or [])
                            rec['notes']     = row[5] or ''
                            # primer género como categoría principal
                            gs = row[3] or []
                            if gs: rec['genre'] = gs[0]
                    else:
                        # Nuevo o sin enriquecer → fetch full release
                        full = fetch_release_full(release_id)
                        if full['cover_url']: rec['cover_url'] = full['cover_url']
                        rec['tracklist'] = json.dumps(full['tracklist'])
                        rec['videos']    = json.dumps(full['videos'])
                        rec['genres']    = json.dumps(full['genres'])
                        rec['styles']    = json.dumps(full['styles'])
                        rec['notes']     = full['notes']
                        if full['genres']: rec['genre'] = full['genres'][0]
                        fetched += 1
                        time.sleep(2.5)  # throttle 25/min

                    upsert_record(cur, rec)
                    current_ids.add(rec['id'])
                print(f'[discogs-sync] {fetched} releases enriquecidos nuevos', flush=True)

                # 3) Marcar como sold los que estaban en BD con este seller pero ya no aparecen
                cur.execute(
                    '''SELECT id FROM records WHERE seller_id = %s''',
                    (SELLER_ID,),
                )
                db_ids = {r[0] for r in cur.fetchall()}
                missing = db_ids - current_ids
                if missing:
                    cur.execute(
                        '''UPDATE records SET status = 'sold', stock = 0
                           WHERE id = ANY(%s) AND seller_id = %s''',
                        (list(missing), SELLER_ID),
                    )
                    print(f'[discogs-sync] {len(missing)} marcados como sold', flush=True)

        print('[discogs-sync] OK', flush=True)
        return 0
    finally:
        conn.close()


if __name__ == '__main__':
    sys.exit(main())
