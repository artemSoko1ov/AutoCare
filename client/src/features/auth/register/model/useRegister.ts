import { useState } from "react";
import { useAppDispatch } from "@app/providers/store/hooks";
import { registerApi } from "../api/registerApi.ts";
import type { RegisterBody } from "@shared/contracts/auth";
import { setCredentials } from "@/entities/session/model/sessionSlice.ts";

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRegister = async (data: RegisterBody) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerApi(data);
      dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || "Ошибка регистрации");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeRegister, loading, error };
};
