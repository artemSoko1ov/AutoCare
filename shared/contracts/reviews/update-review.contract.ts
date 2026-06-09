import { z } from 'zod';
import {
  reviewCommentSchema,
  reviewRatingSchema,
  updateReviewResponseSchema,
} from './review.contract';

export const UpdateReviewBodySchema = z.object({
  rating: reviewRatingSchema,
  comment: reviewCommentSchema,
});

export const UpdateReviewResponseSchema = updateReviewResponseSchema;

export type UpdateReviewBody = z.infer<typeof UpdateReviewBodySchema>;
export type UpdateReviewResponse = z.infer<typeof UpdateReviewResponseSchema>;
