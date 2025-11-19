// -------- Main application --------
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import JSZip from "jszip";
import AppEnvironment from "./app/app-environment";
import AppData, { DEFAULT_BRAND_PALETTE as FALLBACK_BRAND_PALETTE } from "./data/app-data";
import AppGlobals from "./app/config/globals";
import useBackgroundManager from "./hooks/background-manager";
import useStreamingTheme from "./hooks/streaming-theme";
import useTogelControls from "./hooks/togel-controls";
import useImageCache from "./hooks/use-image-cache";
import BannerHeader from "./components/layout/BannerHeader";
import BannerPreviewPanel from "./components/layout/BannerPreviewPanel";
import PreviewModal from "./components/layout/PreviewModal";
import MatchListForm from "./components/MatchListForm";
import { CanvasUtils } from "./utils/canvas-utils";
import "./app/mode-layout-registry";
import "./app/mode-modules";
import "./modes/layouts/match-mode";
import "./modes/layouts/togel-mode";
import "./modes/modules/match-modes";
import "./modes/modules/togel-mode";

const {
  drawBackground = () => {},
  drawOverlay = () => {},
  drawBrandLogo = () => 0,
  drawHeader = () => 0,
  drawFooter = () => {},
} = CanvasUtils || {};
const getModeLayoutConfig = AppEnvironment.getModeLayoutResolver();

const AVAILABLE_BRAND_LOGOS = Array.isArray(AppData.BRAND_LOGO_OPTIONS)
  ? AppData.BRAND_LOGO_OPTIONS
  : [];
const BACKGROUND_LOOKUP = AppData.BANNER_BACKGROUND_LOOKUP || {};
const DEFAULT_BRAND_PALETTE = AppData.DEFAULT_BRAND_PALETTE || FALLBACK_BRAND_PALETTE;
const MODE_BACKGROUND_DEFAULTS = AppGlobals.MODE_BACKGROUND_DEFAULTS || {};
const DEFAULT_ESPORT_MINI_BANNER = AppGlobals.DEFAULT_ESPORT_MINI_BANNER || AppData.ESPORT_MINI_BANNER_FOOTER || null;
const TOGEL_POOL_BACKGROUND_LOOKUP = AppGlobals.TOGEL_POOL_BACKGROUND_LOOKUP || {};
const MODE_CONFIG = AppGlobals.MODE_CONFIG || [];
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

