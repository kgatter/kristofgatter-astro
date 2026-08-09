#!/usr/bin/env bash
# Regenerates public/KristofGatterCV.pdf by printing the built /cv page
# with headless Chrome. Run from anywhere: ./cv/build-cv.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8123

pnpm build

python3 -m http.server "$PORT" --directory dist &>/dev/null &
SERVER_PID=$!
trap 'kill $SERVER_PID' EXIT
sleep 1

# --virtual-time-budget makes Chrome wait for the Graphik webfonts before
# printing; without it the PDF comes out with invisible (still-loading) text.
"$CHROME" \
  --headless \
  --disable-gpu \
  --virtual-time-budget=10000 \
  --no-pdf-header-footer \
  --print-to-pdf="$PWD/public/KristofGatterCV.pdf" \
  "http://localhost:$PORT/cv/"

echo "Wrote public/KristofGatterCV.pdf"
