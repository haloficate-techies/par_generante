export const computeMiniBannerLayout = (
  canvas,
  image,
  { marginRatio = 0.08, offsetBottom = 28 } = {}
) => {
  if (!canvas || !image) return null;
  const canvasWidth = canvas.width;
  const marginX = Math.max(48, canvasWidth * marginRatio);
  const availableWidth = Math.max(canvasWidth - marginX * 2, canvasWidth * 0.5);
  const imageWidth = image.width || availableWidth;
  const imageHeight = image.height || 1;
  const aspectRatio = imageWidth / imageHeight;
  let width = Math.min(availableWidth, canvasWidth - marginX);
  let height = width / aspectRatio;
  const footerHeight = 110;
  let y = canvas.height - footerHeight - offsetBottom - height;
  if (y < 0) {
    height = Math.max(40, canvas.height - footerHeight - offsetBottom - 20);
    width = height * aspectRatio;
    y = Math.max(20, canvas.height - footerHeight - offsetBottom - height);
  }
  const x = (canvas.width - width) / 2;
  return {
    x,
    y,
    width,
    height,
    totalHeight: height + offsetBottom,
  };
};

