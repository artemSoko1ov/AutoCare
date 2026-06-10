import type { GetServicesResponse } from "@shared/contracts/services";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const getServicesApi = async () => {
  const response = await axiosInstance.get<GetServicesResponse>("/services");
  return response.data;
};
