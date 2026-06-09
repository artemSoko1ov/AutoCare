import { useEffect, useMemo, useRef, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";
import styles from "./TopLoader.module.scss";

const START_PROGRESS = 0.12;
const FINISH_DELAY_MS = 320;
const ROUTE_PULSE_MS = 260;
const STEP_INTERVAL_MS = 180;
const WARMUP_DELAY_MS = 90;

const TopLoader = () => {
  const location = useLocation();
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const sessionStatus = useAppSelector((state) => state.session.status);

  const [progress, setProgress] = useState(0);
  const [routePulseActive, setRoutePulseActive] = useState(false);

  const isFirstRenderRef = useRef(true);
  const progressRef = useRef(0);
  const routePulseTimerRef = useRef<number | null>(null);
  const routePulseFrameRef = useRef<number | null>(null);
  const warmupTimerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const routeKey = useMemo(() => {
    return `${location.pathname}${location.search}${location.hash}`;
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (routePulseFrameRef.current !== null) {
      window.cancelAnimationFrame(routePulseFrameRef.current);
    }

    if (routePulseTimerRef.current !== null) {
      window.clearTimeout(routePulseTimerRef.current);
    }

    routePulseFrameRef.current = window.requestAnimationFrame(() => {
      setRoutePulseActive(true);
      routePulseFrameRef.current = null;
    });

    routePulseTimerRef.current = window.setTimeout(() => {
      setRoutePulseActive(false);
      routePulseTimerRef.current = null;
    }, ROUTE_PULSE_MS);
  }, [routeKey]);

  useEffect(() => {
    return () => {
      if (routePulseTimerRef.current !== null) {
        window.clearTimeout(routePulseTimerRef.current);
      }

      if (routePulseFrameRef.current !== null) {
        window.cancelAnimationFrame(routePulseFrameRef.current);
      }

      if (warmupTimerRef.current !== null) {
        window.clearTimeout(warmupTimerRef.current);
      }

      if (stepTimerRef.current !== null) {
        window.clearInterval(stepTimerRef.current);
      }

      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const isBusy =
    routePulseActive || fetchingCount > 0 || mutatingCount > 0 || sessionStatus === "loading";
  const isVisible = isBusy || progress > 0;

  useEffect(() => {
    if (warmupTimerRef.current !== null) {
      window.clearTimeout(warmupTimerRef.current);
      warmupTimerRef.current = null;
    }

    if (stepTimerRef.current !== null) {
      window.clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }

    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (isBusy) {
      frameRef.current = window.requestAnimationFrame(() => {
        setProgress((currentProgress) => {
          if (currentProgress === 0) {
            return START_PROGRESS;
          }

          return Math.max(currentProgress, START_PROGRESS);
        });
        frameRef.current = null;
      });

      warmupTimerRef.current = window.setTimeout(() => {
        setProgress((currentProgress) => Math.max(currentProgress, 0.28));
        warmupTimerRef.current = null;
      }, WARMUP_DELAY_MS);

      stepTimerRef.current = window.setInterval(() => {
        setProgress((currentProgress) => {
          if (currentProgress >= 0.9) {
            return currentProgress;
          }

          if (currentProgress < 0.45) {
            return Math.min(currentProgress + 0.11, 0.9);
          }

          if (currentProgress < 0.7) {
            return Math.min(currentProgress + 0.05, 0.9);
          }

          return Math.min(currentProgress + 0.02, 0.9);
        });
      }, STEP_INTERVAL_MS);

      return;
    }

    if (progressRef.current === 0) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      setProgress(1);
      frameRef.current = null;
    });

    finishTimerRef.current = window.setTimeout(() => {
      setProgress(0);
      finishTimerRef.current = null;
    }, FINISH_DELAY_MS);
  }, [isBusy]);

  return (
    <div
      aria-hidden="true"
      className={clsx(styles.loader, {
        [styles["loader--visible"]]: isVisible,
      })}
    >
      <span
        className={styles.bar}
        style={{
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
};

export default TopLoader;
