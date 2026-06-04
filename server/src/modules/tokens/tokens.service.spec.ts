import type { PrismaService } from '@prisma/prisma.service';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  it('removes stale refresh tokens without throwing', async () => {
    const prisma = {
      token: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    } as unknown as PrismaService;

    const service = new TokensService(prisma);

    await expect(service.removeToken('stale-token')).resolves.toEqual({
      count: 0,
    });
    expect(prisma.token.deleteMany).toHaveBeenCalledWith({
      where: { refreshToken: 'stale-token' },
    });
  });
});
