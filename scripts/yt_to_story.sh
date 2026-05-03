#!/bin/bash
# yt_to_story.sh — Descarga un trozo de YouTube y lo formatea para Instagram Stories (9:16)
#
# Uso:
#   ./scripts/yt_to_story.sh <URL> <inicio> <duración> [salida]
#
# Ejemplos:
#   ./scripts/yt_to_story.sh "https://youtube.com/watch?v=xxx" 1:30 15
#   ./scripts/yt_to_story.sh "https://youtube.com/watch?v=xxx" 0:45 30 mi_story.mp4
#
# Requisitos: brew install yt-dlp ffmpeg

set -euo pipefail

URL="${1:?Uso: $0 <url> <inicio> <duración> [salida]}"
START="${2:?Falta timestamp de inicio (ej: 1:30)}"
DURATION="${3:?Falta duración en segundos (máx 60)}"
OUTPUT="${4:-story_$(date +%Y%m%d_%H%M%S).mp4}"

# Validar duración máx 60s
if [ "$DURATION" -gt 60 ] 2>/dev/null; then
  echo "⚠️  Instagram Stories permite máx 60s. Recortando a 60s."
  DURATION=60
fi

TMPFILE=$(mktemp /tmp/yt_story_XXXXXX.mp4)
trap 'rm -f "$TMPFILE"' EXIT

echo "📥 Descargando trozo de $START (${DURATION}s)..."

# Descargar solo el trozo necesario
yt-dlp \
  --download-sections "*${START}-${START}+${DURATION}" \
  --force-keyframes-at-cuts \
  -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" \
  --merge-output-format mp4 \
  -o "$TMPFILE" \
  "$URL"

echo "🎬 Convirtiendo a formato Stories (1080x1920, 9:16)..."

# Convertir a 9:16 con fondo blur
# 1. Escala el vídeo original para que quepa en 1080x1920 manteniendo aspecto
# 2. Crea un fondo blurreado que rellena el 9:16 completo
# 3. Superpone el vídeo centrado sobre el fondo
ffmpeg -y -i "$TMPFILE" \
  -filter_complex "
    [0:v]scale=1080:1920:force_original_aspect_ratio=decrease,setsar=1[fg];
    [0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5,setsar=1[bg];
    [bg][fg]overlay=(W-w)/2:(H-h)/2
  " \
  -c:v libx264 -preset fast -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -t "$DURATION" \
  "$OUTPUT"

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo ""
echo "✅ Listo: $OUTPUT ($SIZE)"
echo "📱 Pásalo al móvil (AirDrop, Telegram, etc.) y súbelo a Stories."
