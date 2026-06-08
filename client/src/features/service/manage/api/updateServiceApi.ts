import type { UpdateServiceBody, UpdateServiceResponse } from "@shared/contracts/services";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const updateServiceApi = async (serviceId: string, data: UpdateServiceBody) => {
  const response = await axiosInstance.patch<UpdateServiceResponse>(
    `/admin/services/${serviceId}`,
    data,
  );
  return response.data;
};
