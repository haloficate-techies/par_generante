import React, { useState, useCallback, useEffect, useRef, useId } from "react";
import AppEnvironment from "../app/app-environment";
// -------- Reusable UI blocks --------
const AppData = AppEnvironment.getData() || {};
const AppGlobals = AppEnvironment.getGlobals() || {};
const AVAILABLE_TOGEL_POOL_OPTIONS =
  Array.isArray(AppData.TOGEL_POOL_OPTIONS) ? AppData.TOGEL_POOL_OPTIONS : [];
const resolveTogelDrawTimeConfigImpl =
  typeof AppGlobals.resolveTogelDrawTimeConfig === "function"
    ? AppGlobals.resolveTogelDrawTimeConfig
    : null;
const resolveAutoLogoSrc =
  typeof AppData.resolveAutoLogoSrc === "function" ? AppData.resolveAutoLogoSrc : () => "";
const readFileAsDataURL =
  typeof AppData.readFileAsDataURL === "function" ? AppData.readFileAsDataURL : async () => null;
const AVAILABLE_LEAGUE_LOGO_OPTIONS =
  Array.isArray(AppGlobals.LEAGUE_LOGO_OPTIONS) ? AppGlobals.LEAGUE_LOGO_OPTIONS : [];

const DEFAULT_ESPORT_GAME_OPTIONS = [
  { label: "Age of Empires", value: "assets/ESPORT/logo_game/AGE_OF_EMPIRES.webp" },
  { label: "AOV", value: "assets/ESPORT/logo_game/AOV.webp" },
  { label: "Apex Legends", value: "assets/ESPORT/logo_game/APEX_LEGENDS.webp" },
  { label: "Brawl Stars", value: "assets/ESPORT/logo_game/BRAWL_STARS.webp" },
  { label: "Call of Duty", value: "assets/ESPORT/logo_game/CALL_OF_DUTY.webp" },
  {
    label: "Call of Duty Mobile",
    value: "assets/ESPORT/logo_game/CALL_OF_DUTY_MOBILE.webp",
  },
  { label: "Counter Strike", value: "assets/ESPORT/logo_game/COUNTER_STRIKE.webp" },
  { label: "Crossfire", value: "assets/ESPORT/logo_game/CROSSFIRE.webp" },
  { label: "Dota 2", value: "assets/ESPORT/logo_game/DOTA_2.webp" },
  { label: "FIFA", value: "assets/ESPORT/logo_game/FIFA.webp" },
  { label: "King of Glory", value: "assets/ESPORT/logo_game/KING_OF_GLORY.webp" },
  { label: "League of Legends", value: "assets/ESPORT/logo_game/LOL.webp" },
  {
    label: "League of Legends: Wild Rift",
    value: "assets/ESPORT/logo_game/LOL_WILD_RIFT.webp",
  },
  { label: "Mobile Legends", value: "assets/ESPORT/logo_game/MOBILE_LEGENDS.webp" },
  { label: "NBA 2K", value: "assets/ESPORT/logo_game/NBA_2K.webp" },
  { label: "Overwatch", value: "assets/ESPORT/logo_game/OVERWATCH.webp" },
  { label: "PUBG", value: "assets/ESPORT/logo_game/PUBG.webp" },
  { label: "PUBG Mobile", value: "assets/ESPORT/logo_game/PUBG_MOBILE.webp" },
  {
    label: "Rainbow Six Siege",
    value: "assets/ESPORT/logo_game/RAINBOW_SIX_SIEGE.webp",
  },
  { label: "Rocket League", value: "assets/ESPORT/logo_game/ROCKET_LEAGUE.webp" },
  { label: "StarCraft 2", value: "assets/ESPORT/logo_game/STARCRAFT_2.webp" },
  {
    label: "StarCraft: Brood War",
    value: "assets/ESPORT/logo_game/STARCRAFT_BROOD_WAR.webp",
  },
  { label: "Valorant", value: "assets/ESPORT/logo_game/VALORANT.webp" },
  { label: "Warcraft 3", value: "assets/ESPORT/logo_game/WARCRAFT_3.webp" },
];

const AVAILABLE_ESPORT_GAME_OPTIONS =
  Array.isArray(AppData.ESPORT_GAME_OPTIONS) && AppData.ESPORT_GAME_OPTIONS.length
    ? AppData.ESPORT_GAME_OPTIONS
    : DEFAULT_ESPORT_GAME_OPTIONS;

const DEFAULT_SCORE_DATE_OPTIONS = [
  { value: "today", label: "Hari Ini" },
  { value: "yesterday", label: "Kemarin" },
  { value: "yesterday_today", label: "Kemarin & Hari Ini" },
];

const getTogelDrawTimeConfig = (pool, variant) =>
  typeof resolveTogelDrawTimeConfigImpl === "function"
    ? resolveTogelDrawTimeConfigImpl(pool, variant)
    : { options: [] };

