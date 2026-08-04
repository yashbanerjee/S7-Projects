#!/usr/bin/env bash
set -euo pipefail

if [ -f "prisma/schema.prisma" ]; then
  APP_DIR="."
elif [ -d "backend" ]; then
  APP_DIR="backend"
else
  echo "ERROR: cannot find backend"
  exit 1
fi

cd "$APP_DIR"
export NODE_ENV=production
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-5000}"
exec npm run start:prod
