import type { PrismaService } from '@prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import type { TokensService } from '../tokens/tokens.service';
import { AuthService } from './auth.service';

const snapshotAdminEnv = () => ({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  username: process.env.ADMIN_USERNAME,
});

const clearAdminEnv = () => {
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_USERNAME;
};

const restoreAdminEnv = (snapshot: {
  email?: string;
  password?: string;
  username?: string;
}) => {
  if (snapshot.email === undefined) {
    delete process.env.ADMIN_EMAIL;
  } else {
    process.env.ADMIN_EMAIL = snapshot.email;
  }

  if (snapshot.password === undefined) {
    delete process.env.ADMIN_PASSWORD;
  } else {
    process.env.ADMIN_PASSWORD = snapshot.password;
  }

  if (snapshot.username === undefined) {
    delete process.env.ADMIN_USERNAME;
  } else {
    process.env.ADMIN_USERNAME = snapshot.username;
  }
};

describe('AuthService', () => {
  it('uses admin credentials from environment variables', async () => {
    const adminEnvSnapshot = snapshotAdminEnv();

    process.env.ADMIN_EMAIL = "'root@example.com';";
    process.env.ADMIN_PASSWORD = "'super-secret';";
    process.env.ADMIN_USERNAME = "'Root Admin';";

    try {
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn(),
        },
      } as unknown as PrismaService;

      const tokenService = {
        generateTokens: jest.fn().mockReturnValue({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        }),
        saveToken: jest.fn().mockResolvedValue(undefined),
      } as unknown as TokensService;

      const service = new AuthService(prisma, tokenService);

      const createdPasswordHash = await bcrypt.hash('super-secret', 10);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'env-admin-id',
        email: 'root@example.com',
        username: 'Root Admin',
        phone: null,
        avatarUrl: null,
        role: 'ADMIN',
        password: createdPasswordHash,
        sessionVersion: 0,
        createdAt: new Date('2026-06-08T10:00:00.000Z'),
        updatedAt: new Date('2026-06-08T10:00:00.000Z'),
      });

      const result = await service.login({
        email: 'root@example.com',
        password: 'super-secret',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'root@example.com' },
        select: expect.objectContaining({
          email: true,
          role: true,
          password: true,
        }),
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'root@example.com',
          username: 'Root Admin',
          role: 'ADMIN',
        }),
        select: expect.objectContaining({
          email: true,
          role: true,
          password: true,
        }),
      });
      expect(result.email).toBe('root@example.com');
      expect(result.username).toBe('Root Admin');
      expect(result.role).toBe('ADMIN');
    } finally {
      restoreAdminEnv(adminEnvSnapshot);
    }
  });

  it('creates and authorizes the reserved admin account on login', async () => {
    const adminEnvSnapshot = snapshotAdminEnv();
    clearAdminEnv();

    try {
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn(),
        },
      } as unknown as PrismaService;

      const tokenService = {
        generateTokens: jest.fn().mockReturnValue({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        }),
        saveToken: jest.fn().mockResolvedValue(undefined),
      } as unknown as TokensService;

      const service = new AuthService(prisma, tokenService);

      const createdPasswordHash = await bcrypt.hash('admin.admin', 10);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'admin-id',
        email: 'admin@admin.admin',
        username: 'Administrator',
        phone: null,
        avatarUrl: null,
        role: 'ADMIN',
        password: createdPasswordHash,
        sessionVersion: 0,
        createdAt: new Date('2026-06-08T10:00:00.000Z'),
        updatedAt: new Date('2026-06-08T10:00:00.000Z'),
      });

      const result = await service.login({
        email: 'admin@admin.admin',
        password: 'admin.admin',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@admin.admin' },
        select: expect.objectContaining({
          email: true,
          role: true,
          password: true,
        }),
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'admin@admin.admin',
          role: 'ADMIN',
          username: 'Administrator',
        }),
        select: expect.objectContaining({
          email: true,
          role: true,
          password: true,
        }),
      });
      expect(tokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(tokenService.saveToken).toHaveBeenCalledWith(
        'admin-id',
        'refresh-token',
      );
      expect(result).not.toHaveProperty('user');
      expect(result.role).toBe('ADMIN');
      expect(result.email).toBe('admin@admin.admin');
    } finally {
      restoreAdminEnv(adminEnvSnapshot);
    }
  });

  it('rejects registration with the reserved admin email', async () => {
    const adminEnvSnapshot = snapshotAdminEnv();
    clearAdminEnv();

    try {
      const prisma = {
        user: {
          findUnique: jest.fn(),
        },
      } as unknown as PrismaService;

      const tokenService = {} as TokensService;

      const service = new AuthService(prisma, tokenService);

      await expect(
        service.register({
          email: 'admin@admin.admin',
          username: 'tester',
          password: 'secret123',
        }),
      ).rejects.toThrow('Этот email зарезервирован для администратора');
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    } finally {
      restoreAdminEnv(adminEnvSnapshot);
    }
  });

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

    await expect(service.logout('stale-refresh-token')).resolves.toBeUndefined();
    expect(tokenService.removeToken).toHaveBeenCalledWith(
      'stale-refresh-token',
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
