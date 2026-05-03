#!/usr/bin/env python3
"""
Scraper semanal de Instagram para Fondos Reservados.
Ejecución: cada domingo 04:00.
Requiere sesión instaloader autenticada (ver DEPLOY.md).
"""
import os, re, sys, json, argparse, datetime, time
from pathlib import Path

import psycopg2, requests, instaloader

TARGET_HANDLE = os.environ.get("FONDOS_IG_HANDLE", "bruscabo")
SESSION_USER = os.environ.get("INSTALOADER_USER", "")
SESSION_FILE = os.environ.get("INSTALOADER_SESSION", "")
LOCAL_IMAGE_DIR = Path(os.environ.get("FONDOS_IMAGE_DIR", "/home/yousef-o/sites/mat32/fondos"))
MAX_NEW_POSTS = int(os.environ.get("FONDOS_MAX_NEW", "40"))
MAX_TOTAL_SYNC = int(os.environ.get("FONDOS_MAX_SYNC", "200"))

PG = dict(user="ruzafa", password="ruzafa2025secure", host="localhost", database="mat32db")

# Regex patterns para extraer precio del caption
PRICE_PATTERNS = [
    re.compile(r"(\d{1,4}(?:[.,]\d{2})?)\s*€"),
    re.compile(r"€\s*(\d{1,4}(?:[.,]\d{2})?)"),
    re.compile(r"PVP[:\s]+(\d{1,4}(?:[.,]\d{2})?)", re.IGNORECASE),
    re.compile(r"(\d{1,4}(?:[.,]\d{2})?)\s*EUR", re.IGNORECASE),
]

# Heurística de categoría por hashtags/keywords del caption
CATEGORY_KEYWORDS = {
    "Mobiliario": ["silla", "mesa", "butaca", "sofá", "sofa", "sillón", "sillon", "mueble", "estanter", "aparador", "lámpara de pie", "banqueta"],
    "Deco": ["cuadro", "jarrón", "jarron", "espejo", "lámpara", "lampara", "decor", "objeto", "ceramica", "cerámica", "vinilo", "cartel", "póster", "poster"],
    "Iluminación": ["lámpara", "lampara", "aplique", "iluminación", "iluminacion", "foco", "luz"],
}


def extract_price_cents(caption: str):
    if not caption:
        return None
    for pat in PRICE_PATTERNS:
        m = pat.search(caption)
        if m:
            raw = m.group(1).replace(",", ".")
            try:
                return int(round(float(raw) * 100))
            except ValueError:
                continue
    return None


def guess_category(caption: str):
    c = (caption or "").lower()
    scores = {cat: sum(1 for kw in keys if kw in c) for cat, keys in CATEGORY_KEYWORDS.items()}
    best = max(scores.items(), key=lambda x: x[1])
    return best[0] if best[1] > 0 else "Otros"


def extract_title(caption: str):
    if not caption:
        return None
    first = caption.strip().split("\n", 1)[0]
    first = re.sub(r"[#@]\S+", "", first)   # quita hashtags/menciones
    first = re.sub(r"https?://\S+", "", first)
    first = first.strip(" ·-—|")
    return first[:120] if first else None


def extract_tags(caption: str):
    if not caption:
        return []
    return list({m.group(0)[1:].lower() for m in re.finditer(r"#\w+", caption)})[:10]


def download_image(url: str, dest: Path) -> bool:
    try:
        r = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code == 200:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(r.content)
            return True
    except Exception as e:
        print(f"[img] download failed {url}: {e}", file=sys.stderr)
    return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=MAX_TOTAL_SYNC)
    args = parser.parse_args()

    L = instaloader.Instaloader(
        download_pictures=False, download_videos=False, download_video_thumbnails=False,
        download_comments=False, save_metadata=False, compress_json=False, quiet=True,
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    )

    # Cargar sesión si está disponible
    if SESSION_USER:
        session_path = SESSION_FILE or f"{Path.home()}/.config/instaloader/session-{SESSION_USER}"
        if Path(session_path).exists():
            L.load_session_from_file(SESSION_USER, session_path)
            print(f"[auth] session loaded for {SESSION_USER}")
        else:
            print(f"[auth] session file not found: {session_path}. Running anonymous (may 403).", file=sys.stderr)
    else:
        print("[auth] no INSTALOADER_USER set. Running anonymous (may 403).", file=sys.stderr)

    try:
        profile = instaloader.Profile.from_username(L.context, TARGET_HANDLE)
    except Exception as e:
        print(f"[fatal] cannot load profile @{TARGET_HANDLE}: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"[profile] @{profile.username} · {profile.mediacount} posts · {profile.followers} seguidores")

    conn = psycopg2.connect(**PG)
    cur = conn.cursor()
    cur.execute("SELECT external_id FROM fondos_items WHERE source='instagram' AND handle=%s", (profile.username,))
    existing = {row[0] for row in cur.fetchall()}
    print(f"[db] existing: {len(existing)} items already scraped")

    new_count = 0
    update_count = 0
    total = 0
    for post in profile.get_posts():
        if total >= args.limit:
            break
        total += 1
        if post.shortcode in existing:
            continue  # ya lo tenemos (no re-descargamos)

        caption = post.caption or ""
        data = {
            "source": "instagram",
            "external_id": post.shortcode,
            "external_url": f"https://www.instagram.com/p/{post.shortcode}/",
            "handle": profile.username,
            "title": extract_title(caption),
            "description": None,
            "caption_raw": caption,
            "price_cents": extract_price_cents(caption),
            "currency": "EUR",
            "category": guess_category(caption),
            "tags": json.dumps(extract_tags(caption)),
            "published_at": post.date_utc,
            "scraped_at": datetime.datetime.utcnow(),
        }

        # Descargar imagen local (el CDN de IG expira)
        image_url = post.url
        image_local = None
        if image_url and not args.dry_run:
            local_path = LOCAL_IMAGE_DIR / f"{post.shortcode}.jpg"
            if not local_path.exists():
                if download_image(image_url, local_path):
                    image_local = f"/fondos/{post.shortcode}.jpg"
            else:
                image_local = f"/fondos/{post.shortcode}.jpg"
        data["image_url"] = image_local

        if args.dry_run:
            print(json.dumps({**data, "published_at": str(data["published_at"]), "scraped_at": str(data["scraped_at"])}, ensure_ascii=False))
        else:
            cur.execute(
                """
                INSERT INTO fondos_items (source, external_id, external_url, handle, title, caption_raw, price_cents, currency, category, image_url, tags, published_at, scraped_at, updated_at)
                VALUES (%(source)s, %(external_id)s, %(external_url)s, %(handle)s, %(title)s, %(caption_raw)s, %(price_cents)s, %(currency)s, %(category)s, %(image_url)s, %(tags)s, %(published_at)s, %(scraped_at)s, NOW())
                ON CONFLICT (source, external_id) DO UPDATE SET
                  caption_raw = EXCLUDED.caption_raw,
                  image_url = COALESCE(fondos_items.image_url, EXCLUDED.image_url),
                  scraped_at = EXCLUDED.scraped_at,
                  updated_at = NOW()
                RETURNING id, (xmax = 0) AS inserted
                """,
                data,
            )
            _, inserted = cur.fetchone()
            if inserted:
                new_count += 1
                if new_count >= MAX_NEW_POSTS:
                    break
            else:
                update_count += 1
        time.sleep(1)  # gentle

    if not args.dry_run:
        conn.commit()
    cur.close()
    conn.close()
    print(f"[done] new={new_count} updated={update_count} total_seen={total}")


if __name__ == "__main__":
    main()
