#!/usr/bin/env python3
"""
DISCOGS DEMAND RADAR — Encuentra discos con alto ratio want/have
Busca en géneros clave los discos más demandados y menos disponibles.
Output: ~/.openclaw/workspace/digger/state/demand_radar.json

Uso:
  python3 discogs_demand_radar.py              # run completo
  python3 discogs_demand_radar.py --top 50     # solo top 50 resultados
  python3 discogs_demand_radar.py --genre funk  # solo un género
"""
import urllib.request, urllib.parse, json, time, os, sys
from datetime import datetime

STATE_DIR = os.path.expanduser('~/.openclaw/workspace/digger/state')
os.makedirs(STATE_DIR, exist_ok=True)

DISCOGS_TOKEN = 'gtUurCfPduiAKiXjrZUVtBzNbIvPFpGTqDOJsHMC'
HEADERS = {
    'User-Agent': 'MAT32DiggerRadar/1.0 +https://mat32.com',
    'Authorization': f'Discogs token={DISCOGS_TOKEN}',
}

# Géneros y estilos a rastrear
GENRES = {
    'funk_soul': {
        'genre': 'Funk / Soul',
        'styles': ['Funk', 'Soul', 'Disco', 'Boogie', 'P.Funk'],
    },
    'electronic': {
        'genre': 'Electronic',
        'styles': ['Deep House', 'House', 'Ambient', 'Electro', 'Techno', 'Downtempo'],
    },
    'house': {
        'genre': 'Electronic',
        'styles': ['House', 'Deep House', 'Acid House', 'Chicago House', 'Garage House'],
    },
    'library': {
        'genre': 'Funk / Soul',
        'styles': ['Library'],
    },
    'brazilian': {
        'genre': 'Latin',
        'styles': ['MPB', 'Bossa Nova', 'Samba', 'Tropicália'],
    },
    'afrobeat': {
        'genre': 'Folk, World, & Country',
        'styles': ['Afrobeat', 'Highlife', 'Afro-Cuban'],
    },
    'jazz': {
        'genre': 'Jazz',
        'styles': ['Free Jazz', 'Modal', 'Spiritual Jazz', 'Jazz-Funk', 'Fusion'],
    },
}

# Páginas por estilo (cada página = 100 releases, rate limit 60/min)
PAGES_PER_STYLE = 2
MIN_WANTS = 20        # mínimo wants para considerar
MIN_RATIO = 2.0       # mínimo ratio want/have
REQUEST_DELAY = 1.1   # segundos entre requests (rate limit Discogs)


def fetch_json(url):
    """Fetch JSON con rate limiting y retry."""
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 30 * (attempt + 1)
                print(f'  Rate limited, esperando {wait}s...')
                time.sleep(wait)
            else:
                print(f'  HTTP {e.code}: {url}')
                return None
        except Exception as e:
            print(f'  Error: {e}')
            time.sleep(3)
    return None


def search_style(genre, style, pages=PAGES_PER_STYLE):
    """Busca releases de un estilo ordenados por wants descendente."""
    results = []
    for page in range(1, pages + 1):
        params = urllib.parse.urlencode({
            'genre': genre,
            'style': style,
            'format': 'Vinyl',
            'sort': 'want',
            'sort_order': 'desc',
            'per_page': 100,
            'page': page,
        })
        url = f'https://api.discogs.com/database/search?{params}'
        print(f'  [{style}] página {page}...', end=' ')
        time.sleep(REQUEST_DELAY)

        data = fetch_json(url)
        if not data or 'results' not in data:
            print('sin datos')
            break

        batch = data['results']
        print(f'{len(batch)} releases')
        if not batch:
            break

        for r in batch:
            community = r.get('community', {})
            want = community.get('want', 0)
            have = community.get('have', 0)

            if want < MIN_WANTS:
                continue

            ratio = want / max(have, 1)
            if ratio < MIN_RATIO:
                continue

            results.append({
                'discogs_id': r.get('id'),
                'artist': (r.get('title', '').split(' - ')[0]).strip(),
                'title': ' - '.join(r.get('title', '').split(' - ')[1:]).strip(),
                'full_title': r.get('title', ''),
                'year': r.get('year', ''),
                'label': (r.get('label', [''])[0] if r.get('label') else ''),
                'format': ', '.join(r.get('format', [])),
                'genre_tag': style,
                'want': want,
                'have': have,
                'ratio': round(ratio, 2),
                'cover_url': r.get('cover_image', ''),
                'discogs_url': f"https://www.discogs.com/release/{r.get('id')}",
            })

    return results


def run(filter_genre=None, top_n=200):
    """Ejecuta el radar completo."""
    all_results = []
    genres_to_scan = GENRES

    if filter_genre:
        # Buscar match parcial
        matches = {k: v for k, v in GENRES.items() if filter_genre.lower() in k.lower()}
        if matches:
            genres_to_scan = matches
        else:
            print(f'Género "{filter_genre}" no encontrado. Disponibles: {", ".join(GENRES.keys())}')
            return

    print(f'=== DISCOGS DEMAND RADAR ===')
    print(f'Géneros: {", ".join(genres_to_scan.keys())}')
    print(f'Min wants: {MIN_WANTS} | Min ratio: {MIN_RATIO} | Top: {top_n}\n')

    for genre_key, config in genres_to_scan.items():
        genre = config['genre']
        print(f'\n── {genre_key.upper()} ({genre}) ──')
        for style in config['styles']:
            results = search_style(genre, style)
            all_results.extend(results)

    # Deduplicar por discogs_id
    seen = {}
    for r in all_results:
        did = r['discogs_id']
        if did not in seen or r['ratio'] > seen[did]['ratio']:
            seen[did] = r
    unique = list(seen.values())

    # Ordenar por ratio descendente
    unique.sort(key=lambda x: x['ratio'], reverse=True)
    top = unique[:top_n]

    # Guardar
    output = {
        'generated_at': datetime.now().isoformat(),
        'total_scanned': len(all_results),
        'unique': len(unique),
        'top_saved': len(top),
        'min_wants': MIN_WANTS,
        'min_ratio': MIN_RATIO,
        'records': top,
    }

    out_path = os.path.join(STATE_DIR, 'demand_radar.json')
    with open(out_path, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f'\n=== RESULTADO ===')
    print(f'Escaneados: {len(all_results)} | Únicos: {len(unique)} | Top guardados: {len(top)}')
    print(f'Guardado en: {out_path}\n')

    # Mostrar top 20
    print(f'TOP 20 RATIO WANT/HAVE:')
    print(f'{"RATIO":>7} {"WANT":>6} {"HAVE":>6}  DISCO')
    print('-' * 70)
    for r in top[:20]:
        print(f'{r["ratio"]:>7.1f} {r["want"]:>6} {r["have"]:>6}  {r["full_title"][:50]}')


if __name__ == '__main__':
    top = 200
    genre = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == '--top' and i + 1 < len(args):
            top = int(args[i + 1]); i += 2
        elif args[i] == '--genre' and i + 1 < len(args):
            genre = args[i + 1]; i += 2
        else:
            i += 1
    run(filter_genre=genre, top_n=top)
