import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import AppEnvironment from "./app/app-environment";
import AppData, { DEFAULT_BRAND_PALETTE as FALLBACK_BRAND_PALETTE } from "./data/app-data";
import AppGlobals from "./app/config/globals";
import useBackgroundManager from "./hooks/background-manager";
import useBackgroundRemoval from "./hooks/use-background-removal";
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
import "./app/mode-layout-registry";
import "./app/mode-modules";
import "./modes/layouts/match-mode";
import "./modes/layouts/togel-mode";
import "./modes/layouts/raffle-mode";
import "./modes/modules/match-modes";
import "./modes/modules/togel-mode";

const getModeLayoutConfig = AppEnvironment.getModeLayoutResolver();
const getModeModule = AppEnvironment.getModeModuleResolver();

const AVAILABLE_BRAND_LOGOS = Array.isArray(AppData.BRAND_LOGO_OPTIONS)
  ? AppData.BRAND_LOGO_OPTIONS
  : [];
const BACKGROUND_LOOKUP = AppData.BANNER_BACKGROUND_LOOKUP || {};
const DEFAULT_BRAND_PALETTE = AppData.DEFAULT_BRAND_PALETTE || FALLBACK_BRAND_PALETTE;
const MODE_BACKGROUND_DEFAULTS = AppGlobals.MODE_BACKGROUND_DEFAULTS || {};
const DEFAULT_RAFFLE_FOOTER = AppGlobals.DEFAULT_RAFFLE_FOOTER || "assets/RAFFLE/banner_footer/FOOTER.webp";
const RAFFLE_HEADER_LOGO_SRC = "assets/RAFFLE/logo_mode/IDNRAFFLE.png";
const DEFAULT_ESPORT_MINI_BANNER = AppGlobals.DEFAULT_ESPORT_MINI_BANNER || AppData.ESPORT_MINI_BANNER_FOOTER || null;
const LEAGUE_LOGO_OPTIONS = AppGlobals.LEAGUE_LOGO_OPTIONS || [];
const MATCH_COUNT_OPTIONS = AppGlobals.MATCH_COUNT_OPTIONS || [1, 2, 3, 4, 5];
const MAX_MATCHES = AppGlobals.MAX_MATCHES || MATCH_COUNT_OPTIONS[MATCH_COUNT_OPTIONS.length - 1];
const computeMiniBannerLayout = AppGlobals.computeMiniBannerLayout || (() => null);
const resolveTogelPoolLabel = AppGlobals.resolveTogelPoolLabel || (() => "");
const buildTogelTitle = AppGlobals.buildTogelTitle || ((title) => title || "");
const createBrandSlug = AppGlobals.createBrandSlug || ((brandName) => (brandName || "").toString().trim());
const resolveFooterSrcForBrand = AppGlobals.resolveFooterSrcForBrand || (() => "");
const loadMatchLogoImage = AppGlobals.loadMatchLogoImage || (() => Promise.resolve(null));
const createInitialMatches =
  AppData.createInitialMatches ||
  ((count) => Array.from({ length: count }).map(() => ({ teamHome: "", teamAway: "" })));
const resolveAutoTeamLogoSrc = AppData.resolveAutoTeamLogoSrc || (() => "");
const loadOptionalImage = AppData.loadOptionalImage || (() => Promise.resolve(null));
const deriveBrandPaletteFn =
  AppData.deriveBrandPalette ||
  AppData.DERIVE_BRAND_PALETTE ||
  (() => DEFAULT_BRAND_PALETTE);
const deriveBrandPalette = (image) => {
  if (typeof deriveBrandPaletteFn === "function") {
    return deriveBrandPaletteFn(image) || DEFAULT_BRAND_PALETTE;
  }
  return DEFAULT_BRAND_PALETTE;
};

const SCORE_MODE_TITLE = "HASIL SKOR SEPAK BOLA";

