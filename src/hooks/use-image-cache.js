import { useCallback, useRef } from "react";

const globalImageCache = new Map();
const MAX_CACHE_ENTRIES = 120;
const LOAD_TIMEOUT_MS = 8000;
const MAX_PARALLEL_LOADS = 4;

const globalQueueState = {
  active: 0,
  queue: [],
};

const scheduleQueue = () => {
  const state = globalQueueState;
  while (state.active < MAX_PARALLEL_LOADS && state.queue.length > 0) {
    const task = state.queue.shift();
    state.active += 1;
    task()
      .catch(() => {})
      .finally(() => {
        state.active -= 1;
        scheduleQueue();
      });
  }
};

const enqueue = (taskFn) =>
  new Promise((resolve, reject) => {
    const wrapped = () =>
      taskFn()
        .then(resolve)
        .catch(reject);
    globalQueueState.queue.push(wrapped);
    scheduleQueue();
  });

const evictIfNeeded = (cache) => {
  if (cache.size <= MAX_CACHE_ENTRIES) return;
  const oldestKey = cache.keys().next().value;
  if (oldestKey) {
    cache.delete(oldestKey);
  }
};

const withTimeout = (promise, src) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out loading image: ${src}`));
    }, LOAD_TIMEOUT_MS);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });

/**
 * Provides an image cache with a queue and eviction policy to keep parallel loads in check.
 *
 * @param {Function} loader - Async image loader (should return a Promise).
 * @returns {Object} Cache helpers
 * @returns {Function} return.loadImage - Loads or returns a cached image.
 * @returns {Function} return.prefetchImages - Prefetches several sources concurrently.
 */
const useImageCache = (loader = () => Promise.resolve(null)) => {
  const cacheRef = useRef(globalImageCache);

  const loadImage = useCallback(
    (src) => {
      if (!src) {
        return Promise.resolve(null);
      }
      const cache = cacheRef.current;
      if (cache.has(src)) {
        const cached = cache.get(src);
        cache.delete(src);
        cache.set(src, cached);
        return cached;
      }
      const promise = enqueue(() => withTimeout(Promise.resolve(loader(src)), src))
        .then((image) => {
          cache.set(src, image);
          evictIfNeeded(cache);
          return image;
        })
        .catch((error) => {
          cache.delete(src);
          throw error;
        });
      cache.set(src, promise);
      evictIfNeeded(cache);
      return promise;
    },
    [loader]
  );

  const prefetchImages = useCallback(
    (sources = []) => {
      const validSources = sources.filter(Boolean);
      return Promise.allSettled(validSources.map((src) => loadImage(src)));
    },
    [loadImage]
  );

  return {
    loadImage,
    prefetchImages,
  };
};

export default useImageCache;
