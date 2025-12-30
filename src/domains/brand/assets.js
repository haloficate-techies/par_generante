import { BRAND_NAMES } from "./constants/brand-names";
import {
  BANNER_BACKGROUND_DIRECTORY,
  BASKETBALL_BRAND_BACKGROUND_DIRECTORY,
  ESPORT_BRAND_BACKGROUND_DIRECTORY,
} from "./constants/directories";
import { ESPORT_GAME_OPTIONS, ESPORT_MINI_BANNER_FOOTER } from "./constants/esport-games";
import {
  createBrandBackgroundFiles,
  createBrandBackgroundLookup,
  createBrandBackgroundResolver,
  normalizeBrandKey,
} from "./resolvers/background-resolver";
import {
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  BANNER_FOOTER_OPTIONS,
  BASKETBALL_BRAND_BACKGROUND_LOOKUP,
  BRAND_ASSET_ENTRIES,
  BRAND_LOGO_OPTIONS,
  ESPORT_BRAND_BACKGROUND_LOOKUP,
  resolveBasketballBrandBackgroundPath,
  resolveBrandBackgroundPath,
  resolveEsportBrandBackgroundPath,
} from "./resolvers/brand-assets-builder";

export * from "./constants/brand-names";
export * from "./constants/directories";
export * from "./constants/esport-games";
export * from "./resolvers/background-resolver";
export * from "./resolvers/brand-assets-builder";

const brandAssets = {
  BRAND_NAMES,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  resolveBrandBackgroundPath,
  BASKETBALL_BRAND_BACKGROUND_LOOKUP,
  resolveBasketballBrandBackgroundPath,
  ESPORT_BRAND_BACKGROUND_LOOKUP,
  resolveEsportBrandBackgroundPath,
  BRAND_ASSET_ENTRIES,
  BRAND_LOGO_OPTIONS,
  BANNER_FOOTER_OPTIONS,
  helpers: {
    createBrandBackgroundFiles,
    createBrandBackgroundLookup,
    createBrandBackgroundResolver,
    normalizeBrandKey,
  },
  directories: {
    BANNER_BACKGROUND_DIRECTORY,
    BASKETBALL_BRAND_BACKGROUND_DIRECTORY,
    ESPORT_BRAND_BACKGROUND_DIRECTORY,
  },
};

export default brandAssets;
