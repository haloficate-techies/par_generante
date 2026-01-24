import React, { useCallback, useId } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../ui/Tooltip";

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
          <Tooltip content="Kembalikan ke brand default" align="right">
            <button
              type="button"
              className="self-start rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
              onClick={() => onChange("")}
              aria-label="Reset Brand"
            >
              <span className="inline-flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                  <polyline points="21 3 21 9 15 9" />
                </svg>
                Reset Brand
              </span>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex w-full flex-col md:w-60">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Brand Aktif
            </span>
            <Tooltip
              content="Logo header & banner akan mengikuti brand yang dipilih"
              align="left"
            >
              <button
                type="button"
                className="grid h-5 w-5 place-items-center rounded-full border border-slate-600 text-[11px] font-bold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
                aria-label="Info Brand Aktif"
              >
                ?
              </button>
            </Tooltip>
          </div>
          <select
            id={selectId}
            value={selectedHeaderSrc}
            onChange={handleSelection}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/30 transition focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          >
            <option value="">{selectPlaceholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
          <p className="text-[11px] text-slate-500">Tampil di bagian atas banner</p>
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
          <p className="text-[11px] text-slate-500">Tampil di bagian bawah banner</p>
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
