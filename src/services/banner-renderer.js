import {
  drawBackground as defaultDrawBackground,
  drawOverlay as defaultDrawOverlay,
  drawBrandLogo as defaultDrawBrandLogo,
  drawHeader as defaultDrawHeader,
  drawFooter as defaultDrawFooter,
  drawVariantBall as defaultDrawVariantBall,
} from "../utils/canvas";

/**
 * Waits for document fonts to be ready before drawing.
 * @returns {Promise<void>}
 */
const waitForFonts = async () => {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (error) {
      console.warn("Fonts failed to load in time:", error);
    }
  }
};

/**
 * Enforces a maximum size on cache Map objects.
 * @param {import("react").MutableRefObject<Map<any, any>>} cacheRef
 * @param {number} limit
 */
const ensureCacheLimit = (cacheRef, limit) => {
  const cache = cacheRef?.current;
  if (!cache || typeof cache.size !== "number") return;
  if (limit <= 0) return;
  if (cache.size >= limit) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
};

const VARIANT_BALL_RADIUS = 80;
const VARIANT_BALL_GAP = 70;
const VARIANT_BALL_PADDING_RIGHT = 40;
const HEADER_HEIGHT = 88;
const VARIANT_BALL_TOP_INSET = 0;

const getBrandLogoSlotRect = (canvas) => {
  const desiredWidth = 450;
  const desiredHeight = 160;
  const horizontalPadding = 80;
  const slotWidth = Math.min(desiredWidth, canvas.width - horizontalPadding * 2);
  const slotHeight = Math.min(desiredHeight, canvas.height * 0.25);
  const x = canvas.width / 2 - slotWidth / 2;
  const y = 36;
  return {
    x,
    y,
    width: slotWidth,
    height: slotHeight,
  };
};

/**
 * Resolves a friendly brand name for the currently selected logo.
 * @param {Array<{value?: string; brand?: string; label?: string}>} availableBrandLogos
 * @param {string} logoValue
 * @param {string} fallbackName
 * @returns {string}
 */
const resolveBrandDisplayName = (availableBrandLogos, logoValue, fallbackName = "") => {
  if (!logoValue) {
    return fallbackName;
  }
  const matched = availableBrandLogos.find((option) => option && option.value === logoValue);
  return matched?.brand || matched?.label || fallbackName || "";
};

/**
 * Renders the current banner configuration to the canvas reference, reusing caches and assets.
 *
 * @param {Object} params
 * @param {Object} params.overrides - overrides applied during bulk rendering (brand/logo/background etc)
 * @param {import("react").MutableRefObject<HTMLCanvasElement>} params.canvasRef
 * @param {number} [params.baseSize=1080]
 * @param {Object} params.drawConfig - canvas drawing helpers (background, header, footer, overlay)
 * @param {Object} params.caches - Mutable refs used for caching palettes and layers
 * @param {Object} params.assets - Asset loaders such as `loadCachedOptionalImage`
 * @param {Object} params.config - Mode configurations and lookup tables
 * @param {Object} params.state - Banner state managed via `useBannerState`
 * @param {Object} params.togel - Togel-specific inputs
 * @param {Object} params.raffle - Raffle-specific inputs
 * @param {Object} params.helpers - Formatting helpers consumed by renderer
 * @param {Function} params.setLastRenderAt - Optional callback to timestamp renders
 * @returns {Promise<HTMLCanvasElement|null>}
 */
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
    drawVariantBall = defaultDrawVariantBall,
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
    resolveTogelPoolLogoSrc = () => "",
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
  if (!ctx) return null;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
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
  const togelPoolLogoSrc = isTogelMode ? resolveTogelPoolLogoSrc(effectiveTogelPool) : "";
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
    togelPoolLogoImage,
  ] = await Promise.all([
    loadCachedOptionalImage(effectiveBackgroundSrc),
    loadCachedOptionalImage(effectiveFooterSrc),
    loadCachedOptionalImage(effectiveBrandLogoSrc),
    miniBannerSrc ? loadCachedOptionalImage(miniBannerSrc) : Promise.resolve(null),
    shouldUseRaffleHeaderLogo ? loadCachedOptionalImage(raffleHeaderLogoSrc) : Promise.resolve(null),
    isTogelMode && togelPoolLogoSrc
      ? loadCachedOptionalImage(togelPoolLogoSrc)
      : Promise.resolve(null),
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
    isTogelMode ? togelPoolLogoSrc || "togel-logo-none" : "togel-logo-none",
    isTogelMode
      ? `variant-ball-${effectiveTogelVariant || "none"}-${VARIANT_BALL_RADIUS}-${VARIANT_BALL_GAP}-${VARIANT_BALL_PADDING_RIGHT}-${VARIANT_BALL_TOP_INSET}`
      : "variant-ball-none",
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
    const showLeftLogoSlot = isBigMatchLayoutActive || isTogelMode;
    const leftLogoImage = isBigMatchLayoutActive ? leagueLogoImage : togelPoolLogoImage;
    const leftLogoLabel = isTogelMode ? "LOGO POOL" : undefined;
    const headerY = brandBottom + 24;
    headerBottom = shouldSkipHeader
      ? brandBottom
      : drawHeader(ctx, effectiveTitle, headerY, brandPalette, {
          headerLogoImage: shouldUseRaffleHeaderLogo ? raffleHeaderLogoImage : null,
          leftLogoImage,
          showLeagueLogoSlot: showLeftLogoSlot,
          leftLogoLabel,
        });
    if (!shouldSkipHeader && isTogelMode && effectiveTogelVariant) {
      const brandRect = getBrandLogoSlotRect(canvas);
      const r = VARIANT_BALL_RADIUS;
      const gap = VARIANT_BALL_GAP;
      const desiredCenterX = brandRect.x + brandRect.width + r + gap;
      const maxCenterX = canvas.width - VARIANT_BALL_PADDING_RIGHT - r;
      const x = Math.min(desiredCenterX, maxCenterX);
      const y = brandRect.y + r + VARIANT_BALL_TOP_INSET;
      drawVariantBall(ctx, {
        x,
        y,
        text: effectiveTogelVariant,
        radius: r,
        palette: brandPalette,
      });
    }
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
