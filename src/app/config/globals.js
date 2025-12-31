import AppEnvironment from "../app-environment";
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
import { LEAGUE_LOGO_OPTIONS } from "./modules/match/match.config";
import { MATCH_COUNT_OPTIONS, MAX_MATCHES } from "./modules/match/match.constants";
import {
  resolveTogelPoolLabel,
  buildTogelTitle,
  resolveTogelStreamingInfo,
} from "./modules/togel/togel.utils";
import {
  TOGEL_POOL_BACKGROUND_LOOKUP,
  TOGEL_VARIANT_DIGIT_LENGTH,
  TOGEL_BACKGROUND_EXTENSION_PRIORITY,
} from "./modules/togel/togel.constants";
import { TOGEL_STREAMING_LINK_LOOKUP } from "./modules/togel/togel.streaming";
import { computeMiniBannerLayout } from "./modules/layout/layout.utils";
import {
  hexToRgbForTheme,
  resolveStreamingThemeFromPalette,
} from "./modules/theme/theme.utils";
import { createBrandSlug, loadMatchLogoImage } from "./modules/shared/string.utils";
import { MODE_CONFIG } from "./modules/mode/mode.config";
import { resolveTogelDrawTimeConfig as resolveTogelDrawTimeConfigHelper } from "../../domains/togel";

const resolveTogelDrawTimeConfig =
  typeof resolveTogelDrawTimeConfigHelper === "function"
    ? resolveTogelDrawTimeConfigHelper
    : () => ({ options: [] });

const isDevelopment = import.meta.env.DEV;

/**
 * @deprecated Use direct imports from `@app/*` modules instead of relying on AppGlobals.
 *
 * Examples:
 * import { MODE_BACKGROUND_DEFAULTS } from "@app/assets/asset.constants";
 * import { MODE_CONFIG } from "@app/mode/mode.config";
 */
const APP_GLOBALS_BUNDLE = {
  MODE_BACKGROUND_DEFAULTS,
  DEFAULT_ESPORT_MINI_BANNER,
  DEFAULT_RAFFLE_FOOTER,
  computeMiniBannerLayout,
  TOGEL_POOL_BACKGROUND_LOOKUP,
  TOGEL_VARIANT_DIGIT_LENGTH,
  TOGEL_STREAMING_LINK_LOOKUP,
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
};

if (isDevelopment) {
  console.warn(
    "[DEPRECATION] APP_GLOBALS_BUNDLE will be removed in a future major release. " +
      "Please import needed helpers directly from their module (e.g., @app/assets, @app/mode, @app/togel)."
  );
}

AppEnvironment.setGlobals(APP_GLOBALS_BUNDLE);

export default APP_GLOBALS_BUNDLE;
