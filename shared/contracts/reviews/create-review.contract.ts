import { z } from 'zod';
import {
  createReviewResponseSchema,
  reviewCommentSchema,
  reviewRatingSchema,
} from './review.contract';

export const CreateReviewBodySchema = z.object({
  orderId: z.string().trim().min(1, 'Не удалось определить заявку для отзыва'),
  rating: reviewRatingSchema,
  comment: reviewCommentSchema,
});

export const CreateReviewResponseSchema = createReviewResponseSchema;

export type CreateReviewBody = z.infer<typeof CreateReviewBodySchema>;
export type CreateReviewResponse = z.infer<typeof CreateReviewResponseSchema>;
