import type { CreateReviewBody, CreateReviewResponse } from "@shared/contracts/reviews";
import axiosInstance from "@/shared/api/axiosInstance";

export const createReviewApi = async (data: CreateReviewBody) => {
  const response = await axiosInstance.post<CreateReviewResponse>("/reviews", data);
  return response.data;
};
