import AppEnvironment from "../../app/app-environment";
import { drawTogelResult } from "../../utils/canvas";

/**
 * Renders togel mode layout with result digits, pool labels, and streaming info.
 *
 * @param {Object} params
 * @param {CanvasRenderingContext2D} params.ctx
 * @param {number} params.matchesStartY
 * @param {Object} params.brandPalette
 * @param {Object} params.togelData
 * @param {Array} params.togelData.digits
 * @param {string} params.togelData.poolCode
 * @param {string} params.togelData.poolLabel
 * @param {string} params.togelData.variantLabel
 * @param {string} params.togelData.drawTime
 * @param {Object} params.togelData.streamingInfo
 */
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