const BIG_MATCH_TITLE = "BIG MATCH";

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
    modeConfigList: AppGlobals.MODE_CONFIG || [],
    resolveModeModule: (mode) =>
      (typeof getModeModule === "function" ? getModeModule(mode) : null) || null,
  });
  const selectedBrandOption = useMemo(
    () =>
      AVAILABLE_BRAND_LOGOS.find((option) => option && option.value === brandLogoSrc) || null,
    [AVAILABLE_BRAND_LOGOS, brandLogoSrc]
  );
  const selectedBrandName = selectedBrandOption?.brand || selectedBrandOption?.label || "";
  useEffect(() => {
    if (!activeModeConfig) {
      setActiveSubMenu("");
      return;
    }
    const availableSubMenus = Array.isArray(activeModeConfig.subMenus) ? activeModeConfig.subMenus : [];
    if (availableSubMenus.length === 0) {
      setActiveSubMenu("");
      return;
    }
    const defaultSubMenuId =
      activeModeConfig.defaultSubMenuId ||
      availableSubMenus[0]?.id ||
      "";
    setActiveSubMenu(defaultSubMenuId);
    }, [activeModeConfig]);
    const pageBackgroundClass = activeModeConfig?.pageBackgroundClass || "bg-slate-950";
    useEffect(() => {
      if (isBigMatchLayout && activeMatchCount !== 1) {
        setMatchCount(1);
      }
    }, [isBigMatchLayout, activeMatchCount, setMatchCount]);
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

  // Draws the entire banner on the canvas.
  useEffect(() => {
    if (!brandLogoSrc) {
      setFooter("", isRaffleMode ? DEFAULT_RAFFLE_FOOTER : "");
      return;
    }
    const matchedBrandOption = AVAILABLE_BRAND_LOGOS.find(
      (option) => option && option.value === brandLogoSrc
    );
    const brandName = matchedBrandOption?.brand ?? null;
    const nextFooterSrc = resolveFooterSrcForBrand(brandName, brandLogoSrc, activeMode);
    if (nextFooterSrc) {
      setFooter(nextFooterSrc);
    } else {
      setFooter("", activeMode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "");
    }
  }, [activeMode, AVAILABLE_BRAND_LOGOS, brandLogoSrc, DEFAULT_RAFFLE_FOOTER, isRaffleMode, setFooter]);

  const handleBrandLogoSelection = useCallback(
    (newValue) => {
      setBrandLogo(newValue);

      if (!newValue) {
        setFooter("", isRaffleMode ? DEFAULT_RAFFLE_FOOTER : "");
        setSelectedFootballBackground(footballDefaultBackground);
        setSelectedBasketballBackground(MODE_BACKGROUND_DEFAULTS.basketball);
        setSelectedEsportsBackground(MODE_BACKGROUND_DEFAULTS.esports);
        return;
      }

      const matchedBrandOption = AVAILABLE_BRAND_LOGOS.find(
        (option) => option && option.value === newValue
      );
      let resolvedFooterForPrefetch = null;
      if (matchedBrandOption && matchedBrandOption.brand) {
        const modeAwareFooter = resolveFooterSrcForBrand(
          matchedBrandOption.brand,
          newValue,
          activeMode
        );
        const raffleFooter = activeMode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "";
        const footerToUse = modeAwareFooter || raffleFooter;
        setFooter(footerToUse);
        resolvedFooterForPrefetch = footerToUse;

      const footballBrandBackground =
        (matchedBrandOption.backgroundByMode &&
          matchedBrandOption.backgroundByMode.football) ||
        matchedBrandOption.backgroundValue ||
        footballDefaultBackground;
        const basketballBrandBackground =
          (matchedBrandOption.backgroundByMode &&
            matchedBrandOption.backgroundByMode.basketball) ||
          MODE_BACKGROUND_DEFAULTS.basketball;
        const esportsBrandBackground =
          (matchedBrandOption.backgroundByMode &&
            matchedBrandOption.backgroundByMode.esports) ||
          MODE_BACKGROUND_DEFAULTS.esports;
        setSelectedFootballBackground(footballBrandBackground);
        setSelectedBasketballBackground(basketballBrandBackground);
        setSelectedEsportsBackground(esportsBrandBackground);
        const brandSlug = createBrandSlug(matchedBrandOption.brand, {
          uppercase: true,
        });
        setFooter(footerToUse, brandSlug ? `INDO.SKIN/${brandSlug}` : "");
      } else {
        const fallbackFooter = resolveFooterSrcForBrand(null, newValue, activeMode);
        setFooter(fallbackFooter, "");
        resolvedFooterForPrefetch = fallbackFooter;
        setSelectedFootballBackground(footballDefaultBackground);
        setSelectedBasketballBackground(MODE_BACKGROUND_DEFAULTS.basketball);
        setSelectedEsportsBackground(MODE_BACKGROUND_DEFAULTS.esports);
      }

      const prefetchCandidates = [
        newValue,
        resolvedFooterForPrefetch,
        matchedBrandOption?.backgroundByMode?.[activeMode],
        matchedBrandOption?.backgroundValue,
        activeMode === "football" ? footballDefaultBackground : null,
        activeMode === "esports" ? MODE_BACKGROUND_DEFAULTS.esports : null,
        activeMode === "basketball" ? MODE_BACKGROUND_DEFAULTS.basketball : null,
        activeMode === "raffle" ? MODE_BACKGROUND_DEFAULTS.raffle : null,
        activeMode === "raffle" && !resolvedFooterForPrefetch ? DEFAULT_RAFFLE_FOOTER : null,
      ].filter(Boolean);
      if (prefetchCandidates.length) {
        prefetchImages(prefetchCandidates);
      }
    },
    [
      AVAILABLE_BRAND_LOGOS,
      activeMode,
      footballDefaultBackground,
      setBrandLogo,
      setFooter,
      setSelectedFootballBackground,
      setSelectedBasketballBackground,
      setSelectedEsportsBackground,
      prefetchImages,
      DEFAULT_RAFFLE_FOOTER,
      isRaffleMode,
    ]
  );

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
              <MatchListForm
                title={title}
              onTitleChange={setTitle}
              matches={visibleMatches}
              onMatchFieldChange={handleMatchFieldChange}
              onAutoLogoRequest={handleAutoLogoRequest}
              onLogoAdjust={handleLogoAdjust}
              onPlayerImageAdjust={handlePlayerImageAdjust}
              onPlayerImageFlipToggle={handlePlayerImageFlipToggle}
              brandLogoSrc={brandLogoSrc}
              onBrandLogoChange={handleBrandLogoSelection}
              brandOptions={AVAILABLE_BRAND_LOGOS}
              backgroundSrc={backgroundSrc}
              footerSrc={footerSrc}
              activeSubMenu={activeSubMenu}
              matchCount={activeMatchCount}
              onMatchCountChange={handleMatchCountChange}
              matchCountOptions={MATCH_COUNT_OPTIONS}
              activeMode={activeMode}
              togelPool={togelPool}
              onTogelPoolChange={setTogelPool}
              togelPoolVariant={togelPoolVariant}
              onTogelPoolVariantChange={setTogelPoolVariant}
              togelDigits={togelDigits}
              onTogelDigitChange={handleTogelDigitChange}
              togelDrawTime={togelDrawTime}
              onTogelDrawTimeChange={setTogelDrawTime}
              modeFeatures={modeFeatures}
              showTitleFieldOverride={shouldShowTitleInput}
              leagueLogoSrc={leagueLogoSrc}
              onLeagueLogoChange={setLeagueLogo}
              isBigMatchLayout={isBigMatchLayout}
              onRemovePlayerBackground={backgroundRemoval.handlePlayerRemoval}
              playerBackgroundRemovalState={backgroundRemoval.playerStatus}
              onRemoveLogoBackground={backgroundRemoval.handleLogoRemoval}
              logoBackgroundRemovalState={backgroundRemoval.logoStatus}
              isBackgroundRemovalAvailable={backgroundRemoval.isAvailable}
              raffleSlug={raffleSlug}
              onRaffleSlugChange={handleRaffleSlugChange}
              onFetchRaffleData={handleFetchRaffleData}
              raffleWinners={raffleWinners}
              raffleInfo={raffleInfo}
              isFetchingRaffle={isFetchingRaffle}
              raffleFetchError={raffleFetchError}
            />
            </section>

            <BannerPreviewPanel
              canvasRef={canvasRef}
              isRendering={isRenderingUi}
              isBulkDownloading={isBulkDownloading}
              bulkProgress={bulkProgress}
              onPreviewClick={handlePreviewClick}
              onDownloadPng={downloadBanner}
              onDownloadZip={downloadAllBanners}
            />
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
