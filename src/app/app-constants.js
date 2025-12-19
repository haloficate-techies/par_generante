import AppEnvironment from "./app-environment";
import AppData, { DEFAULT_BRAND_PALETTE as FALLBACK_BRAND_PALETTE } from "../data/app-data";
import AppGlobals from "./config/globals";

export const getModeLayoutConfig = AppEnvironment.getModeLayoutResolver();
export const getModeModule = AppEnvironment.getModeModuleResolver();

export const AVAILABLE_BRAND_LOGOS = Array.isArray(AppData.BRAND_LOGO_OPTIONS)
  ? AppData.BRAND_LOGO_OPTIONS
  : [];
export const BACKGROUND_LOOKUP = AppData.BANNER_BACKGROUND_LOOKUP || {};
export const DEFAULT_BRAND_PALETTE = AppData.DEFAULT_BRAND_PALETTE || FALLBACK_BRAND_PALETTE;
export const MODE_BACKGROUND_DEFAULTS = AppGlobals.MODE_BACKGROUND_DEFAULTS || {};
export const DEFAULT_RAFFLE_FOOTER =
  AppGlobals.DEFAULT_RAFFLE_FOOTER || "assets/RAFFLE/banner_footer/FOOTER.webp";
export const RAFFLE_HEADER_LOGO_SRC = "assets/RAFFLE/logo_mode/IDNRAFFLE.png";
export const DEFAULT_ESPORT_MINI_BANNER =
  AppGlobals.DEFAULT_ESPORT_MINI_BANNER || AppData.ESPORT_MINI_BANNER_FOOTER || null;
export const LEAGUE_LOGO_OPTIONS = AppGlobals.LEAGUE_LOGO_OPTIONS || [];
export const MATCH_COUNT_OPTIONS = AppGlobals.MATCH_COUNT_OPTIONS || [1, 2, 3, 4, 5];
export const MAX_MATCHES = AppGlobals.MAX_MATCHES || MATCH_COUNT_OPTIONS[MATCH_COUNT_OPTIONS.length - 1];
export const computeMiniBannerLayout = AppGlobals.computeMiniBannerLayout || (() => null);
export const resolveTogelPoolLabel = AppGlobals.resolveTogelPoolLabel || (() => "");
export const buildTogelTitle = AppGlobals.buildTogelTitle || ((title) => title || "");
export const createBrandSlug =
  AppGlobals.createBrandSlug || ((brandName) => (brandName || "").toString().trim());
export const resolveFooterSrcForBrand = AppGlobals.resolveFooterSrcForBrand || (() => "");
export const loadMatchLogoImage = AppGlobals.loadMatchLogoImage || (() => Promise.resolve(null));
export const createInitialMatches =
  AppData.createInitialMatches ||
  ((count) => Array.from({ length: count }).map(() => ({ teamHome: "", teamAway: "" })));
export const resolveAutoTeamLogoSrc = AppData.resolveAutoTeamLogoSrc || (() => "");
export const loadOptionalImage = AppData.loadOptionalImage || (() => Promise.resolve(null));
const deriveBrandPaletteFn =
  AppData.deriveBrandPalette ||
  AppData.DERIVE_BRAND_PALETTE ||
  (() => DEFAULT_BRAND_PALETTE);
export const deriveBrandPalette = (image) => {
  if (typeof deriveBrandPaletteFn === "function") {
    return deriveBrandPaletteFn(image) || DEFAULT_BRAND_PALETTE;
  }
  return DEFAULT_BRAND_PALETTE;
};

export const SCORE_MODE_TITLE = "HASIL SKOR SEPAK BOLA";
export const BIG_MATCH_TITLE = "BIG MATCH";

export const MODE_CONFIG = AppGlobals.MODE_CONFIG || [];
