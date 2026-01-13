import { darkenColor, lightenColor, mixColors } from "../color-utils";

const resolveBallColors = (palette = {}) => {
  const baseStart = palette?.headerStart || "#ff2d2d";
  const baseEnd = palette?.headerEnd || baseStart;
  const accent = palette?.accent || baseStart;
  return {
    outerHighlight: lightenColor(mixColors(baseStart, accent, 0.35), 0.25),
    outerShadow: darkenColor(mixColors(baseEnd, accent, 0.4), 0.3),
    innerHighlight: lightenColor(mixColors(baseStart, "#ffffff", 0.4), 0.2),
    innerShadow: darkenColor(mixColors(baseEnd, "#000000", 0.2), 0.2),
  };
};

export const drawVariantBall = (
  ctx,
  { x, y, text, radius = 28, palette, fontScale = 0.9 } = {}
) => {
  if (!ctx || !text || !Number.isFinite(x) || !Number.isFinite(y)) {
    return;
  }

  const safeRadius = Math.max(8, radius);
  const outerRadius = safeRadius;
  const ringOuter = Math.max(2, Math.round(outerRadius * 0.30));
  const ringGap = Math.max(2, Math.round(outerRadius * 0.08));
  const ringInner = Math.max(1, Math.round(outerRadius * 0.03));
  const coreRadius = Math.max(
    6,
    outerRadius - ringOuter - ringGap - ringInner - ringGap
  );

  const { outerHighlight, outerShadow, innerHighlight, innerShadow } = resolveBallColors(
    palette
  );

  ctx.save();
  const outerGradient = ctx.createRadialGradient(
    x - outerRadius * 0.35,
    y - outerRadius * 0.35,
    outerRadius * 0.15,
    x,
    y,
    outerRadius
  );
  outerGradient.addColorStop(0, outerHighlight);
  outerGradient.addColorStop(1, outerShadow);
  ctx.fillStyle = outerGradient;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, outerRadius - ringOuter, 0, Math.PI * 2);
  ctx.fill();

  const innerGradient = ctx.createRadialGradient(
    x - outerRadius * 0.2,
    y - outerRadius * 0.2,
    outerRadius * 0.12,
    x,
    y,
    outerRadius - ringOuter - ringGap
  );
  innerGradient.addColorStop(0, innerHighlight);
  innerGradient.addColorStop(1, innerShadow);
  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius - ringOuter - ringGap, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const safeFontScale = Number.isFinite(fontScale) ? fontScale : 0.9;
  ctx.font = `900 ${Math.round(coreRadius * safeFontScale)}px "Inter", "Arial", sans-serif`;
  ctx.fillText(String(text).toUpperCase(), x, y);
  ctx.restore();
};
