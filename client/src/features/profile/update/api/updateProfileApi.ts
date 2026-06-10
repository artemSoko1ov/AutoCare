import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { UpdateProfileBody, UpdateProfileResponse } from "@shared/contracts/auth";

export const updateProfileApi = async (data: UpdateProfileBody): Promise<UpdateProfileResponse> => {
  const response = await axiosInstance.patch<UpdateProfileResponse>("/profile", data);
  return response.data;
};
