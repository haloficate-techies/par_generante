export const drawBackground = (ctx, image) => {
  const { width, height } = ctx.canvas;
  if (image) {
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = "#000000ff";
    ctx.fillRect(0, 0, width, height);
  }
};

export const drawOverlay = (ctx) => {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
};