const DigitStepperInput = ({ label, value = "0", onChange }) => {
  const numericValue = Number.parseInt(value, 10);
  const currentValue = Number.isFinite(numericValue) ? numericValue : 0;
  const clampDigit = (digit) => Math.min(9, Math.max(0, digit));
  const handleManualInput = (event) => {
    const raw = event.target.value.replace(/\D/g, "");
    const digit = raw ? Number.parseInt(raw[raw.length - 1], 10) : 0;
    onChange?.(String(clampDigit(digit)));
  };
  const handleIncrement = () => {
    const nextValue = currentValue >= 9 ? 0 : currentValue + 1;
    onChange?.(String(nextValue));
  };
  const handleDecrement = () => {
    const nextValue = currentValue <= 0 ? 9 : currentValue - 1;
    onChange?.(String(nextValue));
  };
  const handleKeyDown = (event) => {
    const { key } = event;
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      onChange?.(key);
      return;
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      handleIncrement();
      return;
    }
    if (key === "ArrowDown") {
      event.preventDefault();
      handleDecrement();
      return;
    }
    if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      onChange?.("0");
    }
  };

  const ArrowIcon = ({ direction = "up" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      {direction === "up" ? (
        <path d="M6 15l6-6 6 6" />
      ) : (
        <path d="M18 9l-6 6-6-6" />
      )}
    </svg>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="flex w-16 flex-col items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/70 px-2 py-3 text-slate-100 shadow-inner shadow-black/40">
        <button
          type="button"
          onClick={handleIncrement}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:text-white"
          aria-label="Naikkan digit"
        >
          <ArrowIcon direction="up" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={String(currentValue)}
          onChange={handleManualInput}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-center text-3xl font-semibold tracking-wider text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
        />
        <button
          type="button"
          onClick={handleDecrement}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:text-white"
          aria-label="Turunkan digit"
        >
          <ArrowIcon direction="down" />
        </button>
      </div>
    </div>
  );
};

