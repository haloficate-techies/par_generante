import { clamp } from "./constants";

export const drawImageCover = (
  ctx,
  image,
  x,
  y,
  width,
  height,
  options = {}
) => {
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
  const effectiveOffsetX = Number.isFinite(offsetXInput)
    ? clamp(offsetXInput, -1, 1)
    : 0;
  const effectiveOffsetY = Number.isFinite(offsetYInput)
    ? clamp(offsetYInput, -1, 1)
    : 0;
  const appliedOffsetX = shouldFlipHorizontal ? -effectiveOffsetX : effectiveOffsetX;
  const renderX = x + (width - drawWidth) / 2 + appliedOffsetX * offsetRangeX;
  const renderY = y + (height - drawHeight) / 2 + effectiveOffsetY * offsetRangeY;

  if (shouldFlipHorizontal) {
    ctx.save();
    ctx.translate(renderX + drawWidth / 2, renderY + drawHeight / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
    return;
  }

  ctx.drawImage(image, renderX, renderY, drawWidth, drawHeight);
};
