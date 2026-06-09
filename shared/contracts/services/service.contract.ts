import { z } from 'zod';

export const serviceStatusValues = ['active', 'draft', 'hidden'] as const;

export const serviceStatusSchema = z.enum(serviceStatusValues);
export const serviceIconPathSchema = z
  .string()
  .trim()
  .min(1, 'Укажите путь к иконке')
  .max(255, 'Путь к иконке не должен быть длиннее 255 символов')
  .regex(/^\/.+/, 'Путь к иконке должен начинаться с /');

const serviceContentItemSchema = z
  .string()
  .trim()
  .min(10, 'Каждый пункт должен быть не короче 10 символов')
  .max(220, 'Каждый пункт должен быть не длиннее 220 символов');

export const serviceIncludedItemsSchema = z
  .array(serviceContentItemSchema)
  .min(3, 'Добавьте минимум 3 пункта в блок "Что входит в услугу"')
  .max(8, 'В блоке "Что входит в услугу" не должно быть больше 8 пунктов');

export const serviceWorkflowStepsSchema = z
  .array(serviceContentItemSchema)
  .min(3, 'Добавьте минимум 3 шага в блок "Как проходит работа"')
  .max(8, 'В блоке "Как проходит работа" не должно быть больше 8 шагов');

export const serviceDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  summary: z.string(),
  iconPath: serviceIconPathSchema,
  includedItems: serviceIncludedItemsSchema,
  workflowSteps: serviceWorkflowStepsSchema,
  priceFrom: z.number().int(),
  durationLabel: z.string(),
  status: serviceStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getServicesResponseSchema = z.array(serviceDtoSchema);
export const getServiceResponseSchema = serviceDtoSchema;

export type ServiceStatus = z.infer<typeof serviceStatusSchema>;
export type ServiceDto = z.infer<typeof serviceDtoSchema>;
export type GetServicesResponse = z.infer<typeof getServicesResponseSchema>;
export type GetServiceResponse = z.infer<typeof getServiceResponseSchema>;
