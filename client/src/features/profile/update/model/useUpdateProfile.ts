import { useState } from "react";
import type { AxiosError } from "axios";
import type { UpdateProfileBody, UserDto } from "@shared/contracts/auth";
import { useAppDispatch } from "@app/providers/store/hooks";
import { currentUserUpdated } from "@/entities/user/model/user.actions.ts";
import { updateProfileApi } from "../api/updateProfileApi";

type ValidationIssue = {
  field: string;
  message: string;
};

type ValidationErrorResponse = {
  message?: string;
  errors?: ValidationIssue[];
};

type ProfileFieldErrors = Partial<Record<keyof UpdateProfileBody, string>>;

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});

  const clearFieldError = (field: keyof UpdateProfileBody) => {
    setFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const executeUpdateProfile = async (data: UpdateProfileBody): Promise<UserDto> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      const response = await updateProfileApi(data);
      dispatch(currentUserUpdated(response));
      setSuccessMessage("Профиль обновлен");
      return response;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<ValidationErrorResponse>;
      const validationErrors = axiosErr.response?.data?.errors ?? [];

      if (validationErrors.length > 0) {
        const nextFieldErrors = validationErrors.reduce<ProfileFieldErrors>((acc, issue) => {
          if (
            issue.field === "username" ||
            issue.field === "phone" ||
            issue.field === "avatarUrl"
          ) {
            acc[issue.field] = issue.message;
          }

          return acc;
        }, {});

        setFieldErrors(nextFieldErrors);
        setError("Проверьте введенные данные");
      } else {
        setError(axiosErr.response?.data?.message || "Не удалось обновить профиль");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    executeUpdateProfile,
    loading,
    error,
    successMessage,
    fieldErrors,
    clearFieldError,
    clearMessages,
  };
};
