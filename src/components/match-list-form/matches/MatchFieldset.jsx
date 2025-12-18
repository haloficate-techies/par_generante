import React, { useCallback } from "react";
import ImageUploadPreview from "../components/ImageUploadPreview";
import { buildLogoSlotKey, buildPlayerSlotKey } from "../utils";

const MatchFieldset = ({
  match,
  index,
  onFieldChange,
  onRequestAutoLogo,
  onLogoAdjust,
  onPlayerImageAdjust,
  onPlayerImageFlipToggle,
  isEsportsMode = false,
  gameOptions = [],
  showScoreInputs = false,
  showBigMatchExtras = false,
  onRemoveBackground,
  playerBackgroundRemovalState = {},
  canUseBackgroundRemoval = false,
  onRemoveLogoBackground,
  logoBackgroundRemovalState = {},
  resolveAutoLogoSrc = () => "",
  readFileAsDataURL = async () => null,
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

  const homeRemovalKey = buildPlayerSlotKey(index, "home");
  const awayRemovalKey = buildPlayerSlotKey(index, "away");
  const homeRemovalState = playerBackgroundRemovalState[homeRemovalKey] || {};
  const awayRemovalState = playerBackgroundRemovalState[awayRemovalKey] || {};
  const homeLogoRemovalKey = buildLogoSlotKey(index, "home");
  const awayLogoRemovalKey = buildLogoSlotKey(index, "away");
  const homeLogoRemovalState = logoBackgroundRemovalState[homeLogoRemovalKey] || {};
  const awayLogoRemovalState = logoBackgroundRemovalState[awayLogoRemovalKey] || {};

  return (
    <fieldset className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
      <legend className="px-2 text-sm font-semibold text-slate-300">
        Pertandingan {index + 1}
      </legend>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col">
          <label
            htmlFor={homeInputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Tim Tuan Rumah
          </label>
          <input
            id={homeInputId}
            type="text"
            value={match.teamHome}
            onChange={(event) => onFieldChange(index, "teamHome", event.target.value)}
            placeholder="Contoh: Manchester City"
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={awayInputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Tim Tamu
          </label>
          <input
            id={awayInputId}
            type="text"
            value={match.teamAway}
            onChange={(event) => onFieldChange(index, "teamAway", event.target.value)}
            placeholder="Contoh: Liverpool FC"
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={dateInputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Tanggal
          </label>
          <input
            id={dateInputId}
            type="date"
            value={match.date}
            onChange={(event) => onFieldChange(index, "date", event.target.value)}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={timeInputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Kick-off (WIB)
          </label>
          <input
            id={timeInputId}
            type="time"
            value={match.time}
            onChange={(event) => onFieldChange(index, "time", event.target.value)}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
      </div>
      {showScoreInputs && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="flex flex-col">
            <label
              htmlFor={homeScoreId}
              className="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
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
            <label
              htmlFor={awayScoreId}
              className="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
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
          canRemoveBackground={canUseBackgroundRemoval}
          onRemoveBackground={() =>
            onRemoveLogoBackground?.(index, "home", match.teamHomeLogo)
          }
          isRemovingBackground={Boolean(homeLogoRemovalState.loading)}
          removeBackgroundError={homeLogoRemovalState.error || ""}
          readFileAsDataURL={readFileAsDataURL}
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
          canRemoveBackground={canUseBackgroundRemoval}
          onRemoveBackground={() =>
            onRemoveLogoBackground?.(index, "away", match.teamAwayLogo)
          }
          isRemovingBackground={Boolean(awayLogoRemovalState.loading)}
          removeBackgroundError={awayLogoRemovalState.error || ""}
          readFileAsDataURL={readFileAsDataURL}
        />
      </div>
      {isEsportsMode && (
        <div className="mt-4 space-y-2">
          <label
            htmlFor={gameSelectId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
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
            onChange={(value) =>
              onFieldChange(index, "teamHomePlayerImage", value)
            }
            inputId={`home-player-${index}`}
            ratioHint="Format potret disarankan"
            slotHeight="h-52"
            scale={match.teamHomePlayerScale}
            offsetX={match.teamHomePlayerOffsetX}
            offsetY={match.teamHomePlayerOffsetY}
            onAdjust={(adjustments) => onPlayerImageAdjust?.(index, "home", adjustments)}
            onToggleFlip={() => onPlayerImageFlipToggle?.(index, "home")}
            isFlipped={Boolean(match.teamHomePlayerFlip)}
            canRemoveBackground={canUseBackgroundRemoval}
            onRemoveBackground={() =>
              onRemoveBackground?.(index, "home", match.teamHomePlayerImage)
            }
            isRemovingBackground={Boolean(homeRemovalState.loading)}
            removeBackgroundError={homeRemovalState.error || ""}
            readFileAsDataURL={readFileAsDataURL}
          />
          <ImageUploadPreview
            label="Foto Pemain Tim Tandang"
            helperText="Gunakan gambar PNG/JPG dengan latar bersih."
            previewSrc={match.teamAwayPlayerImage}
            onChange={(value) =>
              onFieldChange(index, "teamAwayPlayerImage", value)
            }
            inputId={`away-player-${index}`}
            ratioHint="Format potret disarankan"
            slotHeight="h-52"
            scale={match.teamAwayPlayerScale}
            offsetX={match.teamAwayPlayerOffsetX}
            offsetY={match.teamAwayPlayerOffsetY}
            onAdjust={(adjustments) => onPlayerImageAdjust?.(index, "away", adjustments)}
            onToggleFlip={() => onPlayerImageFlipToggle?.(index, "away")}
            isFlipped={Boolean(match.teamAwayPlayerFlip)}
            canRemoveBackground={canUseBackgroundRemoval}
            onRemoveBackground={() =>
              onRemoveBackground?.(index, "away", match.teamAwayPlayerImage)
            }
            isRemovingBackground={Boolean(awayRemovalState.loading)}
            removeBackgroundError={awayRemovalState.error || ""}
            readFileAsDataURL={readFileAsDataURL}
          />
        </div>
      )}
    </fieldset>
  );
};

export default MatchFieldset;
