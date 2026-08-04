# Railway setup (from your dashboard)

You already point Config File correctly:
- Frontend (**S7-Projects**): `/frontend/railway.toml`
- Backend (**ingenious-dedication**): `/backend/railway.toml`

## Critical: Root Directory

For each service open **Settings → Source / Build → Root Directory**:

| Service | Root Directory |
|---------|----------------|
| S7-Projects (frontend) | `frontend` |
| ingenious-dedication (backend) | `backend` |

If Root Directory is left empty, the auto-detect scripts still try to `cd frontend` / `cd backend`. Setting Root Directory is still recommended.

## Rebuild after push

Build commands now use:
- `frontend/railway-build.sh` / `railway-start.sh`
- `backend/railway-build.sh` / `railway-start.sh`

These detect monorepo root vs app folder automatically.

## Frontend variables (build time)

```env
NEXT_PUBLIC_SITE_URL=https://s7-projects-production.up.railway.app
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.up.railway.app/api
```

## Backend variables

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=...
FRONTEND_URL=https://s7-projects-production.up.railway.app
CORS_ORIGINS=https://s7-projects-production.up.railway.app
```

## After first backend deploy

Seed once (Railway shell on backend service):
```bash
npm run db:seed
```

## Billing

The yellow "subscription past due" banner can still block deploys — settle that in Railway if builds abort unexpectedly.
