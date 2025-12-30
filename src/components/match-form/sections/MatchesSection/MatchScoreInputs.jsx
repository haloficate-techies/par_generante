import React, { useCallback } from "react";
import PropTypes from "prop-types";

const MatchScoreInputs = ({ index, match, onMatchFieldChange }) => {
  const handleScoreInput = useCallback(
    (field, value) => {
      const safeValue = typeof value === "string" ? value : String(value ?? "");
      const normalized = safeValue.replace(/[^0-9]/g, "").slice(0, 2);
      onMatchFieldChange(index, field, normalized);
    },
    [index, onMatchFieldChange]
  );

  const homeScoreId = `match-${index}-score-home`;
  const awayScoreId = `match-${index}-score-away`;

  return (
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
  );
};

MatchScoreInputs.propTypes = {
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({
    scoreHome: PropTypes.string,
    scoreAway: PropTypes.string,
  }).isRequired,
  onMatchFieldChange: PropTypes.func.isRequired,
};

export default MatchScoreInputs;

