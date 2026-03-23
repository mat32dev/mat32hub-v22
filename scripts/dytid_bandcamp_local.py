#!/usr/bin/env python3
"""
RADIO → BANDCAMP ENRICHER (corre en Mac, no en VPS)
Toma los tracks de YouTube en radio.db que no tienen Bandcamp URL,
busca el link de compra desde aquí (Bandcamp bloquea la IP del VPS)
y actualiza radio.db en el servidor.

Uso:
  python3 scripts/dytid_bandcamp_local.py --limit 50
  python3 scripts/dytid_bandcamp_local.py --limit 100 --offset 50
"""
import sqlite3, os, ssl, re, time, argparse, subprocess, tempfile, html as html_module
import urllib.request, urllib.parse

VPS       = 'yousef-o@46.225.112.154'
RADIO_DB  = '~/.mat32/radio.db'
TMP_RADIO = os.path.join(tempfile.gettempdir(), 'radio_enrich_tmp.db')

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode    = ssl.CERT_NONE

def search_bandcamp(artist, title):
    """Devuelve bc_url limpia o None."""
    # Limpiar el título (radio.db a veces incluye label/año en el título)
    clean_title = re.sub(r'\s*-\s*[A-Z][^-]{3,}\s*\d{4}.*$', '', title).strip()
    clean_title = re.sub(r'\s*\(.*\)$', '', clean_title).strip()

    query = urllib.parse.quote(f'{artist} {clean_title}')
    url   = f'https://bandcamp.com/search?q={query}&item_type=t'
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        with urllib.request.urlopen(req, timeout=14, context=ssl_ctx) as r:
            raw = r.read().decode('utf-8', errors='ignore')

        links = re.findall(
            r'<li[^>]*class="[^"]*searchresult[^"]*"[^>]*>.*?<a[^>]+href="(https://[a-z0-9\-]+\.bandcamp\.com/track/[^"]+)"',
            raw, re.DOTALL
        )
        if not links:
            return None
        return html_module.unescape(links[0]).split('?')[0]
    except:
        return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit',  type=int, default=50,  help='Tracks a procesar (default 50)')
    ap.add_argument('--offset', type=int, default=0,   help='Offset para continuar')
    ap.add_argument('--delay',  type=float, default=1.0, help='Delay entre búsquedas (default 1s)')
    args = ap.parse_args()

    print(f'[RADIO BC ENRICHER] limit={args.limit} offset={args.offset}')
    print('Descargando radio.db del VPS...')
    subprocess.run(['scp', f'{VPS}:{RADIO_DB}', TMP_RADIO], check=True)

    db = sqlite3.connect(TMP_RADIO)
    db.row_factory = sqlite3.Row

    # Tracks con artista pero sin Bandcamp URL
    rows = db.execute("""
        SELECT id, artist, title FROM tracks
        WHERE bandcamp_url IS NULL
          AND artist IS NOT NULL AND artist != ''
        ORDER BY id ASC
        LIMIT ? OFFSET ?
    """, (args.limit, args.offset)).fetchall()

    total = len(rows); found = 0
    print(f'{total} tracks sin Bandcamp a procesar\n' + '─' * 60)

    for i, row in enumerate(rows):
        bc_url = search_bandcamp(row['artist'], row['title'])
        time.sleep(args.delay)

        if bc_url:
            db.execute('UPDATE tracks SET bandcamp_url=?, bandcamp_found=1 WHERE id=?', (bc_url, row['id']))
            db.commit()
            found += 1
            print(f'  ✅ [{i+1}/{total}] {row["artist"][:28]} — {row["title"][:24]}')
        else:
            # Marcar como revisado para no repetir
            db.execute('UPDATE tracks SET bandcamp_checked=1 WHERE id=?', (row['id'],))
            db.commit()
            print(f'  —  [{i+1}/{total}] {row["artist"][:28]} — {row["title"][:24]}')

    print('─' * 60)
    total_bc = db.execute('SELECT COUNT(*) FROM tracks WHERE bandcamp_url IS NOT NULL').fetchone()[0]
    print(f'Nuevos con Bandcamp: {found} | Total en radio.db: {total_bc}')
    db.close()

    print('\nSubiendo radio.db al VPS...')
    subprocess.run(['scp', TMP_RADIO, f'{VPS}:{RADIO_DB}'], check=True)
    print('✅ Listo.')
    print(f'Continuar: python3 scripts/dytid_bandcamp_local.py --offset {args.offset + args.limit} --limit {args.limit}')

if __name__ == '__main__':
    main()
