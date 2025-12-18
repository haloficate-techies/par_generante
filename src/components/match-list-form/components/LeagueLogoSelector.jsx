import React, { useCallback, useId } from "react";

const LeagueLogoSelector = ({
  label = "Logo Liga",
  helperText,
  value,
  onChange,
  options = [],
}) => {
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

export default LeagueLogoSelector;
