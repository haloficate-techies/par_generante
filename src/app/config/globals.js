import AppEnvironment from "../app-environment";

const AppData = AppEnvironment.getData() || {};

const AVAILABLE_BRAND_LOGOS = Array.isArray(AppData.BRAND_LOGO_OPTIONS)
  ? AppData.BRAND_LOGO_OPTIONS
  : [];
const AVAILABLE_FOOTER_LOGOS = Array.isArray(AppData.BANNER_FOOTER_OPTIONS)
  ? AppData.BANNER_FOOTER_OPTIONS
  : [];
const AVAILABLE_TOGEL_POOL_OPTIONS = Array.isArray(AppData.TOGEL_POOL_OPTIONS)
  ? AppData.TOGEL_POOL_OPTIONS
  : [];
const MODE_BACKGROUND_DEFAULTS = {
  basketball: "assets/BASKET/banner_background/BACKGROUND.webp",
  esports: "assets/ESPORT/banner_background/BACKGROUND.webp",
  togel: "assets/TOTO/banner_background/BACKGROUND.webp",
};
const DEFAULT_ESPORT_MINI_BANNER = AppData.ESPORT_MINI_BANNER_FOOTER || null;

const computeMiniBannerLayout = (
  canvas,
  image,
  { marginRatio = 0.08, offsetBottom = 28 } = {}
) => {
  if (!canvas || !image) return null;
  const canvasWidth = canvas.width;
  const marginX = Math.max(48, canvasWidth * marginRatio);
  const availableWidth = Math.max(canvasWidth - marginX * 2, canvasWidth * 0.5);
  const imageWidth = image.width || availableWidth;
  const imageHeight = image.height || 1;
  const aspectRatio = imageWidth / imageHeight;
  let width = Math.min(availableWidth, canvasWidth - marginX);
  let height = width / aspectRatio;
  const footerHeight = 110;
  let y = canvas.height - footerHeight - offsetBottom - height;
  if (y < 0) {
    height = Math.max(40, canvas.height - footerHeight - offsetBottom - 20);
    width = height * aspectRatio;
    y = Math.max(20, canvas.height - footerHeight - offsetBottom - height);
  }
  const x = (canvas.width - width) / 2;
  return {
    x,
    y,
    width,
    height,
    totalHeight: height + offsetBottom,
  };
};
const TOGEL_POOL_BACKGROUND_LOOKUP = {
  toto_macau: "assets/TOTO/banner_background/TOTO_MACAU.webp",
  king_kong_pools: "assets/TOTO/banner_background/KINGKONG_POOLS.webp",
  lato_lato_lotto: "assets/TOTO/banner_background/LATOLATO_LOTTO.webp",
  toto_singapore: "assets/TOTO/banner_background/TOTO_SINGAPORE.webp",
  sydney_lotto: "assets/TOTO/banner_background/SYDNEY_LOTTO.webp",
  hongkong_lotto: "assets/TOTO/banner_background/HONGKONG_LOTTO.webp",
  toto_saigon: "assets/TOTO/banner_background/TOTO_SAIGON.webp",
  toto_taipei: "assets/TOTO/banner_background/TOTO_TAIPEI.webp",
  toto_taiwan: "assets/TOTO/banner_background/TOTO_TAIWAN.webp",
  jakarta_pools: "assets/TOTO/banner_background/JAKARTA_POOLS.webp",
  jowo_pools: "assets/TOTO/banner_background/JOWO_POOLS.webp",
};
const TOGEL_VARIANT_DIGIT_LENGTH = {
  "3D": 3,
  "4D": 4,
  "5D": 5,
};

