import React from "react";
import PropTypes from "prop-types";
import MatchCountAdjuster from "../../ui/MatchCountAdjuster";
import MatchFieldset from "./MatchFieldset";

const MatchesSection = ({
  shouldShowMatches = true,
  effectiveMatchCount,
  minMatchCount,
  maxMatchCount,
  adjustMatchCount,
  matches,
  isEsportsMode = false,
  availableGameOptions = [],
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
          isEsportsMode={isEsportsMode}
          gameOptions={availableGameOptions}
          showScoreInputs={showScoreInputs}
          showBigMatchExtras={showBigMatchExtras}
        />
      ))}
    </section>
  );
};

const matchShape = PropTypes.shape({
  teamHome: PropTypes.string,
  teamAway: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
});

MatchesSection.propTypes = {
  shouldShowMatches: PropTypes.bool,
  effectiveMatchCount: PropTypes.number.isRequired,
  minMatchCount: PropTypes.number.isRequired,
  maxMatchCount: PropTypes.number.isRequired,
  adjustMatchCount: PropTypes.func.isRequired,
  matches: PropTypes.arrayOf(matchShape).isRequired,
  isEsportsMode: PropTypes.bool,
  availableGameOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  showScoreInputs: PropTypes.bool,
  showBigMatchExtras: PropTypes.bool,
  disableMatchCountAdjuster: PropTypes.bool,
};

export default MatchesSection;

