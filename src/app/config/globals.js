import AppEnvironment from "../app-environment";
import { resolveTogelDrawTimeConfig as resolveTogelDrawTimeConfigHelper } from "../../domains/togel";

export * from "./modules/togel/togel.constants";
export * from "./modules/togel/togel.streaming";
export * from "./modules/togel/togel.utils";
export * from "./modules/match/match.constants";
export * from "./modules/match/match.config";
export * from "./modules/assets/asset.constants";
export * from "./modules/assets/asset.resolvers";
export * from "./modules/layout/layout.utils";
export * from "./modules/theme/theme.utils";
export * from "./modules/shared/string.utils";
export * from "./modules/mode/mode.config";

import {
  DEFAULT_IMAGE_EXTENSION_PRIORITY,
  DEFAULT_RAFFLE_FOOTER,
  FOOTER_DIRECTORY_BY_MODE,
  FOOTER_DIRECTORY_DEFAULT,
  MODE_BACKGROUND_DEFAULTS,
  DEFAULT_ESPORT_MINI_BANNER,
} from "./modules/assets/asset.constants";
import {
  HEADER_TO_FOOTER_LOOKUP,
  resolveFooterSrcForBrand,
  resolveImageAssetSrc,
  resolveModeFooterPath,
  splitAssetExtension,
} from "./modules/assets/asset.resolvers";
import {
  TOGEL_POOL_BACKGROUND_LOOKUP,
  TOGEL_VARIANT_DIGIT_LENGTH,
  TOGEL_BACKGROUND_EXTENSION_PRIORITY,
} from "./modules/togel/togel.constants";
import { TOGEL_STREAMING_LINK_LOOKUP } from "./modules/togel/togel.streaming";
import {
  normalizeStreamingDisplayUrl,
  resolveTogelPoolLabel,
  buildTogelTitle,
  resolveTogelStreamingInfo,
} from "./modules/togel/togel.utils";
import { MATCH_COUNT_OPTIONS, MAX_MATCHES } from "./modules/match/match.constants";
import { FOOTBALL_SUB_MENUS, DEFAULT_SUB_MENUS, LEAGUE_LOGO_OPTIONS } from "./modules/match/match.config";
import { computeMiniBannerLayout } from "./modules/layout/layout.utils";
import { hexToRgbForTheme, resolveStreamingThemeFromPalette } from "./modules/theme/theme.utils";
import { createBrandSlug, loadMatchLogoImage } from "./modules/shared/string.utils";
import { MODE_CONFIG } from "./modules/mode/mode.config";

const resolveTogelDrawTimeConfig =
  typeof resolveTogelDrawTimeConfigHelper === "function"
    ? resolveTogelDrawTimeConfigHelper
    : () => ({ options: [] });

const APP_GLOBALS_BUNDLE = {
  MODE_BACKGROUND_DEFAULTS,
  DEFAULT_ESPORT_MINI_BANNER,
  DEFAULT_RAFFLE_FOOTER,
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
  resolveTogelDrawTimeConfig,
  LEAGUE_LOGO_OPTIONS,
  FOOTBALL_SUB_MENUS,
  DEFAULT_SUB_MENUS,
};

AppEnvironment.setGlobals(APP_GLOBALS_BUNDLE);

export default APP_GLOBALS_BUNDLE;
