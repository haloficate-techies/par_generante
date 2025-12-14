import {
  PLACEHOLDER_COLORS as DATA_PLACEHOLDER_COLORS,
  TEAM_LOGO_PLACEHOLDER_COLORS as DATA_TEAM_LOGO_PLACEHOLDER_COLORS,
  DEFAULT_BRAND_PALETTE as DATA_DEFAULT_BRAND_PALETTE,
  applyFittedFont as applyFittedFontHelper,
  clampMin as clampMinHelper,
  formatDate as formatDateHelper,
  formatTime as formatTimeHelper,
  hexToRgb as hexToRgbHelper,
  rgbToHex as rgbToHexHelper,
  drawLogoTile as drawLogoTileHelper,
} from "../../data/app-data";

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
