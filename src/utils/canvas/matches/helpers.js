import { DEFAULT_BRAND_PALETTE, clamp } from "../constants";
import { ensureSubduedGradientColor } from "../color";
import { drawRoundedRectPath } from "../geometry";
import { drawImageCover } from "../image";

export const layoutTeamName = (
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

  const multiWordModifier = words.length > 1 ? 0.94 : 1;
  const targetMax = Math.max(minFontSize, Math.round(maxFontSize * multiWordModifier));
  const targetMin = Math.max(8, Math.round(minFontSize));
  const widthTolerance = words.length === 1 ? 1.08 : 1;

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
    if (singleLineWidth <= safeWidth * widthTolerance) {
      return {
        fontSize: size,
        lines: [joined],
      };
    }

    if (words.length === 1) {
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

export const drawPlayerPortraitCard = (
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
  if (!image) {
    ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetY = shadowOffsetY;
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    ctx.fill();
  }
  ctx.restore();

  if (image) {
    ctx.save();
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.clip();
    drawImageCover(ctx, image, x, y, width, height, {
      scale: clamp(adjustments.scale ?? 1, 0.6, 1.6),
      offsetX: clamp(adjustments.offsetX ?? 0, -1.1, 1.1),
      offsetY: clamp(adjustments.offsetY ?? 0, -1.1, 1.1),
      flipHorizontal: Boolean(adjustments.flip),
    });
    ctx.restore();
  } else {
    ctx.save();
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.clip();
    const placeholderGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    placeholderGradient.addColorStop(0, "#111827");
    placeholderGradient.addColorStop(1, "#1f2937");
    ctx.fillStyle = placeholderGradient;
    ctx.fillRect(x, y, width, height);
    const overlayGradient = ctx.createLinearGradient(x, y + height * 0.45, x, y + height);
    overlayGradient.addColorStop(0, "rgba(15, 23, 42, 0)");
    overlayGradient.addColorStop(0.55, "rgba(15, 23, 42, 0.45)");
    overlayGradient.addColorStop(1, "rgba(15, 23, 42, 0.9)");
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }

  const safeLabel = typeof label === "string" ? label.trim() : "";
  if (showPlaceholderLabel && !image) {
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

export const drawVsBadge = (ctx, centerX, centerY, radius, detailScale = 1) => {
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

export const drawEsportsGameSlot = (ctx, x, y, size, { logoImage, label } = {}) => {
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
