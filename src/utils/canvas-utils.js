import {
  PLACEHOLDER_COLORS as DATA_PLACEHOLDER_COLORS,
  DEFAULT_BRAND_PALETTE as DATA_DEFAULT_BRAND_PALETTE,
  applyFittedFont as applyFittedFontHelper,
  clampMin as clampMinHelper,
  formatDate as formatDateHelper,
  formatTime as formatTimeHelper,
  hexToRgb as hexToRgbHelper,
  rgbToHex as rgbToHexHelper,
  drawLogoTile as drawLogoTileHelper,
} from "../data/app-data";

// -------- Canvas drawing utilities --------
const PLACEHOLDER_FILL_COLOR = DATA_PLACEHOLDER_COLORS.fill || "#1f2937";
const PLACEHOLDER_BORDER_COLOR =
  DATA_PLACEHOLDER_COLORS.border || "rgba(148, 163, 184, 0.4)";
const PLACEHOLDER_TEXT_COLOR = DATA_PLACEHOLDER_COLORS.text || "#e2e8f0";
const DEFAULT_BRAND_PALETTE = DATA_DEFAULT_BRAND_PALETTE;
const applyFittedFont = applyFittedFontHelper;
const clampMin = clampMinHelper;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const formatDate = formatDateHelper;
const formatTime = formatTimeHelper;
const hexToRgb = hexToRgbHelper;
const rgbToHex = rgbToHexHelper;
const drawLogoTile = drawLogoTileHelper;

const BIG_MATCH_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatBigMatchDateLabel = (dateString) => {
  if (!dateString) return "";
  try {
    const parsed = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return dateString;
    }
    return BIG_MATCH_DATE_FORMATTER.format(parsed);
  } catch (error) {
    return dateString;
  }
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

const ensureSubduedGradientColor = (color, fallback, ratio = 0.35) => {
  const base = "#0f172a";
  const source = typeof color === "string" && color ? color : fallback;
  if (!source) return base;
  return blendHexColors(source, base, ratio);
};

const srgbChannelToLinear = (value) => {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

const getRelativeLuminanceSafe = (hex) => {
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

const averageHexColor = (startHex, endHex) => {
  if (typeof hexToRgb !== "function" || typeof rgbToHex !== "function") {
    return "#000000";
  }
  const safeStart = typeof startHex === "string" ? startHex : "#000000";
  const safeEnd =
    typeof endHex === "string" ? endHex : typeof startHex === "string" ? startHex : "#000000";
  const startRgb = hexToRgb(safeStart);
  const endRgb = hexToRgb(safeEnd);
  return rgbToHex(
    (startRgb.r + endRgb.r) / 2,
    (startRgb.g + endRgb.g) / 2,
    (startRgb.b + endRgb.b) / 2
  );
};

const pickReadableTextColor = (startHex, endHex, { preferLight = false } = {}) => {
  const midpoint = averageHexColor(startHex, endHex);
  const luminance = getRelativeLuminanceSafe(midpoint);
  const threshold = preferLight ? 0.78 : 0.6;
  return luminance > threshold ? "#0f172a" : "#f8fafc";
};

const getTodayDateLabel = () => {
  try {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Failed to format date label:", error);
    return "";
  }
};

const shouldUsePreviousDateForTogel = (poolCode, variantLabel, drawTime) => {
  if (!poolCode || !variantLabel || !drawTime) {
    return false;
  }
  const normalizedPool = poolCode.toLowerCase();
  const normalizedVariant = variantLabel.toUpperCase();
  const normalizedTime = drawTime.trim().replace(/\./g, ":");
  return normalizedPool === "toto_macau" && normalizedVariant === "4D" && normalizedTime === "00:00";
};

const resolveTogelDateLabel = ({ poolCode, variantLabel, drawTime } = {}) => {
  try {
    const targetDate = new Date();
    if (shouldUsePreviousDateForTogel(poolCode, variantLabel, drawTime)) {
      targetDate.setDate(targetDate.getDate() - 1);
    }
    return targetDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Failed to resolve togel date label:", error);
    return "";
  }
};

const layoutTeamName = (
  ctx,
  text,
  {
    maxWidth,
    maxFontSize,
    minFontSize = 18,
    fontWeight = 700,
    fontFamily = '"Poppins", sans-serif',
  }
) => {
  const safeWidth = Math.max(0, maxWidth);
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) {
    return {
      fontSize: minFontSize,
      lines: ["Tim TBD"],
    };
  }

  const targetMax = Math.max(minFontSize, Math.round(maxFontSize));
  const targetMin = Math.max(8, Math.round(minFontSize));

  for (let size = targetMax; size >= targetMin; size -= 1) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;

    if (safeWidth <= 0) {
      return {
        fontSize: size,
        lines: [words.join(" ")],
      };
    }

    const joined = words.join(" ");
    const singleLineWidth = ctx.measureText(joined).width;
    if (singleLineWidth <= safeWidth) {
      return {
        fontSize: size,
        lines: [joined],
      };
    }

    if (words.length === 1) {
      // Single long word, keep shrinking until it fits.
      const soloWidth = ctx.measureText(words[0]).width;
      if (soloWidth <= safeWidth || size === targetMin) {
        return {
          fontSize: size,
          lines: [words[0]],
        };
      }
      continue;
    }

    let bestLines = null;
    let bestScore = Infinity;
    for (let split = 1; split < words.length; split += 1) {
      const lineA = words.slice(0, split).join(" ");
      const lineB = words.slice(split).join(" ");
      const widthA = ctx.measureText(lineA).width;
      const widthB = ctx.measureText(lineB).width;
      if (widthA > safeWidth || widthB > safeWidth) {
        continue;
      }
      const score = Math.max(widthA, widthB);
      if (score < bestScore) {
        bestScore = score;
        bestLines = [lineA, lineB];
      }
    }
    if (bestLines) {
      return {
        fontSize: size,
        lines: bestLines,
      };
    }
  }

  ctx.font = `${fontWeight} ${targetMin}px ${fontFamily}`;
  return {
    fontSize: targetMin,
    lines: [words.join(" ")],
  };
};

const drawBackground = (ctx, image) => {
  const { width, height } = ctx.canvas;
  if (image) {
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = "#000000ff";
    ctx.fillRect(0, 0, width, height);
  }
};

const drawOverlay = (ctx) => {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
};

