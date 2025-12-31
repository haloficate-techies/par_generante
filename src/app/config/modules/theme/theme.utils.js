const hexToRgbForTheme = (hex) => {
  if (typeof hex !== "string" || !hex) {
    return { r: 31, g: 41, b: 55 };
  }
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const intVal = Number.parseInt(normalized, 16);
  if (Number.isNaN(intVal)) {
    return { r: 31, g: 41, b: 55 };
  }
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
};

export const resolveStreamingThemeFromPalette = (palette) => {
  const baseColor = palette?.headerStart || palette?.headerEnd || "#1f2937";
  const { r, g, b } = hexToRgbForTheme(baseColor);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / (2 * 255);
  if (lightness >= 0.88) return "light";
  if (lightness <= 0.2) return "dark";
  const delta = max - min || 1;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  if ((hue >= 0 && hue < 25) || hue >= 330) {
    return lightness > 0.6 ? "light" : "red";
  }
  if (hue >= 25 && hue < 65) {
    return "gold";
  }
  if (hue >= 65 && hue < 170) {
    return lightness > 0.5 ? "light" : "gold";
  }
  if (hue >= 170 && hue < 250) {
    return "blue";
  }
  if (hue >= 250 && hue < 320) {
    return "purple";
  }
  return lightness > 0.5 ? "light" : "dark";
};

