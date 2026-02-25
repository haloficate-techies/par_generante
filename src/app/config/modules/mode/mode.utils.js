export const resolveBackgroundModeKey = (activeMode, activeSubMenu) => {
  if (activeMode === "football" && activeSubMenu === "big_match") {
    return "football_big_match";
  }
  return activeMode || "";
};
