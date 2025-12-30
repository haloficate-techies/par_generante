import { useState, useEffect } from "react";
import AppEnvironment from "../app/app-environment";
import {
  deriveBrandPalette,
  DEFAULT_BRAND_PALETTE,
  resolveStreamingThemeFromPalette,
} from "../app/index.js";

/**
 * Derives a streaming theme (light/dark/gold) based on brand logo or togel mode.
 *
 * @param {Object} config
 * @param {boolean} config.isTogelMode
 * @param {string} config.brandLogoSrc
 * @param {Function} config.loadCachedOptionalImage
 * @returns {string} The computed theme name
 */
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
