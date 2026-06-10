import { useState } from "react";
import { useAppDispatch } from "@app/providers/store/hooks";
import { sessionCleared } from "@/entities/session/model/session.actions.ts";
import { getApiErrorMessage } from "@/shared/lib/api/validation";
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
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Ошибка выхода"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogout, loading, error };
};
