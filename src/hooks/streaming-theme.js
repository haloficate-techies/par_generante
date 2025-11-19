import { useState, useEffect } from "react";
import AppEnvironment from "../app/app-environment";

const AppData = AppEnvironment.getData();
const AppGlobals = AppEnvironment.getGlobals();
const deriveBrandPalette =
  AppData.deriveBrandPalette || AppData.DERIVE_BRAND_PALETTE || (() => AppData.DEFAULT_BRAND_PALETTE);
const resolveStreamingThemeFromPalette =
  AppGlobals.resolveStreamingThemeFromPalette || (() => "dark");

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
          const palette = deriveBrandPalette(image) || AppData.DEFAULT_BRAND_PALETTE;
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
