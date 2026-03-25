#!/usr/bin/env python3
"""
seed_april_events.py — Crea todos los eventos de Abril 2026 en la API de MAT32.
Abre X-J-V-S (miércoles, jueves, viernes, sábado).

Uso:
    python3 scripts/seed_april_events.py
    python3 scripts/seed_april_events.py --dry-run   # muestra los eventos sin crear
    python3 scripts/seed_april_events.py --api http://localhost:3003
"""
import json
import sys
import os
import argparse
import ssl
import urllib.request
import urllib.error

_ssl_ctx = ssl.create_default_context()
_ssl_ctx.check_hostname = False
_ssl_ctx.verify_mode = ssl.CERT_NONE

# ── CONFIG ──────────────────────────────────────────────────────────────────
API_URL = os.environ.get("MAT32_API", "http://localhost:3003")
ADMIN_EMAIL = os.environ.get("MAT32_EMAIL", "")
ADMIN_PASS  = os.environ.get("MAT32_PASS", "")

# ── EVENTOS ABRIL 2026 ───────────────────────────────────────────────────────
EVENTS = [
    # ─── SEMANA 1 (1-4 Abr) ─── color: oscuro estándar ──────────────────────
    {
        "id": "evt-salsa-0401",
        "title": "Salsa en Ruzafa",
        "slug": "salsa-ruzafa-mat32-1-abril-2026",
        "date": "2026-04-01",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Noche de salsa en vinilo en el corazón de Ruzafa. Sones cubanos, salsa dura neoyorkina y ritmos tropicales seleccionados desde el disco. Sin lista de canciones fija, sin setlist predefinido: pura improvisación sobre la pista de baile más pequeña de Valencia. Fania All Stars, Celia Cruz, Willie Colón, Héctor Lavoe — y todo lo que quede entre medias.",
        "category": "Baile",
        "imageUrl": "/flyers/e_wed_0401.svg",
        "attendees": 0,
        "capacity": 50,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["tropical", "baile", "latinoamerica", "vinilo"],
        "status": "published",
        "tags": ["salsa", "latin", "baile", "ruzafa", "valencia", "vinilo", "fania", "cuba"]
    },
    {
        "id": "evt-cumbia-0402",
        "title": "Noche de Cumbia",
        "slug": "cumbia-mat32-2-abril-2026",
        "date": "2026-04-02",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Cumbia colombiana, cumbia villera y sus derivas más extrañas, seleccionadas en vinilo. Desde los clásicos de Discos Fuentes hasta las versiones más oscuras que nunca salieron de Barranquilla. El jueves perfecto para olvidarse del miércoles.",
        "category": "Baile",
        "imageUrl": "/flyers/e_thu_0402.svg",
        "attendees": 0,
        "capacity": 50,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["cumbia", "colombia", "caribe", "baile"],
        "status": "published",
        "tags": ["cumbia", "colombia", "caribe", "latin", "ruzafa", "valencia", "vinilo"]
    },
    {
        "id": "evt-electricavenue-fri-0403",
        "title": "Electric Avenue — Deep House Cuts",
        "slug": "electric-avenue-deep-house-mat32-3-abril-2026",
        "date": "2026-04-03",
        "time": "21:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "La sesión de viernes de MAT32. Deep house de Chicago y Detroit seleccionado en vinilo original: Larry Heard, Ron Trent, Moodymann, Kerri Chandler. Sin monitores baratos, sin playlist de streaming. Sólo el Altec A7 y mucho tiempo entre cada disco.",
        "category": "Club",
        "imageUrl": "/flyers/e_fri_0403.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["deep house", "chicago", "detroit", "vinilo"],
        "status": "published",
        "tags": ["deep house", "chicago", "vinyl", "electric avenue", "ruzafa", "valencia", "larry heard", "moodymann"]
    },
    {
        "id": "evt-crate-0404",
        "title": "Crate Diggers — Disco, House & Italo",
        "slug": "crate-diggers-disco-house-italo-mat32-4-abril-2026",
        "date": "2026-04-04",
        "time": "22:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Sábado de Crate Diggers en MAT32. Disco clásico, house de los noventa e italo poco conocido seleccionado desde el fondo de la caja. Forgotten bangers que no van a encontrar en ningún algoritmo. Entrada libre, aforo limitado al local.",
        "category": "Club",
        "imageUrl": "/flyers/e_sat_0404.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["disco", "italo", "house", "vinilo"],
        "status": "published",
        "tags": ["disco", "italo disco", "house", "forgotten bangers", "crate diggers", "ruzafa", "valencia"]
    },

    # ─── SEMANA 2 (8-11 Abr) ─── color: naranja invertido ───────────────────
    {
        "id": "evt-bolero-0408",
        "title": "Noche de Bolero",
        "slug": "bolero-mat32-8-abril-2026",
        "date": "2026-04-08",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Bolero cubano y mexicano en vinilo. Voces de los años cincuenta y sesenta que no necesitan contexto. Una copa, la aguja sobre el disco y la conversación que surge sola. Benny Moré, Agustín Lara, Toña la Negra, Los Panchos.",
        "category": "Escucha",
        "imageUrl": "/flyers/e_wed_0408.svg",
        "attendees": 0,
        "capacity": 40,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["bolero", "romantico", "voz", "cuba", "mexico"],
        "status": "published",
        "tags": ["bolero", "cuba", "mexico", "latinoamerica", "vinilo", "ruzafa", "benny more", "agustin lara"]
    },
    {
        "id": "evt-jazz-0409",
        "title": "Sesión de Jazz en Vinilo",
        "slug": "sesion-jazz-vinilo-mat32-9-abril-2026",
        "date": "2026-04-09",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Sesión de escucha de jazz en vinilo original. Blue Note, Prestige, Impulse: discos que suenan diferente sobre los Altec A7 del local. Nada de jazz de fondo. Jazz de verdad, escuchado de verdad. Miles Davis, Coltrane, Mingus, Monk, y lo que traiga el selector del día.",
        "category": "Escucha",
        "imageUrl": "/flyers/e_thu_0409.svg",
        "attendees": 0,
        "capacity": 40,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["jazz", "blue note", "escucha", "vinilo"],
        "status": "published",
        "tags": ["jazz", "blue note", "prestige", "vinilo", "miles davis", "coltrane", "ruzafa", "valencia", "listening session"]
    },
    {
        "id": "evt-electricavenue-fri-0410",
        "title": "Electric Avenue — Forgotten Bangers",
        "slug": "electric-avenue-forgotten-bangers-mat32-10-abril-2026",
        "date": "2026-04-10",
        "time": "21:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Viernes de Electric Avenue en MAT32. Esta semana: forgotten bangers. Tracks sin clasificar que no entraron en ninguna lista, rarezas que aparecen de vez en cuando en una caja de Wallapop, ediciones originales de sellos que ya no existen. Música que merece un sistema de sonido de verdad.",
        "category": "Club",
        "imageUrl": "/flyers/e_fri_0410.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["forgotten bangers", "rare", "vinilo", "unclassified"],
        "status": "published",
        "tags": ["forgotten bangers", "rarezas", "vinyl only", "electric avenue", "ruzafa", "valencia"]
    },
    {
        "id": "evt-electronica-jazz-0411",
        "title": "Sesión Hi-Fi — Electrónica & Jazz",
        "slug": "sesion-hifi-electronica-jazz-mat32-11-abril-2026",
        "date": "2026-04-11",
        "time": "20:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Sesión especial Hi-Fi en MAT32 Ruzafa. Electrónica contemporánea y jazz en vinilo seleccionado. Floating Points, Pharoah Sanders, Four Tet, Nils Frahm — música pensada para escucharse de pie, en silencio, prestando atención. Aforo muy limitado, ticket 5€ para garantizar la experiencia.",
        "category": "Especial",
        "imageUrl": "/flyers/e_special_0411.svg",
        "attendees": 0,
        "capacity": 30,
        "price": 5,
        "paidPrice": 5,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["electronica", "jazz", "hi-fi", "escucha profunda"],
        "status": "published",
        "tags": ["electronica", "jazz", "hi-fi", "listening session", "floating points", "ruzafa", "valencia", "ticket"]
    },

    # ─── SEMANA 3 (15-18 Abr) ─── color: crema / papel ──────────────────────
    {
        "id": "evt-soul-0415",
        "title": "Soul Night — Memphis & Stax",
        "slug": "soul-night-memphis-stax-mat32-15-abril-2026",
        "date": "2026-04-15",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Miércoles de soul en MAT32. Stax Records, Motown, deep funk y todo lo que huele a Memphis y Detroit. Soul en vinilo original, sin remaster, sin compresión digital. Otis Redding, Al Green, Marvin Gaye, Sharon Jones. La música que estaba en los discos antes de que existieran las plataformas.",
        "category": "Club",
        "imageUrl": "/flyers/e_wed_0415.svg",
        "attendees": 0,
        "capacity": 50,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["soul", "memphis", "stax", "funk", "vinilo"],
        "status": "published",
        "tags": ["soul", "stax", "motown", "memphis", "funk", "vinilo", "ruzafa", "valencia", "otis redding"]
    },
    {
        "id": "evt-idm-0416",
        "title": "IDM Session — Música Electrónica Inteligente",
        "slug": "idm-session-electronica-mat32-16-abril-2026",
        "date": "2026-04-16",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Sesión de IDM en el sistema Hi-Fi de MAT32. Aphex Twin, Autechre, Boards of Canada, µ-Ziq — música electrónica que no cabe en ninguna pista de baile pero que necesita un buen sistema para entenderse. Sesión de escucha activa, sin mezcla, con pausa entre discos.",
        "category": "Escucha",
        "imageUrl": "/flyers/e_thu_0416.svg",
        "attendees": 0,
        "capacity": 40,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["idm", "electronica", "experimental", "escucha"],
        "status": "published",
        "tags": ["idm", "electronica", "aphex twin", "autechre", "boards of canada", "vinilo", "ruzafa", "valencia"]
    },
    {
        "id": "evt-electricavenue-fri-0417",
        "title": "Electric Avenue — Italo Disco Classics",
        "slug": "electric-avenue-italo-disco-mat32-17-abril-2026",
        "date": "2026-04-17",
        "time": "21:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Viernes de italo disco en MAT32. Los clásicos que pusieron el synth en la pista de baile antes de que llegara el house. Giorgio Moroder, Italo Boot Mix, Righeira, Klein + MBO — y todo lo que el selector encuentre en la caja de los ochenta. Vinilo only, sistema Altec A7.",
        "category": "Club",
        "imageUrl": "/flyers/e_fri_0417.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["italo disco", "80s", "synth", "vinilo"],
        "status": "published",
        "tags": ["italo disco", "80s", "giorgio moroder", "synth pop", "electric avenue", "ruzafa", "valencia", "vinilo"]
    },
    {
        "id": "evt-unclassics-0418",
        "title": "Crate Diggers — Unclassics",
        "slug": "crate-diggers-unclassics-mat32-18-abril-2026",
        "date": "2026-04-18",
        "time": "22:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Crate Diggers edición Unclassics en MAT32. Los discos que no salen en ningún top, que no tienen entrada en Discogs destacada, que aparecen por error en un mercadillo. Disco funk, boogie, b-sides y caras B que merecían ser caras A. Entrada libre.",
        "category": "Club",
        "imageUrl": "/flyers/e_sat_0418.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["unclassics", "b-sides", "disco", "funk", "obscure"],
        "status": "published",
        "tags": ["unclassics", "b-sides", "disco", "funk", "crate diggers", "ruzafa", "valencia", "forgotten"]
    },

    # ─── SEMANA 4 (22-25 Abr) ─── color: oscuro, naranja como texto ──────────
    {
        "id": "evt-ambient-0422",
        "title": "Ambient Session — Música para Escuchar",
        "slug": "ambient-session-mat32-22-abril-2026",
        "date": "2026-04-22",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Sesión de ambient en el sistema de escucha Hi-Fi de MAT32. Brian Eno, Harold Budd, Stars of the Lid, William Basinski — ambient que necesita volumen real para mostrarse. El espacio del local, el sistema Altec, y tiempo para dejar que cada disco respire.",
        "category": "Escucha",
        "imageUrl": "/flyers/e_wed_0422.svg",
        "attendees": 0,
        "capacity": 40,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["ambient", "drone", "escucha profunda", "vinilo"],
        "status": "published",
        "tags": ["ambient", "brian eno", "harold budd", "drone", "vinilo", "ruzafa", "valencia", "listening session"]
    },
    {
        "id": "evt-dub-0423",
        "title": "Dub Session — Echo y Riddim",
        "slug": "dub-session-echo-riddim-mat32-23-abril-2026",
        "date": "2026-04-23",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Sesión de dub jamaicano seleccionado en vinilo. King Tubby, Lee Scratch Perry, Scientist, Augustus Pablo — el dub que inventó el remix antes de que existiera el remix. Bajo, eco y mucho espacio. El sistema de sonido de MAT32 para lo que fue diseñado.",
        "category": "Club",
        "imageUrl": "/flyers/e_thu_0423.svg",
        "attendees": 0,
        "capacity": 50,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["dub", "reggae", "roots", "jamaica"],
        "status": "published",
        "tags": ["dub", "reggae", "jamaica", "king tubby", "lee scratch perry", "vinilo", "ruzafa", "valencia"]
    },
    {
        "id": "evt-electricavenue-fri-0424",
        "title": "Electric Avenue — Afrobeat & Highlife",
        "slug": "electric-avenue-afrobeat-mat32-24-abril-2026",
        "date": "2026-04-24",
        "time": "21:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "Viernes de afrobeat en MAT32. Fela Kuti, Tony Allen, Afrobeat original de Lagos en vinilo. Highlife ghanés, jùjú nigeriano y todo lo que conecta con la raíz rítmica de la música negra. Vinyl only, sin concesiones.",
        "category": "Club",
        "imageUrl": "/flyers/e_fri_0424.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["afrobeat", "highlife", "nigeria", "ghana", "vinilo"],
        "status": "published",
        "tags": ["afrobeat", "fela kuti", "tony allen", "highlife", "nigeria", "electric avenue", "ruzafa", "valencia"]
    },
    {
        "id": "evt-house-0425",
        "title": "Crate Diggers — House Night",
        "slug": "crate-diggers-house-night-mat32-25-abril-2026",
        "date": "2026-04-25",
        "time": "22:00",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "House de Chicago, Detroit y Nueva York seleccionado desde la caja. Larry Heard, Mr. Fingers, Frankie Knuckles, Ron Hardy — el house que salía de noche y llegaba de día. Sólo prensados originales, sin reediciones, sin WAV. Crate Diggers en su formato más puro.",
        "category": "Club",
        "imageUrl": "/flyers/e_sat_0425.svg",
        "attendees": 0,
        "capacity": 80,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["house", "chicago", "detroit", "warehouse", "vinilo"],
        "status": "published",
        "tags": ["house", "chicago house", "larry heard", "frankie knuckles", "crate diggers", "ruzafa", "valencia", "vinilo"]
    },

    # ─── SEMANA 5 (29-30 Abr) ─── color: oscuro cálido ──────────────────────
    {
        "id": "evt-house-wed-0429",
        "title": "Miércoles de House — Vinyl Only",
        "slug": "miercoles-house-vinyl-mat32-29-abril-2026",
        "date": "2026-04-29",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "House en vinilo para empezar la semana corta de abril. Deep, soulful, con tiempo entre track y track. Sin mezcla perfecta, sin cuantización: solo la aguja, el disco y el volumen justo. MAT32 entre semana es diferente: más pequeño, más cerca.",
        "category": "Club",
        "imageUrl": "/flyers/e_wed_0429.svg",
        "attendees": 0,
        "capacity": 50,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["house", "deep", "soulful", "vinilo"],
        "status": "published",
        "tags": ["house", "deep house", "soulful house", "vinyl only", "ruzafa", "valencia"]
    },
    {
        "id": "evt-soul-jazz-0430",
        "title": "Soul & Jazz — Fin de Abril",
        "slug": "soul-jazz-fin-abril-mat32-30-abril-2026",
        "date": "2026-04-30",
        "time": "19:30",
        "location": "MAT32 · Ruzafa, Valencia",
        "description": "El último jueves de abril en MAT32. Soul y jazz para cerrar el mes: Blue Note de los sesenta, Prestige, Riverside. Grant Green, Horace Silver, Sonny Rollins, Lee Morgan. Una selección para beber despacio y hablar de música.",
        "category": "Escucha",
        "imageUrl": "/flyers/e_thu_0430.svg",
        "attendees": 0,
        "capacity": 50,
        "price": 0,
        "paidPrice": 0,
        "ticketLink": "",
        "lineup": [],
        "vibe": ["soul", "jazz", "blue note", "vinilo"],
        "status": "published",
        "tags": ["soul", "jazz", "blue note", "grant green", "horace silver", "sonny rollins", "ruzafa", "valencia", "vinilo"]
    },
]

