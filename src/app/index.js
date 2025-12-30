import {
  BANNER_BACKGROUND_LOOKUP,
  BRAND_LOGO_OPTIONS,
} from "../domains/brand";

export * from "./config/modules/assets/asset.constants";
export * from "./config/modules/assets/asset.resolvers";
export * from "./config/modules/match/match.config";
export * from "./config/modules/match/match.constants";
export * from "./config/modules/togel/togel.utils";
export * from "./config/modules/togel/togel.constants";
export * from "./config/modules/togel/togel.streaming";
export * from "./config/modules/shared/string.utils";
export * from "./config/modules/layout/layout.utils";
export * from "./config/modules/theme/theme.utils";
export * from "./config/modules/mode/mode.config";
export * from "../domains/brand";
export * from "../domains/teams";
export * from "../domains/togel";
export * from "../utils/image-loader";
export * from "../utils/color-utils";
export * from "../data/helpers/match-factory";

export { default as AppEnvironment } from "./app-environment";
export * from "./mode-registry";

export const AVAILABLE_BRAND_LOGOS = Array.isArray(BRAND_LOGO_OPTIONS) ? BRAND_LOGO_OPTIONS : [];
export const BACKGROUND_LOOKUP = BANNER_BACKGROUND_LOOKUP || {};
export const RAFFLE_HEADER_LOGO_SRC = "assets/RAFFLE/logo_mode/IDNRAFFLE.png";
export const SCORE_MODE_TITLE = "HASIL SKOR SEPAK BOLA";
export const BIG_MATCH_TITLE = "BIG MATCH";
