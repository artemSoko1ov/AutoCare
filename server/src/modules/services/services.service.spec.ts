import { ConflictException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '@prisma/prisma.service';
import { createServiceSlug } from './service-slug.util';
import { ServicesService } from './services.service';

describe('ServicesService', () => {
  const baseService = {
    id: 'service-1',
    title: 'Диагностика перед покупкой',
    category: 'Диагностика',
    summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
    iconPath: '/icons/services/magnifying-glass-plus.svg',
    priceFrom: 3500,
    durationLabel: '2 часа',
    includedItems: [
      'Проверка кузова и лакокрасочного покрытия.',
      'Диагностика основных электронных систем.',
      'Рекомендации по рискам перед покупкой.',
    ],
    workflowSteps: [
      'Сначала уточняем, какой автомобиль планируете смотреть.',
      'Потом проводим диагностику и фиксируем замечания.',
      'В конце выдаем понятное заключение по состоянию авто.',
    ],
    status: 'active',
    createdAt: new Date('2026-06-08T10:00:00.000Z'),
    updatedAt: new Date('2026-06-08T11:00:00.000Z'),
  } as const;

  const createPayload = {
    title: baseService.title,
    category: baseService.category,
    summary: baseService.summary,
    iconPath: baseService.iconPath,
    priceFrom: baseService.priceFrom,
    durationLabel: baseService.durationLabel,
    includedItems: [...baseService.includedItems],
    workflowSteps: [...baseService.workflowSteps],
    status: 'active' as const,
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
        iconPath: '/icons/services/magnifying-glass-plus.svg',
        priceFrom: 3500,
        durationLabel: '2 часа',
        includedItems: [
          'Проверка кузова и лакокрасочного покрытия.',
          'Диагностика основных электронных систем.',
          'Рекомендации по рискам перед покупкой.',
        ],
        workflowSteps: [
          'Сначала уточняем, какой автомобиль планируете смотреть.',
          'Потом проводим диагностику и фиксируем замечания.',
          'В конце выдаем понятное заключение по состоянию авто.',
        ],
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

  it('returns one active public service by id', async () => {
    const prisma = {
      service: {
        findFirst: jest.fn().mockResolvedValue(baseService),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(service.getPublicServiceById('service-1')).resolves.toEqual({
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
      iconPath: '/icons/services/magnifying-glass-plus.svg',
      priceFrom: 3500,
      durationLabel: '2 часа',
      includedItems: [
        'Проверка кузова и лакокрасочного покрытия.',
        'Диагностика основных электронных систем.',
        'Рекомендации по рискам перед покупкой.',
      ],
      workflowSteps: [
        'Сначала уточняем, какой автомобиль планируете смотреть.',
        'Потом проводим диагностику и фиксируем замечания.',
        'В конце выдаем понятное заключение по состоянию авто.',
      ],
      status: 'active',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });

    expect(prisma.service.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'service-1',
        status: 'active',
      },
      select: expect.any(Object),
    });
  });

  it('creates a service and returns dto', async () => {
    const prisma = {
      service: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(baseService),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(service.createService(createPayload)).resolves.toEqual({
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
      iconPath: '/icons/services/magnifying-glass-plus.svg',
      priceFrom: 3500,
      durationLabel: '2 часа',
      includedItems: [
        'Проверка кузова и лакокрасочного покрытия.',
        'Диагностика основных электронных систем.',
        'Рекомендации по рискам перед покупкой.',
      ],
      workflowSteps: [
        'Сначала уточняем, какой автомобиль планируете смотреть.',
        'Потом проводим диагностику и фиксируем замечания.',
        'В конце выдаем понятное заключение по состоянию авто.',
      ],
      status: 'active',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });

    expect(prisma.service.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: baseService.title,
        category: baseService.category,
        slug: expect.stringMatching(/^service-[a-f0-9]{16}$/),
      }),
      select: expect.any(Object),
    });
  });

  it('updates existing service and returns dto', async () => {
    const updatedService = {
      ...baseService,
      status: 'hidden',
      updatedAt: new Date('2026-06-09T09:00:00.000Z'),
    };
    const findUnique = jest
      .fn()
      .mockResolvedValueOnce({
        id: baseService.id,
        title: baseService.title,
        category: baseService.category,
      })
      .mockResolvedValueOnce({
        id: baseService.id,
      });

    const prisma = {
      service: {
        findUnique,
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
      iconPath: '/icons/services/magnifying-glass-plus.svg',
      priceFrom: 3500,
      durationLabel: '2 часа',
      includedItems: [
        'Проверка кузова и лакокрасочного покрытия.',
        'Диагностика основных электронных систем.',
        'Рекомендации по рискам перед покупкой.',
      ],
      workflowSteps: [
        'Сначала уточняем, какой автомобиль планируете смотреть.',
        'Потом проводим диагностику и фиксируем замечания.',
        'В конце выдаем понятное заключение по состоянию авто.',
      ],
      status: 'hidden',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-09T09:00:00.000Z',
    });

    expect(prisma.service.update).toHaveBeenCalledWith({
      where: { id: 'service-1' },
      data: {
        status: 'hidden',
        slug: createServiceSlug(baseService.title, baseService.category),
      },
      select: expect.any(Object),
    });
  });

  it('recomputes slug when title or category changes during update', async () => {
    const nextTitle = 'Новая диагностика';
    const nextCategory = 'Премиум';
    const updatedService = {
      ...baseService,
      title: nextTitle,
      category: nextCategory,
      updatedAt: new Date('2026-06-09T09:00:00.000Z'),
    };
    const findUnique = jest
      .fn()
      .mockResolvedValueOnce({
        id: baseService.id,
        title: baseService.title,
        category: baseService.category,
      })
      .mockResolvedValueOnce(null);

    const prisma = {
      service: {
        findUnique,
        update: jest.fn().mockResolvedValue(updatedService),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(
      service.updateService(baseService.id, {
        title: nextTitle,
        category: nextCategory,
      }),
    ).resolves.toMatchObject({
      id: baseService.id,
      title: nextTitle,
      category: nextCategory,
    });

    expect(prisma.service.update).toHaveBeenCalledWith({
      where: { id: baseService.id },
      data: {
        title: nextTitle,
        category: nextCategory,
        slug: createServiceSlug(nextTitle, nextCategory),
      },
      select: expect.any(Object),
    });
  });

  it('throws when a service with the same slug already exists during create', async () => {
    const prisma = {
      service: {
        findUnique: jest.fn().mockResolvedValue({ id: 'service-1' }),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(service.createService(createPayload)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('throws when updated title and category conflict with another service', async () => {
    const nextTitle = 'Новая диагностика';
    const nextCategory = 'Премиум';
    const findUnique = jest
      .fn()
      .mockResolvedValueOnce({
        id: baseService.id,
        title: baseService.title,
        category: baseService.category,
      })
      .mockResolvedValueOnce({ id: 'service-2' });
    const prisma = {
      service: {
        findUnique,
        update: jest.fn(),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(
      service.updateService(baseService.id, {
        title: nextTitle,
        category: nextCategory,
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.service.update).not.toHaveBeenCalled();
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
      iconPath: '/icons/services/magnifying-glass-plus.svg',
      priceFrom: 3500,
      durationLabel: '2 часа',
      includedItems: [
        'Проверка кузова и лакокрасочного покрытия.',
        'Диагностика основных электронных систем.',
        'Рекомендации по рискам перед покупкой.',
      ],
      workflowSteps: [
        'Сначала уточняем, какой автомобиль планируете смотреть.',
        'Потом проводим диагностику и фиксируем замечания.',
        'В конце выдаем понятное заключение по состоянию авто.',
      ],
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

  it('throws when active public service is missing', async () => {
    const prisma = {
      service: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new ServicesService(prisma);

    await expect(
      service.getPublicServiceById('missing'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
