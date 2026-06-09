import type { GetReviewsQuery, GetReviewsResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const getReviewsApi = async (query: GetReviewsQuery = {}) => {
  const response = await axiosInstance.get<GetReviewsResponse>("/reviews", {
    params: query,
  });

  return response.data;
};
