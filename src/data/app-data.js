import AppEnvironment from "../app/app-environment";
import {
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  BANNER_FOOTER_OPTIONS,
  BRAND_ASSET_ENTRIES,
  BRAND_LOGO_OPTIONS,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
} from "../domains/brand";
import {
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  TOGEL_POOL_OPTIONS,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
} from "../domains/togel";
import {
  loadOptionalImage,
  loadTeamLogoImage,
  readFileAsDataURL,
} from "../utils/image-loader";
import {
  getAutoTeamLogoSrc,
  normalizeTeamName,
  resolveAutoTeamLogoSrc as resolveAutoTeamLogoSrcHelper,
} from "../domains/teams";
import {
  DEFAULT_BRAND_PALETTE as COLOR_DEFAULT_BRAND_PALETTE,
  clamp as clampHelper,
  colorDistance as colorDistanceHelper,
  deriveBrandPalette as deriveBrandPaletteHelper,
  darkenColor as darkenColorHelper,
  hexToRgb as hexToRgbHelper,
  lightenColor as lightenColorHelper,
  mixColors as mixColorsHelper,
  rgbToHsl as rgbToHslHelper,
  rgbToHex as rgbToHexHelper,
} from "../utils/color-utils";
import {
  PLACEHOLDER_COLORS as LOGO_PLACEHOLDER_COLORS,
  applyFittedFont as applyFittedFontHelper,
  clampMin as clampMinHelper,
  drawLogoTile as drawLogoTileHelper,
} from "../utils/draw-logo-tile";

export { readFileAsDataURL, loadOptionalImage, loadTeamLogoImage };

// -------- Shared helpers --------
export const DEFAULT_BRAND_PALETTE = COLOR_DEFAULT_BRAND_PALETTE;
export const clamp = clampHelper;
export const hexToRgb = hexToRgbHelper;
export const rgbToHex = rgbToHexHelper;
export const rgbToHsl = rgbToHslHelper;
export const mixColors = mixColorsHelper;
export const lightenColor = lightenColorHelper;
export const darkenColor = darkenColorHelper;
export const colorDistance = colorDistanceHelper;
export const deriveBrandPalette = deriveBrandPaletteHelper;

export const PLACEHOLDER_COLORS = LOGO_PLACEHOLDER_COLORS;

export const TEAM_LOGO_PLACEHOLDER_COLORS = {
  fill: "#ffffff",
  border: "rgba(15, 23, 42, 0.18)",
  text: "#0f172a",
};

export const resolveAutoTeamLogoSrc = resolveAutoTeamLogoSrcHelper;

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

export const applyFittedFont = applyFittedFontHelper;
export const clampMin = clampMinHelper;
export const drawLogoTile = drawLogoTileHelper;

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
