const STREAMING_THEME_CANVAS_COLOR = {
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
    color:
      STREAMING_THEME_CANVAS_COLOR[normalized] ||
      STREAMING_THEME_CANVAS_COLOR.dark,
    shadow:
      STREAMING_THEME_CANVAS_SHADOW[normalized] ||
      STREAMING_THEME_CANVAS_SHADOW.dark,
  };
};
