#!/usr/bin/env python3
"""
Scraper semanal de Pamono vendor — Fondos Reservados MAT32.

Fuente: https://www.pamono.es/productos?udropship_vendor={VENDOR_ID}
Recorre todas las páginas, extrae cada producto, descarga la imagen
en local y upserta en la tabla fondos_items.

Ejecución sugerida (cron VPS): domingos 04:00.
"""
import os, re, sys, json, datetime, time, argparse
from pathlib import Path
from urllib.parse import urljoin

import requests, psycopg2
from bs4 import BeautifulSoup

VENDOR_ID = os.environ.get("PAMONO_VENDOR_ID", "3005")
BASE_URL = "https://www.pamono.es/productos"
LOCAL_IMAGE_DIR = Path(os.environ.get("FONDOS_IMAGE_DIR", "/home/yousef-o/sites/mat32/fondos"))
MAX_PAGES = int(os.environ.get("PAMONO_MAX_PAGES", "10"))
DELAY_PAGE = float(os.environ.get("PAMONO_DELAY_PAGE", "1.5"))
DELAY_IMG = float(os.environ.get("PAMONO_DELAY_IMG", "0.3"))

PG = dict(user="ruzafa", password="ruzafa2025secure", host="localhost", database="mat32db")

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
HEADERS = {"User-Agent": UA, "Accept-Language": "es-ES,es;q=0.9"}

# Mapa heurístico para extraer categoría MAT32 del título Pamono
CATEGORY_KEYWORDS = [
    ("Iluminación", ["lámpara", "lampara", "aplique", "foco", "luz", "araña", "candelabro", "farol"]),
    ("Mobiliario", ["silla", "mesa", "butaca", "sofá", "sofa", "sillón", "sillon", "aparador", "estanter", "banqueta", "taburete", "escritorio", "cama", "banco"]),
    ("Deco", ["jarrón", "jarron", "espejo", "cuadro", "cerámica", "ceramica", "reloj", "ventilador", "escultura", "cartel", "póster", "poster", "alfombra", "bandeja"]),
]


def guess_category(title: str) -> str:
    t = (title or "").lower()
    for cat, keys in CATEGORY_KEYWORDS:
        if any(k in t for k in keys):
            return cat
    return "Otros"


def download_image(url: str, dest: Path) -> bool:
    if dest.exists():
        return True
    try:
        r = requests.get(url, timeout=30, headers=HEADERS)
        if r.status_code == 200 and len(r.content) > 1000:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(r.content)
            return True
        print(f"[img] {r.status_code} {url}", file=sys.stderr)
    except Exception as e:
        print(f"[img] failed {url}: {e}", file=sys.stderr)
    return False


def parse_card(card) -> dict | None:
    sku_raw = card.get("data-sku") or ""
    external_id = sku_raw.split("-", 1)[-1] if "-" in sku_raw else sku_raw
    if not external_id:
        return None

    link = card.find("a", class_="link-wrapper", href=True)
    if not link:
        return None
    url = link["href"]

    title_el = card.select_one("p.title, .title")
    title = title_el.get_text(strip=True) if title_el else None

    # Price: .regular-price[content="140"] trae número limpio
    price_cents = None
    price_el = card.select_one(".regular-price[content], [itemprop='price'][content]")
    if price_el and price_el.get("content"):
        try:
            price_cents = int(round(float(price_el["content"]) * 100))
        except ValueError:
            pass
    if price_cents is None:
        # fallback a texto
        ptxt = card.select_one(".price, .regular-price span")
        if ptxt:
            m = re.search(r"([\d.,]+)", ptxt.get_text())
            if m:
                try:
                    v = m.group(1).replace(".", "").replace(",", ".")
                    price_cents = int(round(float(v) * 100))
                except ValueError:
                    pass

    img_el = card.select_one("img.image, img[data-lazy]")
    image_url = None
    if img_el:
        image_url = img_el.get("data-lazy") or img_el.get("src") or None
        if image_url and image_url.startswith("data:"):
            image_url = None

    return {
        "external_id": external_id,
        "external_url": url,
        "title": title,
        "price_cents": price_cents,
        "image_cdn_url": image_url,
        "category": guess_category(title or ""),
    }


