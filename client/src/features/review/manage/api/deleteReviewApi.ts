import type { DeleteReviewResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const deleteReviewApi = async (reviewId: string) => {
  const response = await axiosInstance.delete<DeleteReviewResponse>(`/reviews/${reviewId}`);
  return response.data;
};
