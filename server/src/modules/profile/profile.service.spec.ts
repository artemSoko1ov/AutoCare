import { NotFoundException } from '@nestjs/common';
import type { PrismaService } from '@prisma/prisma.service';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  it('returns the latest profile from the database', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          username: 'tester',
          phone: '+7 (999) 123-45-67',
          avatarUrl: 'https://example.com/avatar.jpg',
          createdAt: new Date('2026-06-04T10:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);

    await expect(service.getProfile('user-1')).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
      username: 'tester',
      phone: '+7 (999) 123-45-67',
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: '2026-06-04T10:00:00.000Z',
    });
  });

  it('throws when profile cannot be found', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);

    await expect(service.getProfile('missing-user')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates profile fields and returns normalized user data', async () => {
    const prisma = {
      user: {
        update: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          username: 'updated',
          phone: null,
          avatarUrl: 'https://example.com/avatar.jpg',
          createdAt: new Date('2026-06-04T10:00:00.000Z'),
        }),
      },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);

    await expect(
      service.updateProfile('user-1', {
        username: 'updated',
        phone: null,
        avatarUrl: 'https://example.com/avatar.jpg',
      }),
    ).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
      username: 'updated',
      phone: null,
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: '2026-06-04T10:00:00.000Z',
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        username: 'updated',
        phone: null,
        avatarUrl: 'https://example.com/avatar.jpg',
      },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  });
});
