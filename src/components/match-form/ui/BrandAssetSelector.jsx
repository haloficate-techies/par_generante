import React, { useCallback, useId } from "react";
import PropTypes from "prop-types";

const BrandAssetSelector = ({
  label = "Brand & Banner Footer",
  helperText = "",
  options = [],
  selectedHeaderSrc = "",
  footerPreviewSrc = "",
  onChange,
  selectPlaceholder = "Pilih brand",
  headerRatioHint = "",
  footerRatioHint = "",
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

const optionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  footerSrc: PropTypes.string,
});

BrandAssetSelector.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(optionShape),
  selectedHeaderSrc: PropTypes.string,
  footerPreviewSrc: PropTypes.string,
  onChange: PropTypes.func,
  selectPlaceholder: PropTypes.string,
  headerRatioHint: PropTypes.string,
  footerRatioHint: PropTypes.string,
};

export default BrandAssetSelector;
