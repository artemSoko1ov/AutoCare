import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { LoginBody, LoginResponse } from "@shared/contracts/auth";

export const loginApi = async (data: LoginBody): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", data, {
    skipAuthRefresh: true,
  });
  return response.data;
};
