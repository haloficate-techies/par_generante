import React from "react";
import PropTypes from "prop-types";

const ImageActionButtons = ({
  variant = "header",
  onReset,
  showReset = true,
  onToggleFlip,
  isFlipped,
  canRemoveBackground,
  onRemoveBackground,
  isRemovingBackground,
  isBackgroundRemoved,
  removeBackgroundError,
}) => {
  const baseBtn =
    "inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-semibold whitespace-nowrap rounded-full focus:outline-none transition";

  if (variant === "header") {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {showReset && (
          <button
            type="button"
            className="rounded-full border border-slate-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow"
            onClick={onReset}
          >
            Reset
          </button>
        )}
      </div>
    );
  }

  if (!(onToggleFlip || canRemoveBackground)) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
        Aksi Gambar
      </p>
      <div className="flex flex-col gap-2">
        {onToggleFlip && (
          <button
            type="button"
            className={`${baseBtn} border border-slate-600 text-slate-100 hover:border-brand-yellow hover:text-white focus:ring-2 focus:ring-brand-yellow/40`}
            onClick={onToggleFlip}
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 7-5 5 5 5" />
              <path d="m15 7 5 5-5 5" />
            </svg>
            <span>{isFlipped ? "Normal" : "Balik"}</span>
          </button>
        )}

        {canRemoveBackground && (
          <button
            type="button"
            className={`${baseBtn} text-slate-950 focus:ring-2 focus:ring-emerald-300/60 ${
              isBackgroundRemoved
                ? "cursor-not-allowed bg-emerald-900/70 text-emerald-200 border border-emerald-800/80"
              : !onRemoveBackground || isRemovingBackground
                ? "cursor-not-allowed bg-emerald-800/60 text-emerald-100"
                : "bg-emerald-400 hover:bg-emerald-300"
            }`}
            onClick={isBackgroundRemoved ? undefined : onRemoveBackground}
            disabled={!onRemoveBackground || isRemovingBackground || isBackgroundRemoved}
          >
            {isRemovingBackground ? (
              <>
                <svg
                  className="h-4 w-4 shrink-0 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" className="opacity-30" />
                  <path d="M21 12a9 9 0 0 1-9 9" />
                </svg>
                <span>Memproses...</span>
              </>
            ) : isBackgroundRemoved ? (
              <>
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>✓ BG Dihapus</span>
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  >
                    <path d="m3 21 12-12" />
                    <path d="M15 6V4" />
                    <path d="M8 9H6" />
                    <path d="M18 9h2" />
                    <path d="M15 18v2" />
                    <path d="m18 6 2-2" />
                    <path d="m11 6-2-2" />
                    <path d="m18 18 2 2" />
                </svg>
                <span>{isBackgroundRemoved ? "BG Dihapus" : "Hapus BG"}</span>
              </>
            )}
          </button>
        )}
      </div>

      {removeBackgroundError && (
        <span className="block text-xs text-rose-300">{removeBackgroundError}</span>
      )}
    </div>
  );
};

ImageActionButtons.propTypes = {
  variant: PropTypes.oneOf(["header", "footer"]),
  onReset: PropTypes.func,
  showReset: PropTypes.bool,
  onToggleFlip: PropTypes.func,
  isFlipped: PropTypes.bool,
  canRemoveBackground: PropTypes.bool,
  onRemoveBackground: PropTypes.func,
  isRemovingBackground: PropTypes.bool,
  isBackgroundRemoved: PropTypes.bool,
  removeBackgroundError: PropTypes.string,
};

export default ImageActionButtons;

