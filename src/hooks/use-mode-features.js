import { useMemo } from "react";
const useModeFeatures = (activeMode, activeSubMenu, options = {}) => {
  const { modeContext } = options;
  const modeConfigList = options.modeConfigList || modeContext?.modeConfig || [];
  const resolveModeModule =
    options.resolveModeModule || modeContext?.registry?.getModeModule || (() => null);

  const activeModeConfig = useMemo(
    () => modeConfigList.find((mode) => mode.id === activeMode) || modeConfigList[0] || {},
    [activeMode, modeConfigList]
  );

  const modeModule = useMemo(() => resolveModeModule(activeMode), [activeMode, resolveModeModule]);

  const modeFeatures = modeModule?.features || {};
  const isTogelMode = activeMode === "togel";
  const isEsportsMode = activeMode === "esports";
  const isRaffleMode = activeMode === "raffle";
  const isScoreModeActive = activeMode === "football" && activeSubMenu === "scores";
  const isBigMatchLayout = activeMode === "football" && activeSubMenu === "big_match";
  const includeMiniBanner =
    typeof modeFeatures.includeMiniBanner === "boolean"
      ? modeFeatures.includeMiniBanner
      : isEsportsMode;
  const shouldSkipHeader =
    typeof modeFeatures.skipHeader === "boolean" ? modeFeatures.skipHeader : isEsportsMode;
  const allowCustomTitle =
    typeof modeFeatures.showTitle === "boolean"
      ? modeFeatures.showTitle
      : !isEsportsMode && !isTogelMode && !isRaffleMode;
  const shouldShowTitleInput =
    allowCustomTitle && !isTogelMode && !isRaffleMode && !isScoreModeActive && !isBigMatchLayout;
  const shouldRenderMatches =
    typeof modeFeatures.showMatches === "boolean" ? modeFeatures.showMatches : !isTogelMode;

  return {
    activeModeConfig,
    modeFeatures,
    isTogelMode,
    isEsportsMode,
    isRaffleMode,
    isScoreModeActive,
    isBigMatchLayout,
    includeMiniBanner,
    shouldSkipHeader,
    allowCustomTitle,
    shouldShowTitleInput,
    shouldRenderMatches,
  };
};

export default useModeFeatures;
