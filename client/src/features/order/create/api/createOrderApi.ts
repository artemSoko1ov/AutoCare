import type { CreateOrderBody, CreateOrderResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const createOrderApi = async (data: CreateOrderBody) => {
  const response = await axiosInstance.post<CreateOrderResponse>("/requests", data);
  return response.data;
};
