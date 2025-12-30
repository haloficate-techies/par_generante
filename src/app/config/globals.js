import AppEnvironment from "../app-environment";
import {
  DEFAULT_IMAGE_EXTENSION_PRIORITY,
  DEFAULT_RAFFLE_FOOTER,
  FOOTER_DIRECTORY_BY_MODE,
  FOOTER_DIRECTORY_DEFAULT,
  MODE_BACKGROUND_DEFAULTS,
  DEFAULT_ESPORT_MINI_BANNER,
  HEADER_TO_FOOTER_LOOKUP,
  resolveFooterSrcForBrand,
  resolveImageAssetSrc,
  resolveModeFooterPath,
  splitAssetExtension,
  TOGEL_POOL_BACKGROUND_LOOKUP,
  TOGEL_VARIANT_DIGIT_LENGTH,
  TOGEL_BACKGROUND_EXTENSION_PRIORITY,
  TOGEL_STREAMING_LINK_LOOKUP,
  normalizeStreamingDisplayUrl,
  resolveTogelPoolLabel,
  buildTogelTitle,
  resolveTogelStreamingInfo,
  MATCH_COUNT_OPTIONS,
  MAX_MATCHES,
  LEAGUE_LOGO_OPTIONS,
  FOOTBALL_SUB_MENUS,
  DEFAULT_SUB_MENUS,
  computeMiniBannerLayout,
  hexToRgbForTheme,
  resolveStreamingThemeFromPalette,
  createBrandSlug,
  loadMatchLogoImage,
  MODE_CONFIG,
  resolveTogelDrawTimeConfig as resolveTogelDrawTimeConfigHelper,
} from "../index";

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
