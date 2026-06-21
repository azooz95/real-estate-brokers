import type { IncomingMessage, ServerResponse } from 'node:http';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import { AppModule } from '../src/app.module';

// Vercel serverless entry point. Local/Docker still boot via src/main.ts
// (app.listen) — this file wraps the same Nest app as a request handler
// instead, reused across invocations on a warm instance.
const expressApp = express();
let ready: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: [
      process.env.CLIENT_BASE_URL ?? 'http://localhost:5173',
      process.env.ADMIN_BASE_URL ?? 'http://localhost:5173',
    ],
    credentials: true,
  });
  await app.init();
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (!ready) ready = bootstrap();
  await ready;
  expressApp(req, res);
}
