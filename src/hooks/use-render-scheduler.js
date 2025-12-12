import { useCallback, useEffect, useRef } from "react";

const useRenderScheduler = (renderFn, delay = 80) => {
  const timeoutRef = useRef(null);
  const latestFnRef = useRef(renderFn);

  useEffect(() => {
    latestFnRef.current = renderFn;
  }, [renderFn]);

  const schedule = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      if (typeof latestFnRef.current === "function") {
        latestFnRef.current();
      }
    }, delay);
  }, [delay]);

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
