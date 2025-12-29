import { useMemo } from "react";

// Consolidates all render configuration objects for the banner pipeline into one place.
export const useRenderConfiguration = ({
  loadCachedOptionalImage,
  loadMatchLogoImage,
  computeMiniBannerLayout,
  constants,
  matches,
  activeMatchCount,
  activeMode,
  activeSubMenu,
  brandLogoSrc,
  footerSrc,
  footerLink,
  backgroundSrc,
  title,
  selectedBrandName,
  leagueLogoSrc,
  includeMiniBanner,
  shouldSkipHeader,
  allowCustomTitle,
  shouldRenderMatches,
  isBigMatchLayout,
  isScoreModeActive,
  isTogelMode,
  isRaffleMode,
  togelDigits,
  togelPool,
  togelPoolVariant,
  togelDrawTime,
  togelStreamingInfo,
  raffleWinners,
  raffleInfo,
  raffleEventLabel,
  deriveBrandPalette,
  buildTogelTitle,
  resolveTogelPoolLabel,
  formatMatchDateLabel,
  formatMatchTimeLabel,
  availableBrandLogos,
  leagueLogoOptions,
  getModeLayoutConfig,
}) => {
  const renderAssets = useMemo(
    () => ({
      loadCachedOptionalImage,
      loadMatchLogoImage,
      computeMiniBannerLayout,
      defaultEsportMiniBanner: constants.DEFAULT_ESPORT_MINI_BANNER,
      raffleHeaderLogoSrc: constants.RAFFLE_HEADER_LOGO_SRC,
    }),
    [loadCachedOptionalImage, loadMatchLogoImage, computeMiniBannerLayout, constants]
  );

  const renderConfig = useMemo(
    () => ({
      availableBrandLogos,
      leagueLogoOptions,
      getModeLayoutConfig,
    }),
    [availableBrandLogos, leagueLogoOptions, getModeLayoutConfig]
  );

  const renderState = useMemo(
    () => ({
      matches,
      activeMatchCount,
      activeMode,
      activeSubMenu,
      brandLogoSrc,
      footerSrc,
      footerLink,
      backgroundSrc,
      title,
      includeMiniBanner,
      shouldSkipHeader,
      allowCustomTitle,
      shouldRenderMatches,
      selectedBrandName,
      isBigMatchLayout,
      isScoreModeActive,
      isTogelMode,
      isRaffleMode,
      leagueLogoSrc,
    }),
    [
      matches,
      activeMatchCount,
      activeMode,
      activeSubMenu,
      brandLogoSrc,
      footerSrc,
      footerLink,
      backgroundSrc,
      title,
      includeMiniBanner,
      shouldSkipHeader,
      allowCustomTitle,
      shouldRenderMatches,
      selectedBrandName,
      isBigMatchLayout,
      isScoreModeActive,
      isTogelMode,
      isRaffleMode,
      leagueLogoSrc,
    ]
  );

  const renderTogelState = useMemo(
    () => ({
      digits: togelDigits,
      pool: togelPool,
      variant: togelPoolVariant,
      drawTime: togelDrawTime,
      streamingInfo: togelStreamingInfo,
    }),
    [togelDigits, togelPool, togelPoolVariant, togelDrawTime, togelStreamingInfo]
  );

  const renderRaffleState = useMemo(
    () => ({
      winners: raffleWinners,
      info: raffleInfo,
      eventLabel: raffleEventLabel,
    }),
    [raffleWinners, raffleInfo, raffleEventLabel]
  );

  const renderHelpers = useMemo(
    () => ({
      deriveBrandPalette,
      defaultBrandPalette: constants.DEFAULT_BRAND_PALETTE,
      buildTogelTitle,
      resolveTogelPoolLabel,
      scoreModeTitle: constants.SCORE_MODE_TITLE,
      bigMatchTitle: constants.BIG_MATCH_TITLE,
      formatMatchDateLabel,
      formatMatchTimeLabel,
    }),
    [
      deriveBrandPalette,
      constants,
      buildTogelTitle,
      resolveTogelPoolLabel,
      formatMatchDateLabel,
      formatMatchTimeLabel,
    ]
  );

  return {
    assets: renderAssets,
    config: renderConfig,
    state: renderState,
    togelState: renderTogelState,
    raffleState: renderRaffleState,
    helpers: renderHelpers,
  };
};

export default useRenderConfiguration;

