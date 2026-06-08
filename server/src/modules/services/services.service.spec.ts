import { NotFoundException } from '@nestjs/common';
import type { PrismaService } from '@prisma/prisma.service';
import { ServicesService } from './services.service';

describe('ServicesService', () => {
  const baseService = {
    id: 'service-1',
    title: 'Диагностика перед покупкой',
    category: 'Диагностика',
    summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
    priceFrom: 3500,
    durationLabel: '2 часа',
    status: 'active',
    createdAt: new Date('2026-06-08T10:00:00.000Z'),
    updatedAt: new Date('2026-06-08T11:00:00.000Z'),
  };

  it('returns only active public services ordered by category, price and title', async () => {
    const prisma = {
      service: {
        findMany: jest.fn().mockResolvedValue([baseService]),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(service.getPublicServices()).resolves.toEqual([
      {
        id: 'service-1',
        title: 'Диагностика перед покупкой',
        category: 'Диагностика',
        summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
        priceFrom: 3500,
        durationLabel: '2 часа',
        status: 'active',
        createdAt: '2026-06-08T10:00:00.000Z',
        updatedAt: '2026-06-08T11:00:00.000Z',
      },
    ]);

    expect(prisma.service.findMany).toHaveBeenCalledWith({
      where: { status: 'active' },
      orderBy: [{ category: 'asc' }, { priceFrom: 'asc' }, { title: 'asc' }],
      select: expect.any(Object),
    });
  });

  it('returns all services for admin list', async () => {
    const prisma = {
      service: {
        findMany: jest.fn().mockResolvedValue([baseService]),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(service.getAdminServices()).resolves.toHaveLength(1);
    expect(prisma.service.findMany).toHaveBeenCalledWith({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      select: expect.any(Object),
    });
  });

  it('creates a service and returns dto', async () => {
    const prisma = {
      service: {
        create: jest.fn().mockResolvedValue(baseService),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(
      service.createService({
        title: 'Диагностика перед покупкой',
        category: 'Диагностика',
        summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
        priceFrom: 3500,
        durationLabel: '2 часа',
        status: 'active',
      }),
    ).resolves.toEqual({
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
      priceFrom: 3500,
      durationLabel: '2 часа',
      status: 'active',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });
  });

  it('updates existing service and returns dto', async () => {
    const updatedService = {
      ...baseService,
      status: 'hidden',
      updatedAt: new Date('2026-06-09T09:00:00.000Z'),
    };

    const prisma = {
      service: {
        findUnique: jest.fn().mockResolvedValue(baseService),
        update: jest.fn().mockResolvedValue(updatedService),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(
      service.updateService('service-1', {
        status: 'hidden',
      }),
    ).resolves.toEqual({
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
      priceFrom: 3500,
      durationLabel: '2 часа',
      status: 'hidden',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-09T09:00:00.000Z',
    });
    expect(prisma.service.update).toHaveBeenCalledWith({
      where: { id: 'service-1' },
      data: { status: 'hidden' },
      select: expect.any(Object),
    });
  });

  it('deletes existing service and returns dto', async () => {
    const prisma = {
      service: {
        findUnique: jest.fn().mockResolvedValue(baseService),
        delete: jest.fn().mockResolvedValue(baseService),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(service.deleteService('service-1')).resolves.toEqual({
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
      priceFrom: 3500,
      durationLabel: '2 часа',
      status: 'active',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });
    expect(prisma.service.delete).toHaveBeenCalledWith({
      where: { id: 'service-1' },
    });
  });

  it('throws when service is missing during update', async () => {
    const prisma = {
      service: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(
      service.updateService('missing', {
        status: 'hidden',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
