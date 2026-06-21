# Jiwar Aloula — Backend

NestJS + Prisma + PostgreSQL API for the Jiwar Aloula reservation platform. Serves both the
client reservation flow and the admin/marketer console under `/api`.

## Setup

```bash
cp .env.example .env   # fill in real values — see table below
npm install
npx prisma migrate dev
```

## Run

```bash
npm run start:dev     # watch mode
npm run start          # no watch
npm run start:prod     # run compiled dist/main.js (no migrations)
npm run start:prod:migrate   # prisma migrate deploy, then start — used by Docker
```

## Test & lint

```bash
npm run test           # unit tests
npm run test:e2e        # e2e tests
npm run lint            # eslint --fix
npm run lint:ci          # eslint, no autofix — used in CI
```

## Build

```bash
npm run build           # compiles to dist/main.js
```

## Docker

```bash
docker build -t jiwar-backend .
docker run -p 8000:8000 --env-file .env jiwar-backend
```

The image installs Chromium (for `puppeteer-core`, used to render receipt PDFs) and runs
`prisma migrate deploy` on container start before launching the server.

## Environment variables

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Postgres connection string |
| `PORT` | HTTP port (default 8000) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Admin auth session tokens |
| `CLIENT_BASE_URL`, `ADMIN_BASE_URL` | Allowed CORS origins / links used in emails |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Outbound mail (password resets, etc.) |
| `CHROME_PATH` | Path to a Chrome/Chromium binary for PDF receipt generation |

See `.env.example` for a filled-in template. Never commit a real `.env`.
