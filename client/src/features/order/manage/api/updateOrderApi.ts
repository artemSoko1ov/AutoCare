import type { UpdateOrderBody, UpdateOrderResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const updateOrderApi = async (orderId: string, data: UpdateOrderBody) => {
  const response = await axiosInstance.patch<UpdateOrderResponse>(
    `/admin/requests/${orderId}`,
    data,
  );
  return response.data;
};
