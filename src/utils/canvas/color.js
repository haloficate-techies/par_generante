import { hexToRgb, rgbToHex } from "./constants";

const srgbChannelToLinear = (value) => {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

const blendHexColors = (sourceHex, targetHex, ratio = 0.4) => {
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

const clampRatio = (value) => Math.min(1, Math.max(0, value));

export const darkenHexColor = (color, ratio = 0.2, base = "#0f172a") => {
  const safeRatio = clampRatio(ratio);
  const source = typeof color === "string" && color ? color : base;
  return blendHexColors(source, base, safeRatio);
};

export const desaturateHexColor = (color, ratio = 0.2) => {
  const safeRatio = clampRatio(ratio);
  if (safeRatio <= 0) return color;
  const source = typeof color === "string" && color ? color : "#0f172a";
  const rgb = hexToRgb(source);
  if (!rgb) return source;
  const gray = Math.round(
    rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722
  );
  const mixChannel = (channel) =>
    Math.round(channel * (1 - safeRatio) + gray * safeRatio);
  return rgbToHex(
    mixChannel(rgb.r),
    mixChannel(rgb.g),
    mixChannel(rgb.b)
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

export const toneDownBrightColor = (
  color,
  {
    fallback = "#0f172a",
    ratio = 0.2,
    luminanceThreshold = 0.78,
    base = "#0f172a",
  } = {}
) => {
  const source = typeof color === "string" && color ? color : fallback;
  if (!source) return base;
  const luminance = getRelativeLuminanceSafe(source);
  if (luminance <= luminanceThreshold) return source;
  return blendHexColors(source, base, clampRatio(ratio));
};

export const normalizeHeaderGradientColor = (
  color,
  fallback,
  {
    base = "#0f172a",
    lift = "#475569",
    darkenRatio = 0.2,
    brightenRatio = 0.35,
    minLuminance = 0.22,
    maxLuminance = 0.84,
  } = {}
) => {
  const source = typeof color === "string" && color ? color : fallback || base;
  const toned = toneDownBrightColor(source, {
    fallback,
    ratio: darkenRatio,
    luminanceThreshold: maxLuminance,
    base,
  });
  const luminance = getRelativeLuminanceSafe(toned);
  if (luminance >= minLuminance) return toned;
  return blendHexColors(toned, lift, clampRatio(brightenRatio));
};

export const shouldUseTextOutline = (
  backgroundColor,
  { luminanceThreshold = 0.82 } = {}
) => getRelativeLuminanceSafe(backgroundColor) >= luminanceThreshold;

const averageHexColor = (startHex, endHex) => {
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
