import { DEFAULT_BRAND_PALETTE } from "../constants";
import { drawRoundedRectPath } from "../geometry";

export const drawRaffleDateCapsule = (
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
  const glossGradient = ctx.createLinearGradient(
    capsuleX,
    capsuleY,
    capsuleX,
    capsuleY + capsuleHeight
  );
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
