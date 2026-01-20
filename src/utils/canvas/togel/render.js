import {
  DEFAULT_BRAND_PALETTE,
  clampMin,
} from "../constants";
import { drawRoundedRectPath } from "../geometry";
import { drawVariantBall } from "../variant-ball";
import { resolveTogelDateLabel, getTodayDateLabel } from "../date";
import { normalizeTogelDigits } from "./digits";
import { resolveStreamingUrlCanvasStyle } from "./streaming-style";

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
  ctx.clip();
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(cardX, bodyY, cardWidth, cardHeight - headerHeight);

  const leftAreaWidth = cardWidth * 0.7;
  const rightAreaWidth = cardWidth - leftAreaWidth;
  const headerLeftGradient = ctx.createLinearGradient(
    cardX,
    cardY,
    cardX + leftAreaWidth,
    cardY + headerHeight
  );
  headerLeftGradient.addColorStop(0, palette?.headerStart ?? "#dc2626");
  headerLeftGradient.addColorStop(1, palette?.headerEnd ?? "#991b1b");
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
  headerRightGradient.addColorStop(0, palette?.headerRightStart ?? "#1f2937");
  headerRightGradient.addColorStop(1, palette?.headerRightEnd ?? "#111827");
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
  ctx.fillStyle = "#f8fafc";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
  ctx.shadowBlur = Math.max(6, headerHeight * 0.18);
  ctx.shadowOffsetY = Math.max(2, headerHeight * 0.08);

  ctx.save();
  ctx.beginPath();
  ctx.rect(cardX, cardY, leftAreaWidth, headerHeight);
  ctx.clip();
  ctx.font = `800 ${Math.round(Math.max(18, Math.min(headerHeight * 0.42, 48)))}px Poppins`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.5px";
  ctx.fillStyle = "#f8fafc";
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1.5;
  const dateTextX = cardX + leftAreaWidth / 2;
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
    ctx.shadowColor = "rgba(226, 232, 240, 0.35)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 0.5;
    const timeTextX = cardX + leftAreaWidth + rightAreaWidth / 2;
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
    const footerTopGradient = ctx.createLinearGradient(
      cardX,
      footerY,
      cardX + cardWidth,
      footerY + footerTopHeight
    );
    footerTopGradient.addColorStop(0, palette?.footerStart ?? "#22c55e");
    footerTopGradient.addColorStop(1, palette?.footerEnd ?? "#0d9488");
    ctx.fillStyle = footerTopGradient;
    ctx.fillRect(cardX, footerY, cardWidth, footerTopHeight);

    const footerBottomGradient = ctx.createLinearGradient(
      cardX,
      footerY + footerTopHeight,
      cardX + cardWidth,
      footerY + footerHeight
    );
    footerBottomGradient.addColorStop(0, palette?.footerBottomStart ?? "#166534");
    footerBottomGradient.addColorStop(1, palette?.footerBottomEnd ?? "#0f172a");
    ctx.fillStyle = footerBottomGradient;
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
      .toLowerCase();
    const firstFontSize = Math.max(18, footerHeight * 0.26);
    const secondFontSize = Math.max(20, footerHeight * 0.3);
    ctx.font = `700 ${Math.round(firstFontSize)}px Poppins`;
    ctx.fillText(firstLine, cardX + cardWidth / 2, footerY + footerTopHeight / 2);
    if (secondLine) {
      const themeStyle = resolveStreamingUrlCanvasStyle(streamingInfo.theme);
      ctx.font = `800 ${Math.round(secondFontSize)}px Poppins`;
      ctx.fillStyle = themeStyle.color || "#f8fafc";
      ctx.shadowColor = themeStyle.shadow;
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.fillText(
        secondLine,
        cardX + cardWidth / 2,
        footerY + footerTopHeight + footerBottomHeight / 2
      );
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
};
