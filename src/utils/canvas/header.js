import {
  DEFAULT_BRAND_PALETTE,
  PLACEHOLDER_FILL_COLOR,
  PLACEHOLDER_BORDER_COLOR,
  PLACEHOLDER_TEXT_COLOR,
  applyFittedFont,
} from "./constants";
import { ensureSubduedGradientColor } from "./color";
import { drawRoundedRectPath } from "./geometry";

export const drawBrandLogo = (ctx, image, palette = DEFAULT_BRAND_PALETTE) => {
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


export const drawHeader = (
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
  const leftLogoLabel = options?.leftLogoLabel || "LOGO LIGA";
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
      const placeholderText = leftLogoLabel;
      ctx.fillText(placeholderText, slotX + slotWidth / 2, slotY + slotHeight / 2);
      ctx.restore();
    }
  }

  ctx.restore();
  return headerY + headerHeight;
};

