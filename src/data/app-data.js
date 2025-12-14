import AppEnvironment from "../app/app-environment";
import TEAM_AUTO_LOGO_SOURCES from "./team-logo-sources";

const DEFAULT_IMAGE_PROXY_BASE_URL = "https://proxy.superbia.app/image?url=";
const IMAGE_PROXY_BASE_URL = (
  import.meta.env.VITE_IMAGE_PROXY_BASE || DEFAULT_IMAGE_PROXY_BASE_URL
).trim();
const IMAGE_PROXY_ALLOW_HOSTS_RAW = (import.meta.env.VITE_IMAGE_PROXY_ALLOW_HOSTS || "").trim();
const IMAGE_PROXY_EXTRA_HOSTS = (
  IMAGE_PROXY_ALLOW_HOSTS_RAW
    ? IMAGE_PROXY_ALLOW_HOSTS_RAW.split(",")
    : ["*"]
)
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
const DEFAULT_IMAGE_PROXY_HOSTS = [
  "upload.wikimedia.org",
  "flagcdn.com",
  "a.espncdn.com",
  "blogger.googleusercontent.com",
  "1000logos.net",
  "img.uefa.com",
  "static.wikia.nocookie.net",
  "liquipedia.net",
  "premierleague.com",
  "www.premierleague.com",
  "resources.premierleague.com",
  "assets.laliga.com",
  "file.ilustrepro.com"
];
const IMAGE_PROXY_HOST_ALLOWLIST = Array.from(
  new Set([...DEFAULT_IMAGE_PROXY_HOSTS, ...IMAGE_PROXY_EXTRA_HOSTS].filter(Boolean))
);
const PROXY_URL_PLACEHOLDER = "{url}";

const getProxyHostFromUrl = (value) => {
  if (typeof value !== "string" || !value) {
    return "";
  }
  try {
    return new URL(value).hostname.toLowerCase();
  } catch (error) {
    return "";
  }
};

const matchesAllowlistedHost = (hostname, allowedHost) => {
  if (!hostname || !allowedHost) {
    return false;
  }
  if (allowedHost === "*") {
    return true;
  }
  if (hostname === allowedHost) {
    return true;
  }
  return hostname.endsWith(`.${allowedHost.replace(/^\*\./, "")}`);
};

const shouldProxyHost = (hostname) => {
  if (!hostname) {
    return false;
  }
  if (IMAGE_PROXY_HOST_ALLOWLIST.length === 0) {
    return true;
  }
  return IMAGE_PROXY_HOST_ALLOWLIST.some((allowedHost) =>
    matchesAllowlistedHost(hostname, allowedHost)
  );
};

const buildProxiedImageUrl = (src) => {
  if (
    !IMAGE_PROXY_BASE_URL ||
    typeof src !== "string" ||
    !/^https?:\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return null;
  }
  if (src.startsWith(IMAGE_PROXY_BASE_URL)) {
    return src;
  }
  const hostname = getProxyHostFromUrl(src);
  if (!hostname || !shouldProxyHost(hostname)) {
    return null;
  }
  const encoded = encodeURIComponent(src);
  if (IMAGE_PROXY_BASE_URL.includes(PROXY_URL_PLACEHOLDER)) {
    return IMAGE_PROXY_BASE_URL.replace(PROXY_URL_PLACEHOLDER, encoded);
  }
  return `${IMAGE_PROXY_BASE_URL}${encoded}`;
};

const buildImageSourceCandidates = (src) => {
  if (typeof src !== "string") {
    return src ? [src] : [];
  }
  const trimmed = src.trim();
  if (!trimmed) {
    return [];
  }
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return [trimmed];
  }
  const proxied = buildProxiedImageUrl(trimmed);
  if (proxied && proxied !== trimmed) {
    return [proxied, trimmed];
  }
  return [trimmed];
};

// -------- Shared helpers --------
export const DEFAULT_BRAND_PALETTE = {
  headerStart: "#6366f1",
  headerEnd: "#ec4899",
  footerStart: "#22c55e",
  footerEnd: "#0d9488",
  accent: "#38bdf8",
};

export const PLACEHOLDER_COLORS = {
  fill: "#1f2937",
  border: "rgba(148, 163, 184, 0.4)",
  text: "#e2e8f0",
};

export const TEAM_LOGO_PLACEHOLDER_COLORS = {
  fill: "#ffffff",
  border: "rgba(15, 23, 42, 0.18)",
  text: "#0f172a",
};

