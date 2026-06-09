import type { GetOrdersResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const getOrdersApi = async () => {
  const response = await axiosInstance.get<GetOrdersResponse>("/orders");
  return response.data;
};
