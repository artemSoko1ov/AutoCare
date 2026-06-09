import { NotFoundException } from '@nestjs/common';
import type { PrismaService } from '@prisma/prisma.service';
import type { UserDto } from '@shared/contracts/auth';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const currentUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    avatarUrl: null,
    role: 'USER',
    createdAt: '2026-06-09T08:00:00.000Z',
    updatedAt: '2026-06-09T08:00:00.000Z',
  } satisfies UserDto;

  const baseOrder = {
    id: 'order-1',
    userId: 'user-1',
    status: 'new',
    notes: 'Нужно проверить автомобиль до выходных',
    scheduledFor: new Date('2026-06-12T09:30:00.000Z'),
    quotedPrice: null,
    createdAt: new Date('2026-06-09T09:00:00.000Z'),
    updatedAt: new Date('2026-06-09T09:00:00.000Z'),
    customerName: 'Иван Петров',
    customerEmail: 'user@example.com',
    customerPhone: '+7 (999) 123-45-67',
    serviceId: 'service-1',
    serviceTitle: 'Диагностика перед покупкой',
    serviceCategory: 'Диагностика',
    serviceIconPath: '/icons/services/magnifying-glass-plus.svg',
    servicePriceFrom: 3500,
    serviceDurationLabel: '2 часа',
    carSnapshot: {
      id: 'snapshot-1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 65000,
      plateNumber: 'A123BC77',
      photoUrl: null,
      createdAt: new Date('2026-06-09T09:00:00.000Z'),
    },
  } as const;

  it('returns current user orders ordered by created date', async () => {
    const prisma = {
      order: {
        findMany: jest.fn().mockResolvedValue([baseOrder]),
      },
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(service.getOrders('user-1')).resolves.toEqual([
      {
        id: 'order-1',
        userId: 'user-1',
        status: 'new',
        notes: 'Нужно проверить автомобиль до выходных',
        scheduledFor: '2026-06-12T09:30:00.000Z',
        quotedPrice: null,
        createdAt: '2026-06-09T09:00:00.000Z',
        updatedAt: '2026-06-09T09:00:00.000Z',
        customer: {
          id: 'user-1',
          name: 'Иван Петров',
          email: 'user@example.com',
          phone: '+7 (999) 123-45-67',
        },
        service: {
          id: 'service-1',
          title: 'Диагностика перед покупкой',
          category: 'Диагностика',
          iconPath: '/icons/services/magnifying-glass-plus.svg',
          priceFrom: 3500,
          durationLabel: '2 часа',
        },
        carSnapshot: {
          id: 'snapshot-1',
          brand: 'Toyota',
          model: 'Camry',
          year: 2018,
          mileage: 65000,
          plateNumber: 'A123BC77',
          photoUrl: null,
          createdAt: '2026-06-09T09:00:00.000Z',
        },
      },
    ]);

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: [{ createdAt: 'desc' }],
      select: expect.any(Object),
    });
  });

  it('returns one current user order by id', async () => {
    const prisma = {
      order: {
        findFirst: jest.fn().mockResolvedValue(baseOrder),
      },
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(service.getOrderById('user-1', 'order-1')).resolves.toMatchObject({
      id: 'order-1',
      status: 'new',
    });

    expect(prisma.order.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'order-1',
        userId: 'user-1',
      },
      select: expect.any(Object),
    });
  });

  it('returns all admin orders', async () => {
    const prisma = {
      order: {
        findMany: jest.fn().mockResolvedValue([baseOrder]),
      },
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(service.getAdminOrders()).resolves.toHaveLength(1);
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      orderBy: [{ createdAt: 'desc' }],
      select: expect.any(Object),
    });
  });

  it('creates order with immutable car snapshot and service snapshot', async () => {
    const car = {
      id: 'car-1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 65000,
      licensePlate: 'A123BC77',
      photoUrl: null,
    };
    const serviceSnapshot = {
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      iconPath: '/icons/services/magnifying-glass-plus.svg',
      priceFrom: 3500,
      durationLabel: '2 часа',
    };
    const transaction = {
      carSnapshot: {
        create: jest.fn().mockResolvedValue({ id: 'snapshot-1' }),
      },
      order: {
        create: jest.fn().mockResolvedValue(baseOrder),
      },
    };
    const prisma = {
      car: {
        findFirst: jest.fn().mockResolvedValue(car),
      },
      service: {
        findFirst: jest.fn().mockResolvedValue(serviceSnapshot),
      },
      $transaction: jest.fn((callback) => callback(transaction)),
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(
      service.createOrder(currentUser, {
        serviceId: 'service-1',
        carId: 'car-1',
        notes: 'Нужно проверить автомобиль до выходных',
        scheduledFor: '2026-06-12T09:30:00.000Z',
      }),
    ).resolves.toMatchObject({
      id: 'order-1',
      status: 'new',
      service: {
        title: 'Диагностика перед покупкой',
      },
      carSnapshot: {
        plateNumber: 'A123BC77',
      },
    });

    expect(transaction.carSnapshot.create).toHaveBeenCalledWith({
      data: {
        sourceCarId: 'car-1',
        brand: 'Toyota',
        model: 'Camry',
        year: 2018,
        mileage: 65000,
        plateNumber: 'A123BC77',
        photoUrl: null,
      },
      select: {
        id: true,
      },
    });
    expect(transaction.order.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        serviceId: 'service-1',
        carSnapshotId: 'snapshot-1',
        customerName: 'Иван Петров',
        customerEmail: 'user@example.com',
        customerPhone: '+7 (999) 123-45-67',
        serviceTitle: 'Диагностика перед покупкой',
        serviceCategory: 'Диагностика',
        serviceIconPath: '/icons/services/magnifying-glass-plus.svg',
        servicePriceFrom: 3500,
        serviceDurationLabel: '2 часа',
        notes: 'Нужно проверить автомобиль до выходных',
        scheduledFor: new Date('2026-06-12T09:30:00.000Z'),
        quotedPrice: null,
      },
      select: expect.any(Object),
    });
  });

  it('updates admin-controlled order fields', async () => {
    const updatedOrder = {
      ...baseOrder,
      status: 'confirmed',
      quotedPrice: 4200,
      updatedAt: new Date('2026-06-10T10:00:00.000Z'),
    };
    const order = {
      findUnique: jest.fn().mockResolvedValueOnce(baseOrder),
      update: jest.fn().mockResolvedValue(updatedOrder),
    };
    const prisma = {
      order,
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(
      service.updateOrder('order-1', {
        status: 'confirmed',
        quotedPrice: 4200,
      }),
    ).resolves.toMatchObject({
      id: 'order-1',
      status: 'confirmed',
      quotedPrice: 4200,
    });

    expect(order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: {
        status: 'confirmed',
        quotedPrice: 4200,
      },
      select: expect.any(Object),
    });
  });

  it('throws when requested car does not belong to user', async () => {
    const prisma = {
      car: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      service: {
        findFirst: jest.fn(),
      },
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(
      service.createOrder(currentUser, {
        serviceId: 'service-1',
        carId: 'missing-car',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when order is missing during update', async () => {
    const prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new OrdersService(prisma);

    await expect(
      service.updateOrder('missing-order', {
        status: 'cancelled',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
