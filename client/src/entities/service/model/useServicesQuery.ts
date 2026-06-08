import { useQuery } from "@tanstack/react-query";
import { getAdminServicesApi } from "../api/getAdminServicesApi";
import { getServicesApi } from "../api/getServicesApi";

export const servicesQueryKey = ["services"] as const;
export const adminServicesQueryKey = ["admin", "services"] as const;

export const useServicesQuery = () => {
  return useQuery({
    queryKey: servicesQueryKey,
    queryFn: getServicesApi,
  });
};

export const useAdminServicesQuery = () => {
  return useQuery({
    queryKey: adminServicesQueryKey,
    queryFn: getAdminServicesApi,
  });
};
