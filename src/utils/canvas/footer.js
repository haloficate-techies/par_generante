import {
  DEFAULT_BRAND_PALETTE,
  PLACEHOLDER_FILL_COLOR,
  PLACEHOLDER_TEXT_COLOR,
  applyFittedFont,
  hexToRgb,
} from "./constants";
import { ensureSubduedGradientColor } from "./color";
import { drawRoundedRectPath } from "./geometry";
import { drawImageCover } from "./image";

export const drawFooter = (ctx, footerImage, linkTextInput, palette = DEFAULT_BRAND_PALETTE) => {
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


export const drawMiniFooterBanner = (ctx, image, layout = {}) => {
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