const INDONESIAN_DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const resolveTotoSingaporeDrawTimeConfig = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  const dayName = INDONESIAN_DAY_NAMES[dayIndex];
  if (dayIndex === 2 || dayIndex === 5) {
    return {
      options: [],
      helperText: `Pools sedang libur (${dayName})`,
      disabledReason: "Pools sedang libur untuk hari ini.",
    };
  }
  const time = dayIndex === 1 || dayIndex === 4 ? "17:35" : "17:40";
  return {
    options: [time],
    helperText: `Jadwal hari ini (${dayName})`,
  };
};

const TOGEL_DRAW_TIME_LOOKUP = {
  toto_macau: {
    "4D": ["13:00", "16:00", "19:00", "22:00", "23:00", "00:00"],
    "5D": ["15:15", "21:15"],
  },
  king_kong_pools: {
    "4D": ["17:00", "23:30"],
  },
  lato_lato_lotto: {
    "3D": [
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "00:00",
    ],
    "4D": ["14:00"],
    "5D": ["11:05"],
  },
  toto_singapore: {
    "4D": resolveTotoSingaporeDrawTimeConfig,
  },
  sydney_lotto: {
    "4D": ["13:50"],
  },
  toto_taiwan: {
    "4D": ["19:30"],
  },
  hongkong_lotto: {
    "4D": ["23:00"],
  },
  toto_saigon: {
    "4D": ["21:15"],
    "5D": ["14:45"],
  },
  toto_taipei: {
    "4D": ["18:30"],
    "5D": ["12:30"],
  },
  jakarta_pools: {
    "4D": ["14:00", "23:30"],
    "5D": ["20:00"],
  },
  jowo_pools: {
    "4D": ["09:00", "21:00"],
  },
};

const resolveTogelDrawTimeConfig = (pool, variant) => {
  if (!pool || !variant) {
    return { options: [] };
  }
  const entry = TOGEL_DRAW_TIME_LOOKUP[pool]?.[variant];
  if (!entry) {
    return { options: [] };
  }
  if (typeof entry === "function") {
    const result = entry();
    if (Array.isArray(result)) {
      return { options: result };
    }
    return {
      options: result?.options ?? [],
      helperText: result?.helperText ?? "",
      disabledReason: result?.disabledReason ?? "",
    };
  }
  if (Array.isArray(entry)) {
    return { options: entry };
  }
  if (entry && typeof entry === "object") {
    return {
      options: entry.options ?? [],
      helperText: entry.helperText ?? "",
      disabledReason: entry.disabledReason ?? "",
    };
  }
  return { options: [] };
};

const TOGEL_POOL_OPTIONS = [
  { label: "TOTO MACAU", value: "toto_macau", modes: ["4D", "5D"] },
  { label: "KING KONG POOLS", value: "king_kong_pools", modes: ["4D"] },
  { label: "LATO LATO LOTTO", value: "lato_lato_lotto", modes: ["3D", "4D", "5D"] },
  { label: "TOTO SINGAPORE", value: "toto_singapore", modes: ["4D"] },
  { label: "SYDNEY LOTTO", value: "sydney_lotto", modes: ["4D"] },
  { label: "HONGKONG LOTTO", value: "hongkong_lotto", modes: ["4D"] },
  { label: "TOTO SAIGON", value: "toto_saigon", modes: ["4D", "5D"] },
  { label: "TOTO TAIPEI", value: "toto_taipei", modes: ["4D", "5D"] },
  { label: "TOTO TAIWAN", value: "toto_taiwan", modes: ["4D"] },
  { label: "JAKARTA POOLS", value: "jakarta_pools", modes: ["4D", "5D"] },
  { label: "JOWO POOLS", value: "jowo_pools", modes: ["4D"] },
];

const normalizeTeamName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const TEAM_AUTO_LOGO_LOOKUP = TEAM_AUTO_LOGO_SOURCES.reduce((acc, entry) => {
  entry.names.forEach((name) => {
    const key = normalizeTeamName(name);
    if (key) {
      acc[key] = entry.source;
    }
  });
  return acc;
}, {});

const TEAM_LOGO_IMAGE_CACHE = new Map();

const getAutoTeamLogoSrc = (teamName) => {
  const normalized = normalizeTeamName(teamName);
  if (!normalized) return "";
  return TEAM_AUTO_LOGO_LOOKUP[normalized] || "";
};

