import { useState, useEffect } from "react";
import AppEnvironment from "../app/app-environment";
import { deriveBrandPalette, DEFAULT_BRAND_PALETTE } from "../utils/color-utils";
import { resolveStreamingThemeFromPalette } from "../app/config/modules/theme/theme.utils";

const useStreamingTheme = ({ isTogelMode, brandLogoSrc, loadCachedOptionalImage }) => {
  const [streamingTheme, setStreamingTheme] = useState("dark");

  useEffect(() => {
    let isCancelled = false;
    const fallbackTheme = isTogelMode ? "gold" : "dark";
    if (!brandLogoSrc || typeof loadCachedOptionalImage !== "function") {
      setStreamingTheme(fallbackTheme);
      return;
    }
    Promise.resolve(loadCachedOptionalImage(brandLogoSrc))
      .then((image) => {
        if (isCancelled || !image) {
          if (!isCancelled) setStreamingTheme(fallbackTheme);
          return;
        }
        try {
          const palette = deriveBrandPalette(image) || DEFAULT_BRAND_PALETTE;
          const theme = resolveStreamingThemeFromPalette(palette);
          if (!isCancelled) {
            setStreamingTheme(theme);
          }
        } catch (error) {
          if (!isCancelled) {
            setStreamingTheme(fallbackTheme);
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setStreamingTheme(fallbackTheme);
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [isTogelMode, brandLogoSrc, loadCachedOptionalImage]);

  return streamingTheme;
};

AppEnvironment.registerHook("useStreamingTheme", useStreamingTheme);

export default useStreamingTheme;