const drawBrandLogo = (ctx, image, palette = DEFAULT_BRAND_PALETTE) => {
  const desiredWidth = 450;
  const desiredHeight = 160;
  const horizontalPadding = 80;
  const slotWidth = Math.min(desiredWidth, ctx.canvas.width - horizontalPadding * 2);
  const slotHeight = Math.min(desiredHeight, ctx.canvas.height * 0.25);
  const x = ctx.canvas.width / 2 - slotWidth / 2;
  const y = 36;
  const radius = Math.min(36, slotHeight / 2);

  if (image) {
    ctx.save();
    const containScale = Math.min(slotWidth / image.width, slotHeight / image.height);
    const renderWidth = image.width * containScale;
    const renderHeight = image.height * containScale;
    const renderX = x + (slotWidth - renderWidth) / 2;
    const renderY = y + (slotHeight - renderHeight) / 2;
    ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();
  } else {
    ctx.save();
    drawRoundedRectPath(ctx, x, y, slotWidth, slotHeight, radius);
    const placeholderGradient = ctx.createLinearGradient(x, y, x, y + slotHeight);
    placeholderGradient.addColorStop(0, palette?.headerStart ?? PLACEHOLDER_FILL_COLOR);
    placeholderGradient.addColorStop(1, palette?.headerEnd ?? PLACEHOLDER_BORDER_COLOR);
    ctx.fillStyle = placeholderGradient;
    ctx.fill();
    ctx.strokeStyle = palette?.accent ?? PLACEHOLDER_BORDER_COLOR;
    ctx.lineWidth = Math.max(2, slotHeight * 0.015);
    ctx.stroke();

    ctx.fillStyle = PLACEHOLDER_TEXT_COLOR;
    ctx.font = `600 ${Math.round(slotHeight * 0.24)}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Logo Brand", x + slotWidth / 2, y + slotHeight / 2);
    ctx.restore();
  }

  return y + slotHeight;
};

const drawImageCover = (ctx, image, x, y, width, height, options = {}) => {
  if (!image) return;
  const sourceWidth = Math.max(1, image.naturalWidth || image.width || 0);
  const sourceHeight = Math.max(1, image.naturalHeight || image.height || 0);
  const baseScale = Math.max(width / sourceWidth, height / sourceHeight);
  const scaleInput = Number(options.scale);
  const scaleFactor = Number.isFinite(scaleInput) ? clamp(scaleInput, 0.5, 2) : 1;
  const drawWidth = sourceWidth * baseScale * scaleFactor;
  const drawHeight = sourceHeight * baseScale * scaleFactor;
  const offsetRangeX = Math.max(width, drawWidth) * 0.25;
  const offsetRangeY = Math.max(height, drawHeight) * 0.25;
  const offsetXInput = Number(options.offsetX);
  const offsetYInput = Number(options.offsetY);
  const shouldFlipHorizontal = Boolean(options.flipHorizontal);
  const effectiveOffsetX = Number.isFinite(offsetXInput) ? clamp(offsetXInput, -1, 1) : 0;
  const effectiveOffsetY = Number.isFinite(offsetYInput) ? clamp(offsetYInput, -1, 1) : 0;
  const appliedOffsetX = shouldFlipHorizontal ? -effectiveOffsetX : effectiveOffsetX;
  const renderX = x + (width - drawWidth) / 2 + appliedOffsetX * offsetRangeX;
  const renderY = y + (height - drawHeight) / 2 + effectiveOffsetY * offsetRangeY;

  if (shouldFlipHorizontal) {
    ctx.save();
    ctx.translate(renderX + drawWidth / 2, renderY + drawHeight / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(
      image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
    return;
  }

  ctx.drawImage(image, renderX, renderY, drawWidth, drawHeight);
};

const drawPlayerPortraitCard = (
  ctx,
  image,
  {
    x = 0,
    y = 0,
    width,
    height,
    palette = DEFAULT_BRAND_PALETTE,
    label = "",
    adjustments = {},
    align = "left",
    showPlaceholderLabel = true,
  } = {}
) => {
  if (!width || !height) {
    return;
  }
  const radius = 0;
  const shadowBlur = Math.max(18, width * 0.15);
  const shadowOffsetY = Math.max(8, height * 0.05);
  const gradientStart = ensureSubduedGradientColor(
    palette?.headerStart,
    DEFAULT_BRAND_PALETTE.headerStart,
    0.35
  );
  const gradientEnd = ensureSubduedGradientColor(
    palette?.footerEnd,
    DEFAULT_BRAND_PALETTE.footerEnd,
    0.35
  );

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetY = shadowOffsetY;
  drawRoundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, x, y, width, height, radius);
  ctx.clip();
  if (image) {
    drawImageCover(ctx, image, x, y, width, height, {
      scale: clamp(adjustments.scale ?? 1, 0.6, 1.6),
      offsetX: clamp(adjustments.offsetX ?? 0, -1.1, 1.1),
      offsetY: clamp(adjustments.offsetY ?? 0, -1.1, 1.1),
      flipHorizontal: Boolean(adjustments.flip),
    });
  } else {
    const placeholderGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    placeholderGradient.addColorStop(0, "#111827");
    placeholderGradient.addColorStop(1, "#1f2937");
    ctx.fillStyle = placeholderGradient;
    ctx.fillRect(x, y, width, height);
  }
  const overlayGradient = ctx.createLinearGradient(x, y + height * 0.45, x, y + height);
  overlayGradient.addColorStop(0, "rgba(15, 23, 42, 0)");
  overlayGradient.addColorStop(0.55, "rgba(15, 23, 42, 0.45)");
  overlayGradient.addColorStop(1, "rgba(15, 23, 42, 0.9)");
  ctx.fillStyle = overlayGradient;
  ctx.fillRect(x, y, width, height);
  ctx.restore();

  const safeLabel = typeof label === "string" ? label.trim() : "";
  if (showPlaceholderLabel) {
    const placeholderLabel =
      align === "right"
        ? "FOTO PEMAIN\nTIM TAMU"
        : "FOTO PEMAIN\nTIM TUAN RUMAH";
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fontSize = Math.round(Math.min(42, width * 0.17));
    ctx.font = `800 ${fontSize}px "Poppins", sans-serif`;
    ctx.fillStyle = "#f8fafc";
    ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    const finalLabel = (safeLabel || placeholderLabel).toUpperCase();
    const lines = finalLabel.split(/\n+/);
    const lineHeight = fontSize * 1.1;
    const totalHeight = lineHeight * lines.length;
    const startY = y + height / 2 - (totalHeight - lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, x + width / 2, startY + index * lineHeight);
    });
    ctx.restore();
  }

  if (!image) {
    ctx.save();
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    const borderGradient = ctx.createLinearGradient(
      align === "right" ? x + width : x,
      y,
      align === "right" ? x : x + width,
      y + height
    );
    borderGradient.addColorStop(0, gradientStart);
    borderGradient.addColorStop(1, gradientEnd);
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = Math.max(3, width * 0.015);
    ctx.stroke();
    ctx.restore();
  }
};

const drawVsBadge = (ctx, centerX, centerY, radius, detailScale = 1) => {
  const r = Math.max(radius, 32);
  const strokeWidth = Math.max(2, 3 * detailScale);

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.5)";
  ctx.shadowBlur = Math.max(18, 32 * detailScale);
  ctx.shadowOffsetY = Math.max(6, 10 * detailScale);
  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
  ctx.clip();

  // Left navy half
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, r, Math.PI / 2, (3 * Math.PI) / 2, true);
  ctx.closePath();
  const leftGradient = ctx.createLinearGradient(
    centerX - r,
    centerY - r,
    centerX,
    centerY + r
  );
  leftGradient.addColorStop(0, "#1d4ed8");
  leftGradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = leftGradient;
  ctx.fill();

  // Right crimson half
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, r, (3 * Math.PI) / 2, Math.PI / 2);
  ctx.closePath();
  const rightGradient = ctx.createLinearGradient(
    centerX,
    centerY - r,
    centerX + r,
    centerY + r
  );
  rightGradient.addColorStop(0, "#dc2626");
  rightGradient.addColorStop(1, "#7f1d1d");
  ctx.fillStyle = rightGradient;
  ctx.fill();

  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.stroke();

  ctx.restore();

  // Outer ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
  const borderGradient = ctx.createLinearGradient(
    centerX,
    centerY - r,
    centerX,
    centerY + r
  );
  borderGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  borderGradient.addColorStop(1, "rgba(148, 163, 184, 0.3)");
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  ctx.restore();

  // Stylized text
  ctx.save();
  ctx.translate(centerX, centerY);
  const skew = -0.2;
  ctx.transform(1, 0, skew, 1, 0, 0);
  const fontSize = Math.round(r * 1.02);
  ctx.font = `900 ${fontSize}px Poppins`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(13, 31, 65, 0.6)";
  ctx.fillText("VS", r * 0.08, r * 0.08);
  ctx.fillStyle = "#f8fafc";
  ctx.fillText("VS", 0, 0);
  ctx.restore();
};

function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const PATH2D_SUPPORTED = typeof Path2D === "function";
const ROUNDED_RECT_PATH_CACHE_LIMIT = 64;
const roundedRectPathCache = new Map();

const getRoundedRectPath = (width, height, radius) => {
  if (!PATH2D_SUPPORTED) return null;
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  const key = `${width.toFixed(2)}|${height.toFixed(2)}|${safeRadius.toFixed(2)}`;
  if (roundedRectPathCache.has(key)) {
    return roundedRectPathCache.get(key);
  }
  const path = new Path2D();
  path.moveTo(safeRadius, 0);
  path.lineTo(width - safeRadius, 0);
  path.quadraticCurveTo(width, 0, width, safeRadius);
  path.lineTo(width, height - safeRadius);
  path.quadraticCurveTo(width, height, width - safeRadius, height);
  path.lineTo(safeRadius, height);
  path.quadraticCurveTo(0, height, 0, height - safeRadius);
  path.lineTo(0, safeRadius);
  path.quadraticCurveTo(0, 0, safeRadius, 0);
  path.closePath();
  if (roundedRectPathCache.size >= ROUNDED_RECT_PATH_CACHE_LIMIT) {
    const oldestKey = roundedRectPathCache.keys().next().value;
    roundedRectPathCache.delete(oldestKey);
  }
  roundedRectPathCache.set(key, path);
  return path;
};

const fillRoundedRectCached = (ctx, x, y, width, height, radius) => {
  const path = getRoundedRectPath(width, height, radius);
  if (!path) {
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.fill();
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.fill(path);
  ctx.restore();
};

const drawEsportsGameSlot = (ctx, x, y, size, { logoImage, label } = {}) => {
  const clampedSize = Math.max(48, size);
  const badgeRadius = clampedSize * 0.32;
  ctx.save();

  drawRoundedRectPath(ctx, x, y, clampedSize, clampedSize, badgeRadius);
  const badgeGradient = ctx.createLinearGradient(x, y, x + clampedSize, y + clampedSize);
  badgeGradient.addColorStop(0, "#0d1829");
  badgeGradient.addColorStop(1, "#050912");
  ctx.fillStyle = badgeGradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
  ctx.lineWidth = Math.max(2, clampedSize * 0.05);
  ctx.stroke();

  ctx.save();
  const glossGradient = ctx.createLinearGradient(x, y, x, y + clampedSize);
  glossGradient.addColorStop(0, "rgba(255,255,255,0.1)");
  glossGradient.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = glossGradient;
  drawRoundedRectPath(ctx, x, y, clampedSize, clampedSize, badgeRadius);
  ctx.fill();
  ctx.restore();

  if (logoImage) {
    const padding = clampedSize * 0.14;
    const maxWidth = clampedSize - padding * 2;
    const maxHeight = clampedSize - padding * 2;
    const imageWidth = logoImage.width || maxWidth;
    const imageHeight = logoImage.height || maxHeight;
    const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const drawX = x + (clampedSize - drawWidth) / 2;
    const drawY = y + (clampedSize - drawHeight) / 2;
    ctx.drawImage(logoImage, drawX, drawY, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = "rgba(226, 232, 240, 0.9)";
    ctx.font = `600 ${Math.round(clampedSize * 0.35)}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = (label || "GAME").toUpperCase();
    ctx.fillText(text, x + clampedSize / 2, y + clampedSize / 2);
  }
  ctx.restore();
};

