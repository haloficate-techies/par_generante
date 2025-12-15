import AppEnvironment from "../app/app-environment";
import TEAM_AUTO_LOGO_SOURCES from "./team-logo-sources";
import {
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  BANNER_FOOTER_OPTIONS,
  BRAND_ASSET_ENTRIES,
  BRAND_LOGO_OPTIONS,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
} from "./brand-assets";
import {
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  TOGEL_POOL_OPTIONS,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
} from "./togel-data";
import {
  loadOptionalImage,
  loadTeamLogoImage,
  readFileAsDataURL,
} from "../utils/image-loader";
import {
  DEFAULT_BRAND_PALETTE as COLOR_DEFAULT_BRAND_PALETTE,
  clamp as clampHelper,
  deriveBrandPalette as deriveBrandPaletteHelper,
  hexToRgb as hexToRgbHelper,
  rgbToHex as rgbToHexHelper,
} from "../utils/color-utils";

export { readFileAsDataURL, loadOptionalImage, loadTeamLogoImage };

// -------- Shared helpers --------
export const DEFAULT_BRAND_PALETTE = COLOR_DEFAULT_BRAND_PALETTE;
export const clamp = clampHelper;
export const hexToRgb = hexToRgbHelper;
export const rgbToHex = rgbToHexHelper;
const deriveBrandPalette = deriveBrandPaletteHelper;

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

const getAutoTeamLogoSrc = (teamName) => {
  const normalized = normalizeTeamName(teamName);
  if (!normalized) return "";
  return TEAM_AUTO_LOGO_LOOKUP[normalized] || "";
};

export const resolveAutoTeamLogoSrc = (teamName) => getAutoTeamLogoSrc(teamName);

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
