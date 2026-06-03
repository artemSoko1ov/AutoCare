import { useEffect, useState } from "react";
import { useAppDispatch } from "@app/providers/store/hooks";
import axiosInstance from "@/shared/api/axiosInstance.ts";
import { logout, setCredentials } from "@/entities/session/model/sessionSlice.ts";

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await axiosInstance.post("/auth/refresh");
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  return null;
};
