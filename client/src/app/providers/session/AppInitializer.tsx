import { type PropsWithChildren, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@app/providers/store/hooks";
import { sessionCleared, sessionEstablished } from "@/entities/session/model/session.actions.ts";
import { setStatus } from "@/entities/session/model/sessionSlice.ts";
import axiosInstance from "@/shared/api/axiosInstance.ts";

type AppInitializerProps = PropsWithChildren;

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useAppDispatch();
  const { isInitialized, status } = useAppSelector((state) => state.session);
  const initStartedRef = useRef(false);

  useEffect(() => {
    if (isInitialized || status === "loading" || initStartedRef.current) {
      return;
    }

    initStartedRef.current = true;
    dispatch(setStatus("loading"));

    const initSession = async () => {
      try {
        const res = await axiosInstance.post("/auth/refresh", undefined, {
          skipAuthRefresh: true,
        });

        dispatch(
          sessionEstablished({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
      } catch {
        dispatch(sessionCleared());
      }
    };

    void initSession();
  }, [dispatch, isInitialized, status]);

  return <>{children}</>;
};
