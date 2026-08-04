#!/usr/bin/env bash
set -euo pipefail

# Works whether Railway Root Directory is monorepo root OR "frontend"
if [ -f "next.config.ts" ] || [ -f "next.config.mjs" ] || [ -f "next.config.js" ]; then
  APP_DIR="."
elif [ -d "frontend" ]; then
  APP_DIR="frontend"
else
  echo "ERROR: cannot find Next.js app (next.config.* or frontend/)"
  ls -la
  exit 1
fi

echo ">> Building frontend in: $(pwd)/$APP_DIR"
cd "$APP_DIR"

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

npm install --include=dev
npm run build

echo ">> Frontend build OK"
