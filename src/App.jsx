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
import {
  removePlayerBackground,
  removeLogoBackground,
  isBackgroundRemovalConfigured,
} from "./services/background-removal";
import "./app/mode-layout-registry";
import "./app/mode-modules";
import "./modes/layouts/match-mode";
import "./modes/layouts/togel-mode";
import "./modes/layouts/raffle-mode";
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
const TOGEL_POOL_BACKGROUND_LOOKUP = AppGlobals.TOGEL_POOL_BACKGROUND_LOOKUP || {};
const MODE_CONFIG = AppGlobals.MODE_CONFIG || [];
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
const BRAND_PALETTE_CACHE_LIMIT = 50;

const deriveBrandPalette = (image) => {
  if (typeof deriveBrandPaletteFn === "function") {
    return deriveBrandPaletteFn(image) || DEFAULT_BRAND_PALETTE;
  }
  return DEFAULT_BRAND_PALETTE;
};
const formatMatchDateLabel =
  AppData.formatDate ||
  ((dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    try {
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  });
const formatMatchTimeLabel =
  AppData.formatTime ||
  ((timeString) => {
    if (!timeString) return "";
    return timeString;
  });
const BASE_LAYER_CACHE_LIMIT = 12;
const HEADER_LAYER_CACHE_LIMIT = 32;

const SCORE_MODE_TITLE = "HASIL SKOR SEPAK BOLA";

const BIG_MATCH_TITLE = "BIG MATCH";
const RAFFLE_DETAIL_ENDPOINT = "https://idnraffle.com/api/detail";
const RAFFLE_DATE_LOCALE_OPTIONS = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

const formatRaffleDateLabel = (rawValue) => {
  if (!rawValue) return "";
  const trimmed = `${rawValue}`.trim();
  if (!trimmed) return "";
  const normalized = trimmed.replace(" ", "T");
  let parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      parsed = new Date(`${isoMatch[1]}T00:00:00`);
    }
  }
  if (!Number.isNaN(parsed.getTime())) {
    try {
      return parsed.toLocaleDateString("id-ID", RAFFLE_DATE_LOCALE_OPTIONS).toUpperCase();
    } catch (error) {
      return parsed.toDateString().toUpperCase();
    }
  }
  return trimmed.toUpperCase();
};

const formatRaffleEventLabel = (info) => {
  if (!info) return "";
  const eventName = typeof info.name === "string" ? info.name.trim() : "";
  if (eventName) {
    return eventName.toUpperCase();
  }
  return formatRaffleDateLabel(info.endDate || info.periode || "");
};

const extractRaffleSlug = (rawValue) => {
  if (!rawValue) {
    return "";
  }
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const parsed = new URL(trimmed);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.pop() || trimmed;
  } catch (error) {
    return trimmed.replace(/^\/+|\/+$/g, "");
  }
};

const formatPrizeAmountLabel = (value) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(numeric);
    } catch (error) {
      return `Rp ${numeric.toLocaleString("id-ID")}`;
    }
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return "Rp -";
};

const mapRaffleWinners = (prizes = []) =>
  prizes.map((winner, index) => {
    const fallbackLabel = `Pemenang ${index + 1}`;
    const usernameSource = winner?.username || winner?.ticket_code || fallbackLabel;
    const displayUsername =
      typeof usernameSource === "string" ? usernameSource : `${usernameSource ?? fallbackLabel}`;
    const formattedPrizeAmount =
      winner?.formattedPrizeAmount ||
      formatPrizeAmountLabel(
        winner?.prize_amount ?? winner?.amount ?? winner?.prizeAmount ?? winner?.total ?? 0
      );
    return {
      ...winner,
      displayUsername,
      formattedPrizeAmount,
    };
  });

const buildPlayerSlotKey = (index, side) => `${index}-${side}`;
const buildLogoSlotKey = (index, side) => `${index}-${side}-logo`;