export const resolveAutoTeamLogoSrc = (teamName) => getAutoTeamLogoSrc(teamName);

const BRAND_NAMES = [
  "303VIP",
  "7METER",
  "ADOBET88",
  "AIRASIABET",
  "BIGDEWA",
  "BOLA88",
  "DEWABET",
  "DEWACASH",
  "DEWAGG",
  "DEWAHUB",
  "DEWASCORE",
  "GOLBOS",
  "IDNGOAL",
  "JAVAPLAY88",
  "KLIKFIFA",
  "KOINVEGAS",
  "MESINGG",
  "NYALABET",
  "PLAYSLOTS88",
  "PROPLAY88",
  "SIGAPBET",
  "SKOR88",
  "TIGERASIA88",
  "VEGASSLOTS",
];

const ESPORT_GAME_OPTIONS = [
  { label: "Age of Empires", value: "assets/ESPORT/logo_game/AGE_OF_EMPIRES.webp" },
  { label: "AOV", value: "assets/ESPORT/logo_game/AOV.webp" },
  { label: "Apex Legends", value: "assets/ESPORT/logo_game/APEX_LEGENDS.webp" },
  { label: "Brawl Stars", value: "assets/ESPORT/logo_game/BRAWL_STARS.webp" },
  { label: "Call of Duty", value: "assets/ESPORT/logo_game/CALL_OF_DUTY.webp" },
  { label: "Call of Duty Mobile", value: "assets/ESPORT/logo_game/CALL_OF_DUTY_MOBILE.webp" },
  { label: "Counter Strike", value: "assets/ESPORT/logo_game/COUNTER_STRIKE.webp" },
  { label: "Crossfire", value: "assets/ESPORT/logo_game/CROSSFIRE.webp" },
  { label: "Dota 2", value: "assets/ESPORT/logo_game/DOTA_2.webp" },
  { label: "FIFA", value: "assets/ESPORT/logo_game/FIFA.webp" },
  { label: "King of Glory", value: "assets/ESPORT/logo_game/KING_OF_GLORY.webp" },
  { label: "League of Legends", value: "assets/ESPORT/logo_game/LOL.webp" },
  { label: "League of Legends: Wild Rift", value: "assets/ESPORT/logo_game/LOL_WILD_RIFT.webp" },
  { label: "Mobile Legends", value: "assets/ESPORT/logo_game/MOBILE_LEGENDS.webp" },
  { label: "NBA 2K", value: "assets/ESPORT/logo_game/NBA_2K.webp" },
  { label: "Overwatch", value: "assets/ESPORT/logo_game/OVERWATCH.webp" },
  { label: "PUBG", value: "assets/ESPORT/logo_game/PUBG.webp" },
  { label: "PUBG Mobile", value: "assets/ESPORT/logo_game/PUBG_MOBILE.webp" },
  { label: "Rainbow Six Siege", value: "assets/ESPORT/logo_game/RAINBOW_SIX_SIEGE.webp" },
  { label: "Rocket League", value: "assets/ESPORT/logo_game/ROCKET_LEAGUE.webp" },
  { label: "StarCraft 2", value: "assets/ESPORT/logo_game/STARCRAFT_2.webp" },
  { label: "StarCraft: Brood War", value: "assets/ESPORT/logo_game/STARCRAFT_BROOD_WAR.webp" },
  { label: "Valorant", value: "assets/ESPORT/logo_game/VALORANT.webp" },
  { label: "Warcraft 3", value: "assets/ESPORT/logo_game/WARCRAFT_3.webp" },
];

const ESPORT_MINI_BANNER_FOOTER = "assets/ESPORT/mini_banner_footer/MINI_BANNER_FOOTER.webp";

const BANNER_BACKGROUND_FILES = (() => {
  const baseList = ["assets/BOLA/banner_background/BACKGROUND.webp"];
  const brandBackgrounds = BRAND_NAMES.map(
    (brandName) => `assets/BOLA/banner_background/${brandName}.webp`
  );
  return [...baseList, ...brandBackgrounds];
})();

const BANNER_BACKGROUND_LOOKUP = BANNER_BACKGROUND_FILES.reduce((acc, path) => {
  const fileName = path.split("/").pop() || "";
  const baseName = fileName.includes(".")
    ? fileName.slice(0, fileName.lastIndexOf("."))
    : fileName;
  if (baseName) {
    acc[baseName.toUpperCase()] = path;
  }
  return acc;
}, {});

