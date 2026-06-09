import type { GetServiceResponse } from "@shared/contracts/services";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const getServiceApi = async (serviceId: string) => {
  const response = await axiosInstance.get<GetServiceResponse>(`/services/${serviceId}`);
  return response.data;
};
