import { Logger, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import {
  isPrismaConnectionError,
  PrismaConnectionExceptionFilter,
} from './prisma-connection-exception.filter';

describe('PrismaConnectionExceptionFilter', () => {
  it('detects known prisma connection errors', () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Connection refused',
      {
        clientVersion: '7.8.0',
        code: 'ECONNREFUSED',
        meta: {
          modelName: 'Service',
        },
      },
    );

    expect(isPrismaConnectionError(error)).toBe(true);
  });

  it('maps database connection errors to service unavailable response', () => {
    const filter = new PrismaConnectionExceptionFilter();
    const loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/api/services',
        }),
        getResponse: () => ({
          status,
          json,
        }),
      }),
    };

    const error = new Prisma.PrismaClientKnownRequestError(
      'Connection refused',
      {
        clientVersion: '7.8.0',
        code: 'ECONNREFUSED',
        meta: {
          modelName: 'Service',
        },
      },
    );

    filter.catch(error, host as never);

    expect(status).toHaveBeenCalledWith(503);
    expect(json).toHaveBeenCalledWith({
      statusCode: 503,
      error: 'Service Unavailable',
      message: 'Database is temporarily unavailable. Please try again later.',
    });

    loggerSpy.mockRestore();
  });

  it('delegates non-database errors to the base nest filter', () => {
    const superCatchSpy = jest
      .spyOn(BaseExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined);
    const filter = new PrismaConnectionExceptionFilter();
    const host = {
      switchToHttp: jest.fn(),
    };

    filter.catch(new NotFoundException('Missing'), host as never);

    expect(superCatchSpy).toHaveBeenCalled();

    superCatchSpy.mockRestore();
  });
});
