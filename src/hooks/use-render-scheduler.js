import { useCallback, useEffect, useRef } from "react";

/**
 * Debounces calls to the provided render function, respecting an optional render lock ref.
 *
 * @param {Function} renderFn
 * @param {Object} [options]
 * @param {number} [options.delay=80]
 * @param {import("react").MutableRefObject<boolean>} [options.renderLockRef]
 * @returns {Function} schedule function that queues the next render call
 */
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
