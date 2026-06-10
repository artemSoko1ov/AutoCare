import type { GetOrderResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const getOrderApi = async (orderId: string) => {
  const response = await axiosInstance.get<GetOrderResponse>(`/requests/${orderId}`);
  return response.data;
};
