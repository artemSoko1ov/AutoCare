import { z } from 'zod';
import { serviceDtoSchema, serviceStatusSchema } from './service.contract';

export const CreateServiceBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Название услуги должно быть не короче 3 символов')
    .max(120, 'Название услуги не должно быть длиннее 120 символов'),
  category: z
    .string()
    .trim()
    .min(2, 'Укажите категорию услуги')
    .max(80, 'Категория не должна быть длиннее 80 символов'),
  summary: z
    .string()
    .trim()
    .min(10, 'Добавьте краткое описание услуги')
    .max(280, 'Описание не должно быть длиннее 280 символов'),
  priceFrom: z
    .number()
    .int('Цена должна быть целым числом')
    .min(0, 'Цена не может быть отрицательной')
    .max(10_000_000, 'Цена выглядит некорректной'),
  durationLabel: z
    .string()
    .trim()
    .min(1, 'Укажите длительность услуги')
    .max(60, 'Длительность не должна быть длиннее 60 символов'),
  status: serviceStatusSchema,
});

export const CreateServiceResponseSchema = serviceDtoSchema;

export type CreateServiceBody = z.infer<typeof CreateServiceBodySchema>;
export type CreateServiceResponse = z.infer<typeof CreateServiceResponseSchema>;
