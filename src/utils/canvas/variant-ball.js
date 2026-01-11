export const drawVariantBall = (ctx, { x, y, text, radius = 28 } = {}) => {
  if (!ctx || !text || !Number.isFinite(x) || !Number.isFinite(y)) {
    return;
  }

  const safeRadius = Math.max(8, radius);
  const outerRadius = safeRadius;
  const innerRadius = Math.max(outerRadius - 4, safeRadius * 0.75);

  ctx.save();
  const baseGradient = ctx.createRadialGradient(
    x - outerRadius * 0.35,
    y - outerRadius * 0.35,
    outerRadius * 0.2,
    x,
    y,
    outerRadius
  );
  baseGradient.addColorStop(0, "#ff5757");
  baseGradient.addColorStop(1, "#b00000");

  ctx.beginPath();
  ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = baseGradient;
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, Math.round(outerRadius * 0.18));
  ctx.beginPath();
  ctx.arc(x, y, outerRadius - ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = Math.max(2, Math.round(outerRadius * 0.1));
  ctx.beginPath();
  ctx.arc(x, y, innerRadius - ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.round(outerRadius * 1.05)}px "Inter", "Arial", sans-serif`;
  ctx.fillText(String(text).toUpperCase(), x, y);
  ctx.restore();
};
