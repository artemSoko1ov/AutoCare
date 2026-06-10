import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  Logger,
  Optional,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

const DATABASE_UNAVAILABLE_MESSAGE =
  'Database is temporarily unavailable. Please try again later.';

const DATABASE_CONNECTION_ERROR_CODES = new Set([
  'P1001',
  'P1002',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'ENOTFOUND',
  'ETIMEDOUT',
]);

type ErrorWithCode = {
  code?: unknown;
  cause?: unknown;
  message?: unknown;
};

type HttpRequestLike = {
  method?: string;
  url?: string;
};

type HttpResponseLike = {
  status: (statusCode: number) => {
    json: (body: {
      statusCode: number;
      error: string;
      message: string;
    }) => void;
  };
};

const isErrorWithCode = (error: unknown): error is ErrorWithCode => {
  return typeof error === 'object' && error !== null;
};

export const isPrismaConnectionError = (error: unknown): boolean => {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return DATABASE_CONNECTION_ERROR_CODES.has(error.code);
  }

  if (isErrorWithCode(error)) {
    if (
      typeof error.code === 'string' &&
      DATABASE_CONNECTION_ERROR_CODES.has(error.code)
    ) {
      return true;
    }

    if ('cause' in error) {
      return isPrismaConnectionError(error.cause);
    }
  }

  return false;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (isErrorWithCode(error) && typeof error.message === 'string') {
    return error.message;
  }

  return 'Unknown database connection error';
};

@Catch()
export class PrismaConnectionExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaConnectionExceptionFilter.name);

  constructor(@Optional() httpAdapterHost?: HttpAdapterHost) {
    super(httpAdapterHost?.httpAdapter);
  }

  override catch(exception: unknown, host: ArgumentsHost): void {
    if (isPrismaConnectionError(exception)) {
      const http = host.switchToHttp();
      const response = http.getResponse<HttpResponseLike>();
      const request = http.getRequest<HttpRequestLike>();
      const requestLabel =
        [request?.method, request?.url].filter(Boolean).join(' ') ||
        'unknown request';

      this.logger.error(
        `Database request failed for ${requestLabel}: ${getErrorMessage(exception)}`,
      );

      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service Unavailable',
        message: DATABASE_UNAVAILABLE_MESSAGE,
      });
      return;
    }

    super.catch(exception, host);
  }
}
