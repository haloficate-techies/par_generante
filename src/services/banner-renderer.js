import { CanvasUtils } from "../utils/canvas-utils";

const {
  drawBackground: defaultDrawBackground = () => {},
  drawOverlay: defaultDrawOverlay = () => {},
  drawBrandLogo: defaultDrawBrandLogo = () => 0,
  drawHeader: defaultDrawHeader = () => 0,
  drawFooter: defaultDrawFooter = () => {},
} = CanvasUtils || {};

const waitForFonts = async () => {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {
      console.warn("Fonts failed to load in time:", error);
    }
  }
};

const ensureCacheLimit = (cacheRef, limit) => {
  const cache = cacheRef?.current;
  if (!cache || typeof cache.size !== "number") return;
  if (limit <= 0) return;
  if (cache.size >= limit) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
};

const resolveBrandDisplayName = (availableBrandLogos, logoValue, fallbackName = "") => {
  if (!logoValue) {
    return fallbackName;
  }
  const matched = availableBrandLogos.find((option) => option && option.value === logoValue);
  return matched?.brand || matched?.label || fallbackName || "";
};

export const renderBanner = async ({
  overrides = {},
  canvasRef,
  baseSize = 1080,
  drawConfig = {},
  caches = {},
  assets = {},
  config = {},
  state = {},
  togel = {},
  raffle = {},
  helpers = {},
  setLastRenderAt,
}) => {
  const canvas = canvasRef?.current;
  if (!canvas) return null;

  canvas.width = baseSize;
  canvas.height = baseSize;

  await waitForFonts();

  const {
    drawBackground = defaultDrawBackground,
    drawOverlay = defaultDrawOverlay,
    drawBrandLogo = defaultDrawBrandLogo,
    drawHeader = defaultDrawHeader,
    drawFooter = defaultDrawFooter,
  } = drawConfig;

  const {
    brandPaletteCacheRef,
    brandPaletteCacheLimit = 50,
    baseLayerCacheRef,
    baseLayerCacheLimit = 12,
    headerLayerCacheRef,
    headerLayerCacheLimit = 32,
  } = caches;

  const {
    loadCachedOptionalImage = () => Promise.resolve(null),
    loadMatchLogoImage = () => Promise.resolve(null),
    computeMiniBannerLayout = () => null,
    defaultEsportMiniBanner = null,
    raffleHeaderLogoSrc = "",
  } = assets;

  const {
    availableBrandLogos = [],
    leagueLogoOptions = [],
    getModeLayoutConfig,
  } = config;

  const {
    deriveBrandPalette = () => helpers.defaultBrandPalette,
    defaultBrandPalette,
    buildTogelTitle = (title) => title,
    resolveTogelPoolLabel = () => "",
    scoreModeTitle = "",
    bigMatchTitle = "",
    formatMatchDateLabel = (value) => value || "",
    formatMatchTimeLabel = (value) => value || "",
  } = helpers;

  const {
    matches = [],
    activeMatchCount = 1,
    activeMode = "football",
    activeSubMenu = "",
    brandLogoSrc,
    footerSrc,
    footerLink,
    backgroundSrc,
    title = "",
    includeMiniBanner = false,
    shouldSkipHeader = false,
    allowCustomTitle = true,
    shouldRenderMatches = true,
    selectedBrandName = "",
    isTogelMode = false,
    isRaffleMode = false,
    leagueLogoSrc = "",
  } = state;

  const {
    digits: togelDigits = [],
    pool: togelPool = "",
    variant: togelPoolVariant = "",
    drawTime: togelDrawTime = "",
    streamingInfo: togelStreamingInfo = null,
  } = togel;

  const {
    winners: raffleWinners = [],
    info: raffleInfo = null,
    eventLabel: raffleEventLabel = "",
  } = raffle;

  const {
    brandLogoSrc: overrideBrandLogoSrc,
    footerSrc: overrideFooterSrc,
    footerLink: overrideFooterLink,
    backgroundSrc: overrideBackgroundSrc,
    title: overrideTitle,
    matches: overrideMatches,
    skipTimestamp = false,
    togelDigits: overrideTogelDigits,
    togelPool: overrideTogelPool,
    togelPoolVariant: overrideTogelPoolVariant,
    togelDrawTime: overrideTogelDrawTime,
    activeSubMenu: overrideActiveSubMenu,
    leagueLogoSrc: overrideLeagueLogoSrc,
  } = overrides || {};

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, baseSize, baseSize);

  const effectiveBrandLogoSrc = overrideBrandLogoSrc ?? brandLogoSrc;
  const effectiveFooterSrc = overrideFooterSrc ?? footerSrc;
  const effectiveFooterLink = overrideFooterLink ?? footerLink;
  const effectiveBackgroundSrc = overrideBackgroundSrc ?? backgroundSrc;
  const effectiveMatches = overrideMatches ?? matches;
  const effectiveLeagueLogoSrc = overrideLeagueLogoSrc ?? leagueLogoSrc;
  const effectiveTogelDigits = overrideTogelDigits ?? togelDigits;
  const effectiveTogelPool = overrideTogelPool ?? togelPool;
  const effectiveTogelVariant = overrideTogelPoolVariant ?? togelPoolVariant;
  const effectiveTogelDrawTime = overrideTogelDrawTime ?? togelDrawTime;
  const layoutSubMenu = overrideActiveSubMenu ?? activeSubMenu;

  const isBigMatchLayoutActive = activeMode === "football" && layoutSubMenu === "big_match";
  const isScoreLayoutActive = activeMode === "football" && layoutSubMenu === "scores";

  const poolLabel = resolveTogelPoolLabel(effectiveTogelPool);
  const effectiveBrandDisplayName = resolveBrandDisplayName(
    availableBrandLogos,
    effectiveBrandLogoSrc,
    selectedBrandName
  );
  const selectedLeagueLogoOption =
    isBigMatchLayoutActive && leagueLogoOptions.length
      ? leagueLogoOptions.find((option) => option.value === effectiveLeagueLogoSrc) || null
      : null;
  const dynamicBigMatchTitle = selectedLeagueLogoOption?.label?.trim() || bigMatchTitle;
  const baseTitleInput =
    overrideTitle ??
    (isScoreLayoutActive
      ? scoreModeTitle
      : isBigMatchLayoutActive
      ? dynamicBigMatchTitle
      : allowCustomTitle
      ? title
      : "");
  const effectiveTitle = isTogelMode
    ? buildTogelTitle(baseTitleInput, poolLabel, effectiveTogelVariant)
    : baseTitleInput;
  const streamingInfoForRender = isTogelMode ? togelStreamingInfo : null;

  const miniBannerSrc = includeMiniBanner ? defaultEsportMiniBanner : null;
  const shouldUseRaffleHeaderLogo = isRaffleMode;

  const [
    backgroundImage,
    footerImage,
    brandLogoImage,
    miniBannerImage,
    raffleHeaderLogoImage,
  ] = await Promise.all([
    loadCachedOptionalImage(effectiveBackgroundSrc),
    loadCachedOptionalImage(effectiveFooterSrc),
    loadCachedOptionalImage(effectiveBrandLogoSrc),
    miniBannerSrc ? loadCachedOptionalImage(miniBannerSrc) : Promise.resolve(null),
    shouldUseRaffleHeaderLogo ? loadCachedOptionalImage(raffleHeaderLogoSrc) : Promise.resolve(null),
  ]);

  const brandPaletteCache = brandPaletteCacheRef?.current;
  const derivePalette = () => {
    if (!brandLogoImage) {
      return defaultBrandPalette;
    }
    if (!brandPaletteCache) {
      return deriveBrandPalette(brandLogoImage) || defaultBrandPalette;
    }
    const cacheKey = effectiveBrandLogoSrc || "logo-pal";
    if (brandPaletteCache.has(cacheKey)) {
      return brandPaletteCache.get(cacheKey);
    }
    const palette = deriveBrandPalette(brandLogoImage) || defaultBrandPalette;
    ensureCacheLimit(brandPaletteCacheRef, brandPaletteCacheLimit);
    brandPaletteCache.set(cacheKey, palette);
    return palette;
  };
  const brandPalette = derivePalette();
  const brandPaletteKey = JSON.stringify(brandPalette || {});

  const baseLayerCache = baseLayerCacheRef?.current;
  const headerLayerCache = headerLayerCacheRef?.current;

  const baseLayerCacheKey = [
    baseSize,
    activeMode,
    effectiveBackgroundSrc || "none",
    brandPaletteKey,
  ].join("|");
  const headerLayerCacheKey = [
    baseLayerCacheKey,
    effectiveBrandLogoSrc || "no-brand",
    effectiveTitle || "",
    shouldSkipHeader ? "skip" : "show",
    shouldUseRaffleHeaderLogo ? "raffle-header" : "standard-header",
    isBigMatchLayoutActive ? effectiveLeagueLogoSrc || "league-none" : "league-none",
  ].join("|");

  let matchesStartY = 0;
  let headerBottom = 0;
  let headerLayerApplied = false;
  const cachedHeaderLayer = headerLayerCache?.get(headerLayerCacheKey);
  if (cachedHeaderLayer) {
    try {
      ctx.putImageData(cachedHeaderLayer.imageData, 0, 0);
      matchesStartY = cachedHeaderLayer.matchesStartY;
      headerBottom = matchesStartY - (shouldSkipHeader ? 12 : 28);
      headerLayerApplied = true;
    } catch (error) {
      console.warn("Gagal menerapkan cache header layer:", error);
      headerLayerCache?.delete(headerLayerCacheKey);
    }
  }

  const miniBannerLayout =
    miniBannerImage && includeMiniBanner ? computeMiniBannerLayout(canvas, miniBannerImage) : null;

  const matchesToUse = isBigMatchLayoutActive ? 1 : activeMatchCount;
  const activeMatches = shouldRenderMatches ? effectiveMatches.slice(0, matchesToUse) : [];
  const matchesWithImages = shouldRenderMatches
    ? await Promise.all(
        activeMatches.map(async (match) => {
          const [
            homeLogoImage,
            awayLogoImage,
            gameLogoImage,
            homePlayerImage,
            awayPlayerImage,
          ] = await Promise.all([
            loadMatchLogoImage(match.teamHomeLogo, match.teamHomeLogoIsAuto),
            loadMatchLogoImage(match.teamAwayLogo, match.teamAwayLogoIsAuto),
            match.gameLogo ? loadCachedOptionalImage(match.gameLogo) : Promise.resolve(null),
            match.teamHomePlayerImage
              ? loadCachedOptionalImage(match.teamHomePlayerImage)
              : Promise.resolve(null),
            match.teamAwayPlayerImage
              ? loadCachedOptionalImage(match.teamAwayPlayerImage)
              : Promise.resolve(null),
          ]);
          return { ...match, homeLogoImage, awayLogoImage, gameLogoImage, homePlayerImage, awayPlayerImage };
        })
      )
    : [];

  const leagueLogoImage = isBigMatchLayoutActive
    ? await loadCachedOptionalImage(effectiveLeagueLogoSrc)
    : null;
  const firstMatchForBigLayout = isBigMatchLayoutActive ? matchesWithImages[0] : null;
  const bigMatchDateLabel = firstMatchForBigLayout?.date
    ? formatMatchDateLabel(firstMatchForBigLayout.date)
    : "";
  const bigMatchTimeLabel = firstMatchForBigLayout?.time
    ? formatMatchTimeLabel(firstMatchForBigLayout.time)
    : "";

  if (!headerLayerApplied) {
    let baseLayerApplied = false;
    const cachedLayer = baseLayerCache?.get(baseLayerCacheKey);
    if (cachedLayer) {
      try {
        ctx.putImageData(cachedLayer, 0, 0);
        baseLayerApplied = true;
      } catch (error) {
        console.warn("Gagal menerapkan cache base layer:", error);
        baseLayerCache?.delete(baseLayerCacheKey);
      }
    }
    if (!baseLayerApplied) {
      drawBackground(ctx, backgroundImage);
      drawOverlay(ctx);
      try {
        const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ensureCacheLimit(baseLayerCacheRef, baseLayerCacheLimit);
        baseLayerCache?.set(baseLayerCacheKey, snapshot);
      } catch (error) {
        console.warn("Gagal menyimpan cache base layer:", error);
      }
    }

    const brandBottom = drawBrandLogo(ctx, brandLogoImage, brandPalette);
    headerBottom = shouldSkipHeader
      ? brandBottom
      : drawHeader(ctx, effectiveTitle, brandBottom + 24, brandPalette, {
          headerLogoImage: shouldUseRaffleHeaderLogo ? raffleHeaderLogoImage : null,
          leftLogoImage: isBigMatchLayoutActive ? leagueLogoImage : null,
          showLeagueLogoSlot: isBigMatchLayoutActive,
        });
    matchesStartY = headerBottom + (shouldSkipHeader ? 12 : 28);
    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ensureCacheLimit(headerLayerCacheRef, headerLayerCacheLimit);
      headerLayerCache?.set(headerLayerCacheKey, {
        imageData: snapshot,
        matchesStartY,
      });
    } catch (error) {
      console.warn("Gagal menyimpan cache header layer:", error);
    }
  }

  const layoutPayload = {
    ctx,
    activeMode,
    activeSubMenu: layoutSubMenu,
    matchesWithImages,
    matchesStartY,
    brandPalette,
    brandDisplayName: effectiveBrandDisplayName,
    miniBannerLayout,
    miniBannerImage,
    streamingInfo: streamingInfoForRender,
    bigMatchDetails: isBigMatchLayoutActive
      ? {
          leagueLogoImage,
          matchDateLabel: bigMatchDateLabel,
          matchTimeLabel: bigMatchTimeLabel,
        }
      : null,
    togelData: isTogelMode
      ? {
          digits: effectiveTogelDigits,
          poolCode: effectiveTogelPool,
          poolLabel,
          variantLabel: effectiveTogelVariant,
          drawTime: effectiveTogelDrawTime,
          streamingInfo: streamingInfoForRender,
        }
      : null,
    raffleData: isRaffleMode
      ? {
          winners: Array.isArray(raffleWinners) ? raffleWinners : [],
          info: raffleInfo || null,
          eventLabel: raffleEventLabel || "",
        }
      : null,
  };

  const getLayoutConfig = typeof getModeLayoutConfig === "function" ? getModeLayoutConfig : () => null;
  const layoutConfig = getLayoutConfig(activeMode);
  if (layoutConfig && typeof layoutConfig.renderContent === "function") {
    await layoutConfig.renderContent(layoutPayload);
  } else {
    console.warn(`Mode layout "${activeMode}" belum terdaftar. Konten tidak akan dirender.`);
  }
  drawFooter(ctx, footerImage, effectiveFooterLink, brandPalette);
  if (!skipTimestamp && typeof setLastRenderAt === "function") {
    setLastRenderAt(new Date());
  }
  return canvas;
};
