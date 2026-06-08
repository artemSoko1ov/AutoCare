import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { CreateCarBody, CreateCarResponse } from "@shared/contracts/cars";

export const createCarApi = async (data: CreateCarBody): Promise<CreateCarResponse> => {
  const response = await axiosInstance.post<CreateCarResponse>("/cars", data);
  return response.data;
};
