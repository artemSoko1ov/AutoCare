import type { GetCarsResponse } from "@shared/contracts/cars";
import axiosInstance from "@/shared/api/axiosInstance.ts";

export const getCarsApi = async (): Promise<GetCarsResponse> => {
  const response = await axiosInstance.get<GetCarsResponse>("/cars");
  return response.data;
};