const drawHeader = (
  ctx,
  title,
  topOffset = 70,
  palette = DEFAULT_BRAND_PALETTE,
  options = {}
) => {
  ctx.save();
  const headerHeight = 88;
  const headerY = topOffset;

  const barGradient = ctx.createLinearGradient(
    0,
    headerY,
    ctx.canvas.width,
    headerY + headerHeight
  );

  const titleText =
    (title && title.trim().toUpperCase()) || "JUDUL LIGA / KOMPETISI";
  const maxTextWidth = ctx.canvas.width - 140;

  const gradientStart = ensureSubduedGradientColor(palette?.headerStart, "#6366f1");
  const gradientEnd = ensureSubduedGradientColor(palette?.headerEnd, "#ec4899");

  const titleColor = "#f8fafc";
  const shadowColor = "rgba(15, 23, 42, 0.55)";

  barGradient.addColorStop(0, gradientStart);
  barGradient.addColorStop(1, gradientEnd);
  ctx.fillStyle = barGradient;
  ctx.fillRect(0, headerY, ctx.canvas.width, headerHeight);

  const glossGradient = ctx.createLinearGradient(0, headerY, 0, headerY + headerHeight);
  glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.24)");
  glossGradient.addColorStop(0.55, "rgba(255, 255, 255, 0.08)");
  glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.04)");
  ctx.fillStyle = glossGradient;
  ctx.fillRect(0, headerY, ctx.canvas.width, headerHeight);

  const headerLogoImage = options?.headerLogoImage || null;
  const leftLogoImage = options?.leftLogoImage || null;
  const showLeagueLogoSlot = Boolean(options?.showLeagueLogoSlot);
  if (headerLogoImage && !leftLogoImage) {
    const paddingX = 80;
    const paddingY = 12;
    const maxWidth = Math.max(120, ctx.canvas.width - paddingX * 2);
    const maxHeight = Math.max(32, headerHeight - paddingY * 2);
    const imageWidth = headerLogoImage.width || maxWidth;
    const imageHeight = headerLogoImage.height || maxHeight;
    const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight, 1);
    const renderWidth = imageWidth * scale;
    const renderHeight = imageHeight * scale;
    const renderX = ctx.canvas.width / 2 - renderWidth / 2;
    const renderY = headerY + (headerHeight - renderHeight) / 2;

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
    ctx.drawImage(headerLogoImage, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();
  } else {
    ctx.fillStyle = titleColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    applyFittedFont(ctx, titleText, {
      maxSize: 68,
      minSize: 26,
      weight: 800,
      maxWidth: maxTextWidth,
      family: '"Montserrat", sans-serif',
    });
    ctx.save();
    ctx.fillStyle = shadowColor;
    const shadowOffset = 4;
    ctx.fillText(
      titleText,
      ctx.canvas.width / 2 + shadowOffset,
      headerY + headerHeight / 2 + shadowOffset
    );
    ctx.restore();

    ctx.save();
    ctx.fillStyle = titleColor;
    ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 6;
    ctx.fillText(titleText, ctx.canvas.width / 2, headerY + headerHeight / 2);
    ctx.restore();
  }

  const shouldRenderLeagueSlot = showLeagueLogoSlot || Boolean(leftLogoImage);

  if (shouldRenderLeagueSlot) {
    const slotWidth = 280;
    const slotHeight = 170;
    const slotRadius = 16;
    const slotX = Math.max(19, ctx.canvas.width * 0.015);
    const slotY = Math.max(20, headerY - slotHeight - 20);

    if (leftLogoImage) {
      ctx.save();
      drawRoundedRectPath(ctx, slotX, slotY, slotWidth, slotHeight, slotRadius);
      ctx.clip();

      const naturalWidth = Math.max(
        1,
        leftLogoImage.naturalWidth || leftLogoImage.width || slotWidth
      );
      const naturalHeight = Math.max(
        1,
        leftLogoImage.naturalHeight || leftLogoImage.height || slotHeight
      );
      const containScale = Math.min(slotWidth / naturalWidth, slotHeight / naturalHeight, 1);
      const renderWidth = naturalWidth * containScale;
      const renderHeight = naturalHeight * containScale;
      const renderX = slotX + (slotWidth - renderWidth) / 2;
      const renderY = slotY + (slotHeight - renderHeight) / 2;
      ctx.drawImage(leftLogoImage, renderX, renderY, renderWidth, renderHeight);

      ctx.restore();
    } else if (showLeagueLogoSlot) {
      ctx.save();
      drawRoundedRectPath(ctx, slotX, slotY, slotWidth, slotHeight, slotRadius);
      ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(248, 250, 252, 0.9)";
      ctx.font = `700 ${Math.round(slotHeight * 0.16)}px "Poppins", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const placeholderText = "LOGO LIGA";
      ctx.fillText(placeholderText, slotX + slotWidth / 2, slotY + slotHeight / 2);
      ctx.restore();
    }
  }

  ctx.restore();
  return headerY + headerHeight;
};

const drawMatches = (
  ctx,
  matches,
  startY = 220,
  palette = DEFAULT_BRAND_PALETTE,
  options = {}
) => {
  ctx.save();
  const paletteSafe = palette ?? DEFAULT_BRAND_PALETTE;
  const headerStart = paletteSafe?.headerStart ?? DEFAULT_BRAND_PALETTE.headerStart;
  const headerEnd = paletteSafe?.headerEnd ?? DEFAULT_BRAND_PALETTE.headerEnd;
  const footerStart = paletteSafe?.footerStart ?? DEFAULT_BRAND_PALETTE.footerStart;
  const footerEnd = paletteSafe?.footerEnd ?? DEFAULT_BRAND_PALETTE.footerEnd;
  const dateTextColor = pickReadableTextColor(headerStart, headerEnd, { preferLight: true });
  const timeTextColor = pickReadableTextColor(footerStart, footerEnd, { preferLight: true });
  const darkerGradientColor =
    getRelativeLuminanceSafe(headerStart) <= getRelativeLuminanceSafe(headerEnd)
      ? headerStart
      : headerEnd;
  const extraBottomSpacing = clampMin(options?.extraBottomSpacing ?? 0, 0);
  const customCenterLabel = options?.customCenterLabel || null;
  const brandDisplayName = options?.brandDisplayName || "";
  const FOOTER_HEIGHT = 110;
  const FOOTER_SPACING = 60 + extraBottomSpacing;
  const footerGuard = FOOTER_HEIGHT + FOOTER_SPACING;
  const bottomLimit = ctx.canvas.height - footerGuard;
  const isFootballMode = options?.mode === "football";
  const isFootballScheduleLayout =
    isFootballMode && (options?.activeSubMenu || "schedule") === "schedule";
  const isFootballScoresLayout =
    isFootballMode && options?.activeSubMenu === "scores";
  const matchCount = Math.max(matches.length, 1);
  const shouldApplyScorePadding =
    isFootballScoresLayout && matchCount <= 3;
  const layoutPaddingY = shouldApplyScorePadding
    ? Math.max(32, ctx.canvas.height * 0.035)
    : 0;
  const paddedTop = startY + layoutPaddingY;
  const paddedBottom = bottomLimit - layoutPaddingY;
  const availableHeight = Math.max(paddedBottom - paddedTop, 240);

  if (isFootballScheduleLayout || isFootballScoresLayout) {
    const baseRowHeight = 118;
    const baseRowGap = 22;
    const baseTotal =
      matchCount * baseRowHeight + Math.max(matchCount - 1, 0) * baseRowGap;
    const scheduleScale =
      baseTotal > availableHeight ? availableHeight / baseTotal : 1;
    const rowHeight = clampMin(baseRowHeight * scheduleScale, 76);
    const rowGap = clampMin(baseRowGap * scheduleScale, 28);
    const layoutHeight =
      matchCount * rowHeight + Math.max(matchCount - 1, 0) * rowGap;
    const verticalOffset =
      layoutHeight < availableHeight
        ? (availableHeight - layoutHeight) / 2
        : 0;
    const marginX = Math.max(56, ctx.canvas.width * 0.08);
    const badgeScale = 1.5;
    const baseCircleRadius = Math.max(rowHeight * 0.34, 34);
    const circleRadius = baseCircleRadius * badgeScale;
    const barHeight = Math.max(
      rowHeight * (customCenterLabel ? 0.75 : 0.6),
      customCenterLabel ? 90 : 50
    );
    const textGap = customCenterLabel
      ? Math.max(32, 40 * scheduleScale)
      : Math.max(18, 28 * scheduleScale);
    const topMarginSpace = Math.max((rowHeight - barHeight) / 2, 0);
    const maxDateCapsuleHeight = Math.max(
      14,
      topMarginSpace + Math.min(4, topMarginSpace * 0.2)
    );
    const scoreDateCapsuleHeight = isFootballScoresLayout
      ? Math.min(Math.max(20, 26 * scheduleScale), maxDateCapsuleHeight)
      : 0;

    const drawTeamBadge = (image, centerX, centerY, radius, fallbackLetter) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.clip();
      if (image) {
        drawImageCover(
          ctx,
          image,
          centerX - radius,
          centerY - radius,
          radius * 2,
          radius * 2,
          { scale: 0.9 }
        );
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.fillStyle = "#f8fafc";
        ctx.font = `700 ${Math.round(radius * 0.85)}px "Poppins", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(fallbackLetter, centerX, centerY);
      }
      ctx.restore();
      ctx.save();
      ctx.lineWidth = Math.max(4, radius * 0.2);
      ctx.strokeStyle = darkerGradientColor || "#ef4444";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawTeamBlock = (label, fallback, areaX, areaWidth, centerY, { textCenterBias = 0 } = {}) => {
      if (areaWidth <= 0) return;
      const baseText = (label && label.trim()) || fallback;
      const upper = baseText.toUpperCase();
      const maxFontSizeBase = customCenterLabel
        ? label ? 44 : 32
        : 28;
      const layout = layoutTeamName(ctx, upper, {
        maxWidth: areaWidth,
        maxFontSize: Math.max(maxFontSizeBase * scheduleScale, 16),
        minFontSize: customCenterLabel ? 18 : 12,
        fontWeight: customCenterLabel ? 800 : 700,
        fontFamily: '"Poppins", sans-serif',
      });
      const lines =
        layout.lines && layout.lines.length ? layout.lines : [upper];
      const lineHeight = layout.fontSize * (lines.length > 1 ? 1.05 : 1);
      const firstLineY = centerY - ((lines.length - 1) * lineHeight) / 2;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      ctx.font = `700 ${Math.round(layout.fontSize)}px "Poppins", sans-serif`;
      lines.forEach((line, idx) => {
        ctx.fillText(line, areaX + areaWidth / 2 + textCenterBias, firstLineY + idx * lineHeight);
      });
      ctx.restore();
    };

    matches.forEach((match, index) => {
      const rowTop =
        paddedTop + verticalOffset + index * (rowHeight + rowGap);
      const centerY = rowTop + rowHeight / 2;
      const leftCircleCenterX = marginX + circleRadius;
      const rightCircleCenterX = ctx.canvas.width - marginX - circleRadius;
      const barX = leftCircleCenterX;
      const barWidth = rightCircleCenterX - leftCircleCenterX;
      const barY = centerY - barHeight / 2;
      const targetCenterWidth = customCenterLabel
        ? 120 * scheduleScale
        : 200 * scheduleScale;
      const minCenterWidth = customCenterLabel ? 100 * scheduleScale : 160 * scheduleScale;
      const maxCenterWidth = customCenterLabel ? 140 * scheduleScale : 240 * scheduleScale;
      const centerWidth = clamp(targetCenterWidth, minCenterWidth, maxCenterWidth);
      const centerX = ctx.canvas.width / 2 - centerWidth / 2;
      const baseInset = customCenterLabel ? 0.3 : 0.12;
      const centerTopInset = Math.max(centerWidth * baseInset, 18 * scheduleScale);
      const centerBottom = barY + barHeight;
      const shouldRenderPlayerCards = Boolean(customCenterLabel);
      if (shouldRenderPlayerCards) {
        const baseCardHeight = rowHeight * 3.2;
        const playerCardHeight = clamp(
          baseCardHeight,
          280,
          Math.min(ctx.canvas.height * 0.58, 520)
        );
        const homePlayerCardHeight = Math.min(playerCardHeight + 120, ctx.canvas.height * 0.7);
        const awayPlayerCardHeight = Math.min(playerCardHeight + 120, ctx.canvas.height * 0.7);
        const basePlayerCardWidth = clamp(
          playerCardHeight * 0.62,
          220,
          Math.min(ctx.canvas.width * 0.32, 380)
        );
        const homePlayerCardWidth = clamp(
          basePlayerCardWidth * 1.75,
          basePlayerCardWidth,
          Math.min(ctx.canvas.width * 0.64, basePlayerCardWidth + 420)
        );
        const awayPlayerCardWidth = clamp(
          basePlayerCardWidth * 1.75,
          basePlayerCardWidth,
          Math.min(ctx.canvas.width * 0.64, basePlayerCardWidth + 420)
        );
        const desiredCardY = centerY - playerCardHeight * 0.75;
        const minCardY = Math.max(80, paddedTop - playerCardHeight * 0.4);
        const cardBottomGuard = FOOTER_HEIGHT + FOOTER_SPACING + 36;
        const maxCardY = Math.max(
          minCardY,
          ctx.canvas.height - cardBottomGuard - playerCardHeight
        );
        const playerCardY = clamp(desiredCardY, minCardY, maxCardY);
        const cardMarginX = Math.max(24, ctx.canvas.width * 0.035);
        const homeCardHorizontalOffset = Math.max(homePlayerCardWidth * 0.18, 70);
        const homeCardX = cardMarginX + homeCardHorizontalOffset;
        const awayCardHorizontalOffset = Math.max(awayPlayerCardWidth * 0.18, 70);
        const awayCardX =
          ctx.canvas.width - cardMarginX - awayPlayerCardWidth - awayCardHorizontalOffset;
        const homeCardLift = Math.max(playerCardHeight * 0.2, 80);
        const additionalHomeOffset = Math.max(playerCardHeight * 0.25, 110);
        const finalHomeLift = Math.max(playerCardHeight * 0.15, 80);
        const homeMinCardY = Math.max(20, paddedTop - homePlayerCardHeight * 0.8);
        const homeCardY = Math.max(
          homeMinCardY,
          playerCardY -
            Math.max(playerCardHeight * 0.55, 120) -
            homeCardLift -
            additionalHomeOffset -
            finalHomeLift
        );
        drawPlayerPortraitCard(ctx, match.homePlayerImage, {
          x: homeCardX,
          y: homeCardY,
          width: homePlayerCardWidth,
          height: homePlayerCardHeight,
          palette: paletteSafe,
          label: "",
          adjustments: {
            scale: match.teamHomePlayerScale,
            offsetX: match.teamHomePlayerOffsetX,
            offsetY: match.teamHomePlayerOffsetY,
            flip: match.teamHomePlayerFlip,
          },
          showPlaceholderLabel: !match.homePlayerImage,
        });
        const awayCardDrop = Math.max(awayPlayerCardHeight * 0.2, 80);
        const additionalAwayOffset = Math.max(awayPlayerCardHeight * 0.25, 110);
        const finalAwayDrop = Math.max(awayPlayerCardHeight * 0.15, 80);
        const awayMinCardY = Math.max(20, paddedTop - awayPlayerCardHeight * 0.8);
        const awayCardY = Math.max(
          awayMinCardY,
          playerCardY -
            Math.max(playerCardHeight * 0.55, 120) -
            awayCardDrop -
            additionalAwayOffset -
            finalAwayDrop
        );
        drawPlayerPortraitCard(ctx, match.awayPlayerImage, {
          x: awayCardX,
          y: awayCardY,
          width: awayPlayerCardWidth,
          height: awayPlayerCardHeight,
          palette: paletteSafe,
          label: "",
          adjustments: {
            scale: match.teamAwayPlayerScale,
            offsetX: match.teamAwayPlayerOffsetX,
            offsetY: match.teamAwayPlayerOffsetY,
            flip: match.teamAwayPlayerFlip,
          },
          align: "right",
          showPlaceholderLabel: !match.awayPlayerImage,
        });
      }

      if (customCenterLabel) {
        const pillHeight = Math.max(34, 42 * scheduleScale);
        const pillPaddingX = Math.max(24, 32 * scheduleScale);
        const dateLabelRaw = formatBigMatchDateLabel(match.date) || "";
        const timeLabelRaw = match.time ? formatTime(match.time) : "";
        const pillLabel = [dateLabelRaw.toUpperCase(), timeLabelRaw.toUpperCase()]
          .filter(Boolean)
          .join(" • ") || "JADWAL TBD";
        const maxPillWidth = Math.min(ctx.canvas.width - marginX, centerWidth + 480);
        ctx.save();
        ctx.font = `700 ${Math.round(Math.max(20, 28 * scheduleScale))}px "Poppins", sans-serif`;
        const textWidth = ctx.measureText(pillLabel).width;
        const basePillWidth = clamp(textWidth + pillPaddingX * 2, 380, maxPillWidth);
        const trapezoidInset = Math.max(pillHeight * 0.13, 20);
        const pillWidth = Math.min(maxPillWidth, basePillWidth + trapezoidInset * 3);
        const pillX = ctx.canvas.width / 2 - pillWidth / 2;
        const pillY = barY - pillHeight;
        ctx.beginPath();
        ctx.moveTo(pillX, pillY + pillHeight);
        ctx.lineTo(pillX + trapezoidInset, pillY);
        ctx.lineTo(pillX + pillWidth - trapezoidInset, pillY);
        ctx.lineTo(pillX + pillWidth, pillY + pillHeight);
        ctx.closePath();
        const pillGradient = ctx.createLinearGradient(pillX, pillY, pillX + pillWidth, pillY + pillHeight);
        const trapezoidGradientStart = ensureSubduedGradientColor(
          headerStart,
          DEFAULT_BRAND_PALETTE.headerStart,
          0.2
        );
        const trapezoidGradientEnd = ensureSubduedGradientColor(
          headerEnd,
          DEFAULT_BRAND_PALETTE.headerEnd,
          0.2
        );
        pillGradient.addColorStop(0, trapezoidGradientStart);
        pillGradient.addColorStop(1, trapezoidGradientEnd);
        ctx.fillStyle = pillGradient;
        ctx.fill();
        const textCenterX = pillX + pillWidth / 2;
        const textCenterY = pillY + pillHeight / 2 + 1;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
        ctx.fillText(pillLabel, textCenterX, textCenterY + 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(pillLabel, textCenterX, textCenterY);
        ctx.restore();

        const ctaPrefix = "Dukung tim jagoanmu dengan pasang taruhan di ";
        const brandNameForCta = (brandDisplayName || "Golbos").trim() || "Golbos";
        const primaryTextColor = "#ffffff";
        const fallbackTextColor = "#f2f2f2";
        const letterSpacing = clamp(2 * scheduleScale, 1, 3);
        const estimatedScheduleFontSize = Math.max(28, 36 * scheduleScale);
        const baseCtaFontSize = clamp(
          estimatedScheduleFontSize * 0.75,
          estimatedScheduleFontSize * 0.7,
          estimatedScheduleFontSize * 0.8
        );
        const buildCtaSegments = (fontSize) => [
          {
            text: ctaPrefix,
            font: `400 ${Math.round(fontSize)}px "Montserrat", "Poppins", sans-serif`,
          },
          {
            text: brandNameForCta,
            font: `500 ${Math.round(fontSize)}px "Montserrat", "Poppins", sans-serif`,
          },
        ];
        const measureSegmentedWidth = (segments) => {
          let width = 0;
          let totalChars = 0;
          segments.forEach((segment) => {
            if (!segment?.text) return;
            ctx.font = segment.font;
            const chars = segment.text.split("");
            totalChars += chars.length;
            chars.forEach((char) => {
              width += ctx.measureText(char).width;
            });
          });
          const spacingCount = Math.max(totalChars - 1, 0);
          return width + spacingCount * letterSpacing;
        };
        const baseSegments = buildCtaSegments(baseCtaFontSize);
        const maxCtaWidth = ctx.canvas.width - marginX * 2;
        const baseWidth = measureSegmentedWidth(baseSegments);
        const shrinkFactor =
          baseWidth > maxCtaWidth ? clamp(maxCtaWidth / baseWidth, 0.9, 1) : 1;
        const finalFontSize = baseCtaFontSize * shrinkFactor;
        const ctaSegments = buildCtaSegments(finalFontSize);
        const ctaTextWidth = measureSegmentedWidth(ctaSegments);
        const ctaY = barY + barHeight + Math.max(24, 36 * scheduleScale);
        const startX = ctx.canvas.width / 2 - ctaTextWidth / 2;
        const drawSegmentedText = (segments, draw) => {
          let cursorX = startX;
          segments.forEach((segment, segmentIndex) => {
            if (!segment?.text) return;
            ctx.font = segment.font;
            const chars = segment.text.split("");
            chars.forEach((char, charIndex) => {
              draw(char, cursorX, ctaY);
              cursorX += ctx.measureText(char).width;
              const hasMore =
                charIndex < chars.length - 1 ||
                segmentIndex < segments.length - 1;
              if (hasMore) {
                cursorX += letterSpacing;
              }
            });
          });
        };
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = clamp(2.5 * scheduleScale, 2, 3);
        ctx.shadowOffsetY = 1;
        ctx.shadowOffsetX = 0;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 1;
        drawSegmentedText(ctaSegments, (char, x, y) => ctx.strokeText(char, x, y));
        ctx.fillStyle = primaryTextColor || fallbackTextColor;
        drawSegmentedText(ctaSegments, (char, x, y) => ctx.fillText(char, x, y));
        ctx.restore();
      }

      if (isFootballScoresLayout && scoreDateCapsuleHeight > 0) {
        const scoreDateLabel = (formatDate(match.date) || "").toUpperCase();
        if (scoreDateLabel) {
          const dateFontSize = Math.max(18, 20 * scheduleScale);
          const dateHeight = scoreDateCapsuleHeight;
          const dateTopInset = Math.max(centerTopInset * 0.45, 12 * scheduleScale);
          const bottomLeft = centerX - centerTopInset;
          const bottomRight = centerX + centerWidth + centerTopInset;
          const topLeft = bottomLeft + dateTopInset;
          const topRight = bottomRight - dateTopInset;
          const bottomY = barY + Math.max(0.5, scheduleScale * 0.6);
          const topY = bottomY - dateHeight;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(bottomLeft, bottomY);
          ctx.lineTo(bottomRight, bottomY);
          ctx.lineTo(topRight, topY);
          ctx.lineTo(topLeft, topY);
          ctx.closePath();
          const dateGradient = ctx.createLinearGradient(
            bottomLeft,
            bottomY,
            bottomRight,
            topY
          );
          dateGradient.addColorStop(
            0,
            ensureSubduedGradientColor(
              paletteSafe?.footerStart,
              DEFAULT_BRAND_PALETTE.footerStart,
              0.45
            )
          );
          dateGradient.addColorStop(
            0.6,
            ensureSubduedGradientColor(
              paletteSafe?.headerEnd,
              DEFAULT_BRAND_PALETTE.headerEnd,
              0.35
            )
          );
          dateGradient.addColorStop(
            1,
            ensureSubduedGradientColor(
              paletteSafe?.headerStart,
              DEFAULT_BRAND_PALETTE.headerStart,
              0.35
            )
          );
          ctx.fillStyle = dateGradient;
          ctx.fill();
          ctx.fillStyle = "#f8fafc";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `700 ${Math.round(dateFontSize)}px "Poppins", sans-serif`;
          const textCenterX = (topLeft + topRight) / 2;
          const textCenterY = topY + dateHeight / 2;
          ctx.fillText(scoreDateLabel, textCenterX, textCenterY);
          ctx.restore();
        }
      }
      ctx.save();
      drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barHeight / 2);
      ctx.fillStyle = "rgba(248, 250, 252, 0.96)";
      ctx.fill();
      ctx.strokeStyle = darkerGradientColor || "#ef4444";
      ctx.lineWidth = Math.max(4, barHeight * 0.06);
      ctx.stroke();
      ctx.restore();

      const centerGradient = ctx.createLinearGradient(
        centerX,
        barY,
        centerX + centerWidth,
        centerBottom
      );
      const trapezoidStartColor = ensureSubduedGradientColor(
        headerStart,
        DEFAULT_BRAND_PALETTE.headerStart
      );
      const trapezoidMidColor = ensureSubduedGradientColor(
        headerEnd,
        DEFAULT_BRAND_PALETTE.headerEnd
      );
      const trapezoidEndColor = ensureSubduedGradientColor(
        paletteSafe?.footerStart ?? DEFAULT_BRAND_PALETTE.footerStart,
        DEFAULT_BRAND_PALETTE.footerStart,
        0.45
      );
      centerGradient.addColorStop(0, trapezoidStartColor);
      centerGradient.addColorStop(0.6, trapezoidMidColor);
      centerGradient.addColorStop(1, trapezoidEndColor);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerBottom);
      ctx.lineTo(centerX + centerWidth, centerBottom);
      ctx.lineTo(centerX + centerWidth + centerTopInset, barY);
      ctx.lineTo(centerX - centerTopInset, barY);
      ctx.closePath();
      ctx.fillStyle = centerGradient;
      ctx.fill();
      ctx.restore();

      const fallbackScore = (value) => {
        if (typeof value === "number" && Number.isFinite(value)) {
          return value;
        }
        if (value === null || value === undefined || value === "") {
          return 0;
        }
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : 0;
      };
      let dateLabel = isFootballScoresLayout
        ? `${fallbackScore(match.scoreHome)} - ${fallbackScore(match.scoreAway)}`
        : (formatDate(match.date) || "JADWAL TBD").toUpperCase();
      let timeLabel = isFootballScoresLayout
        ? ""
        : (match.time ? formatTime(match.time) : "WAKTU TBD").toUpperCase();
      if (customCenterLabel) {
        dateLabel = (customCenterLabel.title || customCenterLabel.text || "VS").toUpperCase();
        timeLabel = customCenterLabel.subtitle
          ? customCenterLabel.subtitle.toUpperCase()
          : "";
      }
      const dateFont = Math.max(
        18,
        (isFootballScoresLayout ? 40 : customCenterLabel ? 72 : 24) * scheduleScale
      );
      const timeFont = Math.max(
        24,
        (isFootballScoresLayout ? 32 : 28) * scheduleScale
      );
      const centerTextX = centerX + centerWidth / 2;
      const centerBandHeight = barHeight * (isFootballScoresLayout ? 0.8 : 0.5);
      const centerBandPadding = customCenterLabel ? 0 : Math.max(8, 10 * scheduleScale);
      const dateAreaHeight = centerBandHeight * (isFootballScoresLayout ? 1 : 0.45);
      const timeAreaHeight = isFootballScoresLayout
        ? 0
        : centerBandHeight * 0.55;
      const dateCenterY = isFootballScoresLayout
        ? centerY
        : barY + centerBandPadding + dateAreaHeight / 2;
      const timeCenterY = isFootballScoresLayout
        ? null
        : barY + barHeight - centerBandPadding - timeAreaHeight / 2;
      const shouldHideTimeLabel = Boolean(customCenterLabel);
      const effectiveTimeCenterY = shouldHideTimeLabel ? null : timeCenterY;
      const dateTextCenterY = customCenterLabel
        ? barY + barHeight / 2
        : dateCenterY;
      const gradientEndY = isFootballScoresLayout || shouldHideTimeLabel
        ? dateTextCenterY + dateFont
        : effectiveTimeCenterY + timeFont;
      const textGradient = ctx.createLinearGradient(
        centerTextX,
        dateTextCenterY - dateFont,
        centerTextX,
        gradientEndY
      );
      textGradient.addColorStop(0, "#f8fafc");
      textGradient.addColorStop(0.55, "#d1d5db");
      textGradient.addColorStop(1, "#4b5563");
      const centerOffset = customCenterLabel ? 0 : 1;
      const drawBeveledText = (text, fontSize, centerY, fontWeight = 700) => {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontWeight} ${Math.round(fontSize)}px "Poppins", sans-serif`;
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = "#111827";
        ctx.fillText(text, centerTextX, centerY + centerOffset);
        ctx.restore();
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontWeight} ${Math.round(fontSize)}px "Poppins", sans-serif`;
        ctx.fillStyle = textGradient;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = Math.max(1, fontSize * 0.05);
        ctx.fillText(text, centerTextX, centerY - centerOffset);
        ctx.strokeText(text, centerTextX, centerY - centerOffset);
        ctx.restore();
      };
      drawBeveledText(dateLabel, dateFont, dateTextCenterY, customCenterLabel ? 800 : 700);
      if (!isFootballScoresLayout && timeLabel && !shouldHideTimeLabel) {
        drawBeveledText(timeLabel, timeFont, effectiveTimeCenterY, 800);
      }

      const sideTextPadding = customCenterLabel ? textGap + 14 : textGap;
      const centerGapPadding = customCenterLabel ? textGap + 18 : textGap;
      const teamTextBias = customCenterLabel ? 18 * scheduleScale : 0;

      const leftTextX = leftCircleCenterX + circleRadius + sideTextPadding;
      const leftAreaEnd = centerX - centerGapPadding;
      const leftTextWidth = Math.max(60, leftAreaEnd - leftTextX);

      const rightTextX = centerX + centerWidth + centerGapPadding;
      const rightAreaEnd = rightCircleCenterX - circleRadius - sideTextPadding;
      const rightTextWidth = Math.max(60, rightAreaEnd - rightTextX);

      drawTeamBlock(
        match.teamHome,
        "Tuan Rumah",
        leftTextX,
        leftTextWidth,
        centerY,
        { textCenterBias: customCenterLabel ? -teamTextBias : 0 }
      );
      drawTeamBlock(
        match.teamAway,
        "Tim Tamu",
        rightTextX,
        rightTextWidth,
        centerY,
        { textCenterBias: customCenterLabel ? teamTextBias : 0 }
      );

      const homeBadgeLetter =
        (match.teamHome && match.teamHome.trim()[0]?.toUpperCase()) || "H";
      const awayBadgeLetter =
        (match.teamAway && match.teamAway.trim()[0]?.toUpperCase()) || "A";

      drawTeamBadge(
        match.homeLogoImage,
        leftCircleCenterX,
        centerY,
        circleRadius,
        homeBadgeLetter
      );
      drawTeamBadge(
        match.awayLogoImage,
        rightCircleCenterX,
        centerY,
        circleRadius,
        awayBadgeLetter
      );
    });

    ctx.restore();
    return;
  }

  const baseDateHeight = 36;
  const baseCardHeight = 132;
  const baseBetweenBarAndCard = 8;
  const baseRowGap = 26;
  const baseTimeWidth = 140;

  const baseRowTotal =
    baseDateHeight + baseBetweenBarAndCard + baseCardHeight;
  const baseTotalHeight =
    matchCount * baseRowTotal +
    Math.max(matchCount - 1, 0) * baseRowGap;

  let scale =
    baseTotalHeight > availableHeight
      ? availableHeight / baseTotalHeight
      : 1;

  let dateHeight = clampMin(baseDateHeight * scale, 20);
  let cardHeight = clampMin(baseCardHeight * scale, 88);
  let betweenBarAndCard = clampMin(
    baseBetweenBarAndCard * scale,
    4
  );
  let rowGap = clampMin(baseRowGap * scale, 10);
  let rowTotal = dateHeight + betweenBarAndCard + cardHeight;
  let adjustedHeight =
    matchCount * rowTotal + Math.max(matchCount - 1, 0) * rowGap;

  if (adjustedHeight > availableHeight) {
    const overflowScale = availableHeight / adjustedHeight;
    dateHeight = clampMin(dateHeight * overflowScale, 20);
    cardHeight = clampMin(cardHeight * overflowScale, 88);
    betweenBarAndCard = clampMin(
      betweenBarAndCard * overflowScale,
      4
    );
    rowGap = clampMin(rowGap * overflowScale, 10);

    rowTotal = dateHeight + betweenBarAndCard + cardHeight;
    adjustedHeight =
      matchCount * rowTotal + Math.max(matchCount - 1, 0) * rowGap;
  }

  const detailScale = Math.min(scale, rowTotal / baseRowTotal);
  const spacingScale = Math.min(scale, rowGap / baseRowGap || scale);

    const verticalOffset =
      adjustedHeight < availableHeight
        ? (availableHeight - adjustedHeight) / 2
        : 0;

  const isEsportsMode = options?.mode === "esports";
  const isBasketballMode = options?.mode === "basketball";
  const baseInset = isEsportsMode ? 130 : 90;
  const cardWidth = ctx.canvas.width - baseInset * 2;
  const dateTimeGap = Math.max(16, 26 * spacingScale);
  const innerPaddingX = Math.max(28, 38 * detailScale);
  const innerPaddingY = Math.max(12, 20 * detailScale);
  const gapBetweenBlocks = Math.max(18, 28 * detailScale);
  const vsDiameter = Math.max(88, 112 * detailScale);
  const cardRadius = Math.max(24, 34 * detailScale);
  const nameAreaHeight = cardHeight - innerPaddingY * 2;

  const nameFontFamily = '"Poppins", sans-serif';
  const nameFontWeight = 700;

  const buildTeamNameLayout = (label, width, fallback, forcedMaxFontSize) => {
    if (width <= 0) return null;
    const baseText = (label && label.trim()) || fallback || "Tim TBD";
    const rawText = baseText.toUpperCase();
    const paddingX = Math.max(14, 22 * detailScale);
    const availableWidth = Math.max(0, width - paddingX * 2);
    const targetMaxFontSize =
      forcedMaxFontSize ?? Math.min(38 * detailScale, nameAreaHeight * 0.58);
    const layout = layoutTeamName(ctx, rawText, {
      maxWidth: availableWidth,
      maxFontSize: targetMaxFontSize,
      minFontSize: 18,
      fontWeight: nameFontWeight,
      fontFamily: nameFontFamily,
    });
    return { text: rawText, layout };
  };

  const renderTeamNameLayout = (info, x, width, centerY) => {
    if (!info || !info.layout) return;
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e2e8f0";
    ctx.textAlign = "center";
    ctx.font = `${nameFontWeight} ${Math.round(info.layout.fontSize)}px ${nameFontFamily}`;
    const lines =
      info.layout.lines && info.layout.lines.length ? info.layout.lines : [info.text];
    const lineCount = lines.length;
    const lineHeight = info.layout.fontSize * (lineCount > 1 ? 1.08 : 1);
    const firstLineY = centerY - ((lineCount - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, x + width / 2, firstLineY + index * lineHeight);
    });
    ctx.restore();
  };

  matches.forEach((match, index) => {
    let cardX = baseInset;
    let esportsSlot = null;
    if (isEsportsMode) {
      const slotSize = cardHeight;
      const slotGap = Math.max(18, 28 * detailScale);
      const combinedWidth = slotSize + slotGap + cardWidth;
      const startX = Math.max(12, (ctx.canvas.width - combinedWidth) / 2);
      esportsSlot = {
        x: startX,
        y: 0, // placeholder, set later
        size: slotSize,
      };
      cardX = startX + slotSize + slotGap;
    }

    const rowTop =
      startY + verticalOffset + index * (rowTotal + rowGap);
    const barY = rowTop;
    const cardY = barY + dateHeight + betweenBarAndCard;

    const timeWidth = Math.max(105, baseTimeWidth * scale);
    const dateLabel = formatDate(match.date);
    const timeLabel = match.time ? formatTime(match.time) : "Waktu TBD";

    const dateLeftLimit = cardX;
    const dateRightLimit = cardX + cardWidth - timeWidth - dateTimeGap;
    const availableDateWidth = Math.max(0, dateRightLimit - dateLeftLimit);
    const datePaddingX = Math.max(16, 22 * detailScale);
    const pillRadius = Math.max(dateHeight / 2, 14);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (availableDateWidth > 0) {
      const minDateWidth = Math.min(
        availableDateWidth,
        clampMin(180 * detailScale, 140)
      );
      const maxTextWidth =
        availableDateWidth > datePaddingX * 2
          ? availableDateWidth - datePaddingX * 2
          : undefined;
      applyFittedFont(ctx, dateLabel, {
        maxSize: Math.max(20, 28 * detailScale),
        minSize: 16,
        weight: 700,
        maxWidth: maxTextWidth,
      });
      const dateTextWidth = ctx.measureText(dateLabel).width;
      let dateWidth = Math.min(
        availableDateWidth,
        Math.max(minDateWidth, dateTextWidth + datePaddingX * 2)
      );
      const desiredCenter = cardX + cardWidth / 2;
      let dateX = desiredCenter - dateWidth / 2;
      if (dateX < dateLeftLimit) dateX = dateLeftLimit;
      if (dateX + dateWidth > dateRightLimit) {
        dateX = Math.max(dateLeftLimit, dateRightLimit - dateWidth);
      }
      ctx.save();
      drawRoundedRectPath(ctx, dateX, barY, dateWidth, dateHeight, pillRadius);
      const dateGradient = ctx.createLinearGradient(
        dateX,
        barY,
        dateX + dateWidth,
        barY + dateHeight
      );
      dateGradient.addColorStop(0, headerStart);
      dateGradient.addColorStop(1, headerEnd);
      ctx.fillStyle = dateGradient;
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = dateTextColor;
      if (isEsportsMode || isBasketballMode || isFootballMode) {
        ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
        ctx.shadowBlur = Math.max(6, 12 * detailScale);
        ctx.shadowOffsetY = Math.max(1, 2 * detailScale);
      }
      ctx.fillText(dateLabel, dateX + dateWidth / 2, barY + dateHeight / 2);
    } else {
      applyFittedFont(ctx, dateLabel, {
        maxSize: Math.max(20, 28 * detailScale),
        minSize: 16,
        weight: 700,
      });
    }

    const timeX = cardX + cardWidth - timeWidth;
    ctx.save();
    drawRoundedRectPath(ctx, timeX, barY, timeWidth, dateHeight, pillRadius);
    const timeGradient = ctx.createLinearGradient(
      timeX,
      barY,
      timeX + timeWidth,
      barY + dateHeight
    );
    timeGradient.addColorStop(0, footerStart);
    timeGradient.addColorStop(1, footerEnd);
    ctx.fillStyle = timeGradient;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = timeTextColor;
    ctx.font = `700 ${Math.max(18, 24 * detailScale)}px Poppins`;
    if (isEsportsMode || isBasketballMode || isFootballMode) {
      ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
      ctx.shadowBlur = Math.max(6, 12 * detailScale);
      ctx.shadowOffsetY = Math.max(1, 2 * detailScale);
    }
    ctx.fillText(timeLabel, timeX + timeWidth / 2, barY + dateHeight / 2);

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
    ctx.shadowBlur = Math.max(20, 34 * detailScale);
    ctx.shadowOffsetY = Math.max(8, 14 * detailScale);
    drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
    const cardGradient = ctx.createLinearGradient(
      cardX,
      cardY,
      cardX + cardWidth,
      cardY + cardHeight
    );
    cardGradient.addColorStop(0, "#1f2937");
    cardGradient.addColorStop(0.5, "#111827");
    cardGradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = cardGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
    ctx.lineWidth = Math.max(1.6, 2.2 * detailScale);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
    const glassGradient = ctx.createLinearGradient(
      cardX,
      cardY,
      cardX,
      cardY + cardHeight
    );
    glassGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
    glassGradient.addColorStop(1, "rgba(148, 163, 184, 0.04)");
    ctx.fillStyle = glassGradient;
    ctx.fill();
    ctx.restore();

    const innerTop = cardY + innerPaddingY;
    const textCenterY = innerTop + nameAreaHeight / 2;

    const logoSize = Math.min(
      nameAreaHeight,
      Math.max(78, 104 * detailScale)
    );
    const logoY = innerTop + (nameAreaHeight - logoSize) / 2;

    const leftLogoX = cardX + innerPaddingX;
    const rightLogoX = cardX + cardWidth - innerPaddingX - logoSize;

    if (isEsportsMode && esportsSlot) {
      const slotSize = esportsSlot.size;
      const slotY = cardY;
      drawEsportsGameSlot(ctx, esportsSlot.x, slotY, slotSize, {
        logoImage: match.gameLogoImage,
        label: match.gameName,
      });
    }

    drawLogoTile(
      ctx,
      match.homeLogoImage,
      leftLogoX,
      logoY,
      logoSize,
      match.teamHome,
      {
        scale: match.teamHomeLogoScale,
        offsetX: match.teamHomeLogoOffsetX,
        offsetY: match.teamHomeLogoOffsetY,
      }
    );
    drawLogoTile(
      ctx,
      match.awayLogoImage,
      rightLogoX,
      logoY,
      logoSize,
      match.teamAway,
      {
        scale: match.teamAwayLogoScale,
        offsetX: match.teamAwayLogoOffsetX,
        offsetY: match.teamAwayLogoOffsetY,
      }
    );

    const leftNameX = leftLogoX + logoSize + gapBetweenBlocks;
    const vsRadius = vsDiameter / 2;
    const vsCenterX = cardX + cardWidth / 2;
    const leftNameEnd = vsCenterX - vsRadius - gapBetweenBlocks;
    const leftNameWidth = Math.max(0, leftNameEnd - leftNameX);

    const rightNameX = vsCenterX + vsRadius + gapBetweenBlocks;
    const rightNameEnd = rightLogoX - gapBetweenBlocks;
    const rightNameWidth = Math.max(0, rightNameEnd - rightNameX);

    const homeNameLayout = buildTeamNameLayout(match.teamHome, leftNameWidth, "Tuan Rumah");
    const awayNameLayout = buildTeamNameLayout(match.teamAway, rightNameWidth, "Tim Tamu");
    let normalizedHomeLayout = homeNameLayout;
    let normalizedAwayLayout = awayNameLayout;
    if (homeNameLayout && awayNameLayout) {
      const sharedFontSize = Math.min(
        homeNameLayout.layout.fontSize || 0,
        awayNameLayout.layout.fontSize || 0
      );
      if (Number.isFinite(sharedFontSize) && sharedFontSize > 0) {
        if (sharedFontSize < (homeNameLayout.layout.fontSize || 0) - 0.1) {
          normalizedHomeLayout = buildTeamNameLayout(
            match.teamHome,
            leftNameWidth,
            "Tuan Rumah",
            sharedFontSize
          );
        }
        if (sharedFontSize < (awayNameLayout.layout.fontSize || 0) - 0.1) {
          normalizedAwayLayout = buildTeamNameLayout(
            match.teamAway,
            rightNameWidth,
            "Tim Tamu",
            sharedFontSize
          );
        }
      }
    }

    renderTeamNameLayout(normalizedHomeLayout, leftNameX, leftNameWidth, textCenterY);
    renderTeamNameLayout(normalizedAwayLayout, rightNameX, rightNameWidth, textCenterY);

    drawVsBadge(ctx, vsCenterX, textCenterY, vsRadius, detailScale);
  });

  ctx.restore();
};

