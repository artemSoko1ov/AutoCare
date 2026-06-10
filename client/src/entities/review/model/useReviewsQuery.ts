import { useQuery } from "@tanstack/react-query";
import { getAdminReviewsApi } from "../api/getAdminReviewsApi";
import { getMyReviewsApi } from "../api/getMyReviewsApi";
import { getReviewsApi } from "../api/getReviewsApi";

export const reviewsQueryKey = ["reviews"] as const;
export const publicReviewsQueryKey = (limit?: number) =>
  [...reviewsQueryKey, "public", limit ?? "all"] as const;
export const serviceReviewsQueryKey = (serviceId: string) =>
  [...reviewsQueryKey, "service", serviceId] as const;
export const myReviewsQueryKey = [...reviewsQueryKey, "me"] as const;
export const adminReviewsQueryKey = ["admin", "reviews"] as const;

export const useReviewsQuery = (limit?: number) => {
  return useQuery({
    queryKey: publicReviewsQueryKey(limit),
    queryFn: () => getReviewsApi(limit ? { limit } : {}),
  });
};

export const useServiceReviewsQuery = (serviceId?: string) => {
  return useQuery({
    queryKey: serviceId ? serviceReviewsQueryKey(serviceId) : [...reviewsQueryKey, "service"],
    queryFn: () => getReviewsApi({ serviceId }),
    enabled: Boolean(serviceId),
  });
};

export const useMyReviewsQuery = () => {
  return useQuery({
    queryKey: myReviewsQueryKey,
    queryFn: getMyReviewsApi,
  });
};

export const useAdminReviewsQuery = () => {
  return useQuery({
    queryKey: adminReviewsQueryKey,
    queryFn: getAdminReviewsApi,
  });
};
