import React from "react";
import PropTypes from "prop-types";

const MatchBasicInfoInputs = ({ index, match, onMatchFieldChange }) => {
  const homeInputId = `match-${index}-home`;
  const awayInputId = `match-${index}-away`;
  const dateInputId = `match-${index}-date`;
  const timeInputId = `match-${index}-time`;

  return (
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
          onChange={(event) => onMatchFieldChange(index, "teamHome", event.target.value)}
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
          onChange={(event) => onMatchFieldChange(index, "teamAway", event.target.value)}
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
          onChange={(event) => onMatchFieldChange(index, "date", event.target.value)}
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
          onChange={(event) => onMatchFieldChange(index, "time", event.target.value)}
          className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
      </div>
    </div>
  );
};

MatchBasicInfoInputs.propTypes = {
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({
    teamHome: PropTypes.string,
    teamAway: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
  onMatchFieldChange: PropTypes.func.isRequired,
};

export default MatchBasicInfoInputs;

