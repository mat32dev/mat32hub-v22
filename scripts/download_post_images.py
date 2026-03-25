#!/usr/bin/env python3
"""Download post images from Wikipedia for each MAT32 post."""
import os, requests, time, urllib.request

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'posts')
os.makedirs(OUT, exist_ok=True)

HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; MAT32-bot/1.0)'}

POSTS = [
    ('basic-channel-dub-techno-berlin',        'Basic Channel discography'),
    ('sault-colectivo-anonimo-untitled',        'Sault (group)'),
    ('rhythm-and-sound-berlin-dub',             'Rhythm & Sound'),
    ('larry-heard-deep-house-chicago',          'Larry Heard'),
    ('gilles-peterson-worldwise-seleccion',     'Gilles Peterson'),
    ('jorge-ben-jor-africa-brasil',             'Jorge Ben Jor'),
    ('fela-kuti-afrobeat-nigeria',              'Fela Kuti'),
    ('madlib-discografia-esencial',             'Madlib'),
    ('prins-thomas-noruega-balearic-disco',     'Prins Thomas'),
    ('ennio-morricone-spaghetti-western',       'Ennio Morricone'),
    ('como-compramos-vinilos-mat32-politica',   'Phonograph record'),
    ('theo-parrish-sound-supreme-detroit',      'Theo Parrish'),
    ('buena-vista-social-club-historia-real',   'Buena Vista Social Club'),
    ('sun-ra-arkestra-jazz-espacial',           'Sun Ra'),
    ('mark-fell-musica-experimental-sheffield', 'SND (music group)'),
    ('sesiones-escucha-mat32-listening-sessions','Jazz kissa'),
    ('altec-a7-mat32-sistema-sonido',           'Altec Lansing'),
    ('floating-points-pharoah-sanders-promises','Floating Points'),
    ('alice-coltrane-journey-satchidananda',    'Alice Coltrane'),
    ('detroit-techno-historia-belleville-three','Detroit techno'),
]

def get_wiki_image(page_title):
    url = 'https://en.wikipedia.org/w/api.php'
    params = {
        'action': 'query', 'format': 'json', 'prop': 'pageimages',
        'titles': page_title, 'pithumbsize': 800, 'pilimit': 1
    }
    r = requests.get(url, params=params, headers=HEADERS, timeout=15)
    r.raise_for_status()
    pages = r.json().get('query', {}).get('pages', {})
    for page in pages.values():
        thumb = page.get('thumbnail', {})
        if thumb:
            return thumb.get('source')
    return None

def download_with_retry(url, dest_path, retries=4):
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            if r.status_code == 429:
                wait = 10 * (attempt + 1)
                print(f'    429 → esperando {wait}s...')
                time.sleep(wait)
                continue
            r.raise_for_status()
            with open(dest_path, 'wb') as f:
                f.write(r.content)
            return True
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(5)
            else:
                raise
    return False

ok, fail = 0, 0
for stem, wiki_title in POSTS:
    dest = os.path.join(OUT, f'{stem}.jpg')
    if os.path.exists(dest):
        print(f'  skip: {stem}')
        ok += 1
        continue
    try:
        img_url = get_wiki_image(wiki_title)
        if not img_url:
            print(f'  NO IMAGE: {stem} ({wiki_title})')
            fail += 1
            time.sleep(1)
            continue
        download_with_retry(img_url, dest)
        size = os.path.getsize(dest) // 1024
        print(f'  OK {size}KB: {stem}')
        ok += 1
        time.sleep(2)
    except Exception as e:
        print(f'  ERROR: {stem} → {e}')
        fail += 1
        time.sleep(2)

print(f'\n{ok} OK / {fail} failed')
