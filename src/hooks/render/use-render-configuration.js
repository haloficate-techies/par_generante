import { useMemo } from "react";

/**
 * Consolidates render configuration for the banner pipeline into structured slices.
 *
 * @param {Object} params
 * @param {Function} params.loadCachedOptionalImage
 * @param {Function} params.loadMatchLogoImage
 * @param {Function} params.computeMiniBannerLayout
 * @param {Object} params.constants
 * @param {Array} params.matches
 * @param {number} params.activeMatchCount
 * @param {string} params.activeMode
 * @param {string} params.activeSubMenu
 * @param {string} params.brandLogoSrc
 * @param {string} params.footerSrc
 * @param {string} params.footerLink
 * @param {string} params.backgroundSrc
 * @param {string} params.title
 * @param {string} params.selectedBrandName
 * @param {string} params.leagueLogoSrc
 * @param {boolean} params.includeMiniBanner
 * @param {boolean} params.shouldSkipHeader
 * @param {boolean} params.allowCustomTitle
 * @param {boolean} params.shouldRenderMatches
 * @param {boolean} params.isBigMatchLayout
 * @param {boolean} params.isScoreModeActive
 * @param {boolean} params.isTogelMode
 * @param {boolean} params.isRaffleMode
 * @param {Array} params.togelDigits
 * @param {string} params.togelPool
 * @param {string} params.togelPoolVariant
 * @param {string} params.togelDrawTime
 * @param {Object} params.togelStreamingInfo
 * @param {Array} params.raffleWinners
 * @param {Object} params.raffleInfo
 * @param {string} params.raffleEventLabel
 * @param {Function} params.deriveBrandPalette
 * @param {Function} params.buildTogelTitle
 * @param {Function} params.resolveTogelPoolLabel
 * @param {Function} params.resolveTogelPoolLogoSrc
 * @param {Function} params.formatMatchDateLabel
 * @param {Function} params.formatMatchTimeLabel
 * @param {Array} params.availableBrandLogos
 * @param {Array} params.leagueLogoOptions
 * @param {Function} params.getModeLayoutConfig
 * @param {Object} params.modeContext
 * @returns {Object} render configuration slices
 * @returns {Object} return.assets - Asset loaders and constants
 * @returns {Object} return.config - Mode configuration lookups
 * @returns {Object} return.state - Snapshot of banner state
 * @returns {Object} return.togelState - Togel-specific state
 * @returns {Object} return.raffleState - Raffle-specific state
 * @returns {Object} return.helpers - Helpers passed to render pipeline
 */
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
  resolveTogelPoolLogoSrc,
  formatMatchDateLabel,
  formatMatchTimeLabel,
  availableBrandLogos,
  leagueLogoOptions,
  getModeLayoutConfig,
  modeContext,
}) => {
  const resolvedGetModeLayoutConfig =
    modeContext?.registry?.getModeLayoutConfig || getModeLayoutConfig;

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
      getModeLayoutConfig: resolvedGetModeLayoutConfig,
    }),
    [availableBrandLogos, leagueLogoOptions, resolvedGetModeLayoutConfig]
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
      resolveTogelPoolLogoSrc,
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
      resolveTogelPoolLogoSrc,
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

