import AppEnvironment from "../../../app-environment";
import {
  DEFAULT_IMAGE_EXTENSION_PRIORITY,
  DEFAULT_RAFFLE_FOOTER,
  FOOTER_DIRECTORY_BY_MODE,
  FOOTER_DIRECTORY_DEFAULT,
} from "./asset.constants";

const AppData = (typeof AppEnvironment.getData === "function" && AppEnvironment.getData()) || {};
const AVAILABLE_BRAND_LOGOS = Array.isArray(AppData.BRAND_LOGO_OPTIONS) ? AppData.BRAND_LOGO_OPTIONS : [];
const AVAILABLE_FOOTER_LOGOS = Array.isArray(AppData.BANNER_FOOTER_OPTIONS)
  ? AppData.BANNER_FOOTER_OPTIONS
  : [];

export const HEADER_TO_FOOTER_LOOKUP = AVAILABLE_BRAND_LOGOS.reduce((acc, option) => {
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

export const resolveModeFooterPath = (brandName, mode) => {
  const directory = FOOTER_DIRECTORY_BY_MODE[mode];
  if (!directory) {
    return mode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "";
  }
  if (!brandName) {
    return mode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "";
  }
  return `${directory}/${brandName}.webp`;
};

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

export const splitAssetExtension = (path) => {
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

