import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { PrismaService } from '@prisma/prisma.service';
import type { TokensService } from '../../modules/tokens/tokens.service';
import { JwtAuthGuard } from './jwt-auth.guard';

function createExecutionContext(
  request: Record<string, unknown>,
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  it('allows request with a valid bearer token and attaches user to request', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          username: 'tester',
          sessionVersion: 0,
          createdAt: new Date('2026-06-04T10:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;

    const tokensService = {
      validateAccessToken: jest.fn().mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        username: 'tester',
        createdAt: '2026-06-04T10:00:00.000Z',
        sessionVersion: 0,
      }),
    } as unknown as TokensService;

    const guard = new JwtAuthGuard(prisma, tokensService);
    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    await expect(
      guard.canActivate(createExecutionContext(request)),
    ).resolves.toBe(true);
    expect(request).toMatchObject({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        username: 'tester',
        createdAt: '2026-06-04T10:00:00.000Z',
      },
    });
  });

  it('throws when authorization header is missing', async () => {
    const prisma = {} as PrismaService;
    const tokensService = {} as TokensService;

    const guard = new JwtAuthGuard(prisma, tokensService);

    await expect(
      guard.canActivate(
        createExecutionContext({
          headers: {},
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws when access token is invalid', async () => {
    const prisma = {} as PrismaService;
    const tokensService = {
      validateAccessToken: jest.fn().mockReturnValue(null),
    } as unknown as TokensService;

    const guard = new JwtAuthGuard(prisma, tokensService);

    await expect(
      guard.canActivate(
        createExecutionContext({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws when session was revoked after token issuance', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          username: 'tester',
          sessionVersion: 1,
          createdAt: new Date('2026-06-04T10:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;

    const tokensService = {
      validateAccessToken: jest.fn().mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        username: 'tester',
        createdAt: '2026-06-04T10:00:00.000Z',
        sessionVersion: 0,
      }),
    } as unknown as TokensService;

    const guard = new JwtAuthGuard(prisma, tokensService);

    await expect(
      guard.canActivate(
        createExecutionContext({
          headers: {
            authorization: 'Bearer stale-token',
          },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
