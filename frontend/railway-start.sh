#!/usr/bin/env bash
set -euo pipefail

if [ -f "next.config.ts" ] || [ -f "next.config.mjs" ] || [ -f "next.config.js" ]; then
  APP_DIR="."
elif [ -d "frontend" ]; then
  APP_DIR="frontend"
else
  echo "ERROR: cannot find Next.js app"
  exit 1
fi

cd "$APP_DIR"
export HOSTNAME=0.0.0.0
export PORT="${PORT:-3000}"
exec npm run start
