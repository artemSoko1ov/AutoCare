import type { GetReviewsResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const getMyReviewsApi = async () => {
  const response = await axiosInstance.get<GetReviewsResponse>("/reviews/me");
  return response.data;
};
