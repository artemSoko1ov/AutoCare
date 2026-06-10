import axiosInstance from "@/shared/api/axiosInstance.ts";

export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout", undefined, {
    skipAuthRefresh: true,
  });
  return response.data;
};
