import {
  TEAM_LOGO_PLACEHOLDER_COLORS as DATA_TEAM_LOGO_PLACEHOLDER_COLORS,
  formatDate as formatDateHelper,
  formatTime as formatTimeHelper,
} from "../../data/app-data";
import {
  DEFAULT_BRAND_PALETTE as DATA_DEFAULT_BRAND_PALETTE,
  hexToRgb as hexToRgbHelper,
  rgbToHex as rgbToHexHelper,
} from "../color-utils";
import {
  PLACEHOLDER_COLORS as DATA_PLACEHOLDER_COLORS,
  applyFittedFont as applyFittedFontHelper,
  clampMin as clampMinHelper,
  drawLogoTile as drawLogoTileHelper,
} from "../draw-logo-tile";

export const PLACEHOLDER_FILL_COLOR = DATA_PLACEHOLDER_COLORS.fill || "#1f2937";
export const PLACEHOLDER_BORDER_COLOR =
  DATA_PLACEHOLDER_COLORS.border || "rgba(148, 163, 184, 0.4)";
export const PLACEHOLDER_TEXT_COLOR =
  DATA_PLACEHOLDER_COLORS.text || "#e2e8f0";
export const TEAM_LOGO_PLACEHOLDER_COLORS = DATA_TEAM_LOGO_PLACEHOLDER_COLORS;

export const DEFAULT_BRAND_PALETTE = DATA_DEFAULT_BRAND_PALETTE;

export const applyFittedFont = applyFittedFontHelper;
export const clampMin = clampMinHelper;
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const formatDate = formatDateHelper;
export const formatTime = formatTimeHelper;
export const hexToRgb = hexToRgbHelper;
export const rgbToHex = rgbToHexHelper;
export const drawLogoTile = drawLogoTileHelper;
