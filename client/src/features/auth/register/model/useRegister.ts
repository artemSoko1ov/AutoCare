import { useState } from "react";
import type { AxiosError } from "axios";
import type { RegisterBody } from "@shared/contracts/auth";
import { useAppDispatch } from "@app/providers/store/hooks";
import { sessionEstablished } from "@/entities/session/model/session.actions.ts";
import { registerApi } from "../api/registerApi.ts";

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRegister = async (data: RegisterBody) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerApi(data);
      dispatch(sessionEstablished({ user: response.user, accessToken: response.accessToken }));
      return response;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || "Ошибка регистрации");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeRegister, loading, error };
};
