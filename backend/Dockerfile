# syntax=docker/dockerfile:1

FROM node:24-bullseye-slim AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma

FROM base AS deps
RUN npm ci

FROM deps AS builder
COPY . .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium \
  && rm -rf /var/lib/apt/lists/*
ENV CHROME_PATH=/usr/bin/chromium
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
