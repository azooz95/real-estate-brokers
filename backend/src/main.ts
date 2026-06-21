import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: [process.env.CLIENT_BASE_URL ?? 'http://localhost:5173', process.env.ADMIN_BASE_URL ?? 'http://localhost:5173'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
