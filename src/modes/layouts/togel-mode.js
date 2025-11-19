import { CanvasUtils } from "../../utils/canvas-utils";
import AppEnvironment from "../../app/app-environment";

const { drawTogelResult } = typeof CanvasUtils === "object" ? CanvasUtils : window;

const renderTogelModeLayout = ({
  ctx,
  matchesStartY = 0,
  brandPalette,
  togelData = {},
}) => {
  if (!ctx) return;
  drawTogelResult(ctx, {
    digits: togelData.digits,
    poolCode: togelData.poolCode,
    poolLabel: togelData.poolLabel,
    variantLabel: togelData.variantLabel,
    drawTime: togelData.drawTime,
    startY: matchesStartY,
    palette: brandPalette,
    streamingInfo: togelData.streamingInfo,
  });
};

const registerLayouts = () => {
  const registry = AppEnvironment ? AppEnvironment.getModeRegistry() : null;
  const register = registry?.registerModeLayout;
  if (typeof register !== "function") return;
  register("togel", { renderContent: renderTogelModeLayout });
};

registerLayouts();

export default renderTogelModeLayout;
