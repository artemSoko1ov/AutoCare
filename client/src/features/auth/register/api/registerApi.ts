import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { RegisterBody, RegisterResponse } from "@shared/contracts/auth";

export const registerApi = async (data: RegisterBody): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>("/auth/register", data);
  return response.data;
};
