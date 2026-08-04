# Railway deployment – Project S7

This monorepo deploys as **two services** + one **Postgres** database.

## Services to create

1. **Postgres** (you already have this)
2. **backend** – Root Directory: `backend`
3. **frontend** – Root Directory: `frontend`

Connect both to the same Railway project. Link **backend** to the Postgres plugin so `DATABASE_URL` is injected (or paste it manually).

---

## Important: Internal vs public DATABASE_URL

| URL host | Where it works |
|----------|----------------|
| `postgres.railway.internal` | **Only inside Railway** (backend container ↔ DB) |
| `*.proxy.rlwy.net` (public) | Local machine + tools (Prisma Studio, local migrate) |

You shared the **internal** URL. Schema push/seed runs automatically when the **backend** service starts (`start:prod`).

To migrate from your laptop, use the **public** TCP proxy URL from Railway → Postgres → **Connect** → **Public Network**.

---

## Backend service – Variables

Set these in Railway → backend → Variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
# or paste: postgresql://postgres:...@postgres.railway.internal:5432/railway

JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@projects7.com
ADMIN_PASSWORD=<strong-password>
ADMIN_NAME=Project S7 Admin

# After frontend is live, set its public URL:
FRONTEND_URL=https://your-frontend.up.railway.app
CORS_ORIGINS=https://your-frontend.up.railway.app
API_URL=https://your-backend.up.railway.app

# Optional email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Project S7 <noreply@projects7.com>"
NOTIFY_EMAIL=admin@projects7.com

# Optional media
USE_CLOUDINARY=false
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Settings**
- Root Directory: `backend`
- Start command (default from `railway.toml`): `npm run start:prod`  
  → runs `prisma db push` + seed + API

Generate a domain for the backend (e.g. `project-s7-api.up.railway.app`).

---

## Frontend service – Variables

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://your-frontend.up.railway.app
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

**Build-time note:** `NEXT_PUBLIC_*` must be present at **build** time on Railway (set them before first deploy, then redeploy if URLs change).

**Settings**
- Root Directory: `frontend`
- Generate a public domain

---

## Deploy order

1. Postgres plugin (done)
2. Deploy **backend** first → wait until `/api/health` is OK (schema + seed run on start)
3. Deploy **frontend** with backend public URL in `NEXT_PUBLIC_API_URL`
4. Set backend `FRONTEND_URL` / `CORS_ORIGINS` to the frontend URL and redeploy backend if needed

---

## Manual migrate from local (public URL only)

```bash
cd backend
# Use PUBLIC Railway Postgres URL, not .internal
$env:DATABASE_URL="postgresql://postgres:PASSWORD@HOST.proxy.rlwy.net:PORT/railway"
npx prisma db push
npm run db:seed
```

---

## Default admin after seed

- Email: value of `ADMIN_EMAIL` (default `admin@projects7.com`)
- Password: value of `ADMIN_PASSWORD`

CMS: `https://your-frontend.up.railway.app/admin`

---

## Health checks

- Backend: `GET /api/health`
- Frontend: `GET /`
