import { useMemo } from "react";

const resolveFeatureFlag = (value, fallback) =>
  typeof value === "boolean" ? value : fallback;

const buildDigitGridClass = (digitCount) => {
  if (digitCount === 3) {
    return "sm:grid-cols-3 md:grid-cols-3";
  }
  if (digitCount === 4) {
    return "sm:grid-cols-4 md:grid-cols-4";
  }
  return "sm:grid-cols-4 md:grid-cols-5";
};

export const useMatchFormState = ({
  modeFeatures = {},
  activeMode = "",
  activeSubMenu = "",
  showTitleFieldOverride,
  isBigMatchLayout = false,
  togelPool = "",
  togelPoolVariant = "",
  togelDigits = [],
  drawTimeConfig = {},
  availableEsportGameOptions = [],
}) => {
  const state = useMemo(() => {
    const isTogelMode = resolveFeatureFlag(
      modeFeatures.showTogelControls,
      activeMode === "togel"
    );
    const isEsportsMode = resolveFeatureFlag(
      modeFeatures.showGameOptions,
      activeMode === "esports"
    );
    const isFootballMode = activeMode === "football";
    const isRaffleMode = activeMode === "raffle";
    const isScoreLayoutActive = isFootballMode && activeSubMenu === "scores";
    const shouldShowMatches = resolveFeatureFlag(
      modeFeatures.showMatches,
      !isTogelMode
    );

    const drawTimeOptions = drawTimeConfig.options ?? [];
    const shouldShowDrawTimeSelector =
      isTogelMode &&
      (drawTimeOptions.length > 0 || Boolean(drawTimeConfig.disabledReason));
    const isTotoSingaporeHoliday =
      togelPool === "toto_singapore" && Boolean(drawTimeConfig.disabledReason);

    const shouldShowDigits =
      isTogelMode &&
      Boolean(togelPoolVariant) &&
      Array.isArray(togelDigits) &&
      togelDigits.length > 0 &&
      !isTotoSingaporeHoliday;
    const digitCount = shouldShowDigits ? togelDigits.length : 0;
    const digitGridClass = buildDigitGridClass(digitCount);

    const availableGameOptions = isEsportsMode
      ? availableEsportGameOptions
      : [];
    const isBigMatchLayoutActive = Boolean(isBigMatchLayout);
    const resolvedShowTitle = resolveFeatureFlag(
      modeFeatures.showTitle,
      !isTogelMode && !isEsportsMode
    );
    const shouldShowTitleField =
      typeof showTitleFieldOverride === "boolean"
        ? showTitleFieldOverride
        : !isTogelMode && resolvedShowTitle;

    return {
      isTogelMode,
      isEsportsMode,
      isFootballMode,
      isRaffleMode,
      isScoreLayoutActive,
      shouldShowMatches,
      drawTimeOptions,
      shouldShowDrawTimeSelector,
      isTotoSingaporeHoliday,
      shouldShowDigits,
      digitCount,
      digitGridClass,
      availableGameOptions,
      isBigMatchLayoutActive,
      shouldShowTitleField,
    };
  }, [
    activeMode,
    activeSubMenu,
    availableEsportGameOptions,
    drawTimeConfig,
    isBigMatchLayout,
    modeFeatures,
    showTitleFieldOverride,
    togelDigits,
    togelPool,
    togelPoolVariant,
  ]);

  return state;
};

