import { useQuery } from "@tanstack/react-query";
import { getCarsApi } from "../api/getCarsApi";

export const carsQueryKey = ["cars"] as const;

export const useCarsQuery = () => {
  return useQuery({
    queryKey: carsQueryKey,
    queryFn: getCarsApi,
  });
};
