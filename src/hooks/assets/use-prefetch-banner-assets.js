import { useEffect } from "react";

const usePrefetchBannerAssets = ({
  activeMode,
  brandOptions,
  footballDefaultBackground,
  includeMiniBanner,
  defaultEsportMiniBanner,
  modeBackgroundDefaults,
  prefetchImages,
}) => {
  useEffect(() => {
    if (!prefetchImages) return;

    const modeDefaults = modeBackgroundDefaults || {};
    const modeSpecificBackgrounds = brandOptions
      .map((option) => option?.backgroundByMode?.[activeMode])
      .filter(Boolean);
    const sharedBackgrounds = brandOptions
      .map((option) => option?.backgroundValue)
      .filter(Boolean);
    const candidates = [
      ...modeSpecificBackgrounds,
      ...sharedBackgrounds,
      modeDefaults[activeMode],
      activeMode === "football" ? footballDefaultBackground : null,
      includeMiniBanner ? defaultEsportMiniBanner : null,
    ].filter(Boolean);

    if (candidates.length) {
      prefetchImages(candidates);
    }
  }, [
    activeMode,
    brandOptions,
    footballDefaultBackground,
    includeMiniBanner,
    defaultEsportMiniBanner,
    modeBackgroundDefaults,
    prefetchImages,
  ]);
};

export default usePrefetchBannerAssets;
