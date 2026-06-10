import { z } from 'zod';

export const GetReviewsQuerySchema = z.object({
  serviceId: z.string().trim().min(1).optional(),
  limit: z.coerce
    .number()
    .int('Лимит должен быть целым числом')
    .min(1, 'Лимит должен быть не меньше 1')
    .max(20, 'Лимит не должен превышать 20')
    .optional(),
});

export type GetReviewsQuery = z.infer<typeof GetReviewsQuerySchema>;
