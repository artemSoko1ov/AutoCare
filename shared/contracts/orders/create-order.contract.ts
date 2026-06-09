import { z } from 'zod';
import { orderDtoSchema } from './order.contract';

export const CreateOrderBodySchema = z.object({
  serviceId: z.string().trim().min(1, 'Укажите услугу'),
  carId: z.string().trim().min(1, 'Укажите автомобиль'),
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
});

export const CreateOrderResponseSchema = orderDtoSchema;

export type CreateOrderBody = z.infer<typeof CreateOrderBodySchema>;
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
