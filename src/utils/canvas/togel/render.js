import {
  DEFAULT_BRAND_PALETTE,
  clampMin,
} from "./constants";
import { drawRoundedRectPath } from "./geometry";
import { resolveTogelDateLabel, getTodayDateLabel } from "./date";
import { normalizeTogelDigits } from "./togel/digits";
import { resolveStreamingUrlCanvasStyle } from "./togel/streaming-style";

export const drawTogelInfoPill = (
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

export const drawDigitOrb = (
  ctx,
  x,
  y,
  radius,
  digitText,
  palette = DEFAULT_BRAND_PALETTE
) => {
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
  ctx.shadowBlur = Math.max(16, radius * 0.8);
  ctx.shadowOffsetY = Math.max(6, radius * 0.25);

  const gradient = ctx.createLinearGradient(
    x - radius,
    y - radius,
    x + radius,
    y + radius
  );
  gradient.addColorStop(0, palette?.headerStart ?? "#2563eb");
  gradient.addColorStop(1, palette?.headerEnd ?? "#ec4899");

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  const innerHighlight = ctx.createLinearGradient(
    x,
    y - radius,
    x,
    y + radius
  );
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

export const drawTogelResult = (
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
  const availableHeight = Math.max(
    ctx.canvas.height - footerGuard - startY,
    220
  );
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
  const cardGradient = ctx.createLinearGradient(
    cardX,
    cardY,
    cardX + cardWidth,
    cardY + cardHeight
  );
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
  const firstCenterX =
    cardX + (cardWidth - totalRowWidth) / 2 + digitRadius;
  const digitsCenterY =
    cardY + innerPaddingY + (cardHeight - innerPaddingY * 2) / 2;

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
    const gradient = ctx.createLinearGradient(
      infoX,
      infoY,
      infoX + infoWidth,
      infoY + infoHeight
    );
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
      descriptorLine &&
      !titleLine.toLowerCase().includes(descriptorLine.toLowerCase())
        ? `${titleLine} ${descriptorLine}`.trim()
        : (titleLine || descriptorLine || "Live Streaming").trim();
    const secondLine = (
      streamingInfo.displayUrl ||
      streamingInfo.url ||
      ""
    )
      .trim()
      .toLowerCase();
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
      const pillGradient = ctx.createLinearGradient(
        pillX,
        pillY,
        pillX,
        pillY + pillHeight
      );
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
};
