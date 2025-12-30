import React, { useCallback } from "react";
import PropTypes from "prop-types";

const gameOptionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const MatchEsportsSection = ({
  index,
  match,
  gameOptions,
  onMatchFieldChange,
}) => {
  const handleGameChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      const option = gameOptions.find((item) => item.value === nextValue);
      onMatchFieldChange(index, "gameLogo", nextValue || null);
      onMatchFieldChange(index, "gameName", option?.label ?? "");
    },
    [gameOptions, index, onMatchFieldChange]
  );

  const gameSelectId = `match-${index}-game`;
  const gameSlotPreviewStyle = {
    backgroundImage: "linear-gradient(135deg, #0d1829, #050912)",
    border: "1px solid rgba(148, 163, 184, 0.45)",
    boxShadow:
      "0 12px 20px rgba(2, 6, 23, 0.65), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -6px 16px rgba(0,0,0,0.45)",
  };

  return (
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
  );
};

MatchEsportsSection.propTypes = {
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({
    gameLogo: PropTypes.string,
    gameName: PropTypes.string,
  }).isRequired,
  gameOptions: PropTypes.arrayOf(gameOptionShape).isRequired,
  onMatchFieldChange: PropTypes.func.isRequired,
};

export default MatchEsportsSection;

