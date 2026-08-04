# Railway – Project S7 (two separate services)

Do **not** deploy the monorepo root. Create **two services** from the same GitHub repo.

## 1. Backend service (API)

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| Start | `npm run start:prod` (from `backend/railway.toml`) |
| Healthcheck | `/api/health` |

### Variables
```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@projects7.com
ADMIN_PASSWORD=<strong-password>
FRONTEND_URL=https://YOUR-FRONTEND.up.railway.app
CORS_ORIGINS=https://YOUR-FRONTEND.up.railway.app
API_URL=https://YOUR-BACKEND.up.railway.app
```

### Seed data once (after first deploy)
Railway → backend service → shell / one-off:
```bash
npm run db:seed
```
Or temporarily set start to `npm run start:seed` once, then switch back to `start:prod`.

---

## 2. Frontend service (Next.js)

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| Start | `npm run start` |
| Healthcheck | `/` |

### Variables (set **before** first build)
```env
NEXT_PUBLIC_SITE_URL=https://YOUR-FRONTEND.up.railway.app
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.up.railway.app/api
```

---

## Why previous builds failed

Your logs showed a **mixed** plan:
- install → `frontend`
- build → Next.js (`next build`)
- start → `start:prod` (**backend**)

That happens when **Root Directory is empty** and monorepo configs conflict.

Nixpacks plan for **backend only** should look like:
```
install  npm install --include=dev
build    prisma generate + tsc
start    npm run start:prod
```

Nixpacks plan for **frontend only** should look like:
```
install  npm install --include=dev
build    next build
start    npm run start
```

No `frontend` paths in a backend deploy.

---

## Deploy order

1. Postgres online  
2. Backend (Root Directory = `backend`) → open `/api/health`  
3. Seed once  
4. Frontend (Root Directory = `frontend`) with public API URL  
5. Update backend `FRONTEND_URL` / `CORS_ORIGINS`  

Also settle Railway billing if you see “subscription past due”.
