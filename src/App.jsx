import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  AVAILABLE_BRAND_LOGOS,
  BACKGROUND_LOOKUP,
  BIG_MATCH_TITLE,
  DEFAULT_BRAND_PALETTE,
  DEFAULT_ESPORT_MINI_BANNER,
  DEFAULT_RAFFLE_FOOTER,
  LEAGUE_LOGO_OPTIONS,
  MATCH_COUNT_OPTIONS,
  MAX_MATCHES,
  MODE_BACKGROUND_DEFAULTS,
  MODE_CONFIG,
  RAFFLE_HEADER_LOGO_SRC,
  SCORE_MODE_TITLE,
  buildTogelTitle,
  computeMiniBannerLayout,
  createBrandSlug,
  createInitialMatches,
  deriveBrandPalette,
  getModeLayoutConfig,
  getModeModule,
  loadMatchLogoImage,
  loadOptionalImage,
  resolveAutoTeamLogoSrc,
  resolveFooterSrcForBrand,
  resolveTogelPoolLabel,
} from "./app/app-constants";
import useBackgroundManager from "./hooks/background-manager";
import useBackgroundRemoval from "./hooks/use-background-removal";
import useBrandSelection from "./hooks/use-brand-selection";
import useModeNavigation from "./hooks/use-mode-navigation";
import useStreamingTheme from "./hooks/streaming-theme";
import useTogelControls from "./hooks/togel-controls";
import useImageCache from "./hooks/use-image-cache";
import useRaffleData from "./hooks/use-raffle-data";
import useBannerState from "./hooks/use-banner-state";
import usePreviewModal from "./hooks/use-preview-modal";
import useModeFeatures from "./hooks/use-mode-features";
import BannerHeader from "./components/layout/BannerHeader";
import BannerPreviewPanel from "./components/layout/BannerPreviewPanel";
import PreviewModal from "./components/layout/PreviewModal";
import MatchListForm from "./components/MatchListForm";
import { formatMatchDateLabel, formatMatchTimeLabel } from "./utils/formatters/match";
import { formatRaffleEventLabel } from "./utils/formatters/raffle";
import useBannerRenderPipeline from "./hooks/render/use-banner-render-pipeline";
import useBannerExportActions from "./hooks/render/use-banner-export-actions";
import usePrefetchBannerAssets from "./hooks/assets/use-prefetch-banner-assets";
import "./app/mode-registry";
import "./modes/layouts/match-mode";
import "./modes/layouts/togel-mode";
import "./modes/layouts/raffle-mode";
import "./modes/modules/match-modes";
import "./modes/modules/togel-mode";

