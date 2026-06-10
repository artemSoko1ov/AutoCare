import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateReviewBody,
  CreateReviewResponse,
  DeleteReviewResponse,
  UpdateReviewBody,
  UpdateReviewResponse,
} from "@shared/contracts/reviews";
import { adminReviewsQueryKey, reviewsQueryKey } from "@/entities/review";
import {
  getApiErrorMessage,
  getValidationIssues,
  mapValidationIssues,
} from "@/shared/lib/api/validation";
import { createReviewApi } from "../api/createReviewApi";
import { deleteAdminReviewApi } from "../api/deleteAdminReviewApi";
import { deleteReviewApi } from "../api/deleteReviewApi";
import { updateAdminReviewApi } from "../api/updateAdminReviewApi";
import { updateReviewApi } from "../api/updateReviewApi";

const createReviewFieldNames = ["orderId", "rating", "comment"] as const;
const reviewFieldNames = ["rating", "comment"] as const;

export type CreateReviewFieldName = (typeof createReviewFieldNames)[number];
export type ReviewFieldName = (typeof reviewFieldNames)[number];
export type CreateReviewFieldErrors = Partial<Record<CreateReviewFieldName, string>>;
export type ReviewFieldErrors = Partial<Record<ReviewFieldName, string>>;

const invalidateReviewQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: reviewsQueryKey }),
    queryClient.invalidateQueries({ queryKey: adminReviewsQueryKey }),
  ]);
};

export const getReviewErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, "Не удалось выполнить действие с отзывом");
};

export const getCreateReviewFieldErrors = (error: unknown) => {
  const validationErrors = getValidationIssues(error);

  return {
    validationErrors,
    fieldErrors: mapValidationIssues(
      validationErrors,
      createReviewFieldNames,
    ) as CreateReviewFieldErrors,
  };
};

export const getReviewFieldErrors = (error: unknown) => {
  const validationErrors = getValidationIssues(error);

  return {
    validationErrors,
    fieldErrors: mapValidationIssues(validationErrors, reviewFieldNames) as ReviewFieldErrors,
  };
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewResponse, unknown, CreateReviewBody>({
    mutationFn: createReviewApi,
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateReviewResponse, unknown, { reviewId: string; data: UpdateReviewBody }>({
    mutationFn: ({ reviewId, data }) => updateReviewApi(reviewId, data),
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReviewResponse, unknown, string>({
    mutationFn: deleteReviewApi,
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};

export const useAdminUpdateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateReviewResponse, unknown, { reviewId: string; data: UpdateReviewBody }>({
    mutationFn: ({ reviewId, data }) => updateAdminReviewApi(reviewId, data),
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};

export const useAdminDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReviewResponse, unknown, string>({
    mutationFn: deleteAdminReviewApi,
    onSuccess: async () => {
      await invalidateReviewQueries(queryClient);
    },
  });
};
