import { ConflictException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '@prisma/prisma.service';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  const baseReview = {
    id: 'review-1',
    userId: 'user-1',
    serviceId: 'service-1',
    orderId: 'order-1',
    rating: 5,
    comment:
      'Подробно объяснили проблему и помогли принять решение по ремонту.',
    createdAt: new Date('2026-06-10T08:00:00.000Z'),
    updatedAt: new Date('2026-06-10T08:00:00.000Z'),
    user: {
      id: 'user-1',
      username: 'Иван Петров',
      avatarUrl: null,
    },
    service: {
      id: 'service-1',
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      iconPath: '/icons/services/magnifying-glass-plus.svg',
    },
    order: {
      id: 'order-1',
      status: 'completed',
      scheduledFor: new Date('2026-06-12T10:00:00.000Z'),
      createdAt: new Date('2026-06-09T10:00:00.000Z'),
      carSnapshot: {
        id: 'snapshot-1',
        brand: 'Toyota',
        model: 'Camry',
        year: 2018,
        mileage: 65000,
        plateNumber: 'A123BC77',
        photoUrl: null,
        createdAt: new Date('2026-06-09T10:00:00.000Z'),
      },
    },
  } as const;

  it('returns public reviews and applies service filter', async () => {
    const prisma = {
      review: {
        findMany: jest.fn().mockResolvedValue([baseReview]),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.getPublicReviews({
        serviceId: 'service-1',
        limit: 3,
      }),
    ).resolves.toHaveLength(1);

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: {
        serviceId: 'service-1',
        service: {
          is: {
            status: 'active',
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 3,
      select: expect.any(Object),
    });
  });

  it('returns current user reviews ordered by created date', async () => {
    const prisma = {
      review: {
        findMany: jest.fn().mockResolvedValue([baseReview]),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(service.getUserReviews('user-1')).resolves.toHaveLength(1);
    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: [{ createdAt: 'desc' }],
      select: expect.any(Object),
    });
  });

  it('creates review only for completed owned order without duplicate', async () => {
    const prisma = {
      order: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'order-1',
          userId: 'user-1',
          serviceId: 'service-1',
          status: 'completed',
        }),
      },
      review: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(baseReview),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.createReview('user-1', {
        orderId: 'order-1',
        rating: 5,
        comment:
          '  Подробно объяснили проблему и помогли принять решение по ремонту.  ',
      }),
    ).resolves.toMatchObject({
      id: 'review-1',
      rating: 5,
      orderId: 'order-1',
    });

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        serviceId: 'service-1',
        orderId: 'order-1',
        rating: 5,
        comment:
          'Подробно объяснили проблему и помогли принять решение по ремонту.',
      },
      select: expect.any(Object),
    });
  });

  it('throws when review already exists for order', async () => {
    const prisma = {
      order: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'order-1',
          userId: 'user-1',
          serviceId: 'service-1',
          status: 'completed',
        }),
      },
      review: {
        findUnique: jest.fn().mockResolvedValue({ id: 'review-1' }),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.createReview('user-1', {
        orderId: 'order-1',
        rating: 5,
        comment: 'Повторный отзыв не должен создаваться.',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when completed order is missing', async () => {
    const prisma = {
      order: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.createReview('user-1', {
        orderId: 'missing-order',
        rating: 4,
        comment: 'Заказ не найден для отзыва.',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates owned review', async () => {
    const updatedReview = {
      ...baseReview,
      rating: 4,
      comment: 'Работа выполнена хорошо, но по времени затянули.',
      updatedAt: new Date('2026-06-10T09:00:00.000Z'),
    };
    const prisma = {
      review: {
        findFirst: jest.fn().mockResolvedValue(baseReview),
        update: jest.fn().mockResolvedValue(updatedReview),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.updateUserReview('user-1', 'review-1', {
        rating: 4,
        comment: '  Работа выполнена хорошо, но по времени затянули. ',
      }),
    ).resolves.toMatchObject({
      id: 'review-1',
      rating: 4,
    });

    expect(prisma.review.update).toHaveBeenCalledWith({
      where: { id: 'review-1' },
      data: {
        rating: 4,
        comment: 'Работа выполнена хорошо, но по времени затянули.',
      },
      select: expect.any(Object),
    });
  });

  it('deletes owned review and returns removed dto', async () => {
    const prisma = {
      review: {
        findFirst: jest.fn().mockResolvedValue(baseReview),
        delete: jest.fn().mockResolvedValue(baseReview),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.deleteUserReview('user-1', 'review-1'),
    ).resolves.toMatchObject({
      id: 'review-1',
    });

    expect(prisma.review.delete).toHaveBeenCalledWith({
      where: { id: 'review-1' },
    });
  });

  it('updates review from admin side', async () => {
    const updatedReview = {
      ...baseReview,
      rating: 3,
      comment: 'Комментарий администратора после уточнения.',
      updatedAt: new Date('2026-06-10T09:00:00.000Z'),
    };
    const prisma = {
      review: {
        findUnique: jest.fn().mockResolvedValue(baseReview),
        update: jest.fn().mockResolvedValue(updatedReview),
      },
    } as unknown as PrismaService;

    const service = new ReviewsService(prisma);

    await expect(
      service.updateAdminReview('review-1', {
        rating: 3,
        comment: 'Комментарий администратора после уточнения.',
      }),
    ).resolves.toMatchObject({
      id: 'review-1',
      rating: 3,
    });
  });
});
