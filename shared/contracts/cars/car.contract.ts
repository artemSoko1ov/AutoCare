import { z } from 'zod';
import { carBrandValues } from './car-catalog';

export const carDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  brand: z.enum(carBrandValues),
  model: z.string(),
  year: z.number().int(),
  licensePlate: z.string(),
  vin: z.string().nullable(),
  mileage: z.number().int(),
  photoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getCarsResponseSchema = z.array(carDtoSchema);
export const getCarResponseSchema = carDtoSchema;
export const deleteCarResponseSchema = carDtoSchema;

export type CarDto = z.infer<typeof carDtoSchema>;
export type GetCarsResponse = z.infer<typeof getCarsResponseSchema>;
export type GetCarResponse = z.infer<typeof getCarResponseSchema>;
export type DeleteCarResponse = z.infer<typeof deleteCarResponseSchema>;
