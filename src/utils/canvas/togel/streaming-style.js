const STREAMING_THEME_CANVAS_BAR_COLOR = {
  gold: "#FEF3C7",
  blue: "#BFDBFE",
  purple: "#E9D5FF",
  dark: "#F8FAFC",
  red: "#FFE4E6",
  light: "#1F2937",
};

const STREAMING_THEME_CANVAS_SHADOW = {
  gold: "rgba(255,255,255,0.45)",
  blue: "rgba(0,0,0,0.6)",
  purple: "rgba(0,0,0,0.6)",
  dark: "rgba(0,0,0,0.7)",
  red: "rgba(0,0,0,0.8)",
  light: "rgba(0,0,0,0.65)",
};

export const resolveStreamingUrlCanvasStyle = (theme) => {
  const normalized = (theme || "dark").toLowerCase();
  return {
    barColor:
      STREAMING_THEME_CANVAS_BAR_COLOR[normalized] ||
      STREAMING_THEME_CANVAS_BAR_COLOR.dark,
    shadowColor:
      STREAMING_THEME_CANVAS_SHADOW[normalized] ||
      STREAMING_THEME_CANVAS_SHADOW.dark,
    textColor: "#F8FAFC",
  };
};

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

export const applyFooterLinkStyle = (ctx, fontSize, letterSpacing = 0.5) => {
  if (!ctx) return () => {};
  const size = Math.round(clampNumber(fontSize || 0, 10, 72));
  const spacing = clampNumber(letterSpacing, 0.4, 0.6);
  ctx.font = `800 ${size}px Poppins`;
  ctx.fillStyle = "#f8fafc";
  ctx.letterSpacing = `${spacing}px`;
  ctx.shadowColor = "rgba(15, 23, 42, 0.55)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 2;
  return () => {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  };
};
