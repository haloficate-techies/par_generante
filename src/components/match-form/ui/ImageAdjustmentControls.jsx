import React from "react";
import PropTypes from "prop-types";
import Tooltip from "../../ui/Tooltip";

const ImageAdjustmentControls = ({
  scale,
  offsetX,
  offsetY,
  onScaleChange,
  onScaleReset,
  onOffsetChange,
  onOffsetReset,
}) => (
  <div className="mt-4 grid gap-4">
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Skala Logo
        </label>
        {onScaleReset && (
          <Tooltip content="Reset skala ke 100%" align="right">
            <button
              type="button"
              onClick={onScaleReset}
              className="inline-flex items-center justify-center text-slate-400 transition hover:text-slate-100 focus:outline-none"
              aria-label="Reset skala ke 100%"
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
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-300">
          <Tooltip content="Atur ukuran logo">
            <span className="inline-flex items-center" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </span>
          </Tooltip>
          {Math.round((scale ?? 1) * 100)}%
        </span>
        <input
          type="range"
          min="0.7"
          max="1.5"
          step="0.01"
          value={scale ?? 1}
          onChange={onScaleChange}
          className="w-full accent-brand-yellow"
          aria-label="Skala logo"
        />
      </div>
    </div>
    <div className="h-px w-full bg-slate-700/60" />
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Offset Logo
        </label>
        {onOffsetReset && (
          <Tooltip content="Reset posisi ke tengah" align="right">
            <button
              type="button"
              onClick={onOffsetReset}
              className="inline-flex items-center justify-center text-slate-400 transition hover:text-slate-100 focus:outline-none"
              aria-label="Reset posisi ke tengah"
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
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Tooltip content="Geser horizontal">
            <span className="inline-flex h-5 w-5 items-center justify-center text-slate-200" aria-hidden="true">
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
                <path d="m9 7-5 5 5 5" />
                <path d="m15 7 5 5-5 5" />
              </svg>
            </span>
          </Tooltip>
          <input
            type="range"
            min="-0.75"
            max="0.75"
            step="0.01"
            value={offsetX ?? 0}
            onChange={(event) => onOffsetChange(event, "offsetX")}
            className="w-full accent-brand-yellow"
            aria-label="Offset horizontal"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Geser vertikal">
            <span className="inline-flex h-5 w-5 items-center justify-center text-slate-200" aria-hidden="true">
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
                <path d="m7 9 5-5 5 5" />
                <path d="m7 15 5 5 5-5" />
              </svg>
            </span>
          </Tooltip>
          <input
            type="range"
            min="-0.75"
            max="0.75"
            step="0.01"
            value={offsetY ?? 0}
            onChange={(event) => onOffsetChange(event, "offsetY")}
            className="w-full accent-brand-yellow"
            aria-label="Offset vertikal"
          />
        </div>
      </div>
    </div>
  </div>
);

ImageAdjustmentControls.propTypes = {
  scale: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  onScaleChange: PropTypes.func.isRequired,
  onScaleReset: PropTypes.func,
  onOffsetChange: PropTypes.func.isRequired,
  onOffsetReset: PropTypes.func,
};

export default ImageAdjustmentControls;

