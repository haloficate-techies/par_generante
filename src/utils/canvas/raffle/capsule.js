import { DEFAULT_BRAND_PALETTE } from "../constants";
import { drawRoundedRectPath } from "../geometry";
import { darkenColor, lightenColor, mixColors } from "../../color-utils";

const toRgba = (hex, alpha) => {
  if (!hex || typeof hex !== "string") return `rgba(0, 0, 0, ${alpha})`;
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const drawRaffleDateCapsule = (
  ctx,
  label,
  { startY = 0, palette = DEFAULT_BRAND_PALETTE } = {}
) => {
  if (!ctx || !label) return 0;
  const paletteSafe = palette || DEFAULT_BRAND_PALETTE;
  const capsuleHeight = 48;
  const capsuleWidth = Math.min(ctx.canvas.width * 0.75, 560);
  const capsuleX = (ctx.canvas.width - capsuleWidth) / 2;
  const capsuleY = startY + 12;
  const radius = 24;
  const rawText = `${label}`.trim();
  const text = rawText.toUpperCase();
  const headerStart =
    paletteSafe?.headerStart || DEFAULT_BRAND_PALETTE.headerStart;
  const headerEnd = paletteSafe?.headerEnd || DEFAULT_BRAND_PALETTE.headerEnd;
  const accent = paletteSafe?.accent || DEFAULT_BRAND_PALETTE.accent;

  ctx.save();
  ctx.shadowColor = toRgba(accent, 0.2);
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  drawRoundedRectPath(ctx, capsuleX, capsuleY, capsuleWidth, capsuleHeight, radius);
  const gradient = ctx.createLinearGradient(
    capsuleX,
    capsuleY,
    capsuleX + capsuleWidth,
    capsuleY + capsuleHeight
  );
  gradient.addColorStop(0, darkenColor(headerStart, 0.18));
  gradient.addColorStop(0.5, headerStart);
  gradient.addColorStop(1, lightenColor(headerEnd, 0.18));
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, capsuleX, capsuleY, capsuleWidth, capsuleHeight, radius);
  ctx.strokeStyle = toRgba(lightenColor(accent, 0.12), 0.3);
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.clip();
  const glossGradient = ctx.createLinearGradient(
    capsuleX,
    capsuleY,
    capsuleX,
    capsuleY + capsuleHeight
  );
  glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.14)");
  glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glossGradient;
  ctx.fillRect(capsuleX, capsuleY, capsuleWidth, capsuleHeight * 0.42);
  ctx.globalAlpha = 1;
  const vignette = ctx.createRadialGradient(
    capsuleX + capsuleWidth / 2,
    capsuleY + capsuleHeight / 2,
    capsuleHeight * 0.25,
    capsuleX + capsuleWidth / 2,
    capsuleY + capsuleHeight / 2,
    capsuleWidth * 0.6
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.28)");
  ctx.fillStyle = vignette;
  ctx.fillRect(capsuleX, capsuleY, capsuleWidth, capsuleHeight);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = Math.max(20, Math.round(capsuleHeight * 0.42));
  ctx.font = `900 ${fontSize}px Poppins`;
  ctx.shadowColor = "rgba(15, 23, 42, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  const hasLottery = text.includes("LOTTERY");
  if (hasLottery) {
    const mainText = text.replace("LOTTERY", "").replace(/\s+/g, " ").trim();
    const badgeText = "LOTTERY";
    ctx.font = `900 ${fontSize}px Poppins`;
    const mainWidth = ctx.measureText(mainText).width;
    const badgeFontSize = 14;
    ctx.font = `700 ${badgeFontSize}px Poppins`;
    const badgePaddingX = 10;
    const badgePaddingY = 4;
    const badgeWidth = ctx.measureText(badgeText).width + badgePaddingX * 2;
    const badgeHeight = badgeFontSize + badgePaddingY * 2;
    const totalWidth = mainWidth + 10 + badgeWidth;
    const centerX = capsuleX + capsuleWidth / 2;
    const mainX = centerX - totalWidth / 2 + mainWidth / 2;
    const badgeX = centerX - totalWidth / 2 + mainWidth + 10;
    const badgeY = capsuleY + capsuleHeight / 2 - badgeHeight / 2;

    ctx.font = `900 ${fontSize}px Poppins`;
    ctx.textAlign = "center";
    ctx.fillText(mainText, mainX, capsuleY + capsuleHeight / 2);

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 1;
    drawRoundedRectPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 12);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.font = `700 ${badgeFontSize}px Poppins`;
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, capsuleY + capsuleHeight / 2 + 0.5);
  } else {
    ctx.fillText(text, capsuleX + capsuleWidth / 2, capsuleY + capsuleHeight / 2);
  }
  ctx.restore();

  return capsuleHeight + 32;
};
