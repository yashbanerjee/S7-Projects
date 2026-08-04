#!/usr/bin/env bash
set -euo pipefail

if [ -f "prisma/schema.prisma" ]; then
  APP_DIR="."
elif [ -d "backend" ]; then
  APP_DIR="backend"
else
  echo "ERROR: cannot find backend (prisma/schema.prisma or backend/)"
  ls -la
  exit 1
fi

echo ">> Building backend in: $(pwd)/$APP_DIR"
cd "$APP_DIR"

export NODE_ENV=production

npm install --include=dev
npx prisma generate
npx tsc

echo ">> Backend build OK"