def scrape():
    session = requests.Session()
    session.headers.update(HEADERS)
    items = []
    seen = set()

    for page in range(1, MAX_PAGES + 1):
        params = {"udropship_vendor": VENDOR_ID}
        if page > 1:
            params["p"] = page
        url = BASE_URL
        r = session.get(url, params=params, timeout=30)
        if r.status_code != 200:
            print(f"[page {page}] HTTP {r.status_code}. stop.", file=sys.stderr)
            break
        soup = BeautifulSoup(r.text, "lxml")
        cards = soup.select("article.product-card")
        if not cards:
            print(f"[page {page}] no cards. stop.")
            break

        new_this_page = 0
        for c in cards:
            d = parse_card(c)
            if d and d["external_id"] not in seen:
                seen.add(d["external_id"])
                items.append(d)
                new_this_page += 1

        print(f"[page {page}] {len(cards)} cards · {new_this_page} new · total {len(items)}")
        if new_this_page == 0:
            break
        time.sleep(DELAY_PAGE)

    return items


def save(items, dry_run=False):
    if not items:
        print("[db] nothing to save")
        return
    conn = psycopg2.connect(**PG)
    cur = conn.cursor()
    cur.execute("SELECT external_id FROM fondos_items WHERE source='pamono'")
    existing = {r[0] for r in cur.fetchall()}

    new_count = 0; updated = 0
    for d in items:
        # Descargar imagen local
        image_local = None
        if d.get("image_cdn_url") and not dry_run:
            dest = LOCAL_IMAGE_DIR / f"pamono-{d['external_id']}.jpg"
            if download_image(d["image_cdn_url"], dest):
                image_local = f"/fondos/pamono-{d['external_id']}.jpg"
            time.sleep(DELAY_IMG)

        payload = {
            "source": "pamono",
            "external_id": d["external_id"],
            "external_url": d["external_url"],
            "handle": f"pamono-vendor-{VENDOR_ID}",
            "title": d["title"],
            "caption_raw": None,
            "price_cents": d["price_cents"],
            "currency": "EUR",
            "category": d["category"],
            "image_url": image_local,
            "tags": json.dumps([]),
            "published_at": datetime.datetime.utcnow(),
            "scraped_at": datetime.datetime.utcnow(),
        }

        if dry_run:
            print(json.dumps({**payload, "published_at": str(payload["published_at"]), "scraped_at": str(payload["scraped_at"])}, ensure_ascii=False))
        else:
            cur.execute(
                """
                INSERT INTO fondos_items (source, external_id, external_url, handle, title, caption_raw, price_cents, currency, category, image_url, tags, published_at, scraped_at, updated_at)
                VALUES (%(source)s, %(external_id)s, %(external_url)s, %(handle)s, %(title)s, %(caption_raw)s, %(price_cents)s, %(currency)s, %(category)s, %(image_url)s, %(tags)s, %(published_at)s, %(scraped_at)s, NOW())
                ON CONFLICT (source, external_id) DO UPDATE SET
                  title = EXCLUDED.title,
                  price_cents = EXCLUDED.price_cents,
                  category = EXCLUDED.category,
                  image_url = COALESCE(EXCLUDED.image_url, fondos_items.image_url),
                  external_url = EXCLUDED.external_url,
                  scraped_at = EXCLUDED.scraped_at,
                  updated_at = NOW()
                RETURNING (xmax = 0) AS inserted
                """,
                payload,
            )
            inserted = cur.fetchone()[0]
            if inserted: new_count += 1
            else: updated += 1

    if not dry_run:
        # Mark as sold any pamono item in DB that no longer appears in scrape
        scraped_ids = [d["external_id"] for d in items]
        cur.execute(
            "UPDATE fondos_items SET sold=TRUE, updated_at=NOW() WHERE source='pamono' AND external_id NOT IN %s AND NOT sold",
            (tuple(scraped_ids) or ("__none__",),)
        )
        now_sold = cur.rowcount
        conn.commit()
        print(f"[db] new={new_count} updated={updated} marked_sold={now_sold}")

    cur.close()
    conn.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    print(f"[start] Pamono vendor={VENDOR_ID} @ {datetime.datetime.utcnow().isoformat()}Z")
    items = scrape()
    print(f"[scrape] {len(items)} products total")
    save(items, dry_run=args.dry_run)
    print("[done]")


if __name__ == "__main__":
    main()
