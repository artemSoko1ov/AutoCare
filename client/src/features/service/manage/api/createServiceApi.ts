import type { CreateServiceBody, CreateServiceResponse } from "@shared/contracts/services";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const createServiceApi = async (data: CreateServiceBody) => {
  const response = await axiosInstance.post<CreateServiceResponse>("/admin/services", data);
  return response.data;
};
