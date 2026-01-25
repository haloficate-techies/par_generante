import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  AVAILABLE_BRAND_LOGOS,
  BACKGROUND_LOOKUP,
  BIG_MATCH_TITLE,
  DEFAULT_ESPORT_MINI_BANNER,
  DEFAULT_RAFFLE_FOOTER,
  LEAGUE_LOGO_OPTIONS,
  MATCH_COUNT_OPTIONS,
  MAX_MATCHES,
  MODE_BACKGROUND_DEFAULTS,
  RAFFLE_HEADER_LOGO_SRC,
  SCORE_MODE_TITLE,
  buildTogelTitle,
  computeMiniBannerLayout,
  createBrandSlug,
  createModeContext,
  loadMatchLogoImage,
  resolveFooterSrcForBrand,
  resolveTogelPoolLabel,
  resolveTogelPoolLogoSrc,
} from "./app/index.js";
import { createInitialMatches } from "./data/helpers/match-factory";
import { resolveAutoTeamLogoSrc } from "./domains/teams";
import { loadOptionalImage } from "./utils/image-loader";
import { DEFAULT_BRAND_PALETTE, deriveBrandPalette } from "./utils/color-utils";
import {
  useBackgroundManager,
  useBackgroundRemoval,
  useBrandSelection,
  useModeNavigation,
  useStreamingTheme,
  useTogelControls,
  useImageCache,
  useRaffleData,
  useBannerState,
  usePreviewModal,
  useModeFeatures,
  useBannerRenderPipeline,
  useBannerExportActions,
  useRenderConfiguration,
  usePrefetchBannerAssets,
  useMatchListFormProps,
  useBannerPreviewProps,
} from "./hooks/index.js";
import {
  BannerHeader,
  BannerPreviewPanel,
  PreviewModal,
  MatchListForm,
} from "./components/index.js";
import {
  formatMatchDateLabel,
  formatMatchTimeLabel,
  formatRaffleEventLabel,
} from "./utils/index.js";
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
  const modeContext = useMemo(() => createModeContext(), []);
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
    modeContext,
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

  const {
    assets: renderAssets,
    config: renderConfig,
    state: renderState,
    togelState: renderTogelState,
    raffleState: renderRaffleState,
    helpers: renderHelpers,
  } = useRenderConfiguration({
    loadCachedOptionalImage,
    loadMatchLogoImage,
    computeMiniBannerLayout,
    constants: {
      DEFAULT_ESPORT_MINI_BANNER,
      RAFFLE_HEADER_LOGO_SRC,
      DEFAULT_BRAND_PALETTE,
      SCORE_MODE_TITLE,
      BIG_MATCH_TITLE,
    },
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
    availableBrandLogos: AVAILABLE_BRAND_LOGOS,
    leagueLogoOptions: LEAGUE_LOGO_OPTIONS,
    modeContext,
  });

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

  const matchListFormProps = useMatchListFormProps({
    title,
    setTitle,
    visibleMatches,
    brandLogoSrc,
    backgroundSrc,
    footerSrc,
    activeSubMenu,
    activeMatchCount,
    activeMode,
    activeModeConfig,
    leagueLogoSrc,
    togelPool,
    setTogelPool,
    togelPoolVariant,
    setTogelPoolVariant,
    togelDigits,
    handleTogelDigitChange,
    togelDrawTime,
    setTogelDrawTime,
    raffleSlug,
    raffleWinners,
    raffleInfo,
    isFetchingRaffle,
    raffleFetchError,
    handleMatchFieldChange,
    handleAutoLogoRequest,
    handleLogoAdjust,
    handlePlayerImageAdjust,
    handlePlayerImageFlipToggle,
    handleBrandLogoSelection,
    handleMatchCountChange,
    setLeagueLogo,
    handleRaffleSlugChange,
    handleFetchRaffleData,
    brandOptions: AVAILABLE_BRAND_LOGOS,
    matchCountOptions: MATCH_COUNT_OPTIONS,
    modeFeatures,
    shouldShowTitleInput,
    isBigMatchLayout,
    backgroundRemoval,
  });

  const bannerPreviewProps = useBannerPreviewProps({
    canvasRef,
    isRenderingUi,
    isBulkDownloading,
    bulkProgress,
    handlePreviewClick,
    downloadBanner,
    downloadAllBanners,
  });

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
          modeConfig={modeContext.modeConfig}
        />

        <main className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
              <MatchListForm {...matchListFormProps} />
            </section>

            <BannerPreviewPanel
              {...bannerPreviewProps}
              hidePreviewAction={isPreviewModalOpen}
            />
          </div>
        </main>
      </div>
      <PreviewModal
        isOpen={isPreviewModalOpen}
        imageSrc={previewImage}
        onClose={handleClosePreview}
        onDownloadPng={downloadBanner}
        onDownloadZip={downloadAllBanners}
        isRendering={isRenderingUi}
        isBulkDownloading={isBulkDownloading}
        bulkProgress={bulkProgress}
      />
    </>
  );
};

export default App;