if (BANNER_BACKGROUND_LOOKUP.BACKGROUND && !BANNER_BACKGROUND_LOOKUP.DEFAULT) {
  BANNER_BACKGROUND_LOOKUP.DEFAULT = BANNER_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return BANNER_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  return (
    BANNER_BACKGROUND_LOOKUP[brandName.toUpperCase()] ||
    BANNER_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const BASKETBALL_BRAND_BACKGROUND_DIRECTORY = "assets/BASKET/banner_background";
const BASKETBALL_BRAND_BACKGROUND_LOOKUP = BRAND_NAMES.reduce(
  (acc, brandName) => {
    if (!acc.BACKGROUND) {
      acc.BACKGROUND = `${BASKETBALL_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp`;
    }
    const normalizedKey = brandName && typeof brandName === "string" ? brandName.toUpperCase() : "";
    if (normalizedKey) {
      acc[normalizedKey] = `${BASKETBALL_BRAND_BACKGROUND_DIRECTORY}/${brandName}.webp`;
    }
    return acc;
  },
  { BACKGROUND: `${BASKETBALL_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp` }
);

if (
  BASKETBALL_BRAND_BACKGROUND_LOOKUP.BACKGROUND &&
  !BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT
) {
  BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT =
    BASKETBALL_BRAND_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveBasketballBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  const key = brandName.toUpperCase();
  return (
    BASKETBALL_BRAND_BACKGROUND_LOOKUP[key] ||
    BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const ESPORT_BRAND_BACKGROUND_DIRECTORY = "assets/ESPORT/banner_background";
const ESPORT_BRAND_BACKGROUND_LOOKUP = BRAND_NAMES.reduce(
  (acc, brandName) => {
    if (!acc.BACKGROUND) {
      acc.BACKGROUND = `${ESPORT_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp`;
    }
    const normalizedKey = brandName && typeof brandName === "string" ? brandName.toUpperCase() : "";
    if (normalizedKey) {
      acc[normalizedKey] = `${ESPORT_BRAND_BACKGROUND_DIRECTORY}/${brandName}.webp`;
    }
    return acc;
  },
  { BACKGROUND: `${ESPORT_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp` }
);

if (ESPORT_BRAND_BACKGROUND_LOOKUP.BACKGROUND && !ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT) {
  ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT = ESPORT_BRAND_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveEsportBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  const key = brandName.toUpperCase();
  return (
    ESPORT_BRAND_BACKGROUND_LOOKUP[key] ||
    ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const BRAND_ASSET_ENTRIES = BRAND_NAMES.map((brandName) => {
  const footballBackgroundPath = resolveBrandBackgroundPath(brandName);
  const basketballBackgroundPath = resolveBasketballBrandBackgroundPath(brandName);
  const esportsBackgroundPath = resolveEsportBrandBackgroundPath(brandName);
  return {
    name: brandName,
    headerPath: `assets/BRAND/${brandName}.webp`,
    footerPath: `assets/BOLA/banner_footer/${brandName}.webp`,
    backgroundPath: footballBackgroundPath,
    backgroundByMode: {
      football: footballBackgroundPath,
      basketball: basketballBackgroundPath,
      esports: esportsBackgroundPath,
    },
  };
});

const BRAND_LOGO_OPTIONS = BRAND_ASSET_ENTRIES.map((entry) => ({
  label: entry.name,
  value: entry.headerPath,
  brand: entry.name,
  footerValue: entry.footerPath,
  backgroundValue: entry.backgroundPath,
  backgroundByMode: entry.backgroundByMode,
}));

const BANNER_FOOTER_OPTIONS = BRAND_ASSET_ENTRIES.map((entry) => ({
  label: entry.name,
  value: entry.footerPath,
  brand: entry.name,
  headerValue: entry.headerPath,
}));

export const createInitialMatches = (count) => {
  const today = new Date();
  const formatDateISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return Array.from({ length: count }).map(() => {
    const matchDate = new Date(today);
    const homeName = "";
    const awayName = "";
    const homeLogo = "";
    const awayLogo = "";
    return {
      teamHome: homeName,
      teamAway: awayName,
      date: formatDateISO(matchDate),
      time: "18:30",
      gameLogo: null,
      gameName: "",
      teamHomeLogo: homeLogo || null,
      teamHomeLogoIsAuto: false,
      teamHomeLogoScale: 1,
      teamHomeLogoOffsetX: 0,
      teamHomeLogoOffsetY: 0,
      teamAwayLogo: awayLogo || null,
      teamAwayLogoIsAuto: false,
      teamAwayLogoScale: 1,
      teamAwayLogoOffsetX: 0,
      teamAwayLogoOffsetY: 0,
      scoreHome: "0",
      scoreAway: "0",
      teamHomePlayerImage: null,
      teamAwayPlayerImage: null,
      teamHomePlayerScale: 1,
      teamHomePlayerOffsetX: 0,
      teamHomePlayerOffsetY: 0,
      teamAwayPlayerScale: 1,
      teamAwayPlayerOffsetX: 0,
      teamAwayPlayerOffsetY: 0,
    };
  });
};

export const readFileAsDataURL = (
  file,
  { maxDimension = 640, outputType = "image/png" } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const finalizeWithFileReader = () => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    };

    loadImage(objectUrl)
      .then((image) => {
        URL.revokeObjectURL(objectUrl);
        const maxSide = Math.max(image.width, image.height);
        if (!maxSide || maxSide <= maxDimension) {
          finalizeWithFileReader();
          return;
        }
        const scale = maxDimension / maxSide;
        const targetWidth = Math.max(1, Math.round(image.width * scale));
        const targetHeight = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL(outputType));
      })
      .catch((error) => {
        console.warn("Gagal mengoptimasi gambar upload, pakai ukuran asli.", error);
        URL.revokeObjectURL(objectUrl);
        finalizeWithFileReader();
      });
  });

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (event) => reject(event);
    img.src = src;
  });

const isSvgUrl = (value) => {
  if (typeof value !== "string" || !value) return false;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.pathname.toLowerCase().endsWith(".svg");
  } catch (error) {
    return /\.svg(\?|#|$)/i.test(value);
  }
};

const estimateSvgSize = (svgText) => {
  if (typeof svgText !== "string" || !svgText) {
    return { width: 512, height: 512 };
  }

  const numeric = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const widthMatch = svgText.match(/\bwidth\s*=\s*["']\s*([0-9.]+)\s*(px)?\s*["']/i);
  const heightMatch = svgText.match(/\bheight\s*=\s*["']\s*([0-9.]+)\s*(px)?\s*["']/i);
  const width = widthMatch ? numeric(widthMatch[1]) : null;
  const height = heightMatch ? numeric(heightMatch[1]) : null;
  if (width && height) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const viewBoxMatch = svgText.match(/\bviewBox\s*=\s*["']\s*([-0-9.\s]+)\s*["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1]
      .trim()
      .split(/\s+/)
      .map((part) => Number.parseFloat(part));
    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      const vbWidth = parts[2];
      const vbHeight = parts[3];
      if (vbWidth > 0 && vbHeight > 0) {
        return { width: Math.round(vbWidth), height: Math.round(vbHeight) };
      }
    }
  }

  return { width: 512, height: 512 };
};

const convertSvgUrlToPngDataUrl = async (src, { maxDimension = 512 } = {}) => {
  if (typeof src !== "string" || !src || !/^https?:\/\//i.test(src)) {
    return null;
  }

  const proxied = buildProxiedImageUrl(src);
  const fetchUrl = proxied || src;
  const response = await fetch(fetchUrl, {
    mode: "cors",
    headers: { Accept: "image/svg+xml,*/*" },
  });
  if (!response.ok) {
    throw new Error(`Gagal mengambil SVG (${response.status})`);
  }

  const svgText = await response.text();
  const { width: rawWidth, height: rawHeight } = estimateSvgSize(svgText);
  const maxSide = Math.max(rawWidth || 0, rawHeight || 0) || 512;
  const scale = maxSide > maxDimension ? maxDimension / maxSide : 1;
  const width = Math.max(1, Math.round(rawWidth * scale));
  const height = Math.max(1, Math.round(rawHeight * scale));

  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const candidates = buildImageSourceCandidates(src);
    if (!candidates.length) {
      reject(new Error("Sumber gambar tidak valid"));
      return;
    }

    let settled = false;
    const finalizeResolve = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const finalizeReject = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const attemptCandidate = async (index) => {
      if (index >= candidates.length) {
        finalizeReject(
          new Error(`Gagal memuat gambar setelah mencoba ${candidates.length} sumber.`)
        );
        return;
      }
      const candidateSrc = candidates[index];
      try {
        const image = await loadImageElement(candidateSrc);
        finalizeResolve(image);
      } catch (error) {
        if (typeof candidateSrc === "string" && isSvgUrl(candidateSrc)) {
          try {
            const pngDataUrl = await convertSvgUrlToPngDataUrl(candidateSrc);
            if (pngDataUrl) {
              const pngImage = await loadImageElement(pngDataUrl);
              finalizeResolve(pngImage);
              return;
            }
          } catch (convertError) {
            // ignore and continue with fallback candidate
          }
        }
        attemptCandidate(index + 1);
      }
    };

    attemptCandidate(0);
  });

export const loadOptionalImage = async (src) => {
  if (!src) return null;
  try {
    return await loadImage(src);
  } catch (error) {
    console.warn("Gagal memuat gambar opsional:", src, error);
    return null;
  }
};

const createWorkingCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  return { canvas, context };
};

const calculateCornerBackground = (imageData, width, height) => {
  const samplePoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
  ];

  const totals = { r: 0, g: 0, b: 0 };
  let count = 0;

  for (const [x, y] of samplePoints) {
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const index = (y * width + x) * 4;
    const alpha = imageData.data[index + 3];
    if (alpha < 255) continue;
    totals.r += imageData.data[index];
    totals.g += imageData.data[index + 1];
    totals.b += imageData.data[index + 2];
    count += 1;
  }

  if (count === 0) {
    return null;
  }

  return {
    r: totals.r / count,
    g: totals.g / count,
    b: totals.b / count,
  };
};

const calculateColorDistance = (colorA, colorB) => {
  const dr = colorA.r - colorB.r;
  const dg = colorA.g - colorB.g;
  const db = colorA.b - colorB.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const findOpaqueBounds = (imageData, width, height) => {
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = imageData.data[index + 3];
      if (alpha > 20) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) {
    return null;
  }

  return {
    x: Math.max(0, minX - 2),
    y: Math.max(0, minY - 2),
    width: Math.min(width, maxX + 2) - Math.max(0, minX - 2),
    height: Math.min(height, maxY + 2) - Math.max(0, minY - 2),
  };
};

const ensureTransparentBackground = async (image) => {
  try {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return image;

    const { canvas, context } = createWorkingCanvas(width, height);
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);

    let alreadyTransparent = false;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 255) {
        alreadyTransparent = true;
        break;
      }
    }
    if (alreadyTransparent) {
      return image;
    }

    const backgroundColor = calculateCornerBackground(imageData, width, height);
    if (!backgroundColor) {
      return image;
    }

    const brightness =
      (backgroundColor.r + backgroundColor.g + backgroundColor.b) / 3;
    if (brightness < 205) {
      return image;
    }

    const toleranceBase = 36;
    const tolerance =
      brightness > 245 ? toleranceBase * 0.75 : toleranceBase * 1.4;
    const whiteCutoff = Math.max(230, brightness - 6);
    const softRange = tolerance * 1.6;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const current = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };
      const distance = calculateColorDistance(current, backgroundColor);
      const luma = (current.r + current.g + current.b) / 3;
      if (distance <= tolerance || luma >= whiteCutoff) {
        imageData.data[i + 3] = 0;
      } else if (distance <= softRange) {
        const normalized = Math.min(
          1,
          Math.max(0, (distance - tolerance) / (softRange - tolerance))
        );
        imageData.data[i + 3] = Math.round(
          imageData.data[i + 3] * normalized * normalized
        );
      }
    }

    // Bersihkan noise alpha rendah agar tidak menyisakan halo abu-abu
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 24) {
        imageData.data[i] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    const bounds = findOpaqueBounds(imageData, width, height);
    if (!bounds) {
      return image;
    }

    const squareSize = Math.max(bounds.width, bounds.height);
    const squareCanvas = document.createElement("canvas");
    squareCanvas.width = squareSize;
    squareCanvas.height = squareSize;
    const squareContext = squareCanvas.getContext("2d");
    squareContext.clearRect(0, 0, squareSize, squareSize);
    squareContext.drawImage(
      canvas,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      (squareSize - bounds.width) / 2,
      (squareSize - bounds.height) / 2,
      bounds.width,
      bounds.height
    );

    const dataUrl = squareCanvas.toDataURL("image/png");
    const processedImage = await loadImage(dataUrl);
    return processedImage;
  } catch (error) {
    console.warn("Gagal membersihkan latar belakang logo otomatis:", error);
    return image;
  }
};

