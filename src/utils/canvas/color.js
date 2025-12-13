import { hexToRgb, rgbToHex } from "./constants";

const srgbChannelToLinear = (value) => {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

export const blendHexColors = (sourceHex, targetHex, ratio = 0.4) => {
  if (!sourceHex || !targetHex) {
    return sourceHex || targetHex || "#0f172a";
  }
  const source = hexToRgb(sourceHex);
  const target = hexToRgb(targetHex);
  if (!source || !target) {
    return sourceHex || targetHex;
  }
  const mixChannel = (a, b) => Math.round(a * (1 - ratio) + b * ratio);
  return rgbToHex(
    mixChannel(source.r, target.r),
    mixChannel(source.g, target.g),
    mixChannel(source.b, target.b)
  );
};

export const ensureSubduedGradientColor = (color, fallback, ratio = 0.35) => {
  const base = "#0f172a";
  const source = typeof color === "string" && color ? color : fallback;
  if (!source) return base;
  return blendHexColors(source, base, ratio);
};

export const getRelativeLuminanceSafe = (hex) => {
  if (typeof hexToRgb !== "function") return 0;
  try {
    const { r, g, b } = hexToRgb(hex);
    const rLin = srgbChannelToLinear(r);
    const gLin = srgbChannelToLinear(g);
    const bLin = srgbChannelToLinear(b);
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  } catch (error) {
    return 0;
  }
};

export const averageHexColor = (startHex, endHex) => {
  if (typeof hexToRgb !== "function" || typeof rgbToHex !== "function") {
    return "#000000";
  }
  const safeStart = typeof startHex === "string" ? startHex : "#000000";
  const safeEnd =
    typeof endHex === "string"
      ? endHex
      : typeof startHex === "string"
      ? startHex
      : "#000000";
  const startRgb = hexToRgb(safeStart);
  const endRgb = hexToRgb(safeEnd);
  return rgbToHex(
    (startRgb.r + endRgb.r) / 2,
    (startRgb.g + endRgb.g) / 2,
    (startRgb.b + endRgb.b) / 2
  );
};

export const pickReadableTextColor = (
  startHex,
  endHex,
  { preferLight = false } = {}
) => {
  const midpoint = averageHexColor(startHex, endHex);
  const luminance = getRelativeLuminanceSafe(midpoint);
  const threshold = preferLight ? 0.78 : 0.6;
  return luminance > threshold ? "#0f172a" : "#f8fafc";
};
