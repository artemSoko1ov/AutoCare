import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { DeleteCarResponse } from "@shared/contracts/cars";

export const deleteCarApi = async (carId: string): Promise<DeleteCarResponse> => {
  const response = await axiosInstance.delete<DeleteCarResponse>(`/cars/${carId}`);
  return response.data;
};
