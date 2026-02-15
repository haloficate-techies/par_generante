import {
  buildImageSourceCandidates,
  buildProxiedImageUrl,
} from "../data/image-proxy";

const TEAM_LOGO_IMAGE_CACHE = new Map();

export const readFileAsDataURL = (
  file,
  { maxDimension = 640, outputType = "image/png" } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const finalizeWithFileReader = () => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    };

    loadImage(objectUrl)
      .then((image) => {
        URL.revokeObjectURL(objectUrl);
        const maxSide = Math.max(image.width, image.height);
        if (!maxSide || maxSide <= maxDimension) {
          finalizeWithFileReader();
          return;
        }
        const scale = maxDimension / maxSide;
        const targetWidth = Math.max(1, Math.round(image.width * scale));
        const targetHeight = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL(outputType));
      })
      .catch((error) => {
        console.warn("Gagal mengoptimasi gambar upload, pakai ukuran asli.", error);
        URL.revokeObjectURL(objectUrl);
        finalizeWithFileReader();
      });
  });

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (event) => reject(event);
    img.src = src;
  });

const isSvgUrl = (value) => {
  if (typeof value !== "string" || !value) return false;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.pathname.toLowerCase().endsWith(".svg");
  } catch (error) {
    return /\.svg(\?|#|$)/i.test(value);
  }
};

const estimateSvgSize = (svgText) => {
  if (typeof svgText !== "string" || !svgText) {
    return { width: 512, height: 512 };
  }

  const numeric = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const widthMatch = svgText.match(/\bwidth\s*=\s*["']\s*([0-9.]+)\s*(px)?\s*["']/i);
  const heightMatch = svgText.match(/\bheight\s*=\s*["']\s*([0-9.]+)\s*(px)?\s*["']/i);
  const width = widthMatch ? numeric(widthMatch[1]) : null;
  const height = heightMatch ? numeric(heightMatch[1]) : null;
  if (width && height) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const viewBoxMatch = svgText.match(/\bviewBox\s*=\s*["']\s*([-0-9.\s]+)\s*["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1]
      .trim()
      .split(/\s+/)
      .map((part) => Number.parseFloat(part));
    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      const vbWidth = parts[2];
      const vbHeight = parts[3];
      if (vbWidth > 0 && vbHeight > 0) {
        return { width: Math.round(vbWidth), height: Math.round(vbHeight) };
      }
    }
  }

  return { width: 512, height: 512 };
};

const convertSvgUrlToPngDataUrl = async (src, { maxDimension = 512 } = {}) => {
  if (typeof src !== "string" || !src || !/^https?:\/\//i.test(src)) {
    return null;
  }

  const proxied = buildProxiedImageUrl(src);
  const fetchUrl = proxied || src;
  const response = await fetch(fetchUrl, {
    mode: "cors",
    headers: { Accept: "image/svg+xml,*/*" },
  });
  if (!response.ok) {
    throw new Error(`Gagal mengambil SVG (${response.status})`);
  }

  const svgText = await response.text();
  const { width: rawWidth, height: rawHeight } = estimateSvgSize(svgText);
  const maxSide = Math.max(rawWidth || 0, rawHeight || 0) || 512;
  const scale = maxSide > maxDimension ? maxDimension / maxSide : 1;
  const width = Math.max(1, Math.round(rawWidth * scale));
  const height = Math.max(1, Math.round(rawHeight * scale));

  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const candidates = buildImageSourceCandidates(src);
    if (!candidates.length) {
      reject(new Error("Sumber gambar tidak valid"));
      return;
    }

    let settled = false;
    const finalizeResolve = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const finalizeReject = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const attemptCandidate = async (index) => {
      if (index >= candidates.length) {
        finalizeReject(
          new Error(`Gagal memuat gambar setelah mencoba ${candidates.length} sumber.`)
        );
        return;
      }
      const candidateSrc = candidates[index];
      try {
        const image = await loadImageElement(candidateSrc);
        finalizeResolve(image);
      } catch (error) {
        if (typeof candidateSrc === "string" && isSvgUrl(candidateSrc)) {
          try {
            const pngDataUrl = await convertSvgUrlToPngDataUrl(candidateSrc);
            if (pngDataUrl) {
              const pngImage = await loadImageElement(pngDataUrl);
              finalizeResolve(pngImage);
              return;
            }
          } catch (convertError) {
            // ignore and continue with fallback candidate
          }
        }
        return attemptCandidate(index + 1);
      }
    };

    attemptCandidate(0);
  });

export const loadOptionalImage = async (src) => {
  if (!src) return null;
  try {
    return await loadImage(src);
  } catch (error) {
    console.warn("Gagal memuat gambar opsional:", src, error);
    return null;
  }
};

const createWorkingCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  return { canvas, context };
};

const calculateCornerBackground = (imageData, width, height) => {
  const samplePoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
  ];

  const totals = { r: 0, g: 0, b: 0 };
  let count = 0;

  for (const [x, y] of samplePoints) {
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const index = (y * width + x) * 4;
    const alpha = imageData.data[index + 3];
    if (alpha < 255) continue;
    totals.r += imageData.data[index];
    totals.g += imageData.data[index + 1];
    totals.b += imageData.data[index + 2];
    count += 1;
  }

  if (count === 0) {
    return null;
  }

  return {
    r: totals.r / count,
    g: totals.g / count,
    b: totals.b / count,
  };
};

