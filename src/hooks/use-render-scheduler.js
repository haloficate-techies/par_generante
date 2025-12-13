import { useCallback, useEffect, useRef } from "react";

const useRenderScheduler = (renderFn, options = {}) => {
  const { delay = 80, renderLockRef = null } = options;
  const timeoutRef = useRef(null);
  const latestFnRef = useRef(renderFn);

  useEffect(() => {
    latestFnRef.current = renderFn;
  }, [renderFn]);

  const schedule = useCallback(() => {
    if (renderLockRef?.current) {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      if (typeof latestFnRef.current === "function") {
        latestFnRef.current();
      }
    }, delay);
  }, [delay, renderLockRef]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return schedule;
};

export default useRenderScheduler;