const TOGEL_STREAMING_LINK_LOOKUP = {
  lato_lato_lotto: {
    "3D": {
      url: "https://latolatolotto.com/",
      title: "Live Streaming Putaran Angka",
    },
    "4D": {
      url: "https://latolatolotto.com/",
      title: "Live Streaming Putaran Angka",
    },
    "5D": {
      url: "https://latolatolotto.com/",
      title: "Live Streaming Putaran Angka",
    },
  },
  toto_singapore: {
    "4D": {
      url: "https://www.singaporepools.com.sg/",
      title: "Live Streaming Putaran Angka",
    },
  },
  toto_macau: {
    "4D": {
      url: "https://kick.com/live-ttm4d",
      title: "Live Streaming Putaran Angka",
    },
    "5D": {
      url: "https://kick.com/studio-live-game",
      title: "Live Streaming Putaran Angka",
    },
  },
  king_kong_pools: {
    "4D": {
      url: "https://kick.com/king-kong-pools",
      title: "Live Streaming Putaran Angka",
    },
  },
  toto_saigon: {
    "4D": {
      url: "https://www.saigontoto.net/",
      title: "Live Streaming Putaran Angka",
    },
    "5D": {
      url: "https://www.saigontoto.net/",
      title: "Live Streaming Putaran Angka",
    },
  },
  toto_taipei: {
    "4D": {
      url: "http://www.taipei101pools.net/",
      title: "Live Streaming Putaran Angka",
    },
    "5D": {
      url: "http://www.taipei101pools.net/",
      title: "Live Streaming Putaran Angka",
    },
  },
  toto_taiwan: {
    "4D": {
      url: "http://www.taiwanlottery.com/",
      title: "Live Streaming Putaran Angka",
    },
  },
  hongkong_lotto: {
    "4D": {
      url: "https://kick.com/hongkong-lotto-official",
      title: "Live Streaming Putaran Angka",
    },
  },
  sydney_lotto: {
    "4D": {
      url: "https://kick.com/sydney-lotto-official",
      title: "Live Streaming Putaran Angka",
    },
  },
  jowo_pools: {
    "4D": {
      url: "https://kick.com/studio-live-game",
      title: "Live Streaming Putaran Angka",
    },
  },
  jakarta_pools: {
    "4D": {
      url: "https://kick.com/studio-live-game",
      title: "Live Streaming Putaran Angka",
    },
    "5D": {
      url: "https://kick.com/studio-live-game",
      title: "Live Streaming Putaran Angka",
    },
  },
};

const normalizeStreamingDisplayUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
};

const hexToRgbForTheme = (hex) => {
  if (typeof hex !== "string" || !hex) {
    return { r: 31, g: 41, b: 55 };
  }
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const intVal = Number.parseInt(normalized, 16);
  if (Number.isNaN(intVal)) {
    return { r: 31, g: 41, b: 55 };
  }
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
};

const resolveStreamingThemeFromPalette = (palette) => {
  const baseColor = palette?.headerStart || palette?.headerEnd || "#1f2937";
  const { r, g, b } = hexToRgbForTheme(baseColor);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / (2 * 255);
  if (lightness >= 0.88) return "light";
  if (lightness <= 0.2) return "dark";
  const delta = max - min || 1;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  if ((hue >= 0 && hue < 25) || hue >= 330) {
    return lightness > 0.6 ? "light" : "red";
  }
  if (hue >= 25 && hue < 65) {
    return "gold";
  }
  if (hue >= 65 && hue < 170) {
    return lightness > 0.5 ? "light" : "gold";
  }
  if (hue >= 170 && hue < 250) {
    return "blue";
  }
  if (hue >= 250 && hue < 320) {
    return "purple";
  }
  return lightness > 0.5 ? "light" : "dark";
};

const resolveTogelStreamingInfo = (pool, variant, poolLabel = "") => {
  if (!pool || !variant) {
    return null;
  }
  const entry =
    TOGEL_STREAMING_LINK_LOOKUP[pool]?.[variant] ||
    TOGEL_STREAMING_LINK_LOOKUP[pool]?.default;
  if (!entry || !entry.url) {
    return null;
  }
  const descriptor = entry.descriptor || [poolLabel, variant].filter(Boolean).join(" ").trim();
  return {
    title: entry.title || "Live Streaming",
    descriptor,
    url: entry.url,
    displayUrl: entry.displayUrl || normalizeStreamingDisplayUrl(entry.url),
  };
};
const MATCH_COUNT_OPTIONS = [1, 2, 3, 4, 5];
const MAX_MATCHES = MATCH_COUNT_OPTIONS[MATCH_COUNT_OPTIONS.length - 1];

const MODE_CONFIG = [
  {
    id: "football",
    label: "Sepak Bola",
    title: "Football Banner Generator",
    subtitle: "Buat banner jadwal sepakbola berukuran 1080 x 1080 dengan cepat.",
    pageBackgroundClass: "bg-slate-950",
  },
  {
    id: "basketball",
    label: "Bola Basket",
    title: "Basketball Banner Generator",
    subtitle: "Layout sama sementara, siap untuk penyesuaian konten basket.",
    pageBackgroundClass: "bg-gradient-to-br from-orange-950 via-slate-950 to-slate-950",
  },
  {
    id: "esports",
    label: "E-Sports",
    title: "E-Sports Banner Generator",
    subtitle: "Gunakan template ini untuk jadwal turnamen gim favoritmu.",
    pageBackgroundClass: "bg-slate-950",
  },
  {
    id: "togel",
    label: "Togel",
    title: "Togel Banner Generator",
    subtitle: "Template siap pakai untuk informasi keluaran dan jadwal togel.",
    pageBackgroundClass: "bg-slate-950",
  },
];

