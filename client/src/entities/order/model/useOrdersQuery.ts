import { getOrderApi } from "../api/getOrderApi";
import { useQuery } from "@tanstack/react-query";
import { getAdminOrdersApi } from "../api/getAdminOrdersApi";
import { getOrdersApi } from "../api/getOrdersApi";

export const ordersQueryKey = ["orders"] as const;
export const orderQueryKey = (orderId: string) => [...ordersQueryKey, orderId] as const;
export const adminOrdersQueryKey = ["admin", "orders"] as const;

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: getOrdersApi,
  });
};

export const useOrderQuery = (orderId?: string) => {
  return useQuery({
    queryKey: orderId ? orderQueryKey(orderId) : [...ordersQueryKey, "unknown"],
    queryFn: () => getOrderApi(orderId ?? ""),
    enabled: Boolean(orderId),
  });
};

export const useAdminOrdersQuery = () => {
  return useQuery({
    queryKey: adminOrdersQueryKey,
    queryFn: getAdminOrdersApi,
  });
};
