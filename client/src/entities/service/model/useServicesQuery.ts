import { useQuery } from "@tanstack/react-query";
import { getAdminServicesApi } from "../api/getAdminServicesApi";
import { getServiceApi } from "../api/getServiceApi";
import { getServicesApi } from "../api/getServicesApi";

export const servicesQueryKey = ["services"] as const;
export const serviceQueryKey = (serviceId: string) => [...servicesQueryKey, serviceId] as const;
export const adminServicesQueryKey = ["admin", "services"] as const;

export const useServicesQuery = () => {
  return useQuery({
    queryKey: servicesQueryKey,
    queryFn: getServicesApi,
  });
};

export const useServiceQuery = (serviceId?: string) => {
  return useQuery({
    queryKey: serviceId ? serviceQueryKey(serviceId) : [...servicesQueryKey, "unknown"],
    queryFn: () => getServiceApi(serviceId ?? ""),
    enabled: Boolean(serviceId),
  });
};

export const useAdminServicesQuery = () => {
  return useQuery({
    queryKey: adminServicesQueryKey,
    queryFn: getAdminServicesApi,
  });
};
