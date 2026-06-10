import { z } from 'zod';
import { orderDtoSchema, orderStatusSchema } from './order.contract';

export const UpdateOrderBodySchema = z
  .object({
    status: orderStatusSchema.optional(),
    notes: z
      .string()
      .trim()
      .max(1000, 'Комментарий не должен быть длиннее 1000 символов')
      .nullable()
      .optional(),
    scheduledFor: z
      .string()
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        'Укажите корректную дату и время',
      )
      .nullable()
      .optional(),
    quotedPrice: z
      .number()
      .int('Стоимость должна быть целым числом')
      .min(0, 'Стоимость не может быть отрицательной')
      .max(10_000_000, 'Стоимость выглядит некорректной')
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    'Передайте хотя бы одно поле для обновления',
  );

export const UpdateOrderResponseSchema = orderDtoSchema;

export type UpdateOrderBody = z.infer<typeof UpdateOrderBodySchema>;
export type UpdateOrderResponse = z.infer<typeof UpdateOrderResponseSchema>;
