import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/providers/store/hooks";
import axiosInstance from "@/shared/api/axiosInstance.ts";
import { logout, setCredentials, setStatus } from "@/entities/session/model/sessionSlice.ts";

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const { isInitialized, status } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (isInitialized || status === "loading") {
      return;
    }

    const initSession = async () => {
      dispatch(setStatus("loading"));

      try {
        const res = await axiosInstance.post("/auth/refresh", undefined, {
          skipAuthRefresh: true,
        });
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
      } catch {
        dispatch(logout());
      }
    };

    void initSession();
  }, [dispatch, isInitialized, status]);

  if (!isInitialized) return <div>Загрузка...</div>;
  return null;
};
