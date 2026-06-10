import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { PrismaService } from '@prisma/prisma.service';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  const baseCar = {
    id: 'car-1',
    userId: 'user-1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2018,
    licensePlate: 'A123BC77',
    vin: 'XW7BF4FK90S123456',
    mileage: 65000,
    photoUrl: 'https://example.com/camry.jpg',
    createdAt: new Date('2026-06-08T10:00:00.000Z'),
    updatedAt: new Date('2026-06-08T11:00:00.000Z'),
  };

  it('returns cars list for the current user', async () => {
    const prisma = {
      car: {
        findMany: jest.fn().mockResolvedValue([baseCar]),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(service.getCars('user-1')).resolves.toEqual([
      {
        id: 'car-1',
        userId: 'user-1',
        brand: 'Toyota',
        model: 'Camry',
        year: 2018,
        licensePlate: 'A123BC77',
        vin: 'XW7BF4FK90S123456',
        mileage: 65000,
        photoUrl: 'https://example.com/camry.jpg',
        createdAt: '2026-06-08T10:00:00.000Z',
        updatedAt: '2026-06-08T11:00:00.000Z',
      },
    ]);
    expect(prisma.car.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: [{ createdAt: 'desc' }],
      select: expect.any(Object),
    });
  });

  it('returns one owned car by id', async () => {
    const prisma = {
      car: {
        findFirst: jest.fn().mockResolvedValue(baseCar),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(service.getCarById('user-1', 'car-1')).resolves.toEqual({
      id: 'car-1',
      userId: 'user-1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      licensePlate: 'A123BC77',
      vin: 'XW7BF4FK90S123456',
      mileage: 65000,
      photoUrl: 'https://example.com/camry.jpg',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });
  });

  it('throws when car does not belong to user', async () => {
    const prisma = {
      car: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(
      service.getCarById('user-1', 'missing'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a car and returns normalized dto', async () => {
    const prisma = {
      car: {
        create: jest.fn().mockResolvedValue(baseCar),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(
      service.createCar('user-1', {
        brand: 'Toyota',
        model: 'Camry',
        year: 2018,
        licensePlate: 'A123BC77',
        vin: 'XW7BF4FK90S123456',
        mileage: 65000,
        photoUrl: 'https://example.com/camry.jpg',
      }),
    ).resolves.toEqual({
      id: 'car-1',
      userId: 'user-1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      licensePlate: 'A123BC77',
      vin: 'XW7BF4FK90S123456',
      mileage: 65000,
      photoUrl: 'https://example.com/camry.jpg',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });
  });

  it('updates owned car and returns dto', async () => {
    const updatedCar = {
      ...baseCar,
      mileage: 70000,
      updatedAt: new Date('2026-06-09T09:00:00.000Z'),
    };

    const prisma = {
      car: {
        findFirst: jest.fn().mockResolvedValue(baseCar),
        update: jest.fn().mockResolvedValue(updatedCar),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(
      service.updateCar('user-1', 'car-1', {
        mileage: 70000,
      }),
    ).resolves.toEqual({
      id: 'car-1',
      userId: 'user-1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      licensePlate: 'A123BC77',
      vin: 'XW7BF4FK90S123456',
      mileage: 70000,
      photoUrl: 'https://example.com/camry.jpg',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-09T09:00:00.000Z',
    });
    expect(prisma.car.update).toHaveBeenCalledWith({
      where: { id: 'car-1' },
      data: { mileage: 70000 },
      select: expect.any(Object),
    });
  });

  it('deletes owned car and returns deleted dto', async () => {
    const prisma = {
      car: {
        findFirst: jest.fn().mockResolvedValue(baseCar),
        delete: jest.fn().mockResolvedValue(baseCar),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(service.deleteCar('user-1', 'car-1')).resolves.toEqual({
      id: 'car-1',
      userId: 'user-1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      licensePlate: 'A123BC77',
      vin: 'XW7BF4FK90S123456',
      mileage: 65000,
      photoUrl: 'https://example.com/camry.jpg',
      createdAt: '2026-06-08T10:00:00.000Z',
      updatedAt: '2026-06-08T11:00:00.000Z',
    });
    expect(prisma.car.delete).toHaveBeenCalledWith({
      where: { id: 'car-1' },
    });
  });

  it('maps prisma unique errors to conflict exception', async () => {
    const prisma = {
      car: {
        create: jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Duplicate', {
            clientVersion: '7.8.0',
            code: 'P2002',
            meta: {
              target: ['licensePlate'],
            },
          }),
        ),
      },
    } as unknown as PrismaService;

    const service = new CarsService(prisma);

    await expect(
      service.createCar('user-1', {
        brand: 'Toyota',
        model: 'Camry',
        year: 2018,
        licensePlate: 'A123BC77',
        vin: null,
        mileage: 65000,
        photoUrl: null,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
