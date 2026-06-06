import type { PrismaService } from '@prisma/prisma.service';
import type { TokensService } from '../tokens/tokens.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('revokes the active session on logout when access token is still valid', async () => {
    const prisma = {
      $transaction: jest.fn().mockResolvedValue([]),
      user: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      token: {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    } as unknown as PrismaService;

    const tokenService = {
      validateAccessToken: jest.fn().mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        username: 'tester',
        phone: null,
        avatarUrl: null,
        role: 'USER',
        createdAt: '2026-06-04T10:00:00.000Z',
        updatedAt: '2026-06-05T10:00:00.000Z',
        sessionVersion: 0,
      }),
      validateRefreshToken: jest.fn(),
      removeToken: jest.fn(),
    } as unknown as TokensService;

    const service = new AuthService(prisma, tokenService);

    await service.logout(undefined, 'Bearer valid-access-token');

    expect(tokenService.validateAccessToken).toHaveBeenCalledWith(
      'valid-access-token',
    );
    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        sessionVersion: {
          increment: 1,
        },
      },
    });
    expect(prisma.token.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('keeps logout idempotent for stale refresh cookies without a valid session', async () => {
    const prisma = {
      $transaction: jest.fn(),
    } as unknown as PrismaService;

    const tokenService = {
      validateAccessToken: jest.fn().mockReturnValue(null),
      validateRefreshToken: jest.fn().mockReturnValue(null),
      removeToken: jest.fn().mockResolvedValue({ count: 0 }),
    } as unknown as TokensService;

    const service = new AuthService(prisma, tokenService);

    await expect(
      service.logout('stale-refresh-token'),
    ).resolves.toBeUndefined();
    expect(tokenService.removeToken).toHaveBeenCalledWith(
      'stale-refresh-token',
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
