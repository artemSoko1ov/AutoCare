import { useQuery } from "@tanstack/react-query";
import { getAdminOrdersApi } from "../api/getAdminOrdersApi";
import { getOrdersApi } from "../api/getOrdersApi";

export const ordersQueryKey = ["orders"] as const;
export const adminOrdersQueryKey = ["admin", "orders"] as const;

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: getOrdersApi,
  });
};

export const useAdminOrdersQuery = () => {
  return useQuery({
    queryKey: adminOrdersQueryKey,
    queryFn: getAdminOrdersApi,
  });
};
