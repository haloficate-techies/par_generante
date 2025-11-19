import { useCallback, useRef } from "react";

const globalImageCache = new Map();

const useImageCache = (loader = () => Promise.resolve(null)) => {
  const cacheRef = useRef(globalImageCache);

  const loadImage = useCallback(
    (src) => {
      if (!src) {
        return Promise.resolve(null);
      }
      const cache = cacheRef.current;
      if (cache.has(src)) {
        return cache.get(src);
      }
      const promise = Promise.resolve(loader(src))
        .then((image) => {
          cache.set(src, image);
          return image;
        })
        .catch((error) => {
          cache.delete(src);
          throw error;
        });
      cache.set(src, promise);
      return promise;
    },
    [loader]
  );

  const prefetchImages = useCallback(
    (sources = []) => {
      const validSources = sources.filter(Boolean);
      return Promise.all(validSources.map((src) => loadImage(src)));
    },
    [loadImage]
  );

  return {
    loadImage,
    prefetchImages,
  };
};

export default useImageCache;
