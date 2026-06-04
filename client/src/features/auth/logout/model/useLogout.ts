import { useState } from "react";
import { useAppDispatch } from "@app/providers/store/hooks";
import { logoutApi } from "../api/logoutApi";
import { logout } from "@/entities/session/model/sessionSlice.ts";
import type { AxiosError } from "axios";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutApi();
      dispatch(logout());
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