const App = () => {
  const canvasRef = useRef(null);
  const {
    state: {
      title,
      matches,
      activeMatchCount,
      brandLogoSrc,
      leagueLogoSrc,
      footerSrc,
      footerLink,
    },
    actions: {
      setTitle,
      setBrandLogo,
      setLeagueLogo,
      setFooter,
      setMatchCount,
      updateMatchField,
      autoLogo: autoMatchLogo,
      adjustLogo: adjustMatchLogo,
      adjustPlayer: adjustMatchPlayer,
      togglePlayerFlip,
    },
  } = useBannerState({
    initialMatches: createInitialMatches(MAX_MATCHES),
    maxMatches: MAX_MATCHES,
    createInitialMatches,
    resolveAutoTeamLogoSrc,
  });
  const [activeMode, setActiveMode] = useState("football");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const {
    activeModeConfig,
    modeFeatures,
    isTogelMode,
    isRaffleMode,
    isScoreModeActive,
    isBigMatchLayout,
    includeMiniBanner,
    shouldSkipHeader,
    allowCustomTitle,
    shouldShowTitleInput,
    shouldRenderMatches,
  } = useModeFeatures(activeMode, activeSubMenu, {
    modeConfigList: MODE_CONFIG,
    resolveModeModule: (mode) =>
      (typeof getModeModule === "function" ? getModeModule(mode) : null) || null,
  });
  const selectedBrandOption = useMemo(
    () =>
      AVAILABLE_BRAND_LOGOS.find((option) => option && option.value === brandLogoSrc) || null,
    [AVAILABLE_BRAND_LOGOS, brandLogoSrc]
  );
  const selectedBrandName = selectedBrandOption?.brand || selectedBrandOption?.label || "";
  const { pageBackgroundClass } = useModeNavigation({
    activeModeConfig,
    isBigMatchLayout,
    activeMatchCount,
    setMatchCount,
    setActiveSubMenu,
  });
  const {
    footballDefaultBackground,
    backgroundSrc,
    setSelectedFootballBackground,
    setSelectedBasketballBackground,
    setSelectedEsportsBackground,
    togelBackgroundSrc,
    applyTogelBackgroundPath,
  } = useBackgroundManager(activeMode);
  const visibleMatches = useMemo(
    () => matches.slice(0, activeMatchCount),
    [matches, activeMatchCount]
  );
  const { loadImage: loadCachedOptionalImage, prefetchImages } = useImageCache(loadOptionalImage);

  const streamingTheme = useStreamingTheme({
    isTogelMode,
    brandLogoSrc,
    loadCachedOptionalImage,
  });
  const {
    togelPool,
    setTogelPool,
    togelPoolVariant,
    setTogelPoolVariant,
    togelDigits,
    setTogelDigits,
    togelDrawTime,
    setTogelDrawTime,
    togelStreamingInfo,
  } = useTogelControls({ isTogelMode, applyTogelBackgroundPath, streamingTheme });
  const {
    slug: raffleSlug,
    setSlug: setRaffleSlug,
    winners: raffleWinners,
    info: raffleInfo,
    isFetching: isFetchingRaffle,
    error: raffleFetchError,
    fetchData: fetchRaffleData,
  } = useRaffleData();
  const handleRaffleSlugChange = useCallback((value) => {
    setRaffleSlug(value);
  }, [setRaffleSlug]);
  const handleFetchRaffleData = useCallback(
    () => fetchRaffleData(raffleSlug),
    [fetchRaffleData, raffleSlug]
  );

  const raffleEventLabel = useMemo(() => {
    if (!raffleInfo) return "";
    return formatRaffleEventLabel(raffleInfo);
  }, [raffleInfo]);

  const {
    isOpen: isPreviewModalOpen,
    imageSrc: previewImage,
    openWith: openPreviewModal,
    close: closePreviewModal,
  } = usePreviewModal();

  const renderAssets = useMemo(
    () => ({
      loadCachedOptionalImage,
      loadMatchLogoImage,
      computeMiniBannerLayout,
      defaultEsportMiniBanner: DEFAULT_ESPORT_MINI_BANNER,
      raffleHeaderLogoSrc: RAFFLE_HEADER_LOGO_SRC,
    }),
    [loadCachedOptionalImage, loadMatchLogoImage, computeMiniBannerLayout]
  );

  const renderConfig = useMemo(
    () => ({
      availableBrandLogos: AVAILABLE_BRAND_LOGOS,
      leagueLogoOptions: LEAGUE_LOGO_OPTIONS,
      getModeLayoutConfig,
    }),
    [AVAILABLE_BRAND_LOGOS, LEAGUE_LOGO_OPTIONS, getModeLayoutConfig]
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
      defaultBrandPalette: DEFAULT_BRAND_PALETTE,
      buildTogelTitle,
      resolveTogelPoolLabel,
      scoreModeTitle: SCORE_MODE_TITLE,
      bigMatchTitle: BIG_MATCH_TITLE,
      formatMatchDateLabel,
      formatMatchTimeLabel,
    }),
    [deriveBrandPalette]
  );

  const {
    renderBanner,
    isRenderingRef,
    isRenderingUi,
    lastRenderAt,
  } = useBannerRenderPipeline({
    canvasRef,
    assets: renderAssets,
    config: renderConfig,
    state: renderState,
    togelState: renderTogelState,
    raffleState: renderRaffleState,
    helpers: renderHelpers,
  });

  const {
    handlePreviewClick,
    downloadBanner,
    downloadAllBanners,
    isBulkDownloading,
    bulkProgress,
  } = useBannerExportActions({
    renderBanner,
    canvasRef,
    brandOptions: AVAILABLE_BRAND_LOGOS,
    createBrandSlug,
    resolveFooterSrcForBrand,
    backgroundLookup: BACKGROUND_LOOKUP,
    modeBackgroundDefaults: MODE_BACKGROUND_DEFAULTS,
    footballDefaultBackground,
    togelBackgroundSrc,
    togelPool,
    includeMiniBanner,
    defaultEsportMiniBanner: DEFAULT_ESPORT_MINI_BANNER,
    prefetchImages,
    activeMode,
    isTogelMode,
    footerLink,
    openPreviewModal,
    isRenderingRef,
  });

  // Handles updating a single match field.
  const handleMatchFieldChange = useCallback(
    (index, field, value) => {
      updateMatchField(index, field, value);
    },
    [updateMatchField]
  );

  const handleAutoLogoRequest = useCallback((index, side) => {
    autoMatchLogo(index, side);
  }, [autoMatchLogo]);

  const handleLogoAdjust = useCallback(
    (index, side, updates) => {
      adjustMatchLogo(index, side, updates);
    },
    [adjustMatchLogo]
  );

  const handlePlayerImageAdjust = useCallback(
    (index, side, updates) => {
      adjustMatchPlayer(index, side, updates);
    },
    [adjustMatchPlayer]
  );

  const handlePlayerImageFlipToggle = useCallback(
    (index, side) => {
      togglePlayerFlip(index, side);
    },
    [togglePlayerFlip]
  );

  const backgroundRemoval = useBackgroundRemoval({
    onApplyResult: handleMatchFieldChange,
  });

  const handleMatchCountChange = useCallback(
    (nextCount) => {
      setMatchCount(nextCount);
    },
    [setMatchCount]
  );

  usePrefetchBannerAssets({
    activeMode,
    brandOptions: AVAILABLE_BRAND_LOGOS,
    footballDefaultBackground,
    includeMiniBanner,
    defaultEsportMiniBanner: DEFAULT_ESPORT_MINI_BANNER,
    modeBackgroundDefaults: MODE_BACKGROUND_DEFAULTS,
    prefetchImages,
  });

  const { handleBrandLogoSelection } = useBrandSelection({
    activeMode,
    availableBrandLogos: AVAILABLE_BRAND_LOGOS,
    brandLogoSrc,
    defaultRaffleFooter: DEFAULT_RAFFLE_FOOTER,
    footballDefaultBackground,
    isRaffleMode,
    modeBackgroundDefaults: MODE_BACKGROUND_DEFAULTS,
    prefetchImages,
    resolveFooterSrcForBrand,
    setBrandLogo,
    setFooter,
    setSelectedBasketballBackground,
    setSelectedEsportsBackground,
    setSelectedFootballBackground,
    createBrandSlug,
  });

  const handleTogelDigitChange = useCallback((index, digit) => {
    setTogelDigits((prevDigits) => {
      const nextDigits = Array.isArray(prevDigits) ? [...prevDigits] : [];
      nextDigits[index] = digit;
      return nextDigits;
    });
  }, []);

  // Converts the current canvas to PNG and downloads it.
  const handleClosePreview = useCallback(() => {
    closePreviewModal();
  }, [closePreviewModal]);

  const matchListFormProps = useMemo(
    () => ({
      title,
      onTitleChange: setTitle,
      matches: visibleMatches,
      onMatchFieldChange: handleMatchFieldChange,
      onAutoLogoRequest: handleAutoLogoRequest,
      onLogoAdjust: handleLogoAdjust,
      onPlayerImageAdjust: handlePlayerImageAdjust,
      onPlayerImageFlipToggle: handlePlayerImageFlipToggle,
      brandLogoSrc,
      onBrandLogoChange: handleBrandLogoSelection,
      brandOptions: AVAILABLE_BRAND_LOGOS,
      backgroundSrc,
      footerSrc,
      activeSubMenu,
      matchCount: activeMatchCount,
      onMatchCountChange: handleMatchCountChange,
      matchCountOptions: MATCH_COUNT_OPTIONS,
      activeMode,
      togelPool,
      onTogelPoolChange: setTogelPool,
      togelPoolVariant,
      onTogelPoolVariantChange: setTogelPoolVariant,
      togelDigits,
      onTogelDigitChange: handleTogelDigitChange,
      togelDrawTime,
      onTogelDrawTimeChange: setTogelDrawTime,
      modeFeatures,
      showTitleFieldOverride: shouldShowTitleInput,
      leagueLogoSrc,
      onLeagueLogoChange: setLeagueLogo,
      isBigMatchLayout,
      onRemovePlayerBackground: backgroundRemoval.handlePlayerRemoval,
      playerBackgroundRemovalState: backgroundRemoval.playerStatus,
      onRemoveLogoBackground: backgroundRemoval.handleLogoRemoval,
      logoBackgroundRemovalState: backgroundRemoval.logoStatus,
      isBackgroundRemovalAvailable: backgroundRemoval.isAvailable,
      raffleSlug,
      onRaffleSlugChange: handleRaffleSlugChange,
      onFetchRaffleData: handleFetchRaffleData,
      raffleWinners,
      raffleInfo,
      isFetchingRaffle,
      raffleFetchError,
    }),
    [
      title,
      setTitle,
      visibleMatches,
      handleMatchFieldChange,
      handleAutoLogoRequest,
      handleLogoAdjust,
      handlePlayerImageAdjust,
      handlePlayerImageFlipToggle,
      brandLogoSrc,
      handleBrandLogoSelection,
      AVAILABLE_BRAND_LOGOS,
      backgroundSrc,
      footerSrc,
      activeSubMenu,
      activeMatchCount,
      handleMatchCountChange,
      MATCH_COUNT_OPTIONS,
      activeMode,
      togelPool,
      setTogelPool,
      togelPoolVariant,
      setTogelPoolVariant,
      togelDigits,
      handleTogelDigitChange,
      togelDrawTime,
      setTogelDrawTime,
      modeFeatures,
      shouldShowTitleInput,
      leagueLogoSrc,
      setLeagueLogo,
      isBigMatchLayout,
      backgroundRemoval.handlePlayerRemoval,
      backgroundRemoval.playerStatus,
      backgroundRemoval.handleLogoRemoval,
      backgroundRemoval.logoStatus,
      backgroundRemoval.isAvailable,
      raffleSlug,
      handleRaffleSlugChange,
      handleFetchRaffleData,
      raffleWinners,
      raffleInfo,
      isFetchingRaffle,
      raffleFetchError,
    ]
  );

  const bannerPreviewProps = useMemo(
    () => ({
      canvasRef,
      isRendering: isRenderingUi,
      isBulkDownloading,
      bulkProgress,
      onPreviewClick: handlePreviewClick,
      onDownloadPng: downloadBanner,
      onDownloadZip: downloadAllBanners,
    }),
    [
      canvasRef,
      isRenderingUi,
      isBulkDownloading,
      bulkProgress,
      handlePreviewClick,
      downloadBanner,
      downloadAllBanners,
    ]
  );

  if (!MatchListForm || !BannerHeader || !BannerPreviewPanel || !PreviewModal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p>Komponen belum siap dimuat. Muat ulang halaman.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen pb-16 ${pageBackgroundClass}`}>
        <BannerHeader
          activeModeConfig={activeModeConfig}
          activeMode={activeMode}
          activeSubMenu={activeSubMenu}
          onModeChange={setActiveMode}
          onSubMenuChange={setActiveSubMenu}
          lastRenderAt={lastRenderAt}
        />

        <main className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
              <MatchListForm {...matchListFormProps} />
            </section>

            <BannerPreviewPanel {...bannerPreviewProps} />
          </div>
        </main>
      </div>
      <PreviewModal
        isOpen={isPreviewModalOpen}
        imageSrc={previewImage}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default App;
