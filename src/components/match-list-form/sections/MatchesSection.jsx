import React from "react";
import MatchCountAdjuster from "../components/MatchCountAdjuster";
import MatchFieldset from "../matches/MatchFieldset";

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
  onPlayerImageFlipToggle,
  isEsportsMode,
  availableGameOptions,
  showScoreInputs = false,
  showBigMatchExtras = false,
  disableMatchCountAdjuster = false,
  onRemovePlayerBackground,
  playerBackgroundRemovalState = {},
  canUseBackgroundRemoval = false,
  onRemoveLogoBackground,
  logoBackgroundRemovalState = {},
  resolveAutoLogoSrc,
  readFileAsDataURL,
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
          onPlayerImageFlipToggle={onPlayerImageFlipToggle}
          isEsportsMode={isEsportsMode}
          gameOptions={availableGameOptions}
          showScoreInputs={showScoreInputs}
          showBigMatchExtras={showBigMatchExtras}
          onRemoveBackground={onRemovePlayerBackground}
          playerBackgroundRemovalState={playerBackgroundRemovalState}
          canUseBackgroundRemoval={canUseBackgroundRemoval}
          onRemoveLogoBackground={onRemoveLogoBackground}
          logoBackgroundRemovalState={logoBackgroundRemovalState}
          resolveAutoLogoSrc={resolveAutoLogoSrc}
          readFileAsDataURL={readFileAsDataURL}
        />
      ))}
    </section>
  );
};

export default MatchesSection;