const MatchFieldset = ({
  match,
  index,
  onFieldChange,
  onRequestAutoLogo,
  onLogoAdjust,
  onPlayerImageAdjust,
  isEsportsMode = false,
  gameOptions = [],
  showScoreInputs = false,
  showBigMatchExtras = false,
}) => {
  const gameSlotPreviewStyle = {
    backgroundImage: "linear-gradient(135deg, #0d1829, #050912)",
    border: "1px solid rgba(148, 163, 184, 0.45)",
    boxShadow:
      "0 12px 20px rgba(2, 6, 23, 0.65), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -6px 16px rgba(0,0,0,0.45)",
  };

  const handleGameChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      const option = gameOptions.find((item) => item.value === nextValue);
      onFieldChange(index, "gameLogo", nextValue || null);
      onFieldChange(index, "gameName", option?.label ?? "");
    },
    [gameOptions, index, onFieldChange]
  );

  const homeInputId = `match-${index}-home`;
  const awayInputId = `match-${index}-away`;
  const dateInputId = `match-${index}-date`;
  const timeInputId = `match-${index}-time`;
  const gameSelectId = `match-${index}-game`;
  const homeScoreId = `match-${index}-score-home`;
  const awayScoreId = `match-${index}-score-away`;

  const handleScoreInput = useCallback(
    (field, value) => {
      const safeValue = typeof value === "string" ? value : String(value ?? "");
      const normalized = safeValue.replace(/[^0-9]/g, "").slice(0, 2);
      onFieldChange(index, field, normalized);
    },
    [index, onFieldChange]
  );

  return (
    <fieldset className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
    <legend className="px-2 text-sm font-semibold text-slate-300">
      Pertandingan {index + 1}
    </legend>
    <div className="grid gap-3 md:grid-cols-2">
      <div className="flex flex-col">
        <label htmlFor={homeInputId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tim Tuan Rumah
        </label>
        <input
          id={homeInputId}
          type="text"
          value={match.teamHome}
          onChange={(event) =>
            onFieldChange(index, "teamHome", event.target.value)
          }
          placeholder="Contoh: Manchester City"
          className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={awayInputId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tim Tamu
        </label>
        <input
          id={awayInputId}
          type="text"
          value={match.teamAway}
          onChange={(event) =>
            onFieldChange(index, "teamAway", event.target.value)
          }
          placeholder="Contoh: Liverpool FC"
          className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={dateInputId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tanggal
        </label>
        <input
          id={dateInputId}
          type="date"
          value={match.date}
          onChange={(event) =>
            onFieldChange(index, "date", event.target.value)
          }
          className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={timeInputId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Kick-off (WIB)
        </label>
        <input
          id={timeInputId}
          type="time"
          value={match.time}
          onChange={(event) =>
            onFieldChange(index, "time", event.target.value)
          }
          className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
      </div>
    </div>
    {showScoreInputs && (
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor={homeScoreId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Skor Tuan Rumah
          </label>
          <input
            id={homeScoreId}
            type="text"
            inputMode="numeric"
            value={match.scoreHome ?? ""}
            onChange={(event) => handleScoreInput("scoreHome", event.target.value)}
            placeholder="0"
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor={awayScoreId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Skor Tim Tamu
          </label>
          <input
            id={awayScoreId}
            type="text"
            inputMode="numeric"
            value={match.scoreAway ?? ""}
            onChange={(event) => handleScoreInput("scoreAway", event.target.value)}
            placeholder="0"
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
      </div>
    )}
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <ImageUploadPreview
        label="Logo Tuan Rumah"
        helperText="PNG transparan 1:1 disarankan."
        previewSrc={match.teamHomeLogo}
        onChange={(value) => onFieldChange(index, "teamHomeLogo", value)}
        inputId={`home-logo-${index}`}
        ratioHint="1:1 (maks 300x300 px)"
        isAuto={match.teamHomeLogoIsAuto}
        onAutoFetch={() => onRequestAutoLogo?.(index, "home")}
        canAutoFetch={Boolean(resolveAutoLogoSrc(match.teamHome))}
        scale={match.teamHomeLogoScale}
        offsetX={match.teamHomeLogoOffsetX}
        offsetY={match.teamHomeLogoOffsetY}
        onAdjust={(adjustments) => onLogoAdjust?.(index, "home", adjustments)}
      />
      <ImageUploadPreview
        label="Logo Tim Tamu"
        helperText="PNG transparan 1:1 disarankan."
        previewSrc={match.teamAwayLogo}
        onChange={(value) => onFieldChange(index, "teamAwayLogo", value)}
        inputId={`away-logo-${index}`}
        ratioHint="1:1 (maks 300x300 px)"
        isAuto={match.teamAwayLogoIsAuto}
        onAutoFetch={() => onRequestAutoLogo?.(index, "away")}
        canAutoFetch={Boolean(resolveAutoLogoSrc(match.teamAway))}
        scale={match.teamAwayLogoScale}
        offsetX={match.teamAwayLogoOffsetX}
        offsetY={match.teamAwayLogoOffsetY}
        onAdjust={(adjustments) => onLogoAdjust?.(index, "away", adjustments)}
      />
    </div>
    {isEsportsMode && (
      <div className="mt-4 space-y-2">
        <label htmlFor={gameSelectId} className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Game
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <select
            id={gameSelectId}
            value={match.gameLogo || ""}
            onChange={handleGameChange}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          >
            <option value="">Pilih game</option>
            {gameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={gameSlotPreviewStyle}
          >
            {match.gameLogo ? (
              <img
                src={match.gameLogo}
                alt={match.gameName || "Logo game"}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-[10px] text-slate-500">Preview</span>
            )}
          </div>
        </div>
      </div>
    )}
    {showBigMatchExtras && (
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ImageUploadPreview
          label="Foto Pemain Tim Tuan Rumah"
          helperText="Gunakan gambar PNG/JPG dengan latar bersih."
          previewSrc={match.teamHomePlayerImage}
          onChange={(value) => onFieldChange(index, "teamHomePlayerImage", value)}
          inputId={`home-player-${index}`}
          ratioHint="Format potret disarankan"
          slotHeight="h-52"
          scale={match.teamHomePlayerScale}
          offsetX={match.teamHomePlayerOffsetX}
          offsetY={match.teamHomePlayerOffsetY}
          onAdjust={(adjustments) => onPlayerImageAdjust?.(index, "home", adjustments)}
        />
        <ImageUploadPreview
          label="Foto Pemain Tim Tandang"
          helperText="Gunakan gambar PNG/JPG dengan latar bersih."
          previewSrc={match.teamAwayPlayerImage}
          onChange={(value) => onFieldChange(index, "teamAwayPlayerImage", value)}
          inputId={`away-player-${index}`}
          ratioHint="Format potret disarankan"
          slotHeight="h-52"
          scale={match.teamAwayPlayerScale}
          offsetX={match.teamAwayPlayerOffsetX}
          offsetY={match.teamAwayPlayerOffsetY}
          onAdjust={(adjustments) => onPlayerImageAdjust?.(index, "away", adjustments)}
        />
      </div>
    )}
  </fieldset>
  );
};


const ImageUploadPreview = ({
  label,
  helperText,
  previewSrc,
  onChange,
  inputId,
  ratioHint,
  slotHeight = "h-32",
  isAuto = false,
  onAutoFetch,
  canAutoFetch = false,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  onAdjust,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!previewSrc) {
      setManualInput("");
      setInputStatus("");
      return;
    }
    if (/^https?:\/\//i.test(previewSrc)) {
      setManualInput(previewSrc);
      setInputStatus("");
      return;
    }
    if (previewSrc.startsWith("data:")) {
      setManualInput("");
      setInputStatus("Gambar clipboard siap dipakai.");
      return;
    }
    setManualInput(previewSrc);
    setInputStatus("");
  }, [previewSrc]);

  const startAsyncRequest = useCallback(() => {
    requestIdRef.current += 1;
    const currentId = requestIdRef.current;
    setIsLoading(true);
    return currentId;
  }, []);

  const finishAsyncRequest = useCallback((requestId) => {
    if (requestIdRef.current === requestId) {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    requestIdRef.current += 1;
    setIsLoading(false);
    setManualInput("");
    setInputStatus("");
    onChange(null);
    onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
  }, [onAdjust, onChange]);

  const handleFileSelection = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        handleReset();
        return;
      }
      if (!file.type.startsWith("image/")) {
        window.alert("Silakan upload file gambar (JPG/PNG/SVG).");
        return;
      }
      const requestId = startAsyncRequest();
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (requestIdRef.current !== requestId) return;
        onChange(dataUrl);
        onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
        setInputStatus("Gambar upload berhasil dimuat.");
      } catch (error) {
        console.error(error);
        window.alert("Gagal membaca file gambar. Coba lagi.");
      } finally {
        finishAsyncRequest(requestId);
      }
    },
    [finishAsyncRequest, handleReset, onAdjust, onChange, startAsyncRequest]
  );

  const handleClipboardPaste = useCallback(
    async (event) => {
      const { clipboardData } = event;
      if (!clipboardData) return;

      const items = clipboardData.items ? Array.from(clipboardData.items) : [];
      const imageItem = items.find((item) => item.type?.startsWith("image/"));

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (!file) return;
        event.preventDefault();
        const requestId = startAsyncRequest();
        try {
          const dataUrl = await readFileAsDataURL(file);
          if (requestIdRef.current !== requestId) return;
          onChange(dataUrl);
          onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
          setInputStatus("Gambar clipboard berhasil dimuat.");
        } catch (error) {
          console.error(error);
          window.alert("Gagal memuat gambar dari clipboard. Coba lagi.");
        } finally {
          finishAsyncRequest(requestId);
        }
        return;
      }

      const text = clipboardData.getData("text/plain");
      if (text) {
        event.preventDefault();
        const normalized = text.trim();
        onChange(normalized || null);
        onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
        setManualInput(normalized);
        setInputStatus("");
      }
    },
    [finishAsyncRequest, onAdjust, onChange, startAsyncRequest]
  );

  const handleManualInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setManualInput(value);
      const normalized = value.trim();
      onChange(normalized ? normalized : null);
      onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
      setInputStatus("");
    },
    [onAdjust, onChange]
  );

  const handleScaleChange = useCallback(
    (event) => {
      const value = Number(event.target.value);
      onAdjust?.({ scale: value });
    },
    [onAdjust]
  );

  const handleOffsetChange = useCallback(
    (event, axis) => {
      const value = Number(event.target.value);
      if (!onAdjust) return;
      onAdjust({ [axis]: value });
    },
    [onAdjust]
  );

  const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
  const clampedScale = clampValue(scale ?? 1, 0.7, 1.5);
  const clampedOffsetX = clampValue(offsetX ?? 0, -0.75, 0.75);
  const clampedOffsetY = clampValue(offsetY ?? 0, -0.75, 0.75);
  const transformStyle = {
    transform: `translate(${clampedOffsetX * 50}%, ${clampedOffsetY * 50}%) scale(${clampedScale})`,
  };
  const hasAdjustments = Boolean(onAdjust);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="text-xs leading-relaxed text-slate-400">
            {helperText}
          </p>
          {ratioHint && (
            <p className="text-xs text-slate-500">Rasio ideal: {ratioHint}</p>
          )}
          {isAuto && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              <span className="text-[12px] leading-none">?</span>
              Logo otomatis
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {canAutoFetch && (
            <button
              type="button"
              className="rounded-full border border-emerald-400/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
              onClick={onAutoFetch}
            >
              Muat otomatis
            </button>
          )}
          {previewSrc && (
            <button
              type="button"
              className="text-xs font-medium text-rose-300 hover:text-rose-200"
              onClick={handleReset}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <label
        htmlFor={inputId}
        className={`mt-3 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800/40 text-sm text-slate-300 transition hover:border-brand-yellow hover:bg-slate-800/70 ${slotHeight}`}
      >
        {isLoading ? (
          <span>Memuat...</span>
        ) : previewSrc ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative flex aspect-square w-28 max-w-[85%] items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-white shadow-inner shadow-black/10">
              <img
                src={previewSrc}
                alt={`${label} preview`}
                className="h-full w-full origin-center object-contain transition-transform duration-150"
                style={transformStyle}
              />
              <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
            </div>
          </div>
        ) : (
          <span>Klik untuk memilih gambar</span>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelection}
      />
      <div className="mt-3 space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Tempel URL atau gambar (Ctrl+V)
        </label>
        <input
          type="text"
          value={manualInput}
          onChange={handleManualInputChange}
          onPaste={handleClipboardPaste}
          placeholder="Paste link gambar dari Google atau Ctrl+V gambar"
          className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
        <p className="text-[11px] leading-relaxed text-slate-500">
          Dukung URL langsung atau gambar yang dicopy dari clipboard.
        </p>
        {inputStatus && (
          <p className="text-[11px] text-emerald-300">{inputStatus}</p>
        )}
      </div>
      {hasAdjustments && previewSrc && (
        <div className="mt-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Penyesuaian posisi gambar
          </p>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Zoom</span>
              <span className="font-semibold">{clampedScale.toFixed(2)} </span>
            </label>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.02"
              value={clampedScale}
              onChange={handleScaleChange}
              className="w-full accent-brand-yellow"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Geser horizontal</span>
              <span className="font-semibold">{Math.round(clampedOffsetX * 100)}%</span>
            </label>
            <input
              type="range"
              min="-0.6"
              max="0.6"
              step="0.02"
              value={clampedOffsetX}
              onChange={(event) => handleOffsetChange(event, "offsetX")}
              className="w-full accent-brand-yellow"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Geser vertikal</span>
              <span className="font-semibold">{Math.round(clampedOffsetY * 100)}%</span>
            </label>
            <input
              type="range"
              min="-0.6"
              max="0.6"
              step="0.02"
              value={clampedOffsetY}
              onChange={(event) => handleOffsetChange(event, "offsetY")}
              className="w-full accent-brand-yellow"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-lg border border-slate-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-500 hover:text-white"
            onClick={() => onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 })}
          >
            Kembalikan bawaan
          </button>
        </div>
      )}
    </div>
  );
};