const loadTeamLogoImage = async (src, { applyAutoProcessing = false } = {}) => {
  if (!src) return null;
  const cacheKey = `${applyAutoProcessing ? "auto" : "raw"}|${src}`;
  const cached = TEAM_LOGO_IMAGE_CACHE.get(cacheKey);
  if (cached) {
    if (cached instanceof Promise) {
      return cached;
    }
    return cached;
  }

  const loader = (async () => {
    const image = await loadOptionalImage(src);
    if (!image) return null;
    if (applyAutoProcessing) {
      return ensureTransparentBackground(image);
    }
    return image;
  })()
    .then((result) => {
      TEAM_LOGO_IMAGE_CACHE.set(cacheKey, result);
      return result;
    })
    .catch((error) => {
      TEAM_LOGO_IMAGE_CACHE.delete(cacheKey);
      throw error;
    });

  TEAM_LOGO_IMAGE_CACHE.set(cacheKey, loader);
  return loader;
};

const MATCH_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatDate = (dateString) => {
  if (!dateString) return "Tanggal TBD";
  const date = new Date(`${dateString}T00:00:00`);
  return MATCH_DATE_FORMATTER.format(date);
};

export const formatTime = (timeString) => {
  if (!timeString) return "Waktu TBD";
  return `${timeString} WIB`;
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

export const rgbToHex = (r, g, b) => {
  const toHex = (component) =>
    component.toString(16).padStart(2, "0");
  return `#${toHex(clamp(Math.round(r), 0, 255))}${toHex(
    clamp(Math.round(g), 0, 255)
  )}${toHex(clamp(Math.round(b), 0, 255))}`;
};

const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const mixColors = (baseHex, targetHex, amount) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const normalizedAmount = clamp(amount, 0, 1);
  const mixChannel = (channel) =>
    clamp(
      base[channel] +
        (target[channel] - base[channel]) * normalizedAmount,
      0,
      255
    );
  return rgbToHex(
    mixChannel("r"),
    mixChannel("g"),
    mixChannel("b")
  );
};