const App = () => {
  const canvasRef = useRef(null);
  const [title, setTitle] = useState("");
  const [matches, setMatches] = useState(() => createInitialMatches(MAX_MATCHES));
  const [activeMatchCount, setActiveMatchCount] = useState(1);
  const [brandLogoSrc, setBrandLogoSrc] = useState("");
  const [leagueLogoSrc, setLeagueLogoSrc] = useState("");
  const [activeMode, setActiveMode] = useState("football");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const isTogelMode = activeMode === "togel";
  const isEsportsMode = activeMode === "esports";
  const isRaffleMode = activeMode === "raffle";
  const isScoreModeActive = activeMode === "football" && activeSubMenu === "scores";
  const isBigMatchLayout = activeMode === "football" && activeSubMenu === "big_match";
  const activeModeConfig = useMemo(
    () => MODE_CONFIG.find((mode) => mode.id === activeMode) || MODE_CONFIG[0],
    [activeMode]
  );
  const activeModeModule = useMemo(
    () => (typeof getModeModule === "function" ? getModeModule(activeMode) : null),
    [activeMode]
  );
  const modeFeatures = activeModeModule?.features || {};
  const includeMiniBanner =
    typeof modeFeatures.includeMiniBanner === "boolean" ? modeFeatures.includeMiniBanner : isEsportsMode;
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
    const pageBackgroundClass = activeModeConfig.pageBackgroundClass || "bg-slate-950";
    useEffect(() => {
      if (isBigMatchLayout && activeMatchCount !== 1) {
        setActiveMatchCount(1);
      }
    }, [isBigMatchLayout, activeMatchCount]);
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
  const [bulkProgress, setBulkProgress] = useState(0);
  const [lastRenderAt, setLastRenderAt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [raffleSlug, setRaffleSlug] = useState("");
  const [raffleWinners, setRaffleWinners] = useState([]);
  const [raffleInfo, setRaffleInfo] = useState(null);
  const [isFetchingRaffle, setIsFetchingRaffle] = useState(false);
  const [raffleFetchError, setRaffleFetchError] = useState("");
  const [playerBgRemovalStatus, setPlayerBgRemovalStatus] = useState({});
  const [logoBgRemovalStatus, setLogoBgRemovalStatus] = useState({});
  const backgroundRemovalAvailable = useMemo(
    () => isBackgroundRemovalConfigured(),
    []
  );
  const renderTimeoutRef = useRef(null);
  const baseLayerCacheRef = useRef(new Map());
  const headerLayerCacheRef = useRef(new Map());
  const brandPaletteCacheRef = useRef(new Map());
  const yieldToFrame = useCallback(
    () =>
      new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      }),
    []
  );
  const visibleMatches = useMemo(
    () => matches.slice(0, activeMatchCount),
    [matches, activeMatchCount]
  );
  const handleRaffleSlugChange = useCallback((value) => {
    setRaffleSlug(value);
    setRaffleFetchError("");
    if (!value || !value.trim()) {
      setRaffleWinners([]);
      setRaffleInfo(null);
    }
  }, []);
  const handleFetchRaffleData = useCallback(async () => {
    const normalizedSlug = extractRaffleSlug(raffleSlug);
    if (!normalizedSlug) {
      setRaffleFetchError("Masukkan slug detail raffle terlebih dahulu.");
      setRaffleWinners([]);
      setRaffleInfo(null);
      return;
    }
    setIsFetchingRaffle(true);
    setRaffleFetchError("");
    try {
      const response = await fetch(RAFFLE_DETAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify({ slug: normalizedSlug }),
      });
      let payload;
      try {
        payload = await response.json();
      } catch (parseError) {
        throw new Error("Server raffle tidak mengembalikan JSON yang valid.");
      }
      if (!response.ok) {
        const message =
          payload?.message || payload?.error || "Gagal mengambil data pemenang dari IDN Raffle.";
        throw new Error(message);
      }
      const prizes = Array.isArray(payload?.prizes) ? payload.prizes : [];
      const normalizedWinners = mapRaffleWinners(prizes);
      setRaffleWinners(normalizedWinners);
      setRaffleInfo({
        name: payload?.name || "",
        totalPrize: payload?.total_prize || "",
        endDate: payload?.end_date || "",
        periode: payload?.periode || "",
      });
      setRaffleSlug(normalizedSlug);
      if (!prizes.length) {
        setRaffleFetchError("Respons berhasil tetapi tidak ada data pemenang.");
      }
    } catch (error) {
      console.error("Gagal memuat data raffle:", error);
      setRaffleFetchError(error?.message || "Gagal memuat data raffle.");
      setRaffleWinners([]);
      setRaffleInfo(null);
    } finally {
      setIsFetchingRaffle(false);
    }
  }, [raffleSlug]);

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

  const raffleEventLabel = useMemo(() => {
    if (!raffleInfo) return "";
    return formatRaffleEventLabel(raffleInfo);
  }, [raffleInfo]);

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
        } else if (field === "teamHomePlayerImage" || field === "teamAwayPlayerImage") {
          const baseKey = field === "teamHomePlayerImage" ? "teamHomePlayer" : "teamAwayPlayer";
          updatedMatch[`${baseKey}Scale`] = 1;
          updatedMatch[`${baseKey}OffsetX`] = 0;
          updatedMatch[`${baseKey}OffsetY`] = 0;
          updatedMatch[`${baseKey}Flip`] = false;
        }

        return updatedMatch;
      })
    );
    if (field === "teamHomePlayerImage" || field === "teamAwayPlayerImage") {
      const slotKey = buildPlayerSlotKey(
        index,
        field === "teamHomePlayerImage" ? "home" : "away"
      );
      setPlayerBgRemovalStatus((prev) => {
        if (!prev[slotKey]) {
          return prev;
        }
        const nextState = { ...prev };
        delete nextState[slotKey];
        return nextState;
      });
    }
  }, [setPlayerBgRemovalStatus]);

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

  const handlePlayerImageAdjust = useCallback((index, side, updates) => {
    if (!updates) return;
    setMatches((prevMatches) =>
      prevMatches.map((match, idx) => {
        if (idx !== index) return match;
        const scaleKey = side === "home" ? "teamHomePlayerScale" : "teamAwayPlayerScale";
        const offsetXKey =
          side === "home" ? "teamHomePlayerOffsetX" : "teamAwayPlayerOffsetX";
        const offsetYKey =
          side === "home" ? "teamHomePlayerOffsetY" : "teamAwayPlayerOffsetY";
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

  const handlePlayerImageFlipToggle = useCallback((index, side) => {
    setMatches((prevMatches) =>
      prevMatches.map((match, idx) => {
        if (idx !== index) return match;
        const imageKey = side === "home" ? "teamHomePlayerImage" : "teamAwayPlayerImage";
        const flipKey = side === "home" ? "teamHomePlayerFlip" : "teamAwayPlayerFlip";
        if (!match[imageKey]) {
          return match;
        }
        return {
          ...match,
          [flipKey]: !match[flipKey],
        };
      })
    );
  }, []);

  const updatePlayerBgRemovalState = useCallback((key, updates) => {
    if (!key) return;
    setPlayerBgRemovalStatus((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { loading: false, error: "" }),
        ...updates,
      },
    }));
  }, [setPlayerBgRemovalStatus]);
  const updateLogoBgRemovalState = useCallback((key, updates) => {
    if (!key) return;
    setLogoBgRemovalStatus((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { loading: false, error: "" }),
        ...updates,
      },
    }));
  }, [setLogoBgRemovalStatus]);

  const handleRemovePlayerBackground = useCallback(
    async (matchIndex, side, imageSrc) => {
      if (!backgroundRemovalAvailable) {
        window.alert("Fitur hapus background belum dikonfigurasi.");
        return;
      }
      if (!imageSrc) {
        window.alert("Unggah gambar pemain terlebih dahulu sebelum menghapus background.");
        return;
      }
      const slotKey = buildPlayerSlotKey(matchIndex, side);
      updatePlayerBgRemovalState(slotKey, { loading: true, error: "" });
      try {
        const cleanedImage = await removePlayerBackground(imageSrc);
        const fieldName =
          side === "home" ? "teamHomePlayerImage" : "teamAwayPlayerImage";
        handleMatchFieldChange(matchIndex, fieldName, cleanedImage);
        updatePlayerBgRemovalState(slotKey, { loading: false, error: "" });
      } catch (error) {
        console.error("Gagal menghapus background pemain:", error);
        const message =
          error?.message || "Gagal menghapus background. Coba lagi.";
      updatePlayerBgRemovalState(slotKey, { loading: false, error: message });
      window.alert(message);
    }
  },
  [
    backgroundRemovalAvailable,
    handleMatchFieldChange,
    updatePlayerBgRemovalState,
  ]
);

  const handleRemoveLogoBackground = useCallback(
    async (matchIndex, side, imageSrc) => {
      if (!backgroundRemovalAvailable) {
        window.alert("Fitur hapus background belum dikonfigurasi.");
        return;
      }
      if (!imageSrc) {
        window.alert("Unggah logo tim terlebih dahulu sebelum menghapus background.");
        return;
      }
      const slotKey = buildLogoSlotKey(matchIndex, side);
      updateLogoBgRemovalState(slotKey, { loading: true, error: "" });
      try {
        const cleanedImage = await removeLogoBackground(imageSrc);
        const fieldName = side === "home" ? "teamHomeLogo" : "teamAwayLogo";
        handleMatchFieldChange(matchIndex, fieldName, cleanedImage);
        updateLogoBgRemovalState(slotKey, { loading: false, error: "" });
      } catch (error) {
        console.error("Gagal menghapus background logo:", error);
        const message =
          error?.message || "Gagal menghapus background logo. Coba lagi.";
        updateLogoBgRemovalState(slotKey, { loading: false, error: message });
        window.alert(message);
      }
    },
    [
      backgroundRemovalAvailable,
      handleMatchFieldChange,
      updateLogoBgRemovalState,
    ]
  );

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

  // Prefetch backgrounds relevant to active mode to reduce unnecessary loads.
  useEffect(() => {
    const modeDefaults = MODE_BACKGROUND_DEFAULTS || {};
    const modeSpecificBackgrounds = AVAILABLE_BRAND_LOGOS
      .map((option) => option?.backgroundByMode?.[activeMode])
      .filter(Boolean);
    const sharedBackgrounds = AVAILABLE_BRAND_LOGOS
      .map((option) => option?.backgroundValue)
      .filter(Boolean);
    const candidates = [
      ...modeSpecificBackgrounds,
      ...sharedBackgrounds,
      modeDefaults[activeMode],
      activeMode === "football" ? footballDefaultBackground : null,
      includeMiniBanner ? DEFAULT_ESPORT_MINI_BANNER : null,
    ].filter(Boolean);
    if (candidates.length) {
      prefetchImages(candidates);
    }
  }, [
    activeMode,
    AVAILABLE_BRAND_LOGOS,
    footballDefaultBackground,
    includeMiniBanner,
    prefetchImages,
  ]);

  // Draws the entire banner on the canvas.
  const renderBanner = useCallback(async (overrides = {}) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const baseSize = 1080;
    canvas.width = baseSize;
    canvas.height = baseSize;

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
      const resolveBrandDisplayName = (logoValue) => {
        if (!logoValue) return "";
        const matched = AVAILABLE_BRAND_LOGOS.find((option) => option && option.value === logoValue);
        return matched?.brand || matched?.label || "";
      };
      const effectiveBrandDisplayName =
        resolveBrandDisplayName(effectiveBrandLogoSrc) || selectedBrandName || "";
      const selectedLeagueLogoOption =
        isBigMatchLayoutActive && LEAGUE_LOGO_OPTIONS.length
          ? LEAGUE_LOGO_OPTIONS.find((option) => option.value === effectiveLeagueLogoSrc) || null
          : null;
      const dynamicBigMatchTitle = selectedLeagueLogoOption?.label?.trim() || BIG_MATCH_TITLE;
      const baseTitleInput =
        overrideTitle ??
        (isScoreLayoutActive
          ? SCORE_MODE_TITLE
          : isBigMatchLayoutActive
          ? dynamicBigMatchTitle
          : allowCustomTitle
          ? title
          : "");
      const effectiveTitle = isTogelMode
        ? buildTogelTitle(baseTitleInput, poolLabel, effectiveTogelVariant)
        : baseTitleInput;
      const streamingInfoForRender = isTogelMode ? togelStreamingInfo : null;

      const miniBannerSrc = includeMiniBanner ? DEFAULT_ESPORT_MINI_BANNER : null;
      const shouldUseRaffleHeaderLogo = isRaffleMode;
      const [backgroundImage, footerImage, brandLogoImage, miniBannerImage, raffleHeaderLogoImage] = await Promise.all([
        loadCachedOptionalImage(effectiveBackgroundSrc),
        loadCachedOptionalImage(effectiveFooterSrc),
        loadCachedOptionalImage(effectiveBrandLogoSrc),
        miniBannerSrc ? loadCachedOptionalImage(miniBannerSrc) : Promise.resolve(null),
        shouldUseRaffleHeaderLogo ? loadCachedOptionalImage(RAFFLE_HEADER_LOGO_SRC) : Promise.resolve(null),
      ]);
      const brandPalette =
        brandLogoImage
          ? (() => {
              const cacheKey = effectiveBrandLogoSrc || "logo-pal";
              const brandPaletteCache = brandPaletteCacheRef.current;
              if (brandPaletteCache.has(cacheKey)) {
                return brandPaletteCache.get(cacheKey);
              }
              const palette = deriveBrandPalette(brandLogoImage) || DEFAULT_BRAND_PALETTE;
              if (brandPaletteCache.size >= BRAND_PALETTE_CACHE_LIMIT) {
                brandPaletteCache.delete(brandPaletteCache.keys().next().value);
              }
              brandPaletteCache.set(cacheKey, palette);
              return palette;
            })()
          : DEFAULT_BRAND_PALETTE;
      const brandPaletteKey = JSON.stringify(brandPalette || {});
      const baseLayerCacheKey = [baseSize, activeMode, effectiveBackgroundSrc || "none", brandPaletteKey].join("|");
      const baseLayerCache = baseLayerCacheRef.current;
      const headerLayerCache = headerLayerCacheRef.current;
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
      const cachedHeaderLayer = headerLayerCache.get(headerLayerCacheKey);
      if (cachedHeaderLayer) {
        try {
          ctx.putImageData(cachedHeaderLayer.imageData, 0, 0);
          matchesStartY = cachedHeaderLayer.matchesStartY;
          headerBottom = matchesStartY - (shouldSkipHeader ? 12 : 28);
          headerLayerApplied = true;
        } catch (error) {
          console.warn("Gagal menerapkan cache header layer:", error);
          headerLayerCache.delete(headerLayerCacheKey);
        }
      }
      const miniBannerLayout =
        miniBannerImage && includeMiniBanner
          ? computeMiniBannerLayout(canvas, miniBannerImage)
          : null;

      const matchesToUse = isBigMatchLayoutActive ? 1 : activeMatchCount;
      const activeMatches = shouldRenderMatches ? effectiveMatches.slice(0, matchesToUse) : [];
      const matchesWithImages = shouldRenderMatches
        ? await Promise.all(
            activeMatches.map(async (match) => {
              const [homeLogoImage, awayLogoImage, gameLogoImage, homePlayerImage, awayPlayerImage] =
                await Promise.all([
                  loadMatchLogoImage(match.teamHomeLogo, match.teamHomeLogoIsAuto),
                  loadMatchLogoImage(match.teamAwayLogo, match.teamAwayLogoIsAuto),
                  match.gameLogo ? loadCachedOptionalImage(match.gameLogo) : Promise.resolve(null),
                  match.teamHomePlayerImage ? loadCachedOptionalImage(match.teamHomePlayerImage) : Promise.resolve(null),
                  match.teamAwayPlayerImage ? loadCachedOptionalImage(match.teamAwayPlayerImage) : Promise.resolve(null),
                ]);
              return { ...match, homeLogoImage, awayLogoImage, gameLogoImage, homePlayerImage, awayPlayerImage };
            })
          )
        : [];

      const leagueLogoImage = isBigMatchLayoutActive
        ? await loadCachedOptionalImage(effectiveLeagueLogoSrc)
        : null;
      const firstMatchForBigLayout = isBigMatchLayoutActive ? matchesWithImages[0] : null;
      const bigMatchDateLabel =
        firstMatchForBigLayout?.date ? formatMatchDateLabel(firstMatchForBigLayout.date) : "";
      const bigMatchTimeLabel =
        firstMatchForBigLayout?.time ? formatMatchTimeLabel(firstMatchForBigLayout.time) : "";

      if (!headerLayerApplied) {
        let baseLayerApplied = false;
        const cachedLayer = baseLayerCache.get(baseLayerCacheKey);
        if (cachedLayer) {
          try {
            ctx.putImageData(cachedLayer, 0, 0);
            baseLayerApplied = true;
          } catch (error) {
            console.warn("Gagal menerapkan cache base layer:", error);
            baseLayerCache.delete(baseLayerCacheKey);
          }
        }
        if (!baseLayerApplied) {
          drawBackground(ctx, backgroundImage);
          drawOverlay(ctx);
          try {
            const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
            if (baseLayerCache.size >= BASE_LAYER_CACHE_LIMIT) {
              baseLayerCache.delete(baseLayerCache.keys().next().value);
            }
            baseLayerCache.set(baseLayerCacheKey, snapshot);
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
          if (headerLayerCache.size >= HEADER_LAYER_CACHE_LIMIT) {
            headerLayerCache.delete(headerLayerCache.keys().next().value);
          }
          headerLayerCache.set(headerLayerCacheKey, {
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
        activeSubMenu: overrideActiveSubMenu ?? activeSubMenu,
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
    AVAILABLE_BRAND_LOGOS,
    backgroundSrc,
    footerSrc,
    brandLogoSrc,
    leagueLogoSrc,
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
    allowCustomTitle,
    includeMiniBanner,
    shouldSkipHeader,
    shouldRenderMatches,
    activeSubMenu,
    isScoreModeActive,
    isBigMatchLayout,
    isRaffleMode,
    raffleWinners,
    raffleInfo,
    raffleEventLabel,
    selectedBrandName,
  ]);

  const scheduleRender = useCallback(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    renderTimeoutRef.current = setTimeout(() => {
      renderTimeoutRef.current = null;
      renderBanner();
    }, 80);
  }, [renderBanner]);

  // Keeps preview up to date when form data changes.
  useEffect(() => {
    scheduleRender();
  }, [scheduleRender]);

  useEffect(
    () => () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!brandLogoSrc) {
      setFooterSrc(activeMode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "");
      return;
    }
    const matchedBrandOption = AVAILABLE_BRAND_LOGOS.find(
      (option) => option && option.value === brandLogoSrc
    );
    const brandName = matchedBrandOption?.brand ?? null;
    const nextFooterSrc = resolveFooterSrcForBrand(brandName, brandLogoSrc, activeMode);
    if (nextFooterSrc) {
      setFooterSrc(nextFooterSrc);
    } else {
      setFooterSrc(activeMode === "raffle" ? DEFAULT_RAFFLE_FOOTER : "");
    }
  }, [activeMode, AVAILABLE_BRAND_LOGOS, brandLogoSrc, DEFAULT_RAFFLE_FOOTER]);

  const handleBrandLogoSelection = useCallback(
    (newValue) => {
      setBrandLogoSrc(newValue);

      if (!newValue) {
        setFooterSrc(isRaffleMode ? DEFAULT_RAFFLE_FOOTER : "");
        setFooterLink("");
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
        setFooterSrc(modeAwareFooter);
        resolvedFooterForPrefetch = modeAwareFooter;

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
        const fallbackFooter = resolveFooterSrcForBrand(null, newValue, activeMode);
        setFooterSrc(fallbackFooter);
        resolvedFooterForPrefetch = fallbackFooter;
        setFooterLink("");
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
      setBrandLogoSrc,
      setFooterSrc,
      setFooterLink,
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
    setBulkProgress(0);
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
      const totalBrands = AVAILABLE_BRAND_LOGOS.length;
      const prefetchedInBulk = new Set();
      const BATCH_SIZE = 3;

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

        const maybePrefetch = [
          option.value,
          footerForBrand,
          backgroundForBrand,
          includeMiniBanner ? DEFAULT_ESPORT_MINI_BANNER : null,
        ].filter(Boolean);
        const freshSources = maybePrefetch.filter((src) => !prefetchedInBulk.has(src));
        if (freshSources.length) {
          freshSources.forEach((src) => prefetchedInBulk.add(src));
          await prefetchImages(freshSources);
        }

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

        const nextProgress = (index + 1) / totalBrands;
        setBulkProgress(nextProgress);
        if ((index + 1) % BATCH_SIZE === 0) {
          await yieldToFrame();
        }
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
      setBulkProgress(0);
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
    yieldToFrame,
    setBulkProgress,
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
              onLeagueLogoChange={setLeagueLogoSrc}
              isBigMatchLayout={isBigMatchLayout}
              onRemovePlayerBackground={handleRemovePlayerBackground}
              playerBackgroundRemovalState={playerBgRemovalStatus}
              onRemoveLogoBackground={handleRemoveLogoBackground}
              logoBackgroundRemovalState={logoBgRemovalStatus}
              isBackgroundRemovalAvailable={backgroundRemovalAvailable}
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
              isRendering={isRendering}
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
