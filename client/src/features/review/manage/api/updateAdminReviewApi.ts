import type { UpdateReviewBody, UpdateReviewResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const updateAdminReviewApi = async (reviewId: string, data: UpdateReviewBody) => {
  const response = await axiosInstance.patch<UpdateReviewResponse>(
    `/admin/reviews/${reviewId}`,
    data,
  );
  return response.data;
};
