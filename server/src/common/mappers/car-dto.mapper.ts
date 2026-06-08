import type { CarDto } from '@shared/contracts/cars';

type CarDtoSource = {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string | null;
  mileage: number;
  createdAt: Date;
  updatedAt: Date;
};

export const toCarDto = (car: CarDtoSource): CarDto => ({
  id: car.id,
  userId: car.userId,
  brand: car.brand,
  model: car.model,
  year: car.year,
  licensePlate: car.licensePlate,
  vin: car.vin,
  mileage: car.mileage,
  createdAt: car.createdAt.toISOString(),
  updatedAt: car.updatedAt.toISOString(),
});