const calculateColorDistance = (colorA, colorB) => {
  const dr = colorA.r - colorB.r;
  const dg = colorA.g - colorB.g;
  const db = colorA.b - colorB.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const findOpaqueBounds = (imageData, width, height) => {
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = imageData.data[index + 3];
      if (alpha > 20) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) {
    return null;
  }

  return {
    x: Math.max(0, minX - 2),
    y: Math.max(0, minY - 2),
    width: Math.min(width, maxX + 2) - Math.max(0, minX - 2),
    height: Math.min(height, maxY + 2) - Math.max(0, minY - 2),
  };
};

const ensureTransparentBackground = async (image) => {
  try {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return image;

    const { canvas, context } = createWorkingCanvas(width, height);
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);

    let alreadyTransparent = false;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 255) {
        alreadyTransparent = true;
        break;
      }
    }
    if (alreadyTransparent) {
      return image;
    }

    const backgroundColor = calculateCornerBackground(imageData, width, height);
    if (!backgroundColor) {
      return image;
    }

    const brightness =
      (backgroundColor.r + backgroundColor.g + backgroundColor.b) / 3;
    if (brightness < 205) {
      return image;
    }

    const toleranceBase = 36;
    const tolerance =
      brightness > 245 ? toleranceBase * 0.75 : toleranceBase * 1.4;
    const whiteCutoff = Math.max(230, brightness - 6);
    const softRange = tolerance * 1.6;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const current = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };
      const distance = calculateColorDistance(current, backgroundColor);
      const luma = (current.r + current.g + current.b) / 3;
      if (distance <= tolerance || luma >= whiteCutoff) {
        imageData.data[i + 3] = 0;
      } else if (distance <= softRange) {
        const normalized = Math.min(
          1,
          Math.max(0, (distance - tolerance) / (softRange - tolerance))
        );
        imageData.data[i + 3] = Math.round(
          imageData.data[i + 3] * normalized * normalized
        );
      }
    }

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 24) {
        imageData.data[i] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    const bounds = findOpaqueBounds(imageData, width, height);
    if (!bounds) {
      return image;
    }

    const squareSize = Math.max(bounds.width, bounds.height);
    const squareCanvas = document.createElement("canvas");
    squareCanvas.width = squareSize;
    squareCanvas.height = squareSize;
    const squareContext = squareCanvas.getContext("2d");
    squareContext.clearRect(0, 0, squareSize, squareSize);
    squareContext.drawImage(
      canvas,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      (squareSize - bounds.width) / 2,
      (squareSize - bounds.height) / 2,
      bounds.width,
      bounds.height
    );

    const dataUrl = squareCanvas.toDataURL("image/png");
    const processedImage = await loadImage(dataUrl);
    return processedImage;
  } catch (error) {
    console.warn("Gagal membersihkan latar belakang logo otomatis:", error);
    return image;
  }
};

export const removeLogoBackgroundClientSide = async (src) => {
  if (!src) {
    throw new Error("Tidak ada gambar logo yang bisa diproses.");
  }

  const image = await loadOptionalImage(src);
  if (!image) {
    throw new Error("Gagal memuat gambar logo untuk diproses.");
  }

  const processedImage = await ensureTransparentBackground(image);
  const width = processedImage.naturalWidth || processedImage.width;
  const height = processedImage.naturalHeight || processedImage.height;
  if (!width || !height) {
    throw new Error("Dimensi gambar logo tidak valid.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(processedImage, 0, 0, width, height);
  return canvas.toDataURL("image/png");
};

export const loadTeamLogoImage = async (src, { applyAutoProcessing = false } = {}) => {
  if (!src) return null;
  const cacheKey = `${applyAutoProcessing ? "auto" : "raw"}|${src}`;
  const cached = TEAM_LOGO_IMAGE_CACHE.get(cacheKey);
  if (cached) {
    if (cached instanceof Promise) {
      return cached;
    }
    return cached;
  }

  const loader = (async () => {
    const image = await loadOptionalImage(src);
    if (!image) return null;
    if (applyAutoProcessing) {
      return ensureTransparentBackground(image);
    }
    return image;
  })()
    .then((result) => {
      TEAM_LOGO_IMAGE_CACHE.set(cacheKey, result);
      return result;
    })
    .catch((error) => {
      TEAM_LOGO_IMAGE_CACHE.delete(cacheKey);
      throw error;
    });

  TEAM_LOGO_IMAGE_CACHE.set(cacheKey, loader);
  return loader;
};

