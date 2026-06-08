import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CreateCarBody,
  CreateCarResponse,
  DeleteCarResponse,
  UpdateCarBody,
  UpdateCarResponse,
} from "@shared/contracts/cars";
import { carsQueryKey } from "@/entities/car";
import { createCarApi } from "../api/createCarApi";
import { deleteCarApi } from "../api/deleteCarApi";
import { updateCarApi } from "../api/updateCarApi";

export type ValidationIssue = {
  field: string;
  message: string;
};

export type ValidationErrorResponse = {
  message?: string;
  errors?: ValidationIssue[];
};

export type CarFieldErrors = Partial<Record<keyof CreateCarBody, string>>;

const normalizeFieldErrors = (issues: ValidationIssue[]): CarFieldErrors => {
  return issues.reduce<CarFieldErrors>((accumulator, issue) => {
    if (
      issue.field === "brand" ||
      issue.field === "model" ||
      issue.field === "year" ||
      issue.field === "licensePlate" ||
      issue.field === "vin" ||
      issue.field === "mileage" ||
      issue.field === "photoUrl"
    ) {
      accumulator[issue.field] = issue.message;
    }

    return accumulator;
  }, {});
};

export const getCarErrorMessage = (error: unknown, fallbackMessage: string) => {
  const axiosError = error as AxiosError<ValidationErrorResponse>;
  return axiosError.response?.data?.message || fallbackMessage;
};

export const getCarFieldErrors = (error: unknown) => {
  const axiosError = error as AxiosError<ValidationErrorResponse>;
  const validationErrors = axiosError.response?.data?.errors ?? [];

  return {
    validationErrors,
    fieldErrors: normalizeFieldErrors(validationErrors),
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
