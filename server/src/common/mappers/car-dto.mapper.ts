import { isCarBrand, type CarDto } from '@shared/contracts/cars';

type CarDtoSource = {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string | null;
  mileage: number;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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
