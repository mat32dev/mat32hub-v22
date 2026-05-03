# MAT32 · RESTYLE v2 · FINAL — HANDOFF

Fecha: 04 mayo 2026
Dirección elegida: **02 ALMACÉN CALIENTE + GUIÑO (CLAUDIA)**

---

## Qué hay aquí

```
handoff/
├── README.md                          ← este archivo
└── MAT32-Restyle-v2-FINAL.html        ← deck completo, autocontenido (2.7 MB)
```

El HTML es **standalone**: no necesita servidor, ni internet, ni dependencias.
Se abre haciendo doble click. Funciona offline.

---

## Cómo verlo

- Doble click en `MAT32-Restyle-v2-FINAL.html`
- O servirlo con cualquier static server (ej. `python -m http.server`)

**Navegación:**
- `→` / `←`  o flechas pantalla — siguiente / anterior slide
- `F` — pantalla completa
- `Cmd/Ctrl + P` — exportar a PDF (una página por slide)

---

## Subir al VPS

Es un **único archivo HTML autocontenido**. Para publicarlo basta con copiarlo
al servidor y enlazarlo:

```bash
# desde el VPS (ejemplo nginx / cualquier static)
scp MAT32-Restyle-v2-FINAL.html user@vps:/var/www/mat32.com/restyle/v2/index.html

# o por rsync respetando permisos
rsync -avz MAT32-Restyle-v2-FINAL.html user@vps:/var/www/mat32.com/restyle/v2/index.html
```

URL sugerida: `https://mat32.com/restyle/v2/`

No requiere build step ni Node ni nada. Es HTML+JS+SVG inline.

---

## Estructura del deck (16 slides)

```
01 Cover                  — portada (lado A, 33⅓)
02 Posicionamiento        — almacén caliente / guiño Claudia
03 Ejes web               — qué hace la web
04 Home mockup            — landing /
05 Landing eventos        — /eventos hero
06 Agenda                 — /eventos listing
07 Discos                 — /discos (tienda + crate digger)
08 Radio                  — /radio · Allegretto! (Thorens TD-160D + constelación)
09 Diario                 — /diario (editorial)
10 Privados               — /privados (alquiler local + catering + calendar)
11 Tipografía             — Exo 2 + EB Garamond + IBM Plex Mono
12 Paleta                 — paper / ink / orange / amarillo Claudia
13 Logo refresh           — refresh sutil del logotipo
14 Merch sistema          — sistema gráfico aplicado
15 Antes / Después        — comparativa
16 Roadmap                — fases de implementación
17 Cierre                 — firma
```

---

## Si Claude Code (Sonnet / Opus) lo va a llevar a producción

El deck es la **especificación visual y de copy** del restyle. Para implementarlo
en el codebase real (`mat32-src/`):

1. **Tokens** (de slides 11 + 12):
   - Fonts: `Exo 2 900` (display), `EB Garamond italic` (serif), `IBM Plex Mono` (mono)
   - Colors: `#f1e8d8` (paper), `#1a1611` (ink), `#c8462a` (orange), `#d8ff5a` (yellow Claudia), `#4a3f2e` (mid)
   - Texturas: grain SVG sutil, líneas 1.5px, sin bordes redondeados grandes

2. **Páginas afectadas en `mat32-src/pages/`**:
   - `Home.tsx` ← slide 04
   - `Events.tsx` + `EventDetail.tsx` ← slides 05–06
   - `Records.tsx` + `RecordDetail.tsx` ← slide 07
   - `Radio.tsx` ← slide 08 (mantener Thorens player y constelación; refrescar tipografía/paleta)
   - `Community.tsx` o nueva página `/diario` ← slide 09
   - `PrivateEvents.tsx` ← slide 10 (mantener calendar embed + form; bajar el "TECH_SPECS" underscored y aplicar el lenguaje editorial)

3. **Lo que no toca**: backend (`dataService`, inbox, sobremesa), routing, lógica.
   Solo capa visual + copy.

4. **Lo que sí mantener tal cual**:
   - Player Thorens TD-160D con disco girando + brazo moviéndose
   - Constelación de tracks (NeuralTree)
   - Drag & drop sobre el plato
   - Calendar embed de Google en /privados
   - Cross-sell de catering con sus precios reales (6/12/18 €)
   - Mascota Claudia (donde aparezca)
   - WhatsApp directo `+34 622 19 08 02`

---

## Contacto interno

Cualquier duda sobre intención de diseño: re-abrir la slide concreta y leer copy +
microtipografía. Todo el lenguaje está deliberadamente elegido — no parafrasear.
