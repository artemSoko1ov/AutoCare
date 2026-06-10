import type { DeleteReviewResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const deleteAdminReviewApi = async (reviewId: string) => {
  const response = await axiosInstance.delete<DeleteReviewResponse>(`/admin/reviews/${reviewId}`);
  return response.data;
};
