import { CanvasUtils } from "../../utils/canvas-utils";
import AppEnvironment from "../../app/app-environment";

const { drawMatches, drawMiniFooterBanner } = typeof CanvasUtils === "object"
  ? CanvasUtils
  : window;

const renderMatchModeLayout = ({
  ctx,
  matchesWithImages = [],
  matchesStartY = 0,
  brandPalette,
  activeMode,
  miniBannerLayout,
  miniBannerImage,
}) => {
  if (!ctx) return;
  drawMatches(ctx, matchesWithImages, matchesStartY, brandPalette, {
    mode: activeMode,
    extraBottomSpacing: miniBannerLayout?.totalHeight ?? 0,
  });
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
