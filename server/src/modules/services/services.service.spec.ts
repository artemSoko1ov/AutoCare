import type { PrismaService } from '@prisma/prisma.service';
import { ServicesService } from './services.service';

describe('ServicesService', () => {
  it('returns only active public services ordered by category, price and title', async () => {
    const prisma = {
      service: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'service-1',
            title: 'Диагностика перед покупкой',
            category: 'Диагностика',
            summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
            priceFrom: 3500,
            durationLabel: '2 часа',
            status: 'active',
            createdAt: new Date('2026-06-08T10:00:00.000Z'),
            updatedAt: new Date('2026-06-08T11:00:00.000Z'),
          },
        ]),
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
});