const resolveTogelPoolLabel = (poolValue) => {
  if (!poolValue) {
    return "";
  }
  const option = AVAILABLE_TOGEL_POOL_OPTIONS.find((item) => item.value === poolValue);
  return option?.label ?? "";
};

const buildTogelTitle = (inputTitle, poolLabel, variant) => {
  const trimmedTitle = inputTitle?.trim();
  if (trimmedTitle) {
    return trimmedTitle;
  }
  if (poolLabel && variant) {
    return `${poolLabel.toUpperCase()} ${variant}`;
  }
  if (poolLabel) {
    return poolLabel.toUpperCase();
  }
  if (variant) {
    return `MODE ${variant}`;
  }
  return "TOGEL KELUARAN";
};

const createBrandSlug = (brandName, { uppercase = false } = {}) => {
  if (!brandName) return "";
  const token = brandName.toString().trim().replace(/[^a-z0-9]+/gi, "");
  return uppercase ? token.toUpperCase() : token.toLowerCase();
};

const loadMatchLogoImage = (src, isAuto) => {
  if (!src) return Promise.resolve(null);
  if (typeof AppData.loadTeamLogoImage === "function") {
    return AppData.loadTeamLogoImage(src, { applyAutoProcessing: Boolean(isAuto) });
  }
  const loadOptionalImage =
    typeof AppData.loadOptionalImage === "function" ? AppData.loadOptionalImage : () => Promise.resolve(null);
  return loadOptionalImage(src);
};

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

const FOOTER_DIRECTORY_DEFAULT = "assets/BOLA/banner_footer";
const FOOTER_DIRECTORY_BY_MODE = {
  basketball: "assets/BASKET/banner_footer",
  esports: "assets/ESPORT/banner_footer",
  togel: "assets/TOTO/banner_footer",
};

const resolveModeFooterPath = (brandName, mode) => {
  if (!brandName) return "";
  const directory = FOOTER_DIRECTORY_BY_MODE[mode];
  if (!directory) return "";
  return `${directory}/${brandName}.webp`;
};

const resolveFooterSrcForBrand = (brandName, headerValue, mode) => {
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

const DEFAULT_IMAGE_EXTENSION_PRIORITY = ["webp", "png", "jpg", "jpeg"];

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

const resolveImageAssetSrc = (() => {
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
    const preferredOrder = Array.isArray(extensionPriority) && extensionPriority.length > 0
      ? extensionPriority
      : DEFAULT_IMAGE_EXTENSION_PRIORITY;
    const candidates = hasExtension
      ? [
          rawPath,
          ...preferredOrder
            .filter((ext) => ext !== extension)
            .map((ext) => `${basePath}.${ext}`),
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

const TOGEL_BACKGROUND_EXTENSION_PRIORITY = ["webp", "png", "jpg", "jpeg"];

const APP_GLOBALS_BUNDLE = {
  MODE_BACKGROUND_DEFAULTS,
  DEFAULT_ESPORT_MINI_BANNER,
  computeMiniBannerLayout,
  TOGEL_POOL_BACKGROUND_LOOKUP,
  TOGEL_VARIANT_DIGIT_LENGTH,
  TOGEL_STREAMING_LINK_LOOKUP,
  normalizeStreamingDisplayUrl,
  hexToRgbForTheme,
  resolveStreamingThemeFromPalette,
  resolveTogelStreamingInfo,
  MATCH_COUNT_OPTIONS,
  MAX_MATCHES,
  MODE_CONFIG,
  resolveTogelPoolLabel,
  buildTogelTitle,
  createBrandSlug,
  loadMatchLogoImage,
  HEADER_TO_FOOTER_LOOKUP,
  FOOTER_DIRECTORY_DEFAULT,
  FOOTER_DIRECTORY_BY_MODE,
  resolveModeFooterPath,
  resolveFooterSrcForBrand,
  DEFAULT_IMAGE_EXTENSION_PRIORITY,
  splitAssetExtension,
  resolveImageAssetSrc,
  TOGEL_BACKGROUND_EXTENSION_PRIORITY,
};

AppEnvironment.setGlobals(APP_GLOBALS_BUNDLE);

export default APP_GLOBALS_BUNDLE;
