import React from "react";
import PropTypes from "prop-types";

const ImageActionButtons = ({
  variant = "header",
  canAutoFetch,
  onAutoFetch,
  onReset,
  onToggleFlip,
  isFlipped,
  canRemoveBackground,
  onRemoveBackground,
  isRemovingBackground,
  removeBackgroundError,
}) => {
  if (variant === "header") {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {canAutoFetch && (
          <button
            type="button"
            className="rounded-full border border-emerald-400/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
            onClick={onAutoFetch}
          >
            Muat otomatis
          </button>
        )}
        <button
          type="button"
          className="rounded-full border border-slate-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    );
  }

  if (!(onToggleFlip || canRemoveBackground)) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {onToggleFlip && (
        <button
          type="button"
          className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow"
          onClick={onToggleFlip}
        >
          {isFlipped ? "Normalkan Arah" : "Balik Horizontal"}
        </button>
      )}
      {canRemoveBackground && (
        <button
          type="button"
          className="rounded-full border border-emerald-500/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100 disabled:cursor-not-allowed disabled:border-emerald-900/40 disabled:text-emerald-900/60"
          onClick={onRemoveBackground}
          disabled={!onRemoveBackground || isRemovingBackground}
        >
          {isRemovingBackground ? "Memproses..." : "Hapus Background"}
        </button>
      )}
      {removeBackgroundError && (
        <span className="text-xs text-rose-300">{removeBackgroundError}</span>
      )}
    </div>
  );
};

ImageActionButtons.propTypes = {
  variant: PropTypes.oneOf(["header", "footer"]),
  canAutoFetch: PropTypes.bool,
  onAutoFetch: PropTypes.func,
  onReset: PropTypes.func,
  onToggleFlip: PropTypes.func,
  isFlipped: PropTypes.bool,
  canRemoveBackground: PropTypes.bool,
  onRemoveBackground: PropTypes.func,
  isRemovingBackground: PropTypes.bool,
  removeBackgroundError: PropTypes.string,
};

export default ImageActionButtons;

