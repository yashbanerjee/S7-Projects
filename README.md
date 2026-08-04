# Project S7

Premium corporate website for **Project S7** — a luxury events & exhibition company.

Monorepo structure:

```
S7-Projects/
├── frontend/          # Next.js 15+ (App Router, TypeScript, Tailwind)
├── backend/           # Express.js + Prisma + PostgreSQL
├── docker-compose.yml # Local PostgreSQL
└── README.md
```

## Stack

### Frontend
- Next.js (App Router) · TypeScript · Tailwind CSS
- Framer Motion · GSAP · Lenis smooth scroll
- React Hook Form · Zod · Swiper · Lucide · next/image · next/font
- SEO: metadata, Open Graph, sitemap, robots, JSON-LD

### Backend
- Node.js · Express · TypeScript
- Prisma ORM · PostgreSQL
- JWT admin auth · Multer uploads · Cloudinary (optional)
- Nodemailer notifications
- REST API for CMS resources

## Brand

- **Accent:** Logo pink `#C4205E` (only accent colour)
- **Base:** White `#FFFFFF`, soft grey `#FAFAFA`
- **Fonts:** Plus Jakarta Sans (display) + Manrope (body)
- **Logo:** `frontend/public/logo.png`

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (recommended) **or** local PostgreSQL 14+

## Quick start

### 1. Database

```bash
docker compose up -d postgres
```

Default connection string:

```
postgresql://postgres:postgres@localhost:5432/project_s7?schema=public
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

API: [http://localhost:5000](http://localhost:5000)  
Health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

**Default admin**
- Email: `admin@projects7.com`
- Password: `Admin@S7Secure2026`

Change these in `backend/.env` before production.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

The public site uses curated fallback content when the API is offline, so the frontend can be previewed without the database.

## Environment variables

### Backend (`backend/.env`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET` | Admin token secret |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed credentials |
| `SMTP_*` | Nodemailer (optional in dev) |
| `CLOUDINARY_*` + `USE_CLOUDINARY=true` | Cloud media (optional) |
| `FRONTEND_URL` | CORS origin |

### Frontend (`frontend/.env.local`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_API_URL` | API base (e.g. `http://localhost:5000/api`) |

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/auth/me` | JWT | Current admin |
| GET/POST | `/api/services` | POST requires JWT | Services CRUD |
| GET/POST | `/api/portfolio` | POST requires JWT | Portfolio CRUD |
| POST | `/api/quotes` | — | Quote request (+ file) |
| GET | `/api/quotes` | JWT | List quotes |
| POST | `/api/messages` | — | Contact form |
| GET/POST | `/api/jobs` | POST requires JWT | Careers |
| POST | `/api/jobs/:id/apply` | — | Job application |
| GET | `/api/content/*` | Varies | FAQ, testimonials, industries, settings, dashboard |
| POST | `/api/media` | JWT | Media library upload |

## Public pages

- `/` Homepage (hero, about, services, why us, portfolio, process, testimonials, industries, FAQ, CTA)
- `/about` Story, mission, vision, values, leadership, timeline
- `/services` + `/services/[slug]` Full service pages
- `/portfolio` + `/portfolio/[slug]` Masonry gallery & case studies
- `/industries` Sector experiences
- `/careers` Culture, benefits, jobs, apply form
- `/faq` Searchable accordion
- `/contact` Form, map, WhatsApp, social
- `/quote` Full quote request with file upload
- `/admin` CMS dashboard (JWT)

## Production notes

1. Set strong `JWT_SECRET` and rotate admin password.
2. Configure SMTP for quote/contact notifications.
3. Enable Cloudinary for durable media, or serve `backend/uploads` behind your CDN.
4. Deploy frontend (Vercel / Node) and backend (Railway / Render / VPS) independently.
5. Point `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` to production hosts.
6. Run `npx prisma migrate deploy` (or `db push`) and `db:seed` on first deploy.

### Build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm start
```

## Image strategy

Homepage and section imagery use high-quality Unsplash photographs of exhibitions, stages, hospitality, and corporate environments via `next/image`. Replace URLs in:

- `frontend/src/lib/content.ts`
- Admin media library / portfolio CMS
- `backend/prisma/seed.ts`

## License

Proprietary — Project S7. All rights reserved.
