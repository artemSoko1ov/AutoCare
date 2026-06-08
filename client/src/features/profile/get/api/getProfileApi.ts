import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { UserDto } from "@shared/contracts/auth";

export const getProfileApi = async (): Promise<UserDto> => {
  const response = await axiosInstance.get<UserDto>("/profile");
  return response.data;
};