const LeagueLogoSelector = ({ label = "Logo Liga", helperText, value, onChange, options = [] }) => {
  const selectId = useId();
  const activeOption = options.find((option) => option.value === value) || null;
  const handleChange = useCallback(
    (event) => {
      onChange?.(event.target.value);
    },
    [onChange]
  );
  const handleReset = useCallback(() => {
    onChange?.("");
  }, [onChange]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="text-xs text-slate-400">
            {helperText || "Pilih logo liga/kompetisi untuk layout Big Match."}
          </p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-brand-yellow transition hover:text-amber-300"
          >
            Hapus
          </button>
        ) : null}
      </div>
      <div className="mt-3">
        <label htmlFor={selectId} className="sr-only">
          {label}
        </label>
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        >
          <option value="">Pilih salah satu logo liga</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/60">
        {activeOption ? (
          <img
            src={activeOption.value}
            alt={`Logo ${activeOption.label}`}
            className="max-h-24 max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-slate-500">Belum memilih logo</span>
        )}
      </div>
    </div>
  );
};

const formatPrizeCurrency = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value || "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const RaffleWinnersSection = ({
  slugValue = "",
  onSlugChange,
  onFetch,
  isLoading = false,
  winners = [],
  fetchError = "",
  raffleInfo,
}) => {
  const safeWinners = Array.isArray(winners) ? winners : [];
  const handleSlugInput = (event) => {
    onSlugChange?.(event.target.value);
  };
  const handleFetchClick = () => {
    onFetch?.();
  };
  const hasWinners = safeWinners.length > 0;
  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Data Pemenang Raffle</h3>
          <p className="text-xs text-slate-400">
            Tempel slug atau URL detail IDN Raffle. Sistem akan otomatis menarik daftar pemenang.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-3">
          <input
            type="text"
            value={slugValue}
            onChange={handleSlugInput}
            placeholder="Contoh: 29_november_2025_lottery_1756712869"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
          <button
            type="button"
            onClick={handleFetchClick}
            disabled={isLoading || !slugValue.trim()}
            className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-900 transition enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Mengambil..." : "Tarik data"}
          </button>
        </div>
      </div>
      {fetchError ? <p className="text-sm text-rose-300">{fetchError}</p> : null}
      {raffleInfo && (raffleInfo.name || raffleInfo.endDate || raffleInfo.totalPrize) ? (
        <div className="grid gap-3 rounded-lg border border-slate-700/80 bg-slate-900/60 p-3 text-sm text-slate-200 md:grid-cols-3">
          {raffleInfo.name ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Event</p>
              <p className="font-semibold">{raffleInfo.name}</p>
            </div>
          ) : null}
          {raffleInfo.endDate ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Tanggal</p>
              <p className="font-semibold">{raffleInfo.endDate}</p>
            </div>
          ) : null}
          {raffleInfo.totalPrize ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Total Hadiah</p>
              <p className="font-semibold">{formatPrizeCurrency(raffleInfo.totalPrize)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Hadiah (x)</th>
              <th className="px-4 py-3">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {hasWinners ? (
              safeWinners.map((winner, index) => (
                <tr key={`${winner.ticket_code || index}-${winner.prize_no || index}`}>
                  <td className="px-4 py-2 font-semibold text-slate-300">{winner.prize_no ?? index + 1}</td>
                  <td className="px-4 py-2 font-mono text-slate-100">{winner.ticket_code || "-"}</td>
                  <td className="px-4 py-2">{winner.username || "-"}</td>
                  <td className="px-4 py-2">x{winner.prize || "-"}</td>
                  <td className="px-4 py-2 font-semibold text-emerald-200">
                    {winner.formattedPrizeAmount || formatPrizeCurrency(winner.prize_amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={5}>
                  {isLoading ? "Sedang mengambil data pemenang..." : "Belum ada data pemenang untuk ditampilkan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const BrandAssetSelector = ({
  label,
  helperText,
  options = [],
  selectedHeaderSrc,
  footerPreviewSrc,
  onChange,
  selectPlaceholder = "Pilih brand",
  headerRatioHint = "Disarankan 450 px (lebar) x 160 px (tinggi) - PNG transparan",
  footerRatioHint = "Maksimum 680 px (lebar) x 110 px (tinggi) - PNG/JPG",
}) => {
  const selectId = useId();
  const handleSelection = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const selectedOptionLabel =
    options.find((option) => option.value === selectedHeaderSrc)?.label ?? "";

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <label htmlFor={selectId} className="text-sm font-semibold text-slate-200">
            {label}
          </label>
          <p className="text-xs text-slate-400">{helperText}</p>
        </div>
        {selectedHeaderSrc && (
          <button
            type="button"
            className="self-start rounded-full border border-rose-400/50 px-3 py-1 text-xs font-medium text-rose-200 transition hover:border-rose-300 hover:text-rose-100"
            onClick={() => onChange("")}
          >
            Reset
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <select
          id={selectId}
          value={selectedHeaderSrc}
          onChange={handleSelection}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/30 transition focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 md:w-60"
        >
          <option value="">{selectPlaceholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedOptionLabel && (
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300">
            {selectedOptionLabel}
          </span>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Logo Header
            </p>
            {headerRatioHint && (
              <p className="text-[11px] text-slate-500">{headerRatioHint}</p>
            )}
          </div>
          <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-600 bg-slate-900/40 md:h-32">
            {selectedHeaderSrc ? (
              <img
                src={selectedHeaderSrc}
                alt={
                  selectedOptionLabel
                    ? `Logo Header - ${selectedOptionLabel}`
                    : "Logo header preview"
                }
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm text-slate-400">
                Logo belum dipilih
              </span>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Banner Footer
            </p>
            {footerRatioHint && (
              <p className="text-[11px] text-slate-500">{footerRatioHint}</p>
            )}
          </div>
          <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-600 bg-slate-900/40 md:h-32">
            {footerPreviewSrc ? (
              <img
                src={footerPreviewSrc}
                alt={
                  selectedOptionLabel
                    ? `Banner Footer - ${selectedOptionLabel}`
                    : "Banner footer preview"
                }
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm text-slate-400">
                Banner footer belum dipilih
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerBackgroundPreview = ({ src }) => (
  <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-200">
          Background Banner
        </p>
        <p className="text-xs text-slate-400">
          Background mengikuti brand. Kosongkan brand untuk memakai default.
        </p>
      </div>
    </div>
    <div className="mt-4 flex h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-600 bg-slate-800/40 md:h-56">
      {src ? (
        <img
          src={src}
          alt="Background banner preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm text-slate-400">Background tidak tersedia</span>
      )}
    </div>
  </div>
);

const BannerMetadataSection = ({
  showTitleField,
  title,
  onTitleChange,
  brandLogoSrc,
  footerSrc,
  onBrandLogoChange,
  brandOptions,
  backgroundSrc,
  showLeagueLogoInput = false,
  leagueLogoSrc,
  onLeagueLogoChange,
  leagueLogoOptions = [],
}) => {
  const titleInputId = useId();
  return (
    <section className="grid gap-4">
      {showTitleField && (
        <div className="flex flex-col">
          <label
            htmlFor={titleInputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Judul Banner
          </label>
          <input
            id={titleInputId}
            type="text"
            value={title}
            onChange={(event) => onTitleChange?.(event.target.value.toUpperCase())}
            placeholder="Masukkan judul liga / kompetisinya"
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 uppercase tracking-wide focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
      )}
      <BrandAssetSelector
        label="Brand & Banner Footer"
        helperText="Pilih brand untuk menampilkan logo header dan banner footer secara otomatis."
        selectedHeaderSrc={brandLogoSrc}
        footerPreviewSrc={footerSrc}
        onChange={onBrandLogoChange}
        options={brandOptions}
      />
      {showLeagueLogoInput ? (
        <LeagueLogoSelector
          value={leagueLogoSrc}
          onChange={onLeagueLogoChange}
          options={leagueLogoOptions}
        />
      ) : null}
      <BannerBackgroundPreview src={backgroundSrc} />
    </section>
  );
};

const MatchCountAdjuster = ({
  count,
  minCount,
  maxCount,
  onChange,
}) => (
  <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 md:flex-row md:items-center md:justify-between">
    <div className="md:w-56">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Jumlah Pertandingan Ditampilkan
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        Banner memuat maksimal 5 pertandingan agar tata letak tetap rapi dan mudah dibaca.
      </p>
    </div>
    <div className="flex items-center justify-center gap-6 md:gap-10">
      <button
        type="button"
        onClick={() => onChange(count - 1)}
        disabled={count <= minCount}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-lg font-bold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
        aria-label="Kurangi jumlah pertandingan"
      >
        -
      </button>
      <span className="text-4xl font-bold text-slate-100">{count}</span>
      <button
        type="button"
        onClick={() => onChange(count + 1)}
        disabled={count >= maxCount}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-lg font-bold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
        aria-label="Tambah jumlah pertandingan"
      >
        +
      </button>
    </div>
  </div>
);

const MatchesSection = ({
  shouldShowMatches = true,
  effectiveMatchCount,
  minMatchCount,
  maxMatchCount,
  adjustMatchCount,
  matches,
  onMatchFieldChange,
  onAutoLogoRequest,
  onLogoAdjust,
  onPlayerImageAdjust,
  isEsportsMode,
  availableGameOptions,
  showScoreInputs = false,
  showBigMatchExtras = false,
  disableMatchCountAdjuster = false,
}) => {
  if (!shouldShowMatches) {
    return null;
  }
  return (
    <section className="grid gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Detail Pertandingan
      </h3>
      {disableMatchCountAdjuster ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
          Layout Big Match menggunakan 1 pertandingan utama. Isi data pada pertandingan pertama.
        </div>
      ) : (
        <MatchCountAdjuster
          count={effectiveMatchCount}
          minCount={minMatchCount}
          maxCount={maxMatchCount}
          onChange={adjustMatchCount}
        />
      )}
      {(disableMatchCountAdjuster ? matches.slice(0, 1) : matches).map((match, index) => (
        <MatchFieldset
          key={index}
          match={match}
          index={index}
          onFieldChange={onMatchFieldChange}
          onRequestAutoLogo={onAutoLogoRequest}
          onLogoAdjust={onLogoAdjust}
          onPlayerImageAdjust={onPlayerImageAdjust}
          isEsportsMode={isEsportsMode}
          gameOptions={availableGameOptions}
          showScoreInputs={showScoreInputs}
          showBigMatchExtras={showBigMatchExtras}
        />
      ))}
    </section>
  );
};

const TogelControlsSection = ({
  isTogelMode,
  pools,
  selectedPool,
  onPoolChange,
  showVariantSelector,
  poolVariants,
  selectedVariant,
  onVariantChange,
  selectedPoolOption,
  drawTimeConfig,
  drawTimeOptions,
  togelDrawTime,
  onTogelDrawTimeChange,
  shouldShowDrawTimeSelector,
}) => {
  const poolSelectId = useId();
  const variantSelectId = useId();

  if (!isTogelMode) {
    return null;
  }
  return (
    <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
      <div>
        <h3 className="text-base font-semibold text-slate-100">
          Pengaturan Pools Togel
        </h3>
        <p className="text-xs text-slate-400">
          Pilih pools dan mode keluarannya sebelum merender banner.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5 text-slate-300">
          <label
            htmlFor={poolSelectId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Pools
          </label>
          <select
            id={poolSelectId}
            value={selectedPool}
            onChange={onPoolChange}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/30 transition focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          >
            <option value="">Pilih pools</option>
            {pools.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {showVariantSelector && (
          <div className="flex flex-col gap-1.5 text-slate-300">
            <label
              htmlFor={variantSelectId}
              className="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Mode Keluaran
            </label>
            <select
              id={variantSelectId}
              value={selectedVariant}
              onChange={onVariantChange}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/30 transition focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
            >
              <option value="">Pilih mode</option>
              {poolVariants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {!showVariantSelector && selectedPool && poolVariants.length === 1 && (
        <p className="text-xs text-slate-400">
          Mode keluaran hanya: {poolVariants[0]}
        </p>
      )}
      {!selectedPool && (
        <p className="text-xs text-rose-300">
          Pilih pools terlebih dahulu untuk menentukan mode keluaran.
        </p>
      )}
      {shouldShowDrawTimeSelector && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm font-semibold text-slate-200">
            Jam Keluaran {selectedPoolOption?.label?.toUpperCase() ?? ""} ({selectedVariant})
          </p>
          <p className="text-xs text-slate-400">
            {drawTimeConfig.helperText || "Pilih salah satu jam keluaran di bawah ini."}
          </p>
          {drawTimeConfig.disabledReason ? (
            <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {drawTimeConfig.disabledReason}
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {drawTimeOptions.map((time) => {
                const isActive = togelDrawTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onTogelDrawTimeChange?.(time)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ${
                      isActive
                        ? "bg-brand-yellow text-slate-900 shadow"
                        : "border border-slate-700 text-slate-200 hover:border-brand-yellow/80"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const TogelDigitsSection = ({
  shouldShowDigits,
  digitGridClass,
  togelDigits,
  onTogelDigitChange,
}) => {
  if (!shouldShowDigits) {
    return null;
  }
  return (
    <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-100">
          Nomor Keluaran
        </h3>
        <p className="text-xs text-slate-400">
          Setiap kolom mewakili satu digit. Gunakan panah untuk menyesuaikan angka dengan cepat.
        </p>
      </div>
      <div className={`grid gap-3 justify-items-center ${digitGridClass}`}>
        {togelDigits.map((digit, index) => (
          <DigitStepperInput
            key={`digit-${index}`}
            label={`Digit ${index + 1}`}
            value={digit}
            onChange={(nextDigit) => onTogelDigitChange?.(index, nextDigit)}
          />
        ))}
      </div>
    </section>
  );
};

const MatchListForm = ({
  title,
  onTitleChange,
  matches,
  onMatchFieldChange,
  onAutoLogoRequest,
  onLogoAdjust,
  onPlayerImageAdjust,
  brandLogoSrc,
  onBrandLogoChange,
  brandOptions,
  backgroundSrc,
  footerSrc,
  activeSubMenu,
  scoreDateMode = "today",
  onScoreDateModeChange,
  scoreDateModeOptions = DEFAULT_SCORE_DATE_OPTIONS,
  matchCount,
  onMatchCountChange,
  matchCountOptions,
  activeMode,
  togelPool,
  onTogelPoolChange,
  togelPoolVariant,
  onTogelPoolVariantChange,
  togelDigits = [],
  onTogelDigitChange,
  togelDrawTime,
  onTogelDrawTimeChange,
  modeFeatures = {},
  showTitleFieldOverride,
  leagueLogoSrc = "",
  onLeagueLogoChange,
  isBigMatchLayout = false,
  leagueLogoOptions = AVAILABLE_LEAGUE_LOGO_OPTIONS,
  raffleSlug = "",
  onRaffleSlugChange,
  onFetchRaffleData,
  raffleWinners = [],
  raffleInfo = null,
  isFetchingRaffle = false,
  raffleFetchError = "",
}) => {
  const resolveFeatureFlag = (value, fallback) =>
    typeof value === "boolean" ? value : fallback;
  const isTogelMode = resolveFeatureFlag(modeFeatures.showTogelControls, activeMode === "togel");
  const isEsportsMode = resolveFeatureFlag(modeFeatures.showGameOptions, activeMode === "esports");
  const isFootballMode = activeMode === "football";
  const isRaffleMode = activeMode === "raffle";
  const isScoreLayoutActive = isFootballMode && activeSubMenu === "scores";
  const shouldShowMatches = resolveFeatureFlag(modeFeatures.showMatches, !isTogelMode);
  const effectiveMatchCount =
    typeof matchCount === "number" ? matchCount : matches.length;
  const availableMatchCountOptions =
    Array.isArray(matchCountOptions) && matchCountOptions.length > 0
      ? matchCountOptions
      : [1, 2, 3, 4, 5];
  const minMatchCount = Math.min(...availableMatchCountOptions);
  const maxMatchCount = Math.max(...availableMatchCountOptions);

  const adjustMatchCount = (nextCount) => {
    if (!onMatchCountChange) return;
    const normalized = Math.min(Math.max(nextCount, minMatchCount), maxMatchCount);
    if (normalized !== effectiveMatchCount) {
      onMatchCountChange(normalized);
    }
  };

  const selectedPoolOption = AVAILABLE_TOGEL_POOL_OPTIONS.find(
    (option) => option.value === togelPool
  );
  const poolVariantOptions = selectedPoolOption?.modes ?? [];
  const shouldShowVariantSelector =
    isTogelMode && poolVariantOptions.length > 1;
  const drawTimeConfig = getTogelDrawTimeConfig(togelPool, togelPoolVariant);
  const isTotoSingaporeHoliday =
    togelPool === "toto_singapore" && Boolean(drawTimeConfig.disabledReason);
  const shouldShowDigits =
    isTogelMode &&
    Boolean(togelPoolVariant) &&
    Array.isArray(togelDigits) &&
    togelDigits.length > 0 &&
    !isTotoSingaporeHoliday;
  const digitCount = shouldShowDigits ? togelDigits.length : 0;
  const digitGridClass =
    digitCount === 3
      ? "sm:grid-cols-3 md:grid-cols-3"
      : digitCount === 4
        ? "sm:grid-cols-4 md:grid-cols-4"
        : "sm:grid-cols-4 md:grid-cols-5";

  const handleTogelPoolChange = useCallback(
    (event) => {
      const nextPool = event.target.value;
      onTogelPoolChange?.(nextPool);
      const option = AVAILABLE_TOGEL_POOL_OPTIONS.find(
        (item) => item.value === nextPool
      );
      const modes = option?.modes ?? [];
      if (modes.length === 1) {
        onTogelPoolVariantChange?.(modes[0]);
      } else {
        onTogelPoolVariantChange?.("");
      }
    },
    [onTogelPoolChange, onTogelPoolVariantChange]
  );

  const handleTogelVariantChange = useCallback(
    (event) => {
      onTogelPoolVariantChange?.(event.target.value);
    },
    [onTogelPoolVariantChange]
  );

  const drawTimeOptions = drawTimeConfig.options ?? [];
  const shouldShowDrawTimeSelector =
    isTogelMode &&
    (drawTimeOptions.length > 0 || Boolean(drawTimeConfig.disabledReason));
  const availableGameOptions = isEsportsMode ? AVAILABLE_ESPORT_GAME_OPTIONS : [];
  const isBigMatchLayoutActive = Boolean(isBigMatchLayout);
  const resolvedShowTitle = resolveFeatureFlag(
    modeFeatures.showTitle,
    !isTogelMode && !isEsportsMode
  );
  const shouldShowTitleField =
    typeof showTitleFieldOverride === "boolean"
      ? showTitleFieldOverride
      : !isTogelMode && resolvedShowTitle;
  const scoreDateOptions = Array.isArray(scoreDateModeOptions) && scoreDateModeOptions.length
    ? scoreDateModeOptions
    : DEFAULT_SCORE_DATE_OPTIONS;

  return (
    <form className="grid gap-6">
      <BannerMetadataSection
        showTitleField={shouldShowTitleField}
        title={title}
        onTitleChange={onTitleChange}
        brandLogoSrc={brandLogoSrc}
        footerSrc={footerSrc}
        onBrandLogoChange={onBrandLogoChange}
        brandOptions={brandOptions}
        backgroundSrc={backgroundSrc}
        showLeagueLogoInput={isBigMatchLayoutActive}
        leagueLogoSrc={leagueLogoSrc}
        onLeagueLogoChange={onLeagueLogoChange}
        leagueLogoOptions={leagueLogoOptions}
      />
      {isRaffleMode && (
        <RaffleWinnersSection
          slugValue={raffleSlug}
          onSlugChange={onRaffleSlugChange}
          onFetch={onFetchRaffleData}
          isLoading={isFetchingRaffle}
          winners={raffleWinners}
          fetchError={raffleFetchError}
          raffleInfo={raffleInfo}
        />
      )}
      {isScoreLayoutActive && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-200">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-slate-100">Label Pertandingan</h3>
            <p className="text-xs text-slate-400">
              Tampilkan tanggal yang cocok untuk kapsul &quot;Pertandingan&quot; di atas daftar skor.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {scoreDateOptions.map((option) => {
              const isActive = option.value === scoreDateMode;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onScoreDateModeChange?.(option.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/30 ${
                    isActive
                      ? "bg-brand-yellow text-slate-900 shadow"
                      : "border border-slate-700 bg-slate-900/40 text-slate-300 hover:border-brand-yellow/60 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      )}
      <MatchesSection
        shouldShowMatches={shouldShowMatches}
        effectiveMatchCount={effectiveMatchCount}
        minMatchCount={minMatchCount}
        maxMatchCount={maxMatchCount}
        adjustMatchCount={adjustMatchCount}
        matches={matches}
        onMatchFieldChange={onMatchFieldChange}
        onAutoLogoRequest={onAutoLogoRequest}
        onLogoAdjust={onLogoAdjust}
        onPlayerImageAdjust={onPlayerImageAdjust}
        isEsportsMode={isEsportsMode}
        availableGameOptions={availableGameOptions}
        showScoreInputs={isScoreLayoutActive}
        showBigMatchExtras={isBigMatchLayoutActive}
        disableMatchCountAdjuster={isBigMatchLayoutActive}
      />
      <TogelControlsSection
        isTogelMode={isTogelMode}
        pools={AVAILABLE_TOGEL_POOL_OPTIONS}
        selectedPool={togelPool}
        onPoolChange={handleTogelPoolChange}
        showVariantSelector={shouldShowVariantSelector}
        poolVariants={poolVariantOptions}
        selectedVariant={togelPoolVariant}
        onVariantChange={handleTogelVariantChange}
        selectedPoolOption={selectedPoolOption}
        drawTimeConfig={drawTimeConfig}
        drawTimeOptions={drawTimeOptions}
        togelDrawTime={togelDrawTime}
        onTogelDrawTimeChange={onTogelDrawTimeChange}
        shouldShowDrawTimeSelector={shouldShowDrawTimeSelector}
      />
      <TogelDigitsSection
        shouldShowDigits={shouldShowDigits}
        digitGridClass={digitGridClass}
        togelDigits={togelDigits}
        onTogelDigitChange={onTogelDigitChange}
      />
    </form>
  );
};

AppEnvironment.registerComponent("MatchListForm", MatchListForm);

export default MatchListForm;
