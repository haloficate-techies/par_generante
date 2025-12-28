import AppEnvironment from "../../../app-environment";

const AppData = (typeof AppEnvironment.getData === "function" && AppEnvironment.getData()) || {};

export const createBrandSlug = (brandName, { uppercase = false } = {}) => {
  if (!brandName) return "";
  const token = brandName.toString().trim().replace(/[^a-z0-9]+/gi, "");
  return uppercase ? token.toUpperCase() : token.toLowerCase();
};

export const loadMatchLogoImage = (src, isAuto) => {
  if (!src) return Promise.resolve(null);
  if (typeof AppData.loadTeamLogoImage === "function") {
    return AppData.loadTeamLogoImage(src, { applyAutoProcessing: Boolean(isAuto) });
  }
  const loadOptionalImage =
    typeof AppData.loadOptionalImage === "function" ? AppData.loadOptionalImage : () => Promise.resolve(null);
  return loadOptionalImage(src);
};

