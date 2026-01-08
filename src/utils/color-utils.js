export const DEFAULT_BRAND_PALETTE = {
  headerStart: "#6366f1",
  headerEnd: "#ec4899",
  footerStart: "#22c55e",
  footerEnd: "#0d9488",
  accent: "#38bdf8",
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

export const rgbToHex = (r, g, b) => {
  const toHex = (component) => component.toString(16).padStart(2, "0");
  return `#${toHex(clamp(Math.round(r), 0, 255))}${toHex(
    clamp(Math.round(g), 0, 255)
  )}${toHex(clamp(Math.round(b), 0, 255))}`;
};

const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

export const mixColors = (baseHex, targetHex, amount) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const normalizedAmount = clamp(amount, 0, 1);
  const mixChannel = (channel) =>
    clamp(
      base[channel] + (target[channel] - base[channel]) * normalizedAmount,
      0,
      255
    );
  return rgbToHex(mixChannel("r"), mixChannel("g"), mixChannel("b"));
};

export const lightenColor = (hex, amount) =>
  mixColors(hex, "#ffffff", clamp(amount, 0, 1));
export const darkenColor = (hex, amount) =>
  mixColors(hex, "#000000", clamp(amount, 0, 1));
const colorDistance = (colorA, colorB) => {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
  );
};

export const deriveBrandPalette = (image) => {
  if (!image) return DEFAULT_BRAND_PALETTE;
  try {
    const sampleSize = 96;
    const aspect = image.width / image.height || 1;
    const width = sampleSize;
    const height = Math.max(1, Math.round(sampleSize / aspect));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 160) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = `${r >> 3}-${g >> 3}-${b >> 3}`;
      let entry = buckets.get(key);
      if (!entry) {
        entry = { count: 0, r: 0, g: 0, b: 0 };
        buckets.set(key, entry);
      }
      entry.count += 1;
      entry.r += r;
      entry.g += g;
      entry.b += b;
    }

    const bucketArray = Array.from(buckets.values()).filter(
      (entry) => entry.count > 0
    );
    if (!bucketArray.length) {
      return DEFAULT_BRAND_PALETTE;
    }
    const enrichedBuckets = bucketArray
      .map((entry) => {
        const rAvg = entry.r / entry.count;
        const gAvg = entry.g / entry.count;
        const bAvg = entry.b / entry.count;
        const hex = rgbToHex(rAvg, gAvg, bAvg);
        const { s, l } = rgbToHsl(rAvg, gAvg, bAvg);
        return {
          count: entry.count,
          hex,
          saturation: s,
          lightness: l,
        };
      })
      .sort((a, b) => b.count - a.count);

    const vibrantCandidates = enrichedBuckets.filter(
      (entry) =>
        entry.saturation >= 0.2 &&
        entry.lightness >= 0.15 &&
        entry.lightness <= 0.8
    );
    const candidates =
      vibrantCandidates.length > 0 ? vibrantCandidates : enrichedBuckets;

    const primaryEntry = candidates[0];
    const primary = primaryEntry?.hex ?? DEFAULT_BRAND_PALETTE.headerStart;

    let secondaryEntry =
      candidates.slice(1).find(
        (entry) => colorDistance(entry.hex, primary) >= 80
      ) ?? candidates[1];

    if (!secondaryEntry) {
      secondaryEntry = {
        hex: lightenColor(primary, 0.25),
        saturation: 1,
        lightness: 0.5,
      };
    }

    let secondary = secondaryEntry.hex;
    if (colorDistance(primary, secondary) < 60) {
      secondary = lightenColor(primary, 0.25);
    }

    const headerStart = lightenColor(primary, 0.05);
    const headerEnd = lightenColor(secondary, 0.12);
    const footerStart = lightenColor(primary, 0.12);
    const footerEnd = darkenColor(secondary, 0.18);
    const accent = lightenColor(secondary, 0.3);

    return {
      headerStart,
      headerEnd,
      footerStart,
      footerEnd,
      accent,
    };
  } catch (error) {
    console.warn("Gagal mengambil palet logo:", error);
    return DEFAULT_BRAND_PALETTE;
  }
};