# ── HELPERS ──────────────────────────────────────────────────────────────────

def api_call(path, method="GET", body=None, token=None):
    url = f"{API_URL}{path}"
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10, context=_ssl_ctx) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"  HTTP {e.code}: {err[:200]}")
        return None

def login(email, password):
    res = api_call("/auth/login", "POST", {"email": email, "pass": password})
    if res and res.get("ok"):
        return res.get("token")
    return None

# ── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    global API_URL
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="No crea eventos, solo muestra los datos")
    parser.add_argument("--api", default=API_URL, help="URL base de la API")
    args = parser.parse_args()

    API_URL = args.api

    if args.dry_run:
        print(f"\n── DRY RUN — {len(EVENTS)} eventos ──\n")
        for e in EVENTS:
            print(f"  {e['date']} {e['time']}  {e['title']}")
            print(f"    Flyer: {e['imageUrl']}")
            print(f"    Tags:  {', '.join(e['tags'][:5])}")
            print()
        return

    # Auth
    email = ADMIN_EMAIL or input("Email admin: ").strip()
    password = ADMIN_PASS or input("Password: ").strip()

    print(f"\nConectando a {API_URL}...")
    token = login(email, password)
    if not token:
        print("Error de autenticación. Comprueba las credenciales.")
        sys.exit(1)
    print("✓ Autenticado\n")

    ok = 0
    fail = 0
    for e in EVENTS:
        print(f"  Creando: {e['date']} — {e['title']} ...", end=" ")
        payload = {
            "title":       e["title"],
            "slug":        e["slug"],
            "description": e["description"],
            "date":        e["date"],
            "time":        e["time"],
            "venue":       e.get("location", "MAT32"),
            "capacity":    e.get("capacity", 80),
            "status":      e.get("status", "published"),
            "cover_url":   e.get("imageUrl", ""),
            "price":       e.get("price", 0),
            "tags":        e.get("tags", []),
        }
        res = api_call("/events", "POST", payload, token)
        if res:
            print("✓")
            ok += 1
        else:
            print("✗ error")
            fail += 1

    print(f"\n── Resultado: {ok} creados, {fail} errores ──")

if __name__ == "__main__":
    main()
