let roundedRectPathCache = null;
let PATH2D_SUPPORTED = null;

const ensureCache = () => {
  if (!roundedRectPathCache) {
    roundedRectPathCache = new Map();
  }
  if (PATH2D_SUPPORTED == null) {
    PATH2D_SUPPORTED = typeof Path2D === "function";
  }
};

export const drawRoundedRectPath = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const getRoundedRectPath = (width, height, radius) => {
  ensureCache();
  if (!PATH2D_SUPPORTED) return null;
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  const key = `${width.toFixed(2)}|${height.toFixed(2)}|${safeRadius.toFixed(
    2
  )}`;
  if (roundedRectPathCache.has(key)) {
    return roundedRectPathCache.get(key);
  }
  const path = new Path2D();
  path.moveTo(safeRadius, 0);
  path.lineTo(width - safeRadius, 0);
  path.quadraticCurveTo(width, 0, width, safeRadius);
  path.lineTo(width, height - safeRadius);
  path.quadraticCurveTo(width, height, width - safeRadius, height);
  path.lineTo(safeRadius, height);
  path.quadraticCurveTo(0, height, 0, height - safeRadius);
  path.lineTo(0, safeRadius);
  path.quadraticCurveTo(0, 0, safeRadius, 0);
  path.closePath();
  if (roundedRectPathCache.size >= 64) {
    const oldestKey = roundedRectPathCache.keys().next().value;
    roundedRectPathCache.delete(oldestKey);
  }
  roundedRectPathCache.set(key, path);
  return path;
};

export const fillRoundedRectCached = (ctx, x, y, width, height, radius) => {
  const path = getRoundedRectPath(width, height, radius);
  if (!path) {
    drawRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.fill();
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.fill(path);
  ctx.restore();
};
