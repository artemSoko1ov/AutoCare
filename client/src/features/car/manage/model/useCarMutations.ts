import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateCarBody,
  CreateCarResponse,
  DeleteCarResponse,
  UpdateCarBody,
  UpdateCarResponse,
} from "@shared/contracts/cars";
import { carsQueryKey } from "@/entities/car";
import {
  getApiErrorMessage,
  getValidationIssues,
  mapValidationIssues,
} from "@/shared/lib/api/validation";
import { createCarApi } from "../api/createCarApi";
import { deleteCarApi } from "../api/deleteCarApi";
import { updateCarApi } from "../api/updateCarApi";

export type CarFieldErrors = Partial<Record<keyof CreateCarBody, string>>;
const carFieldNames = [
  "brand",
  "model",
  "year",
  "licensePlate",
  "vin",
  "mileage",
  "photoUrl",
] as const satisfies readonly (keyof CreateCarBody)[];

export const getCarErrorMessage = getApiErrorMessage;

export const getCarFieldErrors = (error: unknown) => {
  const validationErrors = getValidationIssues(error);

  return {
    validationErrors,
    fieldErrors: mapValidationIssues(validationErrors, carFieldNames) as CarFieldErrors,
  };
};

export const useCreateCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCarResponse, unknown, CreateCarBody>({
    mutationFn: createCarApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: carsQueryKey });
    },
  });
};

export const useUpdateCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCarResponse, unknown, { carId: string; data: UpdateCarBody }>({
    mutationFn: ({ carId, data }) => updateCarApi(carId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: carsQueryKey });
    },
  });
};

export const useDeleteCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCarResponse, unknown, string>({
    mutationFn: deleteCarApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: carsQueryKey });
    },
  });
};
