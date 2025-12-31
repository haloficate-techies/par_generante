import { BRAND_NAMES } from "../constants/brand-names";
import {
  BANNER_BACKGROUND_DIRECTORY,
  BASKETBALL_BRAND_BACKGROUND_DIRECTORY,
  ESPORT_BRAND_BACKGROUND_DIRECTORY,
} from "../constants/directories";
import {
  createBrandBackgroundFiles,
  createBrandBackgroundLookup,
  createBrandBackgroundResolver,
} from "./background-resolver";

const BANNER_BACKGROUND_FILES = createBrandBackgroundFiles(BANNER_BACKGROUND_DIRECTORY);

const BANNER_BACKGROUND_LOOKUP = BANNER_BACKGROUND_FILES.reduce((acc, path) => {
  const fileName = path.split("/").pop() || "";
  const baseName = fileName.includes(".")
    ? fileName.slice(0, fileName.lastIndexOf("."))
    : fileName;
  if (baseName) {
    acc[baseName.toUpperCase()] = path;
  }
  return acc;
}, {});

if (BANNER_BACKGROUND_LOOKUP.BACKGROUND && !BANNER_BACKGROUND_LOOKUP.DEFAULT) {
  BANNER_BACKGROUND_LOOKUP.DEFAULT = BANNER_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return BANNER_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  return (
    BANNER_BACKGROUND_LOOKUP[brandName.toUpperCase()] ||
    BANNER_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const BASKETBALL_BRAND_BACKGROUND_LOOKUP = createBrandBackgroundLookup(
  BASKETBALL_BRAND_BACKGROUND_DIRECTORY
);

const resolveBasketballBrandBackgroundPath = createBrandBackgroundResolver(
  BASKETBALL_BRAND_BACKGROUND_LOOKUP
);

const ESPORT_BRAND_BACKGROUND_LOOKUP = createBrandBackgroundLookup(
  ESPORT_BRAND_BACKGROUND_DIRECTORY
);

const resolveEsportBrandBackgroundPath = createBrandBackgroundResolver(
  ESPORT_BRAND_BACKGROUND_LOOKUP
);

const BRAND_ASSET_ENTRIES = BRAND_NAMES.map((brandName) => {
  const footballBackgroundPath = resolveBrandBackgroundPath(brandName);
  const basketballBackgroundPath = resolveBasketballBrandBackgroundPath(brandName);
  const esportsBackgroundPath = resolveEsportBrandBackgroundPath(brandName);
  return {
    name: brandName,
    headerPath: `assets/BRAND/${brandName}.webp`,
    footerPath: `assets/BOLA/banner_footer/${brandName}.webp`,
    backgroundPath: footballBackgroundPath,
    backgroundByMode: {
      football: footballBackgroundPath,
      basketball: basketballBackgroundPath,
      esports: esportsBackgroundPath,
    },
  };
});

const BRAND_LOGO_OPTIONS = BRAND_ASSET_ENTRIES.map((entry) => ({
  label: entry.name,
  value: entry.headerPath,
  brand: entry.name,
  footerValue: entry.footerPath,
  backgroundValue: entry.backgroundPath,
  backgroundByMode: entry.backgroundByMode,
}));

const BANNER_FOOTER_OPTIONS = BRAND_ASSET_ENTRIES.map((entry) => ({
  label: entry.name,
  value: entry.footerPath,
  brand: entry.name,
  headerValue: entry.headerPath,
}));

export {
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  BANNER_FOOTER_OPTIONS,
  BRAND_LOGO_OPTIONS,
};

