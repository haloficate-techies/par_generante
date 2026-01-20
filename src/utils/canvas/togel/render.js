import {
  DEFAULT_BRAND_PALETTE,
  clampMin,
} from "../constants";
import {
  darkenHexColor,
  desaturateHexColor,
  normalizeHeaderGradientColor,
  shouldUseTextOutline,
} from "../color";
import { drawRoundedRectPath } from "../geometry";
import { drawVariantBall } from "../variant-ball";
import { resolveTogelDateLabel, getTodayDateLabel } from "../date";
import { normalizeTogelDigits } from "./digits";
import { applyFooterLinkStyle } from "./streaming-style";

const drawDigitOrb = (
  ctx,
  x,
  y,
  radius,
  digitText,
  palette = DEFAULT_BRAND_PALETTE
) => {
  drawVariantBall(ctx, {
    x,
    y,
    text: digitText || "0",
    radius,
    fontScale: 1.1,
    palette,
  });
};

export const drawTogelResult = (
  ctx,
  {
    digits = [],
    poolCode = "",
    poolLabel = "",
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
  const footerGuard = 170;
  const availableHeight = Math.max(
    ctx.canvas.height - footerGuard - startY,
    220
  );
  const baseCardHeight = Math.min(
    Math.max(availableHeight * 0.7, 220),
    360
  );
  const footerHeight = hasStreamingInfo
    ? Math.max(86, Math.min(baseCardHeight * 0.32, 150))
    : 0;
  const originalCardHeight = baseCardHeight + footerHeight;
  const bodyExtraHeight = baseCardHeight * 0.08;
  const cardHeight = originalCardHeight + bodyExtraHeight;
  const verticalOffset = Math.max((availableHeight - cardHeight) / 2, 0);
  const cardY = startY + verticalOffset;
  const horizontalPadding = Math.max(70, ctx.canvas.width * 0.08);
  const cardX = horizontalPadding;
  const cardWidth = ctx.canvas.width - horizontalPadding * 2;
  const cardRadius = Math.max(32, originalCardHeight * 0.18);
  const headerHeight = Math.max(56, Math.min(originalCardHeight * 0.22, 120));
  const bodyY = cardY + headerHeight;
  const bodyHeight = Math.max(0, cardHeight - headerHeight - footerHeight);
  const innerPaddingX = Math.max(50, cardWidth * 0.12);
  const innerPaddingY = Math.max(36, bodyHeight * 0.2);
  const footerY = cardY + cardHeight - footerHeight;

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 18;
  drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.fillStyle = "rgba(15, 23, 42, 0.98)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.clip();
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(cardX, bodyY, cardWidth, cardHeight - headerHeight);

  const leftAreaWidth = cardWidth * 0.7;
  const rightAreaWidth = cardWidth - leftAreaWidth;
  const headerStartColor = normalizeHeaderGradientColor(
    palette?.headerStart,
    "#dc2626"
  );
  const headerEndColor = normalizeHeaderGradientColor(
    palette?.headerEnd,
    "#991b1b"
  );
  const headerRightStartColor = normalizeHeaderGradientColor(
    palette?.headerRightStart,
    "#1f2937",
    { minLuminance: 0.24 }
  );
  const headerRightEndColor = normalizeHeaderGradientColor(
    palette?.headerRightEnd,
    "#111827",
    { minLuminance: 0.22 }
  );
  const headerLeftGradient = ctx.createLinearGradient(
    cardX,
    cardY,
    cardX + leftAreaWidth,
    cardY + headerHeight
  );
  headerLeftGradient.addColorStop(0, headerStartColor);
  headerLeftGradient.addColorStop(1, headerEndColor);
  ctx.fillStyle = headerLeftGradient;
  ctx.fillRect(cardX, cardY, leftAreaWidth, headerHeight);

  const headerSheenHeight = Math.max(12, headerHeight * 0.2);
  const headerSheen = ctx.createLinearGradient(
    cardX,
    cardY,
    cardX,
    cardY + headerSheenHeight
  );
  headerSheen.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  headerSheen.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = headerSheen;
  ctx.fillRect(cardX, cardY, leftAreaWidth, headerSheenHeight);

  const headerRightGradient = ctx.createLinearGradient(
    cardX + leftAreaWidth,
    cardY,
    cardX + cardWidth,
    cardY + headerHeight
  );
  headerRightGradient.addColorStop(0, headerRightStartColor);
  headerRightGradient.addColorStop(1, headerRightEndColor);
  ctx.fillStyle = headerRightGradient;
  ctx.fillRect(cardX + leftAreaWidth, cardY, rightAreaWidth, headerHeight);
  ctx.restore();

  ctx.save();
  ctx.font = `700 ${Math.round(Math.max(18, headerHeight * 0.42))}px Poppins`;
  const rawDateLabel =
    resolveTogelDateLabel({ poolCode, variantLabel, drawTime }) ||
    getTodayDateLabel() ||
    new Date().toLocaleDateString();
  const dateText = rawDateLabel.toUpperCase();
  const drawTimeText = drawTime ? `${drawTime}` : "";
  ctx.restore();
  ctx.save();
  drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.clip();
  ctx.textBaseline = "middle";

  ctx.save();
  ctx.beginPath();
  ctx.rect(cardX, cardY, leftAreaWidth, headerHeight);
  ctx.clip();
  ctx.font = `800 ${Math.round(Math.max(18, Math.min(headerHeight * 0.42, 48)))}px Poppins`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.5px";
  ctx.fillStyle = "#f8fafc";
  ctx.shadowColor = "rgba(15, 23, 42, 0.38)";
  ctx.shadowBlur = Math.max(4, headerHeight * 0.16);
  ctx.shadowOffsetY = Math.max(1, headerHeight * 0.06);
  const dateTextX = cardX + leftAreaWidth / 2;
  if (shouldUseTextOutline(headerStartColor)) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(15, 23, 42, 0.6)";
    ctx.strokeText(dateText, dateTextX, cardY + headerHeight / 2);
  }
  ctx.fillText(dateText, dateTextX, cardY + headerHeight / 2);
  ctx.letterSpacing = "0px";
  ctx.restore();

  if (drawTimeText) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(cardX + leftAreaWidth, cardY, rightAreaWidth, headerHeight);
    ctx.clip();
    ctx.font = `600 ${Math.round(Math.max(16, Math.min(headerHeight * 0.38, 44)))}px Poppins`;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.5px";
    ctx.fillStyle = "rgba(248, 250, 252, 0.9)";
    ctx.shadowColor = "rgba(15, 23, 42, 0.28)";
    ctx.shadowBlur = Math.max(3, headerHeight * 0.12);
    ctx.shadowOffsetY = Math.max(1, headerHeight * 0.05);
    const timeTextX = cardX + leftAreaWidth + rightAreaWidth / 2;
    if (shouldUseTextOutline(headerRightStartColor)) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(15, 23, 42, 0.55)";
      ctx.strokeText(drawTimeText, timeTextX, cardY + headerHeight / 2);
    }
    ctx.fillText(drawTimeText, timeTextX, cardY + headerHeight / 2);
    ctx.letterSpacing = "0px";
    ctx.restore();
  }
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.restore();

  const digitsAreaWidth = Math.max(0, cardWidth - innerPaddingX * 2);
  let digitGap = 0;
  if (digitCount > 1) {
    const baseGap = Math.min(36, digitsAreaWidth / digitCount / 2);
    digitGap = digitCount >= 5 ? Math.min(10, baseGap) : baseGap;
  }
  const rawDiameter =
    digitCount > 0
      ? (digitsAreaWidth - digitGap * (digitCount - 1)) / digitCount
      : digitsAreaWidth;
  const diameterScale = digitCount >= 5 ? 1.3 : digitCount === 4 ? 1.22 : 1;
  const digitDiameter = clampMin(
    Math.min(rawDiameter * diameterScale, digitCount === 4 ? 260 : 260),
    digitCount === 4 ? 130 : 130
  );
  const digitRadius = digitDiameter / 2;
  const totalRowWidth =
    digitCount * digitDiameter + (digitCount - 1) * digitGap;
  const firstCenterX =
    cardX + (cardWidth - totalRowWidth) / 2 + digitRadius;
  const digitsCenterY =
    bodyY + innerPaddingY + (bodyHeight - innerPaddingY * 2) / 2;

  safeDigits.forEach((digit, index) => {
    const centerX = firstCenterX + index * (digitDiameter + digitGap);
    drawDigitOrb(ctx, centerX, digitsCenterY, digitRadius, digit, palette);
  });

  if (hasStreamingInfo) {
    ctx.save();
    drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.clip();
    const footerTopHeight = Math.max(34, footerHeight * 0.45);
    const footerBottomHeight = Math.max(34, footerHeight - footerTopHeight);
    const footerTopBg = darkenHexColor(
      desaturateHexColor(headerStartColor, 0.12),
      0.25
    );
    const footerBottomBg = darkenHexColor(headerEndColor, 0.15);
    ctx.fillStyle = footerTopBg;
    ctx.fillRect(cardX, footerY, cardWidth, footerTopHeight);

    ctx.fillStyle = footerBottomBg;
    ctx.fillRect(cardX, footerY + footerTopHeight, cardWidth, footerBottomHeight);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const poolLabelText = (
      poolLabel ||
      streamingInfo.poolLabel ||
      poolCode ||
      ""
    ).trim();
    const variantText = variantLabel ? variantLabel.trim() : "";
    const firstLine = `LIVE STREAMING ${poolLabelText} ${variantText}`
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
    const secondLine = (
      streamingInfo.displayUrl ||
      streamingInfo.url ||
      ""
    )
      .trim()
      .toUpperCase();
    const firstFontSize = Math.max(18, footerHeight * 0.26);
    const secondFontSize = Math.max(20, footerHeight * 0.3);
    ctx.font = `700 ${Math.round(firstFontSize)}px Poppins`;
    ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
    ctx.shadowBlur = Math.max(6, footerHeight * 0.2);
    ctx.shadowOffsetY = Math.max(1, footerHeight * 0.06);
    ctx.fillText(firstLine, cardX + cardWidth / 2, footerY + footerTopHeight / 2);
    if (secondLine) {
      const resetFooterLinkShadow = applyFooterLinkStyle(
        ctx,
        secondFontSize,
        0.5
      );
      ctx.fillText(
        secondLine,
        cardX + cardWidth / 2,
        footerY + footerTopHeight + footerBottomHeight / 2
      );
      resetFooterLinkShadow();
      ctx.letterSpacing = "0px";
    }
    ctx.restore();
  }
};
