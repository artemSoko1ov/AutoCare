import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

const DEV_CORS_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const REQUEST_BODY_LIMIT = '8mb';
const bootstrapLogger = new Logger('Bootstrap');

type CorsCallback = (error: Error | null, allow?: boolean) => void;

function createCorsOptions() {
  const configuredOrigins = new Set(
    (process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return {
    origin: (origin: string | undefined, callback: CorsCallback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (configuredOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      if (isDevelopment && DEV_CORS_ORIGIN_PATTERN.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Images are sent as data URLs inside JSON, so the payload is larger than the original file.
  app.useBodyParser('json', { limit: REQUEST_BODY_LIMIT });
  app.useBodyParser('urlencoded', {
    extended: true,
    limit: REQUEST_BODY_LIMIT,
  });
  app.setGlobalPrefix('api');
  app.enableCors(createCorsOptions());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap().catch((error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'EADDRINUSE'
  ) {
    const port = process.env.PORT ?? 3000;
    bootstrapLogger.error(
      `Port ${port} is already in use. Stop the existing process or change PORT before starting the server.`,
    );
    process.exitCode = 1;
    return;
  }

  throw error;
});
