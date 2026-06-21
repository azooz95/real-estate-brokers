# Jiwar Aloula — Property Reservation Platform

Bilingual (EN/AR, RTL-aware) real-estate reservation platform for **Jiwar Aloula** (جوار الأولى).
Two independent sites share one codebase:

- **Client site** — broker shares a tracking link, client browses projects/units and reserves one.
- **Admin/Marketer console** — login, dashboard, inventory, broker management, transaction ledger, settings.

See [`design_handoff_jiwar_reservation/README.md`](design_handoff_jiwar_reservation/README.md) for full product/UX context.

## Repo layout

| Path | What it is |
|------|------------|
| `backend/` | NestJS + Prisma + PostgreSQL API |
| `design_handoff_jiwar_reservation/react-app/` | React (Vite) frontend — client + admin sites |
| `design_handoff_jiwar_reservation/reference/` | Original HTML design prototype (visual source of truth) |
| `fig/`, `assets/` | Figma export data and static assets |

## Local development

### Backend

```bash
cd backend
cp .env.example .env   # fill in real values
npm install
npx prisma migrate dev
npm run start:dev
```

API runs on `http://localhost:8000`, mounted under `/api`.

### Frontend

```bash
cd design_handoff_jiwar_reservation/react-app
cp .env.example .env
npm install
npm run dev
```

Client site: `http://localhost:5173/` — Admin console: `http://localhost:5173/admin.html`.

### Full stack via Docker Compose

```bash
docker compose up -d --build
```

Brings up Postgres + the backend API (migrations run automatically on container start) at `http://localhost:8000`.
Postgres is also exposed on host port `5433` (mapped to avoid clashing with a locally-installed Postgres on `5432`).
Override secrets via a `.env` file in the repo root or exported env vars — see `docker-compose.yml` for the full list.

The frontend isn't containerized (it's a static Vite build); run it separately as above, or build it (`npm run build`) and serve `dist/` from any static host/CDN.

## Production

### Backend

`backend/Dockerfile` builds a production image (Node 24, Prisma client generated, Chromium installed for PDF receipt generation). On container start it runs `prisma migrate deploy` then starts the server. Required env vars are documented in `backend/.env.example`.

```bash
docker build -t jiwar-backend ./backend
docker run -p 8000:8000 --env-file backend/.env jiwar-backend
```

Deploy the image to any container host (Fly.io, Railway, Render, ECS, a VPS, etc.) alongside a managed/self-hosted Postgres instance.

### Frontend

`npm run build` in `design_handoff_jiwar_reservation/react-app` produces `dist/` containing both `index.html` (client) and `admin.html` (admin). Deploy `dist/` to a static host (Vercel, Netlify, S3+CloudFront, etc.). Each domain (`app.*` / `admin.*`) should point its rewrite rules at the matching HTML entry. Set `VITE_API_TARGET`, `VITE_CLIENT_BASE_URL`, `VITE_ADMIN_BASE_URL` per environment before building.

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`:
- Backend: install, lint, typecheck/build
- Frontend: install, `vite build`
- Validates the backend Docker image builds

No deploy step is wired up yet — add one once a hosting target is chosen.

## Environment variables

See `backend/.env.example` and `design_handoff_jiwar_reservation/react-app/.env.example` for the full list. Never commit real `.env` files — they're git-ignored.
