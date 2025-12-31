import { BANNER_BACKGROUND_LOOKUP } from "../domains/brand";

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

export const BACKGROUND_LOOKUP = BANNER_BACKGROUND_LOOKUP || {};
