import { BANNER_BACKGROUND_LOOKUP } from "../domains/brand";

export * from "./config/modules/assets/asset.constants";
export { resolveImageAssetSrc, resolveFooterSrcForBrand } from "./config/modules/assets/asset.resolvers";
export { LEAGUE_LOGO_OPTIONS } from "./config/modules/match/match.config";
export * from "./config/modules/match/match.constants";
export {
  resolveTogelPoolLabel,
  resolveTogelPoolLogoSrc,
  resolveTogelStreamingInfo,
  buildTogelTitle,
} from "./config/modules/togel/togel.utils";
export * from "./config/modules/togel/togel.constants";
export * from "./config/modules/togel/togel.streaming";
export * from "./config/modules/shared/string.utils";
export * from "./config/modules/layout/layout.utils";
export { resolveStreamingThemeFromPalette } from "./config/modules/theme/theme.utils";
export * from "./config/modules/mode/mode.config";
export * from "../utils/color-utils";

export * from "./app-environment";
export * from "./mode-registry";
export { createModeContext } from "./mode-context";

export const BACKGROUND_LOOKUP = BANNER_BACKGROUND_LOOKUP || {};
