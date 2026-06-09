import type { GetOrdersResponse } from "@shared/contracts/orders";
import axiosInstance from "@/shared/api/axiosInstance";

export const getAdminOrdersApi = async () => {
  const response = await axiosInstance.get<GetOrdersResponse>("/admin/orders");
  return response.data;
};
