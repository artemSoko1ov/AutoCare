import { useState } from "react";
import type { LoginBody } from "@shared/contracts/auth";
import { useAppDispatch } from "@app/providers/store/hooks";
import { sessionEstablished } from "@/entities/session/model/session.actions.ts";
import { getApiErrorMessage } from "@/shared/lib/api/validation";
import { loginApi } from "../api/loginApi";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogin = async (data: LoginBody) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginApi(data);
      dispatch(sessionEstablished({ user: response.user, accessToken: response.accessToken }));
      return response;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Ошибка при входе"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading, error };
};
