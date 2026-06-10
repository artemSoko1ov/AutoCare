import { useState } from "react";
import type { UpdateProfileBody, UserDto } from "@shared/contracts/auth";
import { useAppDispatch } from "@app/providers/store/hooks";
import { currentUserUpdated } from "@/entities/user/model/user.actions.ts";
import {
  getApiErrorMessage,
  getValidationIssues,
  mapValidationIssues,
} from "@/shared/lib/api/validation";
import { updateProfileApi } from "../api/updateProfileApi";

type ProfileFieldErrors = Partial<Record<keyof UpdateProfileBody, string>>;
const profileFieldNames = [
  "username",
  "phone",
  "avatarUrl",
] as const satisfies readonly (keyof UpdateProfileBody)[];

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
      const validationErrors = getValidationIssues(err);

      if (validationErrors.length > 0) {
        const nextFieldErrors = mapValidationIssues(
          validationErrors,
          profileFieldNames,
        ) as ProfileFieldErrors;

        setFieldErrors(nextFieldErrors);
        setError("Проверьте введенные данные");
      } else {
        setError(getApiErrorMessage(err, "Не удалось обновить профиль"));
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
