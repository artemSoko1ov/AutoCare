import { z } from 'zod';
import { orderCarSnapshotSchema, orderStatusSchema } from '../orders/order.contract';
import { nullableImageValueSchema } from '../auth/user.contract';

export const reviewRatingSchema = z
  .number()
  .int('Оценка должна быть целым числом')
  .min(1, 'Оценка должна быть не меньше 1')
  .max(5, 'Оценка должна быть не больше 5');

export const reviewCommentSchema = z
  .string()
  .trim()
  .min(10, 'Отзыв должен быть не короче 10 символов')
  .max(1_000, 'Отзыв не должен быть длиннее 1000 символов');

export const reviewAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: nullableImageValueSchema,
});

export const reviewServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  iconPath: z.string(),
});

export const reviewOrderSchema = z.object({
  id: z.string(),
  status: orderStatusSchema,
  scheduledFor: z.string().nullable(),
  createdAt: z.string(),
  carSnapshot: orderCarSnapshotSchema,
});

export const reviewDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  serviceId: z.string(),
  orderId: z.string(),
  rating: reviewRatingSchema,
  comment: reviewCommentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  author: reviewAuthorSchema,
  service: reviewServiceSchema,
  order: reviewOrderSchema,
});

export const getReviewsResponseSchema = z.array(reviewDtoSchema);
export const createReviewResponseSchema = reviewDtoSchema;
export const updateReviewResponseSchema = reviewDtoSchema;
export const deleteReviewResponseSchema = reviewDtoSchema;

export type ReviewRating = z.infer<typeof reviewRatingSchema>;
export type ReviewDto = z.infer<typeof reviewDtoSchema>;
export type GetReviewsResponse = z.infer<typeof getReviewsResponseSchema>;
export type DeleteReviewResponse = z.infer<typeof deleteReviewResponseSchema>;