const App = () => {
  const canvasRef = useRef(null);
  const [title, setTitle] = useState("");
  const [matches, setMatches] = useState(() => createInitialMatches(MAX_MATCHES));
  const [activeMatchCount, setActiveMatchCount] = useState(1);
  const [brandLogoSrc, setBrandLogoSrc] = useState("");
  const [activeMode, setActiveMode] = useState("football");
  const isTogelMode = activeMode === "togel";
  const isEsportsMode = activeMode === "esports";
  const includeMiniBanner = isEsportsMode;
  const shouldSkipHeader = isEsportsMode;
  const shouldShowTitle = !isEsportsMode;
  const activeModeConfig = useMemo(
    () => MODE_CONFIG.find((mode) => mode.id === activeMode) || MODE_CONFIG[0],
    [activeMode]
  );
  const pageBackgroundClass = activeModeConfig.pageBackgroundClass || "bg-slate-950";
  const {
    footballDefaultBackground,
    backgroundSrc,
    setSelectedFootballBackground,
    setSelectedBasketballBackground,
    setSelectedEsportsBackground,
    togelBackgroundSrc,
    applyTogelBackgroundPath,
  } = useBackgroundManager(activeMode);
  const [footerSrc, setFooterSrc] = useState("");
  const [footerLink, setFooterLink] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [lastRenderAt, setLastRenderAt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
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

  // Handles updating a single match field.
  const handleMatchFieldChange = useCallback((index, field, value) => {
    setMatches((prevMatches) =>
      prevMatches.map((match, idx) => {
        if (idx !== index) return match;

        const updatedMatch = { ...match, [field]: value };

        const resetAdjustments = (teamKey) => {
          const scaleKey =
            teamKey === "teamHome" ? "teamHomeLogoScale" : "teamAwayLogoScale";
          const offsetXKey =
            teamKey === "teamHome" ? "teamHomeLogoOffsetX" : "teamAwayLogoOffsetX";
          const offsetYKey =
            teamKey === "teamHome" ? "teamHomeLogoOffsetY" : "teamAwayLogoOffsetY";
          updatedMatch[scaleKey] = 1;
          updatedMatch[offsetXKey] = 0;
          updatedMatch[offsetYKey] = 0;
        };

        const applyAutoLogoFor = (teamField, { force = false } = {}) => {
          const logoField =
            teamField === "teamHome" ? "teamHomeLogo" : "teamAwayLogo";
          const flagField =
            teamField === "teamHome"
              ? "teamHomeLogoIsAuto"
              : "teamAwayLogoIsAuto";
          const teamName = updatedMatch[teamField];
          const autoLogoSrc = resolveAutoTeamLogoSrc(teamName);
          const hadManualLogo =
            match[logoField] &&
            !match[flagField] &&
            match[logoField] !== "";

          if (autoLogoSrc) {
            if (force || !hadManualLogo || match[flagField]) {
              updatedMatch[logoField] = autoLogoSrc;
              updatedMatch[flagField] = true;
              resetAdjustments(teamField);
            }
          } else {
            if (match[flagField] || updatedMatch[flagField]) {
              updatedMatch[logoField] = "";
              updatedMatch[flagField] = false;
            }
            resetAdjustments(teamField);
          }
        };

        if (field === "teamHome" || field === "teamAway") {
          applyAutoLogoFor(field);
        } else if (field === "teamHomeLogo" || field === "teamAwayLogo") {
          const flagField =
            field === "teamHomeLogo"
              ? "teamHomeLogoIsAuto"
              : "teamAwayLogoIsAuto";
          if (value) {
            updatedMatch[flagField] = false;
            resetAdjustments(
              field === "teamHomeLogo" ? "teamHome" : "teamAway"
            );
          } else {
            updatedMatch[flagField] = false;
            resetAdjustments(
              field === "teamHomeLogo" ? "teamHome" : "teamAway"
            );
          }
        }

        return updatedMatch;
      })
    );
  }, []);

  const handleAutoLogoRequest = useCallback((index, side) => {
    setMatches((prevMatches) =>
      prevMatches.map((match, idx) => {
        if (idx !== index) return match;
        const teamField = side === "home" ? "teamHome" : "teamAway";
        const logoField = side === "home" ? "teamHomeLogo" : "teamAwayLogo";
        const flagField =
          side === "home" ? "teamHomeLogoIsAuto" : "teamAwayLogoIsAuto";
        const scaleKey = side === "home" ? "teamHomeLogoScale" : "teamAwayLogoScale";
        const offsetXKey =
          side === "home" ? "teamHomeLogoOffsetX" : "teamAwayLogoOffsetX";
        const offsetYKey =
          side === "home" ? "teamHomeLogoOffsetY" : "teamAwayLogoOffsetY";
        const autoLogoSrc = resolveAutoTeamLogoSrc(match[teamField]);
        if (autoLogoSrc) {
          return {
            ...match,
            [logoField]: autoLogoSrc,
            [flagField]: true,
            [scaleKey]: 1,
            [offsetXKey]: 0,
            [offsetYKey]: 0,
          };
        }
        return {
          ...match,
          [logoField]: "",
          [flagField]: false,
          [scaleKey]: 1,
          [offsetXKey]: 0,
          [offsetYKey]: 0,
        };
      })
    );
  }, []);

  const handleLogoAdjust = useCallback((index, side, updates) => {
    if (!updates) return;
    setMatches((prevMatches) =>
      prevMatches.map((match, idx) => {
        if (idx !== index) return match;
        const scaleKey = side === "home" ? "teamHomeLogoScale" : "teamAwayLogoScale";
        const offsetXKey =
          side === "home" ? "teamHomeLogoOffsetX" : "teamAwayLogoOffsetX";
        const offsetYKey =
          side === "home" ? "teamHomeLogoOffsetY" : "teamAwayLogoOffsetY";
        let nextMatch = match;
        const ensureDraft = () => {
          if (nextMatch === match) {
            nextMatch = { ...match };
          }
        };
        const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
        if (Object.prototype.hasOwnProperty.call(updates, "scale")) {
          const value = Number(updates.scale);
          const current = match[scaleKey] ?? 1;
          const nextValue = Number.isFinite(value)
            ? clamp(value, 0.7, 1.5)
            : current;
          if (nextValue !== current) {
            ensureDraft();
            nextMatch[scaleKey] = nextValue;
          }
        }
        if (Object.prototype.hasOwnProperty.call(updates, "offsetX")) {
          const value = Number(updates.offsetX);
          const current = match[offsetXKey] ?? 0;
          const nextValue = Number.isFinite(value)
            ? clamp(value, -0.75, 0.75)
            : current;
          if (nextValue !== current) {
            ensureDraft();
            nextMatch[offsetXKey] = nextValue;
          }
        }
        if (Object.prototype.hasOwnProperty.call(updates, "offsetY")) {
          const value = Number(updates.offsetY);
          const current = match[offsetYKey] ?? 0;
          const nextValue = Number.isFinite(value)
            ? clamp(value, -0.75, 0.75)
            : current;
          if (nextValue !== current) {
            ensureDraft();
            nextMatch[offsetYKey] = nextValue;
          }
        }
        return nextMatch;
      })
    );
  }, []);

  const handleMatchCountChange = useCallback((nextCount) => {
    const normalizedCount = Math.min(
      Math.max(nextCount, 1),
      MAX_MATCHES
    );
    setMatches((prevMatches) => {
      if (prevMatches.length >= normalizedCount) {
        return prevMatches;
      }
      const additionalMatches = createInitialMatches(normalizedCount - prevMatches.length);
      return [...prevMatches, ...additionalMatches];
    });
    setActiveMatchCount(normalizedCount);
  }, []);

  // Draws the entire banner on the canvas.
  const renderBanner = useCallback(async (overrides = {}) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    } = overrides ?? {};

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (error) {
        console.warn("Fonts failed to load in time:", error);
      }
    }

    setIsRendering(true);
    try {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const effectiveBrandLogoSrc = overrideBrandLogoSrc ?? brandLogoSrc;
      const effectiveFooterSrc = overrideFooterSrc ?? footerSrc;
      const effectiveFooterLink = overrideFooterLink ?? footerLink;
      const effectiveBackgroundSrc = overrideBackgroundSrc ?? backgroundSrc;
      const effectiveMatches = overrideMatches ?? matches;
      const effectiveTogelDigits = overrideTogelDigits ?? togelDigits;
      const effectiveTogelPool = overrideTogelPool ?? togelPool;
      const effectiveTogelVariant = overrideTogelPoolVariant ?? togelPoolVariant;
      const effectiveTogelDrawTime = overrideTogelDrawTime ?? togelDrawTime;
      const poolLabel = resolveTogelPoolLabel(effectiveTogelPool);
      const baseTitleInput = overrideTitle ?? (shouldShowTitle ? title : "");
      const effectiveTitle = isTogelMode
        ? buildTogelTitle(baseTitleInput, poolLabel, effectiveTogelVariant)
        : baseTitleInput;
      const streamingInfoForRender = isTogelMode ? togelStreamingInfo : null;

      const miniBannerSrc = includeMiniBanner ? DEFAULT_ESPORT_MINI_BANNER : null;
      const [backgroundImage, footerImage, brandLogoImage, miniBannerImage] = await Promise.all([
        loadCachedOptionalImage(effectiveBackgroundSrc),
        loadCachedOptionalImage(effectiveFooterSrc),
        loadCachedOptionalImage(effectiveBrandLogoSrc),
        miniBannerSrc ? loadCachedOptionalImage(miniBannerSrc) : Promise.resolve(null),
      ]);
      const brandPalette =
        brandLogoImage
          ? deriveBrandPalette(brandLogoImage)
          : DEFAULT_BRAND_PALETTE;
      const miniBannerLayout =
        miniBannerImage && includeMiniBanner
          ? computeMiniBannerLayout(canvas, miniBannerImage)
          : null;

      const activeMatches = isTogelMode ? [] : effectiveMatches.slice(0, activeMatchCount);
      const matchesWithImages = isTogelMode
        ? []
        : await Promise.all(
            activeMatches.map(async (match) => {
              const [homeLogoImage, awayLogoImage, gameLogoImage] = await Promise.all([
                loadMatchLogoImage(match.teamHomeLogo, match.teamHomeLogoIsAuto),
                loadMatchLogoImage(match.teamAwayLogo, match.teamAwayLogoIsAuto),
                match.gameLogo ? loadCachedOptionalImage(match.gameLogo) : Promise.resolve(null),
              ]);
              return { ...match, homeLogoImage, awayLogoImage, gameLogoImage };
            })
          );

      drawBackground(ctx, backgroundImage);
      drawOverlay(ctx);

      const brandBottom = drawBrandLogo(ctx, brandLogoImage, brandPalette);
      const headerBottom = shouldSkipHeader
        ? brandBottom
        : drawHeader(ctx, effectiveTitle, brandBottom + 24, brandPalette);
      const matchesStartY = headerBottom + (shouldSkipHeader ? 12 : 28);

      const layoutPayload = {
        ctx,
        activeMode,
        matchesWithImages,
        matchesStartY,
        brandPalette,
        miniBannerLayout,
        miniBannerImage,
        streamingInfo: streamingInfoForRender,
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
      };

      const layoutConfig =
        typeof getModeLayoutConfig === "function" ? getModeLayoutConfig(activeMode) : null;
      if (layoutConfig && typeof layoutConfig.renderContent === "function") {
        await layoutConfig.renderContent(layoutPayload);
      } else {
        console.warn(`Mode layout "${activeMode}" belum terdaftar. Konten tidak akan dirender.`);
      }
      drawFooter(ctx, footerImage, effectiveFooterLink, brandPalette);
      if (!skipTimestamp) {
        setLastRenderAt(new Date());
      }
      return canvas;
    } catch (error) {
      console.error(error);
      window.alert(
        "Gagal membuat preview banner. Periksa data & gambar lalu coba lagi."
      );
    } finally {
      setIsRendering(false);
    }
  }, [
    activeMatchCount,
    backgroundSrc,
    footerSrc,
    brandLogoSrc,
    matches,
    title,
    footerLink,
    loadCachedOptionalImage,
    activeMode,
    togelDigits,
    togelPool,
    togelPoolVariant,
    togelDrawTime,
    togelStreamingInfo,
    isTogelMode,
    shouldShowTitle,
    includeMiniBanner,
    shouldSkipHeader,
  ]);

  // Keeps preview up to date when form data changes.
  useEffect(() => {
    renderBanner();
  }, [renderBanner]);

  useEffect(() => {
    if (!brandLogoSrc) return;
    const matchedBrandOption = AVAILABLE_BRAND_LOGOS.find(
      (option) => option && option.value === brandLogoSrc
    );
    const brandName = matchedBrandOption?.brand ?? null;
    const nextFooterSrc = resolveFooterSrcForBrand(brandName, brandLogoSrc, activeMode);
    setFooterSrc(nextFooterSrc);
  }, [activeMode, AVAILABLE_BRAND_LOGOS, brandLogoSrc]);

  const handleBrandLogoSelection = useCallback(
    (newValue) => {
      setBrandLogoSrc(newValue);

      if (!newValue) {
        setFooterSrc("");
        setFooterLink("");
        setSelectedFootballBackground(footballDefaultBackground);
        setSelectedBasketballBackground(MODE_BACKGROUND_DEFAULTS.basketball);
        setSelectedEsportsBackground(MODE_BACKGROUND_DEFAULTS.esports);
        return;
      }

      const matchedBrandOption = AVAILABLE_BRAND_LOGOS.find(
        (option) => option && option.value === newValue
      );
      if (matchedBrandOption && matchedBrandOption.brand) {
        const modeAwareFooter = resolveFooterSrcForBrand(
          matchedBrandOption.brand,
          newValue,
          activeMode
        );
        setFooterSrc(modeAwareFooter);

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
        setFooterLink(brandSlug ? `INDO.SKIN/${brandSlug}` : "");
      } else {
        setFooterSrc(resolveFooterSrcForBrand(null, newValue, activeMode));
        setFooterLink("");
        setSelectedFootballBackground(footballDefaultBackground);
        setSelectedBasketballBackground(MODE_BACKGROUND_DEFAULTS.basketball);
        setSelectedEsportsBackground(MODE_BACKGROUND_DEFAULTS.esports);
      }
    },
    [
      AVAILABLE_BRAND_LOGOS,
      activeMode,
      footballDefaultBackground,
      setBrandLogoSrc,
      setFooterSrc,
      setFooterLink,
      setSelectedFootballBackground,
      setSelectedBasketballBackground,
      setSelectedEsportsBackground,
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
  const handlePreviewClick = useCallback(async () => {
    if (isRendering) return;
    const renderedCanvas = await renderBanner();
    const canvas = renderedCanvas || canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      setPreviewImage(dataUrl);
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error("Gagal membuat preview popup:", error);
      window.alert("Gagal menyiapkan gambar preview. Coba lagi.");
    }
  }, [isRendering, renderBanner]);

  const downloadBanner = useCallback(async () => {
    if (isRendering) return;
    const renderedCanvas = await renderBanner();
    const canvas = renderedCanvas || canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "");
    link.download = `football-banner-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [isRendering, renderBanner]);

  const downloadAllBanners = useCallback(async () => {
    if (isRendering || isBulkDownloading || !AVAILABLE_BRAND_LOGOS.length) {
      return;
    }

    if (typeof JSZip === "undefined") {
      window.alert("Gagal memuat modul ZIP. Muat ulang halaman dan coba lagi.");
      return;
    }

    setIsBulkDownloading(true);
    const timestampBase = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "");
    const modeDefaultBackground = MODE_BACKGROUND_DEFAULTS[activeMode] || footballDefaultBackground;
    const togelBulkBackground =
      isTogelMode
        ? togelBackgroundSrc ||
          (togelPool && TOGEL_POOL_BACKGROUND_LOOKUP[togelPool]) ||
          MODE_BACKGROUND_DEFAULTS.togel
        : null;

    try {
      const zip = new JSZip();

      for (let index = 0; index < AVAILABLE_BRAND_LOGOS.length; index += 1) {
        const option = AVAILABLE_BRAND_LOGOS[index];
        if (!option || !option.value) continue;

        const brandSlugUpper = createBrandSlug(option.brand, { uppercase: true });
        const footerForBrand = resolveFooterSrcForBrand(
          option.brand,
          option.value,
          activeMode
        );
        let backgroundForBrand;
        if (activeMode === "football") {
          backgroundForBrand =
            option.backgroundValue ||
            (option.brand ? BACKGROUND_LOOKUP[option.brand] : null) ||
            footballDefaultBackground;
        } else if (isTogelMode) {
          backgroundForBrand = togelBulkBackground || MODE_BACKGROUND_DEFAULTS.togel;
        } else {
          const modeSpecificBackground =
            option.backgroundByMode && option.backgroundByMode[activeMode];
          backgroundForBrand =
            modeSpecificBackground || modeDefaultBackground || footballDefaultBackground;
        }

        await prefetchImages([
          option.value,
          footerForBrand,
          backgroundForBrand,
          includeMiniBanner ? DEFAULT_ESPORT_MINI_BANNER : null,
        ]);

        const renderedCanvas = await renderBanner({
          brandLogoSrc: option.value,
          footerSrc: footerForBrand,
          footerLink: brandSlugUpper ? `INDO.SKIN/${brandSlugUpper}` : footerLink,
          backgroundSrc: backgroundForBrand,
          skipTimestamp: true,
        });

        const canvas = renderedCanvas || canvasRef.current;
        if (!canvas) break;

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        if (!blob) continue;

        const brandSlugLower =
          createBrandSlug(option.brand) ||
          createBrandSlug(option.label) ||
          `brand-${String(index + 1).padStart(2, "0")}`;

        const arrayBuffer = await blob.arrayBuffer();
        zip.file(
          `football-banner-${brandSlugLower}-${timestampBase}.png`,
          arrayBuffer
        );
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `football-banner-${timestampBase}.zip`;
      link.click();
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Gagal membuat ZIP banner:", error);
      window.alert("Terjadi kesalahan saat membuat ZIP banner. Coba lagi sebentar lagi.");
    } finally {
      await renderBanner();
      setIsBulkDownloading(false);
    }
  }, [
    AVAILABLE_BRAND_LOGOS,
    BACKGROUND_LOOKUP,
    footballDefaultBackground,
    footerLink,
    isBulkDownloading,
    isRendering,
    renderBanner,
    activeMode,
    isTogelMode,
    togelBackgroundSrc,
    togelPool,
    includeMiniBanner,
    prefetchImages,
  ]);

  const handleClosePreview = useCallback(() => {
    setIsPreviewModalOpen(false);
  }, []);

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
          onModeChange={setActiveMode}
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
                brandLogoSrc={brandLogoSrc}
                onBrandLogoChange={handleBrandLogoSelection}
                brandOptions={AVAILABLE_BRAND_LOGOS}
                backgroundSrc={backgroundSrc}
                footerSrc={footerSrc}
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
            />
            </section>

            <BannerPreviewPanel
              canvasRef={canvasRef}
              isRendering={isRendering}
              isBulkDownloading={isBulkDownloading}
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
