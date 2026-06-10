import { useSyncExternalStore } from "react";

let suspenseLoadCount = 0;

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

export const beginSuspenseTopLoader = () => {
  suspenseLoadCount += 1;
  notifyListeners();

  let isActive = true;

  return () => {
    if (!isActive) {
      return;
    }

    isActive = false;
    suspenseLoadCount = Math.max(0, suspenseLoadCount - 1);
    notifyListeners();
  };
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => suspenseLoadCount > 0;

export const useSuspenseTopLoader = () => {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
