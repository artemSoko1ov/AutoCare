import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteOrderResponse,
  UpdateOrderBody,
  UpdateOrderResponse,
} from "@shared/contracts/orders";
import { adminOrdersQueryKey, ordersQueryKey } from "@/entities/order";
import {
  getApiErrorMessage,
  getValidationIssues,
  mapValidationIssues,
} from "@/shared/lib/api/validation";
import { deleteOrderApi } from "../api/deleteOrderApi";
import { updateOrderApi } from "../api/updateOrderApi";

const orderFieldNames = ["status", "notes", "scheduledFor", "quotedPrice"] as const;

export type OrderFieldName = (typeof orderFieldNames)[number];
export type OrderFieldErrors = Partial<Record<OrderFieldName, string>>;

export const getOrderErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, "Не удалось выполнить действие с заявкой");
};

export const getOrderFieldErrors = (error: unknown) => {
  const validationErrors = getValidationIssues(error);

  return {
    validationErrors,
    fieldErrors: mapValidationIssues(validationErrors, orderFieldNames) as OrderFieldErrors,
  };
};

const invalidateOrderQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminOrdersQueryKey }),
    queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  ]);
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateOrderResponse, unknown, { orderId: string; data: UpdateOrderBody }>({
    mutationFn: ({ orderId, data }) => updateOrderApi(orderId, data),
    onSuccess: async () => {
      await invalidateOrderQueries(queryClient);
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteOrderResponse, unknown, string>({
    mutationFn: deleteOrderApi,
    onSuccess: async () => {
      await invalidateOrderQueries(queryClient);
    },
  });
};
