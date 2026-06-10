import type { UpdateReviewBody, UpdateReviewResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const updateReviewApi = async (reviewId: string, data: UpdateReviewBody) => {
  const response = await axiosInstance.patch<UpdateReviewResponse>(`/reviews/${reviewId}`, data);
  return response.data;
};
