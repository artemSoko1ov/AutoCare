import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/providers/store/hooks";
import { sessionCleared, sessionEstablished } from "@/entities/session/model/session.actions.ts";
import { setStatus } from "@/entities/session/model/sessionSlice.ts";
import axiosInstance from "@/shared/api/axiosInstance.ts";
import AppBootScreen from "@/widgets/app-boot-screen";

type AppInitializerProps = PropsWithChildren;

const BOOT_SCREEN_DELAY_MS = 180;
const BOOT_SCREEN_MIN_VISIBLE_MS = 280;

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useAppDispatch();
  const { isInitialized, status } = useAppSelector((state) => state.session);
  const [isBootVisible, setIsBootVisible] = useState(false);
  const bootVisibleAtRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const clearShowTimer = () => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  };

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (isInitialized || status !== "idle") {
      return;
    }

    const initSession = async () => {
      dispatch(setStatus("loading"));

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

  useEffect(() => {
    clearHideTimer();

    if (!isInitialized && status === "loading") {
      if (isBootVisible || showTimerRef.current !== null) {
        return;
      }

      showTimerRef.current = window.setTimeout(() => {
        bootVisibleAtRef.current = Date.now();
        setIsBootVisible(true);
        showTimerRef.current = null;
      }, BOOT_SCREEN_DELAY_MS);

      return;
    }

    clearShowTimer();

    if (!isBootVisible) {
      return;
    }

    const visibleAt = bootVisibleAtRef.current ?? Date.now();
    const visibleFor = Date.now() - visibleAt;
    const remainingVisibleTime = Math.max(0, BOOT_SCREEN_MIN_VISIBLE_MS - visibleFor);

    hideTimerRef.current = window.setTimeout(() => {
      setIsBootVisible(false);
      bootVisibleAtRef.current = null;
      hideTimerRef.current = null;
    }, remainingVisibleTime);
  }, [isBootVisible, isInitialized, status]);

  useEffect(() => {
    return () => {
      clearShowTimer();
      clearHideTimer();
    };
  }, []);

  if (!isInitialized) {
    return isBootVisible ? <AppBootScreen /> : null;
  }

  if (isBootVisible) {
    return <AppBootScreen />;
  }

  return <>{children}</>;
};
