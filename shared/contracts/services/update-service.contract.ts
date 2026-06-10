import { z } from 'zod';
import {
  serviceDtoSchema,
  serviceIconPathSchema,
  serviceIncludedItemsSchema,
  serviceStatusSchema,
  serviceWorkflowStepsSchema,
} from './service.contract';

export const UpdateServiceBodySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Название услуги должно быть не короче 3 символов')
      .max(120, 'Название услуги не должно быть длиннее 120 символов')
      .optional(),
    category: z
      .string()
      .trim()
      .min(2, 'Укажите категорию услуги')
      .max(80, 'Категория не должна быть длиннее 80 символов')
      .optional(),
    summary: z
      .string()
      .trim()
      .min(10, 'Добавьте краткое описание услуги')
      .max(280, 'Описание не должно быть длиннее 280 символов')
      .optional(),
    iconPath: serviceIconPathSchema.optional(),
    includedItems: serviceIncludedItemsSchema.optional(),
    workflowSteps: serviceWorkflowStepsSchema.optional(),
    priceFrom: z
      .number()
      .int('Цена должна быть целым числом')
      .min(0, 'Цена не может быть отрицательной')
      .max(10_000_000, 'Цена выглядит некорректной')
      .optional(),
    durationLabel: z
      .string()
      .trim()
      .min(1, 'Укажите длительность услуги')
      .max(60, 'Длительность не должна быть длиннее 60 символов')
      .optional(),
    status: serviceStatusSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    'Передайте хотя бы одно поле для обновления',
  );

export const UpdateServiceResponseSchema = serviceDtoSchema;

export type UpdateServiceBody = z.infer<typeof UpdateServiceBodySchema>;
export type UpdateServiceResponse = z.infer<typeof UpdateServiceResponseSchema>;