const drawScoreboardMatches = (
  ctx,
  matches = [],
  startY = 0,
  palette = DEFAULT_BRAND_PALETTE,
  options = {}
) => {
  if (!ctx || !Array.isArray(matches) || matches.length === 0) {
    return;
  }

  const canvasWidth = ctx.canvas.width;
  const referenceWidth = 1080;
  const scale = canvasWidth / referenceWidth || 1;
  const baseRowHeight = 150;
  const baseGap = 32;
  const baseCircleSize = 110;
  const baseCenterWidth = 240;
  const baseCenterHeight = 108;
  const baseTextPadding = 28;
  const paddingX = 90 * scale;
  const extraBottomSpacing = Math.max(options?.extraBottomSpacing ?? 0, 0);
  const infoLabel = typeof options?.infoLabel === "string" ? options.infoLabel.trim() : "";
  const FOOTER_HEIGHT = 110;
  const FOOTER_SPACING = 60 + extraBottomSpacing;
  const bottomLimit = ctx.canvas.height - (FOOTER_HEIGHT + FOOTER_SPACING);

  const infoBadgeSpacing = 28 * scale;
  let contentStart = startY;
  if (infoLabel) {
    const badgeHeight = 48 * scale;
    const horizontalPadding = 36 * scale;
    const badgeText = infoLabel.toUpperCase();
    ctx.save();
    ctx.font = `700 ${Math.round(24 * scale)}px "Poppins", sans-serif`;
    const textWidth = ctx.measureText(badgeText).width;
    const badgeWidth = Math.min(
      canvasWidth - paddingX * 2,
      textWidth + horizontalPadding * 2
    );
    const badgeX = (canvasWidth - badgeWidth) / 2;
    const badgeY = startY;
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 6 * scale;
    drawRoundedRectPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    const infoGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
    infoGradient.addColorStop(0, palette?.headerStart || "#f59e0b");
    infoGradient.addColorStop(1, palette?.headerEnd || "#d97706");
    ctx.fillStyle = infoGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = `700 ${Math.round(24 * scale)}px "Poppins", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textX = canvasWidth / 2;
    const textY = badgeY + badgeHeight / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = -1 * scale;
    ctx.shadowOffsetY = -1 * scale;
    ctx.fillText(badgeText, textX, textY);

    ctx.fillStyle = "#f8fafc";
    ctx.shadowColor = "rgba(15, 23, 42, 0.4)";
    ctx.shadowBlur = 14 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4 * scale;
    ctx.fillText(badgeText, textX, textY);
    ctx.restore();

    contentStart = badgeY + badgeHeight + infoBadgeSpacing;
  }

  const matchCount = Math.max(matches.length, 1);
  const rawAvailable = bottomLimit - contentStart;
  const availableHeight = Math.max(rawAvailable, 220);
  const baseTotalHeight = matchCount * baseRowHeight + Math.max(matchCount - 1, 0) * baseGap;
  const layoutScale = baseTotalHeight > availableHeight ? availableHeight / baseTotalHeight : 1;

  const rowHeight = Math.max(90 * scale, baseRowHeight * scale * layoutScale);
  const gap = Math.max(14 * scale, baseGap * scale * layoutScale);
  const centerPanelWidth = Math.max(200 * scale, baseCenterWidth * scale * layoutScale);
  const centerPanelHeight = Math.max(80 * scale, baseCenterHeight * scale * layoutScale);
  const barHeight = centerPanelHeight;
  const circleSizeCandidate = Math.max(barHeight - 6 * scale, 60 * scale);
  const circleSize = Math.min(circleSizeCandidate, baseCircleSize * scale);
  const textPadding = Math.max(18 * scale, baseTextPadding * scale * layoutScale);
  const barRadius = barHeight / 2;
  const centerRadius = Math.min(centerPanelHeight / 2, 36 * scale);
  const adjustedHeight =
    matchCount * rowHeight + Math.max(matchCount - 1, 0) * gap;
  const verticalOffset =
    adjustedHeight < availableHeight ? (availableHeight - adjustedHeight) / 2 : 0;

  const nameBarStartColor = "#192133";
  const nameBarEndColor = "#0f172a";
  const scoreStartColor = palette?.footerStart || "#ef4444";
  const scoreEndColor = palette?.footerEnd || "#ea580c";
  const labelColor = "rgba(248, 250, 252, 0.95)";

  const normalizeScore = (value) => {
    const strValue = value === null || value === undefined ? "" : String(value);
    const digits = strValue.replace(/[^0-9]/g, "").slice(0, 3);
    return digits || "0";
  };

  const renderTeamLabel = (name, areaX, areaWidth, centerY) => {
    if (areaWidth <= 0) return;
    const fallback = "YOUR TEAM";
    const rawLabel = name && name.trim() ? name : fallback;
    const upperLabel = rawLabel.toUpperCase();
    const layout = layoutTeamName(ctx, upperLabel, {
      maxWidth: areaWidth,
      maxFontSize: 32 * scale,
      minFontSize: 16 * scale,
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
    });
    const lines = layout.lines && layout.lines.length ? layout.lines : [upperLabel];
    const lineSpacing = layout.fontSize * 1.15;
    let startY = centerY - (lineSpacing * (lines.length - 1)) / 2;
    ctx.save();
    ctx.fillStyle = labelColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `700 ${Math.round(layout.fontSize)}px "Poppins", sans-serif`;
    lines.forEach((line) => {
      const targetX = areaX + areaWidth / 2;
      ctx.fillText(line.toUpperCase(), targetX, startY);
      startY += lineSpacing;
    });
    ctx.restore();
  };

  matches.forEach((match, index) => {
    const rowTop = contentStart + verticalOffset + index * (rowHeight + gap);
    const rowCenterY = rowTop + rowHeight / 2;
    const barX = paddingX;
    const barWidth = Math.max(canvasWidth - paddingX * 2, 320 * scale);
    const barY = rowCenterY - barHeight / 2;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 8 * scale;
    drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    const barGradient = ctx.createLinearGradient(barX, rowCenterY, barX + barWidth, rowCenterY);
    barGradient.addColorStop(0, nameBarStartColor);
    barGradient.addColorStop(1, nameBarEndColor);
    ctx.fillStyle = barGradient;
    ctx.fill();
    ctx.restore();

    const centerX = (canvasWidth - centerPanelWidth) / 2;
    const centerY = rowCenterY - centerPanelHeight / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 26 * scale;
    ctx.shadowOffsetY = 12 * scale;
    drawRoundedRectPath(ctx, centerX, centerY, centerPanelWidth, centerPanelHeight, centerRadius);
    const centerGradient = ctx.createLinearGradient(
      centerX,
      centerY,
      centerX + centerPanelWidth,
      centerY + centerPanelHeight
    );
    centerGradient.addColorStop(0, scoreStartColor);
    centerGradient.addColorStop(1, scoreEndColor);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.restore();

    const scoreText = `${normalizeScore(match.scoreHome)} - ${normalizeScore(match.scoreAway)}`;
    ctx.save();
    ctx.font = `800 ${Math.round(48 * scale)}px "Montserrat", "Poppins", sans-serif`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * scale;
    ctx.fillText(scoreText, canvasWidth / 2, rowCenterY);
    ctx.restore();

    const logoY = rowCenterY - circleSize / 2;
    const leftLogoX = barX + 7 * scale;
    const rightLogoX = barX + barWidth - circleSize - 7 * scale;

    drawLogoTile(ctx, match.homeLogoImage, leftLogoX, logoY, circleSize, match.teamHome, {
      scale: match.teamHomeLogoScale,
      offsetX: match.teamHomeLogoOffsetX,
      offsetY: match.teamHomeLogoOffsetY,
    });
    drawLogoTile(ctx, match.awayLogoImage, rightLogoX, logoY, circleSize, match.teamAway, {
      scale: match.teamAwayLogoScale,
      offsetX: match.teamAwayLogoOffsetX,
      offsetY: match.teamAwayLogoOffsetY,
    });

    const leftAreaStart = leftLogoX + circleSize + textPadding;
    const leftAreaEnd = canvasWidth / 2 - centerPanelWidth / 2 - textPadding;
    const leftAreaWidth = Math.max(60 * scale, leftAreaEnd - leftAreaStart);
    const rightAreaEnd = rightLogoX - textPadding;
    const rightAreaStart = canvasWidth / 2 + centerPanelWidth / 2 + textPadding;
    const rightAreaWidth = Math.max(60 * scale, rightAreaEnd - rightAreaStart);

    renderTeamLabel(match.teamHome, leftAreaStart, leftAreaWidth, rowCenterY);
    renderTeamLabel(match.teamAway, rightAreaStart, rightAreaWidth, rowCenterY);
  });
};

const drawBigMatchLayout = (
  ctx,
  {
    matchesWithImages = [],
    matchesStartY = 0,
    brandPalette = DEFAULT_BRAND_PALETTE,
    bigMatchDetails = {},
    brandDisplayName = "",
  } = {}
) => {
  if (!ctx || !matchesWithImages.length) {
    return;
  }

  const subtitle = bigMatchDetails?.matchDateLabel
    ? bigMatchDetails.matchDateLabel.toUpperCase()
    : "";

  const singleMatch = [matchesWithImages[0]];
  const canvasHeight = ctx.canvas?.height || 1080;
  const desiredOffset = Math.max(canvasHeight * 0.38, 320);
  const maxAllowedStart = canvasHeight - 360;
  const adjustedStartY = Math.min(
    maxAllowedStart,
    Math.max(matchesStartY, matchesStartY + desiredOffset)
  );
  drawMatches(ctx, singleMatch, adjustedStartY, brandPalette, {
    mode: "football",
    activeSubMenu: "schedule",
    brandDisplayName,
    customCenterLabel: {
      title: "VS",
      subtitle,
    },
  });
};

const STREAMING_THEME_CANVAS_COLOR = {
  gold: "#1A1A1A",
  blue: "#FFE27D",
  purple: "#FFE27D",
  dark: "#FFD45C",
  red: "#FFF2D9",
  light: "#1A1A1A",
};

const STREAMING_THEME_CANVAS_SHADOW = {
  gold: "rgba(255,255,255,0.45)",
  blue: "rgba(0,0,0,0.6)",
  purple: "rgba(0,0,0,0.6)",
  dark: "rgba(0,0,0,0.7)",
  red: "rgba(0,0,0,0.8)",
  light: "rgba(0,0,0,0.65)",
};

const resolveStreamingUrlCanvasStyle = (theme) => {
  const normalized = (theme || "dark").toLowerCase();
  return {
    color: STREAMING_THEME_CANVAS_COLOR[normalized] || STREAMING_THEME_CANVAS_COLOR.dark,
    shadow: STREAMING_THEME_CANVAS_SHADOW[normalized] || STREAMING_THEME_CANVAS_SHADOW.dark,
  };
};

const normalizeTogelDigits = (digits = []) => {
  const effectiveLength = digits.length > 0 ? digits.length : 3;
  return Array.from({ length: effectiveLength }).map((_, index) => {
    const value = digits[index];
    if (typeof value === "string" && value.length > 0) {
      return value.replace(/\D/g, "").slice(-1) || "0";
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(Math.abs(Math.floor(value)) % 10);
    }
    return "0";
  });
};

const drawTogelInfoPill = (
  ctx,
  {
    x,
    y,
    width,
    height,
    text,
    gradientStart,
    gradientEnd,
    textColor = "#f8fafc",
    fontSize = 20,
    textShadowColor = "rgba(15, 23, 42, 0.35)",
  }
) => {
  if (width <= 0 || height <= 0) return;

  const dropShadowColor = "rgba(15, 23, 42, 0.45)";
  const dropShadowBlur = Math.max(12, height * 0.35);
  const dropShadowOffsetY = Math.max(6, height * 0.2);

  ctx.save();
  drawRoundedRectPath(ctx, x, y, width, height, height / 2);
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, gradientStart);
  gradient.addColorStop(1, gradientEnd);
  ctx.shadowColor = dropShadowColor;
  ctx.shadowBlur = dropShadowBlur;
  ctx.shadowOffsetY = dropShadowOffsetY;
  ctx.shadowOffsetX = 0;
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, x, y, width, height, height / 2);
  const bevelGradient = ctx.createLinearGradient(x, y, x, y + height);
  bevelGradient.addColorStop(0, "rgba(255, 255, 255, 0.55)");
  bevelGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.15)");
  bevelGradient.addColorStop(0.55, "rgba(255, 255, 255, 0.04)");
  bevelGradient.addColorStop(0.65, "rgba(15, 23, 42, 0.18)");
  bevelGradient.addColorStop(1, "rgba(15, 23, 42, 0.35)");
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = bevelGradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  const glare = ctx.createLinearGradient(x, y, x, y + height);
  glare.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  glare.addColorStop(0.45, "rgba(255, 255, 255, 0.15)");
  glare.addColorStop(0.7, "rgba(255, 255, 255, 0.05)");
  glare.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = glare;
  drawRoundedRectPath(ctx, x, y, width, height, height / 2);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.fillStyle = textColor;
  ctx.font = `700 ${Math.round(fontSize)}px Poppins`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = textShadowColor;
  ctx.shadowBlur = Math.max(8, height * 0.25);
  ctx.shadowOffsetY = Math.max(3, height * 0.12);
  ctx.fillText(text, x + width / 2, y + height / 2);
  ctx.restore();
};

const drawDigitOrb = (ctx, x, y, radius, digitText, palette = DEFAULT_BRAND_PALETTE) => {
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
  ctx.shadowBlur = Math.max(16, radius * 0.8);
  ctx.shadowOffsetY = Math.max(6, radius * 0.25);

  const gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  gradient.addColorStop(0, palette?.headerStart ?? "#2563eb");
  gradient.addColorStop(1, palette?.headerEnd ?? "#ec4899");

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  const innerHighlight = ctx.createLinearGradient(x, y - radius, x, y + radius);
  innerHighlight.addColorStop(0, "rgba(255, 255, 255, 0.35)");
  innerHighlight.addColorStop(0.65, "rgba(255, 255, 255, 0.08)");
  innerHighlight.addColorStop(1, "rgba(15, 23, 42, 0.45)");
  ctx.fillStyle = innerHighlight;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.lineWidth = Math.max(2, radius * 0.12);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.stroke();

  ctx.fillStyle = "#f8fafc";
  ctx.font = `800 ${Math.round(radius * 1)}px Poppins`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(2, 6, 23, 0.45)";
  ctx.shadowBlur = radius * 0.3;
  ctx.shadowOffsetY = radius * 0.1;
  ctx.fillText(digitText || "0", x, y + radius * 0.02);
  ctx.restore();
};

const drawTogelResult = (
  ctx,
  {
    digits = [],
    poolCode = "",
    variantLabel = "",
    drawTime,
    startY = 240,
    palette = DEFAULT_BRAND_PALETTE,
    streamingInfo = null,
  } = {}
) => {
  const safeDigits = normalizeTogelDigits(digits);
  const digitCount = Math.max(1, safeDigits.length);
  const hasStreamingInfo = Boolean(streamingInfo && streamingInfo.url);
  const footerGuard = 170 + (hasStreamingInfo ? 90 : 0);
  const availableHeight = Math.max(ctx.canvas.height - footerGuard - startY, 220);
  const cardHeight = Math.min(Math.max(availableHeight * 0.7, 220), 360);
  const verticalOffset = Math.max((availableHeight - cardHeight) / 2, 0);
  const cardY = startY + verticalOffset;
  const horizontalPadding = Math.max(70, ctx.canvas.width * 0.08);
  const cardX = horizontalPadding;
  const cardWidth = ctx.canvas.width - horizontalPadding * 2;
  const cardRadius = Math.max(32, cardHeight * 0.18);
  const innerPaddingX = Math.max(50, cardWidth * 0.12);
  const innerPaddingY = Math.max(36, cardHeight * 0.2);

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 18;
  drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight);
  cardGradient.addColorStop(0, "rgba(30, 41, 59, 0.95)");
  cardGradient.addColorStop(1, "rgba(15, 23, 42, 0.98)");
  ctx.fillStyle = cardGradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.restore();

  const pillHeight = Math.max(44, cardHeight * 0.16);
  const pillFontSize = Math.max(18, pillHeight * 0.5);
  const pillY = Math.max(startY + 10, cardY - pillHeight - 16);
  const pillPaddingX = 30;
  const pillMaxWidth = Math.max(120, cardWidth / 2 - 36);
  const pillGradientStart = palette?.headerStart ?? "#4b5563";
  const pillGradientEnd = palette?.headerEnd ?? "#9ca3af";

  ctx.save();
  ctx.font = `700 ${Math.round(pillFontSize)}px Poppins`;
  const rawDateLabel =
    resolveTogelDateLabel({ poolCode, variantLabel, drawTime }) ||
    getTodayDateLabel() ||
    new Date().toLocaleDateString();
  const dateText = rawDateLabel.toUpperCase();
  const dateWidth = Math.min(
    pillMaxWidth * 1.4,
    ctx.measureText(dateText).width + Math.max(pillPaddingX * 1.1, 32)
  );
  const drawTimeText = drawTime ? `Jam ${drawTime}` : "";
  const drawTimeWidth = drawTime
    ? Math.min(
        pillMaxWidth,
        ctx.measureText(drawTimeText).width + Math.max(pillPaddingX * 1.2, 28)
      )
    : 0;
  ctx.restore();

  drawTogelInfoPill(ctx, {
    x: cardX + 16,
    y: pillY,
    width: dateWidth,
    height: pillHeight,
    text: dateText,
    fontSize: pillFontSize * 0.9,
    gradientStart: pillGradientStart,
    gradientEnd: pillGradientEnd,
  });

  if (drawTimeWidth > 0) {
    drawTogelInfoPill(ctx, {
      x: cardX + cardWidth - drawTimeWidth - 16,
      y: pillY,
      width: drawTimeWidth,
      height: pillHeight,
      text: drawTimeText,
      fontSize: pillFontSize,
      gradientStart: pillGradientStart,
      gradientEnd: pillGradientEnd,
    });
  }

  const digitsAreaWidth = Math.max(0, cardWidth - innerPaddingX * 2);
  let digitGap = 0;
  if (digitCount > 1) {
    const baseGap = Math.min(36, digitsAreaWidth / digitCount / 2);
    digitGap = digitCount >= 5 ? Math.min(18, baseGap) : baseGap;
  }
  const rawDiameter =
    digitCount > 0
      ? (digitsAreaWidth - digitGap * (digitCount - 1)) / digitCount
      : digitsAreaWidth;
  const digitDiameter = clampMin(Math.min(rawDiameter, 210), 110);
  const digitRadius = digitDiameter / 2;
  const totalRowWidth =
    digitCount * digitDiameter + (digitCount - 1) * digitGap;
  const firstCenterX = cardX + (cardWidth - totalRowWidth) / 2 + digitRadius;
  const digitsCenterY = cardY + innerPaddingY + (cardHeight - innerPaddingY * 2) / 2;

  safeDigits.forEach((digit, index) => {
    const centerX = firstCenterX + index * (digitDiameter + digitGap);
    drawDigitOrb(ctx, centerX, digitsCenterY, digitRadius, digit, palette);
  });

  if (hasStreamingInfo) {
    const infoMarginTop = Math.max(18, cardHeight * 0.08);
    const infoHeight = 76;
    const infoWidth = cardWidth;
    const infoX = cardX;
    const infoY = cardY + cardHeight + infoMarginTop;
    const infoRadius = Math.min(24, infoHeight / 2);
    const gradient = ctx.createLinearGradient(infoX, infoY, infoX + infoWidth, infoY + infoHeight);
    gradient.addColorStop(0, palette?.footerStart ?? "#22c55e");
    gradient.addColorStop(1, palette?.footerEnd ?? "#0d9488");

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    drawRoundedRectPath(ctx, infoX, infoY, infoWidth, infoHeight, infoRadius);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const titleLine = streamingInfo.title
      ? streamingInfo.title.trim()
      : "Live Streaming";
    const descriptorLine = streamingInfo.descriptor
      ? streamingInfo.descriptor.trim()
      : "";
    const firstLine =
      descriptorLine && !titleLine.toLowerCase().includes(descriptorLine.toLowerCase())
        ? `${titleLine} ${descriptorLine}`.trim()
        : (titleLine || descriptorLine || "Live Streaming").trim();
    const secondLine =
      (streamingInfo.displayUrl || streamingInfo.url || "").trim().toLowerCase();
    const firstFontSize = Math.max(18, infoHeight * 0.32);
    const secondFontSize = Math.max(14, infoHeight * 0.26);
    ctx.font = `700 ${Math.round(firstFontSize)}px Poppins`;
    ctx.fillText(firstLine, infoX + infoWidth / 2, infoY + infoHeight * 0.4);
    if (secondLine) {
      ctx.font = `600 ${Math.round(secondFontSize)}px Poppins`;
      const textWidth = ctx.measureText(secondLine).width;
      const pillPaddingX = Math.max(18, infoWidth * 0.02);
      const pillPaddingY = Math.max(4, secondFontSize * 0.35);
      const pillWidth = Math.min(infoWidth - 48, textWidth + pillPaddingX * 2);
      const pillHeight = secondFontSize + pillPaddingY;
      const pillX = infoX + (infoWidth - pillWidth) / 2;
      const pillY = infoY + infoHeight * 0.58;
      ctx.save();
      drawRoundedRectPath(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
      const pillGradient = ctx.createLinearGradient(pillX, pillY, pillX, pillY + pillHeight);
      pillGradient.addColorStop(0, "rgba(255, 255, 255, 0.32)");
      pillGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
      ctx.fillStyle = pillGradient;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      const themeStyle = resolveStreamingUrlCanvasStyle(streamingInfo.theme);
      ctx.fillStyle = themeStyle.color;
      ctx.shadowColor = themeStyle.shadow;
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.fillText(
        secondLine,
        infoX + infoWidth / 2,
        pillY + pillHeight / 2 + secondFontSize * 0.08
      );
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  // Removed "Nomor Keluaran" label for cleaner layout.
};

const formatRupiah = (value) => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(numeric)) {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(numeric);
    } catch (error) {
      return `Rp ${numeric.toLocaleString("id-ID")}`;
    }
  }
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  return "Rp -";
};

const drawRaffleDateCapsule = (
  ctx,
  label,
  { startY = 0, palette = DEFAULT_BRAND_PALETTE } = {}
) => {
  if (!ctx || !label) return 0;
  const capsuleHeight = 48;
  const capsuleWidth = Math.min(ctx.canvas.width * 0.75, 560);
  const capsuleX = (ctx.canvas.width - capsuleWidth) / 2;
  const capsuleY = startY + 12;
  const radius = capsuleHeight / 2;
  const text = `${label}`.trim().toUpperCase();

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;
  drawRoundedRectPath(ctx, capsuleX, capsuleY, capsuleWidth, capsuleHeight, radius);
  const gradient = ctx.createLinearGradient(
    capsuleX,
    capsuleY,
    capsuleX + capsuleWidth,
    capsuleY + capsuleHeight
  );
  gradient.addColorStop(0, palette?.headerStart || "#ea580c");
  gradient.addColorStop(1, palette?.headerEnd || "#dc2626");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, capsuleX, capsuleY, capsuleWidth, capsuleHeight, radius);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();
  const glossGradient = ctx.createLinearGradient(capsuleX, capsuleY, capsuleX, capsuleY + capsuleHeight);
  glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  glossGradient.addColorStop(0.55, "rgba(255, 255, 255, 0.05)");
  glossGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");
  ctx.fillStyle = glossGradient;
  ctx.fillRect(capsuleX, capsuleY, capsuleWidth, capsuleHeight);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = Math.max(20, Math.round(capsuleHeight * 0.45));
  ctx.font = `900 ${fontSize}px Poppins`;
  ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;
  ctx.fillText(text, capsuleX + capsuleWidth / 2, capsuleY + capsuleHeight / 2);
  ctx.restore();

  return capsuleHeight + 32;
};

const drawRaffleWinnersTable = (
  ctx,
  winners = [],
  { startY = 0, palette = DEFAULT_BRAND_PALETTE, maxRows = 20 } = {}
) => {
  if (!ctx) return;
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const panelPaddingX = Math.max(48, canvasWidth * 0.075);
  const panelWidth = canvasWidth - panelPaddingX * 2;
  const panelX = panelPaddingX;
  const topSpacing = startY + 12;
  const footerGuard = 130;
  const rawHeight = canvasHeight - topSpacing - footerGuard;
  const panelHeight = Math.max(320, rawHeight);
  const panelY = topSpacing;
  const innerPadding = Math.max(24, panelWidth * 0.03);

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 22;
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, 32);
  ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, 32);
  const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
  gradient.addColorStop(0, palette?.headerStart || DEFAULT_BRAND_PALETTE.headerStart);
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();

  const safeWinners = Array.isArray(winners) ? winners.slice(0, Math.max(1, maxRows)) : [];
  if (!safeWinners.length) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#cbd5f5";
    ctx.font = "500 26px Poppins";
    ctx.fillText("Data pemenang belum tersedia", panelX + panelWidth / 2, panelY + panelHeight / 2);
    ctx.restore();
    return;
  }

  const chunkSize = 10;
  const totalColumns = Math.min(2, Math.ceil(safeWinners.length / chunkSize));
  const columnGap = totalColumns > 1 ? Math.max(36, panelWidth * 0.04) : 0;
  const columnWidth =
    (panelWidth - innerPadding * 2 - columnGap * (totalColumns - 1)) / totalColumns;
  const rowsPerColumn = chunkSize;
  const headerBarHeight = Math.max(32, Math.min(panelHeight * 0.11, 58));
  const availableHeight = panelHeight - innerPadding * 2;
  const headerSpacing = Math.max(18, headerBarHeight * 0.35);
  const preferredRowHeight = Math.min(78, Math.max(56, panelHeight * 0.055));
  let rowHeight = preferredRowHeight;
  let contentHeight = headerBarHeight + headerSpacing + rowHeight * rowsPerColumn;
  if (contentHeight > availableHeight) {
    rowHeight = Math.max(40, (availableHeight - headerBarHeight - headerSpacing) / rowsPerColumn);
    contentHeight = headerBarHeight + headerSpacing + rowHeight * rowsPerColumn;
  }
  const contentOffset = Math.max(0, (availableHeight - contentHeight) / 2);
  const rowRadius = Math.min(22, rowHeight / 2.4);
  const headerFontSize = Math.max(20, rowHeight * 0.38);
  const usernameTextColor = "#f8fafc";
  const headerBarX = panelX + innerPadding;
  const headerBarWidth = panelWidth - innerPadding * 2;
  const headerBarY = panelY + innerPadding + contentOffset;
  const headerBarRadius = Math.min(20, headerBarHeight / 2.4);
  const rowsStartY = headerBarY + headerBarHeight + headerSpacing;

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.3)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  drawRoundedRectPath(ctx, headerBarX, headerBarY, headerBarWidth, headerBarHeight, headerBarRadius);
  const headerGradient = ctx.createLinearGradient(
    headerBarX,
    headerBarY,
    headerBarX,
    headerBarY + headerBarHeight
  );
  headerGradient.addColorStop(
    0,
    ensureSubduedGradientColor(palette?.headerStart, "#fcd34d", 0.45)
  );
  headerGradient.addColorStop(
    1,
    ensureSubduedGradientColor(palette?.headerEnd, "#d97706", 0.45)
  );
  ctx.fillStyle = headerGradient;
  ctx.fill();
  ctx.save();
  drawRoundedRectPath(ctx, headerBarX, headerBarY, headerBarWidth, headerBarHeight, headerBarRadius);
  ctx.clip();
  const bevelGradient = ctx.createLinearGradient(
    headerBarX,
    headerBarY,
    headerBarX,
    headerBarY + headerBarHeight
  );
  bevelGradient.addColorStop(0, "rgba(255,255,255,0.65)");
  bevelGradient.addColorStop(0.4, "rgba(255,255,255,0.12)");
  bevelGradient.addColorStop(0.6, "rgba(0,0,0,0.08)");
  bevelGradient.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = bevelGradient;
  ctx.fillRect(headerBarX, headerBarY, headerBarWidth, headerBarHeight);
  ctx.restore();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.save();
  ctx.textBaseline = "middle";

  for (let columnIndex = 0; columnIndex < totalColumns; columnIndex += 1) {
    const columnX =
      panelX +
      innerPadding +
      columnIndex * (columnWidth + columnGap);
    const columnHeaderY = headerBarY + headerBarHeight / 2;

    ctx.font = `600 ${Math.round(headerFontSize)}px Poppins`;
    ctx.textAlign = "left";
    ctx.fillStyle = usernameTextColor;
    ctx.fillText("USERNAME", columnX + 16, columnHeaderY);
    ctx.textAlign = "right";
    ctx.fillText("NOMINAL", columnX + columnWidth - 16, columnHeaderY);

    const startIndex = columnIndex * chunkSize;
    const columnData = safeWinners.slice(startIndex, startIndex + chunkSize);
    columnData.forEach((winner, rowIndex) => {
      const rowTop = rowsStartY + rowIndex * rowHeight;
      const centerY = rowTop + rowHeight / 2;
      ctx.save();
      ctx.fillStyle =
        rowIndex % 2 === 0 ? "rgba(15, 23, 42, 0.45)" : "rgba(15, 23, 42, 0.3)";
      fillRoundedRectCached(ctx, columnX, rowTop, columnWidth, rowHeight - 6, rowRadius);
      ctx.restore();

      const username =
        winner?.displayUsername ||
        winner?.username ||
        winner?.ticket_code ||
        `Pemenang ${startIndex + rowIndex + 1}`;
      const prizeAmountLabel =
        winner?.formattedPrizeAmount ||
        winner?.displayPrizeAmount ||
        formatRupiah(winner?.prize_amount);
      ctx.font = `600 ${Math.max(20, rowHeight * 0.42)}px Poppins`;
      ctx.textAlign = "left";
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(username, columnX + 12, centerY);

      ctx.textAlign = "right";
      ctx.fillStyle = "#6efacf";
      ctx.fillText(prizeAmountLabel, columnX + columnWidth - 12, centerY);
    });
  }

  ctx.restore();
};

const drawFooter = (ctx, footerImage, linkTextInput, palette = DEFAULT_BRAND_PALETTE) => {
  ctx.save();
  const footerHeight = 110;
  const footerY = ctx.canvas.height - footerHeight;

  const rawLinkInput = linkTextInput ? linkTextInput.trim() : "";

  // Base gradient backdrop
  const baseGradient = ctx.createLinearGradient(0, footerY, 0, footerY + footerHeight);
  baseGradient.addColorStop(0, "#0f172a");
  baseGradient.addColorStop(1, "#020617");
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, footerY, ctx.canvas.width, footerHeight);

  const linkText = (rawLinkInput || "linkwebanda.com").toUpperCase();
  const linkBarWidth = Math.min(360, ctx.canvas.width * 0.32);
  const linkX = Math.max(0, ctx.canvas.width - linkBarWidth);
  const accentColor = palette?.accent ?? "#38bdf8";
  const accentRgb = hexToRgb(accentColor);

  // Divider glow
  if (linkX > 0) {
    const dividerGradient = ctx.createLinearGradient(linkX - 12, footerY, linkX + 2, footerY + footerHeight);
    dividerGradient.addColorStop(0, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0)`);
    dividerGradient.addColorStop(0.4, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.35)`);
    dividerGradient.addColorStop(1, `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0)`);
    ctx.fillStyle = dividerGradient;
    ctx.fillRect(linkX - 12, footerY, 12, footerHeight);
  }

  // Left banner image area with layered gradients
  if (footerImage && linkX > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, footerY, linkX, footerHeight);
    ctx.clip();

    drawImageCover(ctx, footerImage, 0, footerY, linkX, footerHeight);
    ctx.restore();
  } else if (linkX > 0) {
    ctx.fillStyle = PLACEHOLDER_FILL_COLOR;
    ctx.fillRect(0, footerY, linkX, footerHeight);

    ctx.fillStyle = PLACEHOLDER_TEXT_COLOR;
    ctx.font = `600 ${Math.round(footerHeight * 0.22)}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Banner Footer", linkX / 2, footerY + footerHeight / 2);
  }

  // Link panel
  const panelGradient = ctx.createLinearGradient(
    linkX,
    footerY,
    ctx.canvas.width,
    footerY + footerHeight
  );
  panelGradient.addColorStop(
    0,
    ensureSubduedGradientColor(palette?.footerStart, "#22c55e", 0.5)
  );
  panelGradient.addColorStop(
    1,
    ensureSubduedGradientColor(palette?.footerEnd, "#0d9488", 0.5)
  );
  ctx.fillStyle = panelGradient;
  ctx.fillRect(linkX, footerY, Math.max(ctx.canvas.width - linkX, 0), footerHeight);

  const panelOverlay = ctx.createLinearGradient(
    linkX,
    footerY,
    ctx.canvas.width,
    footerY + footerHeight
  );
  panelOverlay.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  panelOverlay.addColorStop(0.6, "rgba(255, 255, 255, 0.06)");
  panelOverlay.addColorStop(1, "rgba(255, 255, 255, 0.02)");
  ctx.fillStyle = panelOverlay;
  ctx.fillRect(linkX, footerY, Math.max(ctx.canvas.width - linkX, 0), footerHeight);

  const textFillColor = "#f8fafc";
  const shadowColor = "rgba(15, 23, 42, 0.55)";
  const shadowOffset = 4;
  const shadowBlur = 28;
  const secondaryShadowColor = "rgba(15, 23, 42, 0.35)";
  const secondaryShadowBlur = 24;
  const secondaryShadowOffsetY = 4;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const maxWidth = Math.max(ctx.canvas.width - linkX - 40, 0);
  applyFittedFont(ctx, linkText, {
    maxSize: 36,
    minSize: 18,
    weight: 800,
    maxWidth,
    family: '"Montserrat", sans-serif',
  });

  const textCenterX = linkX + (ctx.canvas.width - linkX) / 2;
  const textCenterY = footerY + footerHeight / 2;

  ctx.save();
  ctx.fillStyle = textFillColor;
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;
  ctx.fillText(linkText, textCenterX, textCenterY);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = textFillColor;
  ctx.shadowColor = secondaryShadowColor;
  ctx.shadowBlur = secondaryShadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = secondaryShadowOffsetY;
  ctx.fillText(linkText, textCenterX, textCenterY);
  ctx.restore();

  ctx.restore();
};

const drawMiniFooterBanner = (ctx, image, layout = {}) => {
  if (!ctx || !image || !layout.width || !layout.height) return;
  const { x = 0, y = 0, width, height } = layout;
  const radius = Math.min(36, height / 2);
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = Math.max(18, height * 0.25);
  ctx.shadowOffsetY = Math.max(6, height * 0.12);
  drawRoundedRectPath(ctx, x, y, width, height, radius);
  ctx.clip();
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
};

export const CanvasUtils = {
  drawBackground,
  drawOverlay,
  drawBrandLogo,
  drawHeader,
  drawFooter,
  drawMiniFooterBanner,
  drawMatches,
  drawScoreboardMatches,
  drawBigMatchLayout,
  drawTogelResult,
  drawRaffleDateCapsule,
  drawRaffleWinnersTable,
};

if (typeof window !== "undefined") {
  Object.assign(window, CanvasUtils);
}
