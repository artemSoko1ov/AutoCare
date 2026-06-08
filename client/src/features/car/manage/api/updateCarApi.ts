import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { UpdateCarBody, UpdateCarResponse } from "@shared/contracts/cars";

export const updateCarApi = async (
  carId: string,
  data: UpdateCarBody,
): Promise<UpdateCarResponse> => {
  const response = await axiosInstance.patch<UpdateCarResponse>(`/cars/${carId}`, data);
  return response.data;
};
