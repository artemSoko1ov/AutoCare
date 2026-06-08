import { z } from 'zod';
import { carDtoSchema } from './car.contract';

const currentYear = new Date().getFullYear() + 1;

const normalizeOptionalUppercase = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalizedValue = value.trim().toUpperCase();
  return normalizedValue === '' ? null : normalizedValue;
};

const normalizeUppercase = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().toUpperCase();
};

export const UpdateCarBodySchema = z
  .object({
    brand: z
      .string()
      .trim()
      .min(1, 'Укажите марку автомобиля')
      .max(50, 'Марка не должна быть длиннее 50 символов')
      .optional(),
    model: z
      .string()
      .trim()
      .min(1, 'Укажите модель автомобиля')
      .max(50, 'Модель не должна быть длиннее 50 символов')
      .optional(),
    year: z
      .number()
      .int('Год выпуска должен быть целым числом')
      .min(1900, 'Год выпуска должен быть не раньше 1900')
      .max(currentYear, `Год выпуска должен быть не позже ${currentYear}`)
      .optional(),
    licensePlate: z.preprocess(
      normalizeUppercase,
      z
        .string()
        .min(5, 'Укажите госномер автомобиля')
        .max(16, 'Госномер не должен быть длиннее 16 символов')
        .optional(),
    ),
    vin: z.preprocess(
      normalizeOptionalUppercase,
      z
        .string()
        .min(17, 'VIN должен состоять из 17 символов')
        .max(17, 'VIN должен состоять из 17 символов')
        .nullable()
        .optional(),
    ),
    mileage: z
      .number()
      .int('Пробег должен быть целым числом')
      .min(0, 'Пробег не может быть отрицательным')
      .max(2_000_000, 'Пробег выглядит некорректным')
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    'Передайте хотя бы одно поле для обновления',
  );

export const UpdateCarResponseSchema = carDtoSchema;

export type UpdateCarBody = z.infer<typeof UpdateCarBodySchema>;
export type UpdateCarResponse = z.infer<typeof UpdateCarResponseSchema>;
