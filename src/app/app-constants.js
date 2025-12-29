import AppData, { DEFAULT_BRAND_PALETTE as FALLBACK_BRAND_PALETTE } from "../data/app-data";
import {
  MODE_BACKGROUND_DEFAULTS as MODULES_MODE_BACKGROUND_DEFAULTS,
  DEFAULT_RAFFLE_FOOTER as MODULES_DEFAULT_RAFFLE_FOOTER,
  DEFAULT_ESPORT_MINI_BANNER as MODULES_DEFAULT_ESPORT_MINI_BANNER,
} from "./config/modules/assets/asset.constants";
import { resolveFooterSrcForBrand as MODULES_RESOLVE_FOOTER_SRC } from "./config/modules/assets/asset.resolvers";
import { LEAGUE_LOGO_OPTIONS as MATCH_LEAGUE_LOGO_OPTIONS } from "./config/modules/match/match.config";
import {
  MATCH_COUNT_OPTIONS as MODULES_MATCH_COUNT_OPTIONS,
  MAX_MATCHES as MODULES_MAX_MATCHES,
} from "./config/modules/match/match.constants";
import {
  resolveTogelPoolLabel as MODULES_RESOLVE_TOGEL_POOL_LABEL,
  buildTogelTitle as MODULES_BUILD_TOGEL_TITLE,
} from "./config/modules/togel/togel.utils";
import {
  createBrandSlug as MODULES_CREATE_BRAND_SLUG,
  loadMatchLogoImage as MODULES_LOAD_MATCH_LOGO_IMAGE,
} from "./config/modules/shared/string.utils";
import { computeMiniBannerLayout as MODULES_COMPUTE_MINI_BANNER_LAYOUT } from "./config/modules/layout/layout.utils";
import { MODE_CONFIG as MODULES_MODE_CONFIG } from "./config/modules/mode/mode.config";
import {
  getModeLayoutConfig as MODULES_MODE_LAYOUT_CONFIG,
  getModeModule as MODULES_MODE_MODULE,
} from "./mode-registry";

export const getModeLayoutConfig = MODULES_MODE_LAYOUT_CONFIG;
export const getModeModule = MODULES_MODE_MODULE;

export const AVAILABLE_BRAND_LOGOS = Array.isArray(AppData.BRAND_LOGO_OPTIONS)
  ? AppData.BRAND_LOGO_OPTIONS
  : [];
export const BACKGROUND_LOOKUP = AppData.BANNER_BACKGROUND_LOOKUP || {};
export const DEFAULT_BRAND_PALETTE = AppData.DEFAULT_BRAND_PALETTE || FALLBACK_BRAND_PALETTE;
export const MODE_BACKGROUND_DEFAULTS = MODULES_MODE_BACKGROUND_DEFAULTS;
export const DEFAULT_RAFFLE_FOOTER = MODULES_DEFAULT_RAFFLE_FOOTER;
export const RAFFLE_HEADER_LOGO_SRC = "assets/RAFFLE/logo_mode/IDNRAFFLE.png";
export const DEFAULT_ESPORT_MINI_BANNER =
  MODULES_DEFAULT_ESPORT_MINI_BANNER || AppData.ESPORT_MINI_BANNER_FOOTER || null;
export const LEAGUE_LOGO_OPTIONS = MATCH_LEAGUE_LOGO_OPTIONS;
export const MATCH_COUNT_OPTIONS = MODULES_MATCH_COUNT_OPTIONS;
export const MAX_MATCHES = MODULES_MAX_MATCHES;
export const computeMiniBannerLayout = MODULES_COMPUTE_MINI_BANNER_LAYOUT;
export const resolveTogelPoolLabel = MODULES_RESOLVE_TOGEL_POOL_LABEL;
export const buildTogelTitle = MODULES_BUILD_TOGEL_TITLE;
export const createBrandSlug = MODULES_CREATE_BRAND_SLUG;
export const resolveFooterSrcForBrand = MODULES_RESOLVE_FOOTER_SRC;
export const loadMatchLogoImage = MODULES_LOAD_MATCH_LOGO_IMAGE;
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

export const MODE_CONFIG = MODULES_MODE_CONFIG;
