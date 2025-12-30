import { BRAND_NAMES } from "../constants/brand-names";

const normalizeBrandKey = (brandName) =>
  typeof brandName === "string" && brandName ? brandName.toUpperCase() : "";

const createBrandBackgroundFiles = (directory) => {
  const baseBackground = `${directory}/BACKGROUND.webp`;
  const brandBackgrounds = BRAND_NAMES.map((brandName) => `${directory}/${brandName}.webp`);
  return [baseBackground, ...brandBackgrounds];
};

const createBrandBackgroundLookup = (directory) => {
  const lookup = {
    BACKGROUND: `${directory}/BACKGROUND.webp`,
  };

  BRAND_NAMES.forEach((brandName) => {
    const key = normalizeBrandKey(brandName);
    if (key) {
      lookup[key] = `${directory}/${brandName}.webp`;
    }
  });

  if (lookup.BACKGROUND && !lookup.DEFAULT) {
    lookup.DEFAULT = lookup.BACKGROUND;
  }

  return lookup;
};

const createBrandBackgroundResolver = (lookup) => (brandName) => {
  if (!brandName) {
    return lookup.DEFAULT || null;
  }
  const key = normalizeBrandKey(brandName);
  return lookup[key] || lookup.DEFAULT || null;
};

export {
  createBrandBackgroundFiles,
  createBrandBackgroundLookup,
  createBrandBackgroundResolver,
  normalizeBrandKey,
};

export default {
  createBrandBackgroundFiles,
  createBrandBackgroundLookup,
  createBrandBackgroundResolver,
  normalizeBrandKey,
};

