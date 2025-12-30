import AppEnvironment from "../../app/app-environment";
import {
  drawMatches,
  drawMiniFooterBanner,
  drawBigMatchLayout,
} from "../../utils/canvas";

/**
 * Renders match mode layout (football/basketball/esports) handling both grid and big match variants.
 *
 * @param {Object} params
 * @param {CanvasRenderingContext2D} params.ctx
 * @param {Array} params.matchesWithImages
 * @param {number} params.matchesStartY
 * @param {Object} params.brandPalette
 * @param {string} params.brandDisplayName
 * @param {string} params.activeMode
 * @param {string} params.activeSubMenu
 * @param {Object} params.miniBannerLayout
 * @param {HTMLImageElement|null} params.miniBannerImage
 * @param {Object|null} params.bigMatchDetails
 */
const renderMatchModeLayout = ({
  ctx,
  matchesWithImages = [],
  matchesStartY = 0,
  brandPalette,
  brandDisplayName,
  activeMode,
  activeSubMenu,
  miniBannerLayout,
  miniBannerImage,
  bigMatchDetails,
}) => {
  if (!ctx) return;
  const shouldUseBigMatchLayout =
    activeMode === "football" && activeSubMenu === "big_match" && typeof drawBigMatchLayout === "function";
  if (shouldUseBigMatchLayout) {
    drawBigMatchLayout(ctx, {
      matchesWithImages,
      matchesStartY,
      brandPalette,
      bigMatchDetails,
      brandDisplayName,
    });
  } else {
    drawMatches(ctx, matchesWithImages, matchesStartY, brandPalette, {
      mode: activeMode,
      activeSubMenu,
      brandDisplayName,
      extraBottomSpacing: miniBannerLayout?.totalHeight ?? 0,
    });
  }
  if (miniBannerLayout && miniBannerImage) {
    drawMiniFooterBanner(ctx, miniBannerImage, miniBannerLayout);
  }
};

const registerLayouts = () => {
  const registry = AppEnvironment ? AppEnvironment.getModeRegistry() : null;
  const register = registry?.registerModeLayout;
  if (typeof register !== "function") return;

  const registerFor = (modeId) =>
    register(modeId, { renderContent: renderMatchModeLayout });

  registerFor("default");
  registerFor("football");
  registerFor("basketball");
  registerFor("esports");
};

registerLayouts();

export default renderMatchModeLayout;
