import { useState } from "react";
import type { AxiosError } from "axios";
import { useAppDispatch } from "@app/providers/store/hooks";
import { sessionCleared } from "@/entities/session/model/session.actions.ts";
import { logoutApi } from "../api/logoutApi";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logoutApi();
      dispatch(sessionCleared());
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || "Ошибка выхода");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogout, loading, error };
};
