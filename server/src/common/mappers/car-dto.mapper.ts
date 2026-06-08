import { Prisma } from '@prisma/client';
import { isCarBrand, type CarDto } from '@shared/contracts/cars';

export const carDtoSelect = {
  id: true,
  userId: true,
  brand: true,
  model: true,
  year: true,
  licensePlate: true,
  vin: true,
  mileage: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CarSelect;

export type CarDtoSource = Prisma.CarGetPayload<{
  select: typeof carDtoSelect;
}>;

export const toCarDto = (car: CarDtoSource): CarDto => ({
  ...(() => {
    if (!isCarBrand(car.brand)) {
      throw new Error(`Unsupported car brand: ${car.brand}`);
    }

    return {
      id: car.id,
      userId: car.userId,
      brand: car.brand,
      model: car.model,
      year: car.year,
      licensePlate: car.licensePlate,
      vin: car.vin,
      mileage: car.mileage,
      photoUrl: car.photoUrl,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    };
  })(),
});
