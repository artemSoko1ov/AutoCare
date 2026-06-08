import type { GetServicesResponse } from "@shared/contracts/services";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const getAdminServicesApi = async () => {
  const response = await axiosInstance.get<GetServicesResponse>("/admin/services");
  return response.data;
};
