# SCRIPTS MAT32 — Guía de uso

## LOCAL (Mac) — `mat32-src/scripts/`

---

### `dytid_bandcamp_local.py`
**Qué hace:** Enriquece los tracks de la radio con links de compra de Bandcamp.
Descarga `radio.db` del VPS, busca cada track en Bandcamp desde el Mac
(el VPS está bloqueado por Bandcamp con 403), y sube `radio.db` actualizado.

**Por qué en Mac:** Bandcamp bloquea la IP del VPS.

```bash
# Primeros 50 tracks
python3 scripts/dytid_bandcamp_local.py --limit 50

# Continuar desde donde dejaste (ir sumando el offset)
python3 scripts/dytid_bandcamp_local.py --limit 50 --offset 50
python3 scripts/dytid_bandcamp_local.py --limit 50 --offset 100
python3 scripts/dytid_bandcamp_local.py --limit 50 --offset 150
# etc. hasta cubrir los ~1231 tracks
```

**Resultado:** Cuando un track tiene match, aparece el botón "COMPRAR EN BANDCAMP"
en la radio de mat32.com automáticamente.

---

## VPS (`yousef-o@46.225.112.154`) — `~/`

---

### `dytid_scraper.py`
**Qué hace:** Descarga el archivo completo de doyoutrackid.com (oct 2021 → hoy).
Guarda en `~/.digger/dytid_tracks.db` con `play_count` por track.
Los tracks más escuchados en sets de DJs de todo el mundo.

```bash
ssh yousef-o@46.225.112.154
python3 ~/dytid_scraper.py
# Tarda horas — corre en background:
nohup python3 ~/dytid_scraper.py > ~/logs/dytid_scraper.log 2>&1 &
```

---

### `dytid_to_radio_weekly.py`
**Qué hace:** Inyecta el 5% de los tracks de `dytid_tracks.db` en `radio.db`
cada semana. Prioriza los más escuchados.
**Cron:** lunes 09:00 (`0 9 * * 1`)

```bash
# Ejecutar manualmente
python3 ~/dytid_to_radio_weekly.py

# Ver estado
cat ~/.mat32/dytid_inject_state.json
```

---

### `dytid_bandcamp_match.py`
**Qué hace:** Versión del matcher Bandcamp para correr en VPS.
⚠️ Actualmente inútil porque Bandcamp bloquea la IP del VPS.
Usar `scripts/dytid_bandcamp_local.py` desde Mac en su lugar.

---

### `radio_scraper.py`
**Qué hace:** Scrapea los 27 canales de YouTube configurados.
Extrae tracklists de las descripciones (timecodes), guarda en `radio.db`.
Es el scraper principal de contenido para la radio de mat32.com.

```bash
nohup python3 ~/radio_scraper.py > ~/logs/radio_scraper.log 2>&1 &
tail -f ~/logs/radio_scraper.log
```

---

### `digger_app.py`
**Qué hace:** Flask app del Digger en `digger.synthsound.es` (port 5555).
Interfaz web para explorar wantlist, deals y tracks de DYTID.

```bash
# Gestión via systemd (no ejecutar directamente)
sudo systemctl status digger
sudo systemctl restart digger
```

---

### `switch-claude-model.sh`
**Qué hace:** Cambia el modelo de Matias (agente WhatsApp) entre Haiku y Opus.

```bash
~/switch-claude-model.sh haiku    # modo normal (barato)
~/switch-claude-model.sh opus     # modo experto (caro)
```

---

### `start_digger.sh` / `start_befers.sh`
**Qué hacen:** Scripts de arranque manual de Digger y Befers.
Normalmente no son necesarios — systemd los gestiona.

---

### `backup-openclaw.sh`
**Qué hace:** Backup de la configuración de Matias (OpenClaw).

---

## BASES DE DATOS

| Archivo | Dónde | Qué contiene |
|---------|-------|-------------|
| `~/.mat32/radio.db` | VPS | Canales YouTube, videos, tracks, links Bandcamp |
| `~/.digger/dytid_tracks.db` | VPS | 34k+ tracks únicos con play_count de DYTID |
| `~/.digger/digger.db` | VPS | App Digger principal |
| `~/.openclaw/workspace/digger/state/wantlist.json` | VPS | Wantlist enriquecida con Discogs |

## DEPLOY FRONTEND

```bash
# Desde Mac, en mat32-src/
npm run build
rsync -az dist/ yousef-o@46.225.112.154:/home/yousef-o/sites/mat32/
git add -A && git commit -m "descripción" && git push origin main
```
