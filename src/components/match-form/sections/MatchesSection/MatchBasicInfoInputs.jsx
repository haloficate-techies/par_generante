import React, { useCallback, useRef } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../../ui/Tooltip";

const MatchBasicInfoInputs = ({
  index,
  match,
  onMatchFieldChange,
  teamPlaceholders = {},
}) => {
  const homePlaceholder =
    teamPlaceholders.home || "Contoh: Manchester City";
  const awayPlaceholder =
    teamPlaceholders.away || "Contoh: Liverpool FC";
  const homeInputId = `match-${index}-home`;
  const awayInputId = `match-${index}-away`;
  const dateInputId = `match-${index}-date`;
  const timeInputId = `match-${index}-time`;
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const handleOpenDatePicker = useCallback(() => {
    const input = dateInputRef.current;
    input?.focus();
    if (input?.showPicker) input.showPicker();
  }, []);

  const handleOpenTimePicker = useCallback(() => {
    const input = timeInputRef.current;
    input?.focus();
    if (input?.showPicker) input.showPicker();
  }, []);

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
          placeholder={homePlaceholder}
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
          placeholder={awayPlaceholder}
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
        <div className="relative mt-1">
          <input
            ref={dateInputRef}
            id={dateInputId}
            type="date"
            value={match.date}
            onChange={(event) => onMatchFieldChange(index, "date", event.target.value)}
            className="hide-native-picker w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 pr-10 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Tooltip content="Tampilkan pemilih tanggal" align="right">
              <button
                type="button"
                onClick={handleOpenDatePicker}
                className="inline-flex items-center justify-center text-slate-400 transition hover:text-slate-100 focus:outline-none"
                aria-label="Tampilkan pemilih tanggal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label
          htmlFor={timeInputId}
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Kick-off (WIB)
        </label>
        <div className="relative mt-1">
          <input
            ref={timeInputRef}
            id={timeInputId}
            type="time"
            value={match.time}
            onChange={(event) => onMatchFieldChange(index, "time", event.target.value)}
            className="hide-native-picker w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 pr-10 text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Tooltip content="Tampilkan pemilih waktu" align="right">
              <button
                type="button"
                onClick={handleOpenTimePicker}
                className="inline-flex items-center justify-center text-slate-400 transition hover:text-slate-100 focus:outline-none"
                aria-label="Tampilkan pemilih waktu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
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
  teamPlaceholders: PropTypes.shape({
    home: PropTypes.string,
    away: PropTypes.string,
  }),
};

export default MatchBasicInfoInputs;

