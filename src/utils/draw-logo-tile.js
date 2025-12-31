import { clamp } from "./color-utils";

export const PLACEHOLDER_COLORS = {
  fill: "#1f2937",
  border: "rgba(148, 163, 184, 0.4)",
  text: "#e2e8f0",
};

const getInitials = (name) => {
  if (!name) return "FC";
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? words[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
};

export const applyFittedFont = (
  ctx,
  text,
  { maxSize, minSize = 12, weight = 600, maxWidth, family = '"Poppins", sans-serif' }
) => {
  let size = maxSize;
  const floor = Math.max(8, minSize);
  while (size > floor) {
    ctx.font = `${weight} ${Math.round(size)}px ${family}`;
    if (!maxWidth || ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  ctx.font = `${weight} ${Math.round(floor)}px ${family}`;
  return floor;
};

export const clampMin = (value, min) => Math.max(min, value);

export const drawLogoTile = (
  ctx,
  image,
  x,
  y,
  size,
  fallbackName,
  options = {}
) => {
  const radius = size / 2;
  const centerX = x + radius;
  const centerY = y + radius;
  const borderWidth = Math.max(2, size * 0.08);
  const {
    scale = 1,
    offsetX = 0,
    offsetY = 0,
    paddingRatio = 0.08,
    placeholderColors,
  } = options || {};
  const placeholder = placeholderColors || PLACEHOLDER_COLORS;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();

  if (image) {
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
    ctx.shadowBlur = Math.max(14, size * 0.4);
    ctx.shadowOffsetY = Math.max(4, size * 0.12);
    ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.clip();
    const usableSize = size * (1 - paddingRatio);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const baseScale =
      imageWidth && imageHeight
        ? Math.max(usableSize / imageWidth, usableSize / imageHeight)
        : 1;
    const effectiveScale = baseScale * clamp(scale ?? 1, 0.7, 1.5);
    const renderWidth =
      imageWidth && imageHeight ? imageWidth * effectiveScale : usableSize;
    const renderHeight =
      imageWidth && imageHeight ? imageHeight * effectiveScale : usableSize;
    const offsetLimit = usableSize * 0.5;
    const offsetXPx = clamp(offsetX ?? 0, -0.75, 0.75) * offsetLimit;
    const offsetYPx = clamp(offsetY ?? 0, -0.75, 0.75) * offsetLimit;
    const renderX = centerX - renderWidth / 2 + offsetXPx;
    const renderY = centerY - renderHeight / 2 + offsetYPx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      centerX - usableSize / 2,
      centerY - usableSize / 2,
      usableSize,
      usableSize
    );
    ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.fillStyle = placeholder.fill || PLACEHOLDER_COLORS.fill;
    ctx.fill();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = placeholder.border || PLACEHOLDER_COLORS.border;
    ctx.stroke();

    ctx.save();
    ctx.clip();
    ctx.fillStyle = placeholder.text || PLACEHOLDER_COLORS.text;
    ctx.font = `700 ${size * 0.38}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(fallbackName), centerX, centerY);
    ctx.restore();
  }

  ctx.restore();
};

