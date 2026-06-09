import type { CreateOrderBody, CreateOrderResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const createOrderApi = async (data: CreateOrderBody) => {
  const response = await axiosInstance.post<CreateOrderResponse>("/orders", data);
  return response.data;
};
