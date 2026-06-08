import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateServiceBody,
  CreateServiceResponse,
  GetServiceResponse,
  UpdateServiceBody,
  UpdateServiceResponse,
} from "@shared/contracts/services";
import { adminServicesQueryKey, servicesQueryKey } from "@/entities/service";
import {
  getApiErrorMessage,
  getValidationIssues,
  mapValidationIssues,
} from "@/shared/lib/api/validation";
import { createServiceApi } from "../api/createServiceApi";
import { deleteServiceApi } from "../api/deleteServiceApi";
import { updateServiceApi } from "../api/updateServiceApi";

type ServiceFieldName = keyof CreateServiceBody;

export type ServiceFieldErrors = Partial<Record<ServiceFieldName, string>>;

const serviceFieldNames = [
  "title",
  "category",
  "summary",
  "priceFrom",
  "durationLabel",
  "status",
] as const satisfies readonly ServiceFieldName[];

const invalidateServiceQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminServicesQueryKey }),
    queryClient.invalidateQueries({ queryKey: servicesQueryKey }),
  ]);
};

export const getServiceErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, "Не удалось выполнить действие с услугой");
};

export const getServiceFieldErrors = (error: unknown) => {
  const validationErrors = getValidationIssues(error);

  return {
    validationErrors,
    fieldErrors: mapValidationIssues(validationErrors, serviceFieldNames) as ServiceFieldErrors,
  };
};

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateServiceResponse, unknown, CreateServiceBody>({
    mutationFn: createServiceApi,
    onSuccess: async () => {
      await invalidateServiceQueries(queryClient);
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateServiceResponse,
    unknown,
    { serviceId: string; data: UpdateServiceBody }
  >({
    mutationFn: ({ serviceId, data }) => updateServiceApi(serviceId, data),
    onSuccess: async () => {
      await invalidateServiceQueries(queryClient);
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<GetServiceResponse, unknown, string>({
    mutationFn: deleteServiceApi,
    onSuccess: async () => {
      await invalidateServiceQueries(queryClient);
    },
  });
};
