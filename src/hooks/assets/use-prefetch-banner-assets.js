import { useEffect } from "react";

const usePrefetchBannerAssets = ({
  activeMode,
  activeSubMenu,
  brandOptions,
  footballDefaultBackground,
  footballScoresDefaultBackground,
  footballBigMatchDefaultBackground,
  includeMiniBanner,
  defaultEsportMiniBanner,
  modeBackgroundDefaults,
  prefetchImages,
}) => {
  useEffect(() => {
    if (!prefetchImages) return;

    const modeDefaults = modeBackgroundDefaults || {};
    const isBigMatchLayoutActive = activeMode === "football" && activeSubMenu === "big_match";
    const isScoreLayoutActive = activeMode === "football" && activeSubMenu === "scores";
    const modeKey = isBigMatchLayoutActive
      ? "football_big_match"
      : isScoreLayoutActive
      ? "football_scores"
      : activeMode;
    const modeSpecificBackgrounds = brandOptions
      .map((option) => option?.backgroundByMode?.[modeKey])
      .filter(Boolean);
    const sharedBackgrounds = brandOptions
      .map((option) => option?.backgroundValue)
      .filter(Boolean);
    const candidates = [
      ...modeSpecificBackgrounds,
      ...sharedBackgrounds,
      modeDefaults[activeMode],
      activeMode === "football"
        ? isBigMatchLayoutActive
          ? footballBigMatchDefaultBackground
          : isScoreLayoutActive
          ? footballScoresDefaultBackground
          : footballDefaultBackground
        : null,
      includeMiniBanner ? defaultEsportMiniBanner : null,
    ].filter(Boolean);

    if (candidates.length) {
      prefetchImages(candidates);
    }
  }, [
    activeMode,
    activeSubMenu,
    brandOptions,
    footballDefaultBackground,
    footballScoresDefaultBackground,
    footballBigMatchDefaultBackground,
    includeMiniBanner,
    defaultEsportMiniBanner,
    modeBackgroundDefaults,
    prefetchImages,
  ]);
};

export default usePrefetchBannerAssets;