const lightenColor = (hex, amount) =>
  mixColors(hex, "#ffffff", clamp(amount, 0, 1));
const darkenColor = (hex, amount) =>
  mixColors(hex, "#000000", clamp(amount, 0, 1));

const colorDistance = (colorA, colorB) => {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
  );
};

const deriveBrandPalette = (image) => {
  if (!image) return DEFAULT_BRAND_PALETTE;
  try {
    const sampleSize = 96;
    const aspect = image.width / image.height || 1;
    const width = sampleSize;
    const height = Math.max(1, Math.round(sampleSize / aspect));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 160) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = `${r >> 3}-${g >> 3}-${b >> 3}`;
      let entry = buckets.get(key);
      if (!entry) {
        entry = { count: 0, r: 0, g: 0, b: 0 };
        buckets.set(key, entry);
      }
      entry.count += 1;
      entry.r += r;
      entry.g += g;
      entry.b += b;
    }

    const bucketArray = Array.from(buckets.values()).filter(
      (entry) => entry.count > 0
    );
    if (!bucketArray.length) {
      return DEFAULT_BRAND_PALETTE;
    }
    const enrichedBuckets = bucketArray
      .map((entry) => {
        const rAvg = entry.r / entry.count;
        const gAvg = entry.g / entry.count;
        const bAvg = entry.b / entry.count;
        const hex = rgbToHex(rAvg, gAvg, bAvg);
        const { s, l } = rgbToHsl(rAvg, gAvg, bAvg);
        return {
          count: entry.count,
          hex,
          saturation: s,
          lightness: l,
        };
      })
      .sort((a, b) => b.count - a.count);

    const vibrantCandidates = enrichedBuckets.filter(
      (entry) => entry.saturation >= 0.2 && entry.lightness >= 0.15 && entry.lightness <= 0.8
    );
    const candidates =
      vibrantCandidates.length > 0 ? vibrantCandidates : enrichedBuckets;

    const primaryEntry = candidates[0];
    const primary = primaryEntry?.hex ?? DEFAULT_BRAND_PALETTE.headerStart;

    let secondaryEntry =
      candidates.slice(1).find(
        (entry) => colorDistance(entry.hex, primary) >= 80
      ) ?? candidates[1];

    if (!secondaryEntry) {
      secondaryEntry = {
        hex: lightenColor(primary, 0.25),
        saturation: 1,
        lightness: 0.5,
      };
    }

    let secondary = secondaryEntry.hex;
    if (colorDistance(primary, secondary) < 60) {
      secondary = lightenColor(primary, 0.25);
    }

    const headerStart = lightenColor(primary, 0.05);
    const headerEnd = lightenColor(secondary, 0.12);
    const footerStart = lightenColor(primary, 0.12);
    const footerEnd = darkenColor(secondary, 0.18);
    const accent = lightenColor(secondary, 0.3);

    return {
      headerStart,
      headerEnd,
      footerStart,
      footerEnd,
      accent,
    };
  } catch (error) {
    console.warn("Gagal mengambil palet logo:", error);
    return DEFAULT_BRAND_PALETTE;
  }
};

