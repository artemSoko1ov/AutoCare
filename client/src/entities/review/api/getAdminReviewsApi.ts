import type { GetReviewsResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const getAdminReviewsApi = async () => {
  const response = await axiosInstance.get<GetReviewsResponse>("/admin/reviews");
  return response.data;
};
