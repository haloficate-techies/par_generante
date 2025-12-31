import { BANNER_FOOTER_OPTIONS, BRAND_LOGO_OPTIONS } from "../../../../domains/brand";
import {
  DEFAULT_IMAGE_EXTENSION_PRIORITY,
  DEFAULT_RAFFLE_FOOTER,
  FOOTER_DIRECTORY_BY_MODE,
  FOOTER_DIRECTORY_DEFAULT,
} from "./asset.constants";

const AVAILABLE_BRAND_LOGOS = Array.isArray(BRAND_LOGO_OPTIONS) ? BRAND_LOGO_OPTIONS : [];
const AVAILABLE_FOOTER_LOGOS = Array.isArray(BANNER_FOOTER_OPTIONS) ? BANNER_FOOTER_OPTIONS : [];

/**
 * Lookup table mapping header logo values to footer logo assets.
 * @type {Record<string, string>}
 */
const HEADER_TO_FOOTER_LOOKUP = AVAILABLE_BRAND_LOGOS.reduce((acc, option) => {
  if (!option || !option.value) {
    return acc;
  }

  let footerCandidate = option.footerValue;

  if (!footerCandidate) {
    const matchingFooter = AVAILABLE_FOOTER_LOGOS.find(
      (footerOption) =>
        footerOption &&
        footerOption.value &&
        (footerOption.brand === option.brand || footerOption.label === option.label)
    );
    if (matchingFooter) {
      footerCandidate = matchingFooter.value;
    } else if (typeof option.brand === "string") {
      footerCandidate = `assets/BOLA/banner_footer/${option.brand}.webp`;
    }
  }

  if (footerCandidate) {
    acc[option.value] = footerCandidate;
  }

  return acc;
}, {});

/**
 * Resolve a footer asset path for a given mode + brand combination.
 * @param {string} brandName - Canonical brand identifier, e.g. "DEWABET".
 * @param {string} mode - Registered mode identifier (football, basketball, raffle, etc.).
 * @returns {string} Footer asset path or empty string if no match.
 */
const resolveModeFooterPath = (brandName, mode) => {
  const directory = FOOTER_DIRECTORY_BY_MODE[mode];
  if (!directory) {
    return mode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "";
  }
  if (!brandName) {
    return mode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "";
  }
  return `${directory}/${brandName}.webp`;
};

/**
 * Resolve footer source with multi-step fallback logic.
 * Priority: mode-specific asset → header lookup → default footer directory.
 * @param {string} brandName - Brand identifier for directory-based lookup.
 * @param {string} headerValue - Selected header logo path (used for lookup table).
 * @param {string} mode - Mode identifier (football, raffle, etc.).
 * @returns {string} Footer asset path or empty string.
 */
export const resolveFooterSrcForBrand = (brandName, headerValue, mode) => {
  const modeSpecificFooter = resolveModeFooterPath(brandName, mode);
  if (modeSpecificFooter) {
    return modeSpecificFooter;
  }
  if (HEADER_TO_FOOTER_LOOKUP[headerValue]) {
    return HEADER_TO_FOOTER_LOOKUP[headerValue];
  }
  if (brandName) {
    return `${FOOTER_DIRECTORY_DEFAULT}/${brandName}.webp`;
  }
  return "";
};

/**
 * Split an asset path into base path and extension (if any).
 * @param {string} path - Raw asset path that may contain query strings.
 * @returns {{basePath: string, extension: string}} Parsed asset parts.
 */
const splitAssetExtension = (path) => {
  if (!path || typeof path !== "string") {
    return { basePath: "", extension: "" };
  }
  const queryIndex = path.indexOf("?");
  const cleanPath = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  const lastSlashIndex = cleanPath.lastIndexOf("/");
  const lastDotIndex = cleanPath.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex < lastSlashIndex) {
    return { basePath: cleanPath, extension: "" };
  }
  return {
    basePath: cleanPath.slice(0, lastDotIndex),
    extension: cleanPath.slice(lastDotIndex + 1).toLowerCase(),
  };
};

/**
 * Resolve the best available asset source across multiple extensions.
 * Automatically caches the asynchronous resolution per unique combination.
 *
 * @param {string} rawPath - Base path or asset path (with or without extension).
 * @param {string[]} [extensionPriority=DEFAULT_IMAGE_EXTENSION_PRIORITY] - Preferred extension order.
 * @returns {Promise<string>} Promise resolving to the first successfully loaded asset path.
 *
 * @example
 * const logo = await resolveImageAssetSrc(\"assets/BOLA/logo_liga/EPL\");
 *
 * @example
 * const pngFirst = await resolveImageAssetSrc(\"assets/teams/logo\", [\"png\", \"webp\"]);
 */
export const resolveImageAssetSrc = (() => {
  const cache = new Map();

  const attemptLoad = (candidate) =>
    new Promise((resolve, reject) => {
      if (typeof Image === "undefined") {
        resolve(candidate);
        return;
      }
      const probe = new Image();
      probe.onload = () => resolve(candidate);
      probe.onerror = () => reject(new Error(`Failed to load asset: ${candidate}`));
      probe.src = candidate;
    });

  return (rawPath, extensionPriority = DEFAULT_IMAGE_EXTENSION_PRIORITY) => {
    if (!rawPath) {
      return Promise.resolve("");
    }
    const cacheKey = `${rawPath}|${extensionPriority.join(",")}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const { basePath, extension } = splitAssetExtension(rawPath);
    const hasExtension = Boolean(extension);
    const preferredOrder =
      Array.isArray(extensionPriority) && extensionPriority.length > 0
        ? extensionPriority
        : DEFAULT_IMAGE_EXTENSION_PRIORITY;
    const candidates = hasExtension
      ? [
          rawPath,
          ...preferredOrder.filter((ext) => ext !== extension).map((ext) => `${basePath}.${ext}`),
        ]
      : preferredOrder.map((ext) => `${rawPath}.${ext}`);
    const uniqueCandidates = candidates.filter(
      (candidate, index, arr) => candidate && arr.indexOf(candidate) === index
    );

    const promise = new Promise((resolve) => {
      if (typeof Image === "undefined") {
        resolve(uniqueCandidates[0]);
        return;
      }
      const attempt = (index) => {
        if (index >= uniqueCandidates.length) {
          resolve(uniqueCandidates[0]);
          return;
        }
        attemptLoad(uniqueCandidates[index])
          .then((src) => resolve(src))
          .catch(() => attempt(index + 1));
      };
      attempt(0);
    });

    cache.set(cacheKey, promise);
    return promise;
  };
})();