const getInitials = (name) => {
  if (!name) return "FC";
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? words[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
};

export const applyFittedFont = (
  ctx,
  text,
  { maxSize, minSize = 12, weight = 600, maxWidth, family = '"Poppins", sans-serif' }
) => {
  let size = maxSize;
  const floor = Math.max(8, minSize);
  while (size > floor) {
    ctx.font = `${weight} ${Math.round(size)}px ${family}`;
    if (!maxWidth || ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  ctx.font = `${weight} ${Math.round(floor)}px ${family}`;
  return floor;
};

export const clampMin = (value, min) => Math.max(min, value);

export const drawLogoTile = (
  ctx,
  image,
  x,
  y,
  size,
  fallbackName,
  options = {}
) => {
  const radius = size / 2;
  const centerX = x + radius;
  const centerY = y + radius;
  const borderWidth = Math.max(2, size * 0.08);
  const {
    scale = 1,
    offsetX = 0,
    offsetY = 0,
    paddingRatio = 0.08,
    placeholderColors,
  } = options || {};
  const placeholder = placeholderColors || PLACEHOLDER_COLORS;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();

  if (image) {
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
    ctx.shadowBlur = Math.max(14, size * 0.4);
    ctx.shadowOffsetY = Math.max(4, size * 0.12);
    ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.clip();
    const usableSize = size * (1 - paddingRatio);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const baseScale =
      imageWidth && imageHeight
        ? Math.max(usableSize / imageWidth, usableSize / imageHeight)
        : 1;
    const effectiveScale = baseScale * clamp(scale ?? 1, 0.7, 1.5);
    const renderWidth =
      imageWidth && imageHeight ? imageWidth * effectiveScale : usableSize;
    const renderHeight =
      imageWidth && imageHeight ? imageHeight * effectiveScale : usableSize;
    const offsetLimit = usableSize * 0.5;
    const offsetXPx = clamp(offsetX ?? 0, -0.75, 0.75) * offsetLimit;
    const offsetYPx = clamp(offsetY ?? 0, -0.75, 0.75) * offsetLimit;
    const renderX = centerX - renderWidth / 2 + offsetXPx;
    const renderY = centerY - renderHeight / 2 + offsetYPx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      centerX - usableSize / 2,
      centerY - usableSize / 2,
      usableSize,
      usableSize
    );
    ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.fillStyle = placeholder.fill || PLACEHOLDER_COLORS.fill;
    ctx.fill();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = placeholder.border || PLACEHOLDER_COLORS.border;
    ctx.stroke();

    ctx.save();
    ctx.clip();
    ctx.fillStyle = placeholder.text || PLACEHOLDER_COLORS.text;
    ctx.font = `700 ${size * 0.38}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(fallbackName), centerX, centerY);
    ctx.restore();
  }

  ctx.restore();
};

const APP_DATA_BUNDLE = {
  BRAND_LOGO_OPTIONS,
  BANNER_FOOTER_OPTIONS,
  BRAND_ASSET_ENTRIES,
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
  DEFAULT_BRAND_PALETTE,
  deriveBrandPalette,
  PLACEHOLDER_COLORS,
  normalizeTeamName,
  getAutoTeamLogoSrc,
  resolveAutoTeamLogoSrc,
  resolveAutoLogoSrc: resolveAutoTeamLogoSrc,
  loadTeamLogoImage,
  loadOptionalImage,
  createInitialMatches,
  readFileAsDataURL,
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
  TOGEL_POOL_OPTIONS,
};

AppEnvironment.setData(APP_DATA_BUNDLE);

export default APP_DATA_BUNDLE;
