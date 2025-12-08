import { CanvasUtils } from "../../utils/canvas-utils";
import AppEnvironment from "../../app/app-environment";

const { drawMatches, drawMiniFooterBanner, drawScoreboardMatches, drawBigMatchLayout } = typeof CanvasUtils === "object"
  ? CanvasUtils
  : window;

const renderMatchModeLayout = ({
  ctx,
  matchesWithImages = [],
  matchesStartY = 0,
  brandPalette,
  activeMode,
  activeSubMenu,
  miniBannerLayout,
  miniBannerImage,
  bigMatchDetails,
  scoreInfoLabel,
}) => {
  if (!ctx) return;
  const shouldUseBigMatchLayout =
    activeMode === "football" && activeSubMenu === "big_match" && typeof drawBigMatchLayout === "function";
  const shouldUseScoreboard =
    activeMode === "football" && activeSubMenu === "scores" && typeof drawScoreboardMatches === "function";
  if (shouldUseBigMatchLayout) {
    drawBigMatchLayout(ctx, {
      matchesWithImages,
      matchesStartY,
      brandPalette,
      bigMatchDetails,
    });
  } else if (shouldUseScoreboard) {
    drawScoreboardMatches(ctx, matchesWithImages, matchesStartY, brandPalette, {
      extraBottomSpacing: miniBannerLayout?.totalHeight ?? 0,
      infoLabel: scoreInfoLabel,
    });
  } else {
    drawMatches(ctx, matchesWithImages, matchesStartY, brandPalette, {
      mode: activeMode,
      activeSubMenu,
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
