import type { AxiosError } from "axios";

export type ValidationIssue = {
  field: string;
  message: string;
};

export type ValidationErrorResponse = {
  message?: string;
  errors?: ValidationIssue[];
};

const DEFAULT_NETWORK_ERROR_MESSAGE =
  "Сервер недоступен. Проверьте, что backend запущен на http://localhost:7000.";

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
  networkErrorMessage = DEFAULT_NETWORK_ERROR_MESSAGE,
) => {
  const axiosError = error as AxiosError<ValidationErrorResponse>;

  if (axiosError.code === "ERR_NETWORK" || !axiosError.response) {
    return networkErrorMessage;
  }

  return axiosError.response.data?.message || fallbackMessage;
};

export const getValidationIssues = (error: unknown) => {
  const axiosError = error as AxiosError<ValidationErrorResponse>;
  return axiosError.response?.data?.errors ?? [];
};

export const mapValidationIssues = <Field extends string>(
  issues: ValidationIssue[],
  allowedFields: readonly Field[],
) => {
  const nextFieldErrors: Partial<Record<Field, string>> = {};
  const allowedFieldsSet = new Set<string>(allowedFields);

  for (const issue of issues) {
    if (allowedFieldsSet.has(issue.field)) {
      nextFieldErrors[issue.field as Field] = issue.message;
    }
  }

  return nextFieldErrors;
};
