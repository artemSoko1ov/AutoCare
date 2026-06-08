import type { GetServiceResponse } from "@shared/contracts/services";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const deleteServiceApi = async (serviceId: string) => {
  const response = await axiosInstance.delete<GetServiceResponse>(`/admin/services/${serviceId}`);
  return response.data;
};
