import { useState } from "react";
import { useAppDispatch } from "@app/providers/store/hooks";
import { loginApi } from "../api/loginApi";
import type { LoginBody } from "@shared/contracts/auth";
import { setCredentials } from "@/entities/session/model/sessionSlice.ts";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogin = async (data: LoginBody) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginApi(data);
      dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || "Ошибка при входе");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading, error };
};
