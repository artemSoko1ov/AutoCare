import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderBody, CreateOrderResponse } from "@shared/contracts/orders";
import { adminOrdersQueryKey, ordersQueryKey } from "@/entities/order";
import {
  getApiErrorMessage,
  getValidationIssues,
  mapValidationIssues,
} from "@/shared/lib/api/validation";
import { createOrderApi } from "../api/createOrderApi";

const createOrderFieldNames = ["serviceId", "carId", "notes", "scheduledFor"] as const;

export type CreateOrderFieldName = (typeof createOrderFieldNames)[number];
export type CreateOrderFieldErrors = Partial<Record<CreateOrderFieldName, string>>;

export const getCreateOrderErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, "Не удалось создать заявку");
};

export const getCreateOrderFieldErrors = (error: unknown) => {
  const validationErrors = getValidationIssues(error);

  return {
    validationErrors,
    fieldErrors: mapValidationIssues(
      validationErrors,
      createOrderFieldNames,
    ) as CreateOrderFieldErrors,
  };
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, unknown, CreateOrderBody>({
    mutationFn: createOrderApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
        queryClient.invalidateQueries({ queryKey: adminOrdersQueryKey }),
      ]);
    },
  });
};
