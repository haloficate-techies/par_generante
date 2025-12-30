import {
  loadOptionalImage as loadOptionalImageHelper,
  loadTeamLogoImage as loadTeamLogoImageHelper,
} from "../../../../utils/image-loader";

export const createBrandSlug = (brandName, { uppercase = false } = {}) => {
  if (!brandName) return "";
  const token = brandName.toString().trim().replace(/[^a-z0-9]+/gi, "");
  return uppercase ? token.toUpperCase() : token.toLowerCase();
};

export const loadMatchLogoImage = (src, isAuto) => {
  if (!src) return Promise.resolve(null);
  if (typeof loadTeamLogoImageHelper === "function") {
    return loadTeamLogoImageHelper(src, { applyAutoProcessing: Boolean(isAuto) });
  }
  if (typeof loadOptionalImageHelper === "function") {
    return loadOptionalImageHelper(src);
  }
  return Promise.resolve(null);
};

