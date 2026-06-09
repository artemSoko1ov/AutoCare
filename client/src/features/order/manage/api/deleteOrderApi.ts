import type { DeleteOrderResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const deleteOrderApi = async (orderId: string) => {
  const response = await axiosInstance.delete<DeleteOrderResponse>(`/admin/requests/${orderId}`);
  return response.data;
};
