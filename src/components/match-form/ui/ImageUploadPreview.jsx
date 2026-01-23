import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useImageUpload from "./hooks/useImageUpload";
import ImagePreviewDisplay from "./ImagePreviewDisplay";
import ImageAdjustmentControls from "./ImageAdjustmentControls";
import ImageActionButtons from "./ImageActionButtons";
import Tooltip from "../../ui/Tooltip";

const ImageUploadPreview = ({
  label = "",
  helperText = "",
  previewSrc = "",
  onChange,
  inputId = "",
  ratioHint = "",
  helperAsTooltip = false,
  autoIndicator = false,
  unifiedSlot = false,
  hideManualInputWhenPreview = false,
  slotHeight = "h-32",
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  onAdjust,
  onToggleFlip,
  isFlipped = false,
  canRemoveBackground = false,
  onRemoveBackground,
  isRemovingBackground = false,
  removeBackgroundError = "",
  readFileAsDataURL = async () => null,
}) => {
  const [showAutoGlow, setShowAutoGlow] = useState(false);
  const {
    isLoading,
    manualInput,
    inputStatus,
    handleFileSelection,
    handleClipboardPaste,
    handleManualInputChange,
    handleReset,
  } = useImageUpload({
    previewSrc,
    onChange,
    onAdjust,
    readFileAsDataURL,
  });

  useEffect(() => {
    if (!autoIndicator) return;
    setShowAutoGlow(true);
    const timeoutId = window.setTimeout(() => {
      setShowAutoGlow(false);
    }, 900);
    return () => window.clearTimeout(timeoutId);
  }, [autoIndicator]);

  const fileInputRef = useRef(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSlotKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFilePicker();
      }
    },
    [openFilePicker]
  );

  const handleScaleChange = useCallback(
    (event) => {
      const value = Number(event.target.value);
      onAdjust?.({ scale: value });
    },
    [onAdjust]
  );

  const handleScaleReset = useCallback(() => {
    onAdjust?.({ scale: 1 });
  }, [onAdjust]);

  const handleOffsetChange = useCallback(
    (event, axis) => {
      const value = Number(event.target.value);
      if (!onAdjust) return;
      onAdjust({ [axis]: value });
    },
    [onAdjust]
  );

  const handleOffsetReset = useCallback(() => {
    onAdjust?.({ offsetX: 0, offsetY: 0 });
  }, [onAdjust]);

  const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
  const normalizedScale = clampValue(scale ?? 1, 0.7, 1.5);
  const normalizedOffsetX = clampValue(offsetX ?? 0, -0.75, 0.75);
  const normalizedOffsetY = clampValue(offsetY ?? 0, -0.75, 0.75);
  const hasAdjustments = Boolean(onAdjust && previewSrc);
  const showHelperTooltip = Boolean(helperAsTooltip && (helperText || ratioHint));
  const shouldShowManualInput = !(hideManualInputWhenPreview && previewSrc);

  const previewOffsetX = isFlipped ? -normalizedOffsetX : normalizedOffsetX;
  const previewTransformStyle = {
    transform: `translate(${previewOffsetX * 50}%, ${normalizedOffsetY * 50}%) scale(${normalizedScale})`,
  };
  const mirrorWrapperStyle = isFlipped ? { transform: "scaleX(-1)" } : undefined;

  const tooltipContent = (
    <>
      {helperText && (
        <p className="text-xs leading-relaxed text-slate-200">{helperText}</p>
      )}
      {ratioHint && (
        <p className="mt-1 text-xs text-slate-300">Rasio ideal: {ratioHint}</p>
      )}
    </>
  );

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-200">{label}</p>
            {showHelperTooltip && (
              <Tooltip content={tooltipContent} align="left">
                <button
                  type="button"
                  className="grid h-5 w-5 place-items-center rounded-full border border-slate-600 text-[11px] font-bold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
                  aria-label={`Info ${label}`}
                >
                  ?
                </button>
              </Tooltip>
            )}
            {autoIndicator && (
              <Tooltip
                content="Logo terinput otomatis. Anda bisa mengganti manual kapan saja."
                align="left"
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border border-amber-400/60 text-amber-200 ${
                    showAutoGlow ? "auto-glow" : ""
                  }`}
                  role="img"
                  aria-label="Logo otomatis"
                >
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
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
                  </svg>
                </span>
              </Tooltip>
            )}
          </div>
          {!helperAsTooltip && (
            <>
              <p className="text-xs leading-relaxed text-slate-400">{helperText}</p>
              {ratioHint && (
                <p className="text-xs text-slate-500">Rasio ideal: {ratioHint}</p>
              )}
            </>
          )}
        </div>
        <ImageActionButtons
          variant="header"
          onReset={handleReset}
          showReset={Boolean(previewSrc) && !unifiedSlot}
        />
      </div>

      {unifiedSlot ? (
        <div className="mt-4">
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={handleSlotKeyDown}
            onPaste={handleClipboardPaste}
            className={`group relative flex items-center justify-center overflow-hidden rounded-lg border bg-slate-900/50 ${
              previewSrc ? "border-slate-700" : "border-dashed border-slate-600"
            } ${slotHeight} cursor-pointer px-4 text-center transition hover:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30`}
          >
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelection}
            />

            {previewSrc ? (
              <>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={previewTransformStyle}
                >
                  <div style={mirrorWrapperStyle} className="h-full w-full">
                    <img src={previewSrc} alt={label} className="h-full w-full object-contain" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-slate-950/10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                <div className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleReset();
                    }}
                    className="inline-flex items-center justify-center text-rose-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
                    aria-label={`Reset ${label}`}
                  >
                    <Tooltip content="Reset" align="right">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Tooltip>
                  </button>
                </div>
              </>
            ) : (
              <div className="relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                  Upload / Paste Gambar
                </span>
                <span className="mt-1 block text-[11px] text-slate-400">
                  Klik untuk memilih file atau Ctrl+V
                </span>
                {isLoading && (
                  <span className="mt-2 block animate-pulse text-[10px] uppercase tracking-wide text-amber-300">
                    Memproses gambar...
                  </span>
                )}
              </div>
            )}

            {previewSrc && isLoading && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-950/40">
                <span className="animate-pulse text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                  Memproses gambar...
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label
            htmlFor={inputId}
            className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-900/40 ${slotHeight} cursor-pointer px-4 text-center transition hover:border-brand-yellow hover:text-brand-yellow`}
          >
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelection}
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Upload / Paste Gambar
            </span>
            <span className="mt-1 text-[11px] text-slate-400">Klik untuk memilih file</span>
            {isLoading && (
              <span className="mt-2 animate-pulse text-[10px] uppercase tracking-wide text-amber-300">
                Memproses gambar...
              </span>
            )}
          </label>
          <ImagePreviewDisplay
            previewSrc={previewSrc}
            label={label}
            scale={normalizedScale}
            offsetX={normalizedOffsetX}
            offsetY={normalizedOffsetY}
            isFlipped={isFlipped}
            slotHeight={slotHeight}
          />
        </div>
      )}

      {hasAdjustments && (
        <ImageAdjustmentControls
          scale={normalizedScale}
          offsetX={normalizedOffsetX}
          offsetY={normalizedOffsetY}
          onScaleChange={handleScaleChange}
          onScaleReset={handleScaleReset}
          onOffsetChange={handleOffsetChange}
          onOffsetReset={handleOffsetReset}
        />
      )}

      <ImageActionButtons
        variant="footer"
        onToggleFlip={onToggleFlip}
        isFlipped={isFlipped}
        canRemoveBackground={canRemoveBackground}
        onRemoveBackground={onRemoveBackground}
        isRemovingBackground={isRemovingBackground}
        removeBackgroundError={removeBackgroundError}
      />

      {inputStatus && <p className="mt-3 text-xs text-emerald-300">{inputStatus}</p>}

      {shouldShowManualInput && (
        <textarea
          value={manualInput}
          onChange={handleManualInputChange}
          onPaste={handleClipboardPaste}
          placeholder="Paste URL gambar atau data base64 di sini..."
          className="mt-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          rows={2}
        />
      )}
    </div>
  );
};

ImageUploadPreview.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string,
  previewSrc: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  inputId: PropTypes.string,
  ratioHint: PropTypes.string,
  helperAsTooltip: PropTypes.bool,
  autoIndicator: PropTypes.bool,
  unifiedSlot: PropTypes.bool,
  hideManualInputWhenPreview: PropTypes.bool,
  slotHeight: PropTypes.string,
  scale: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  onAdjust: PropTypes.func,
  onToggleFlip: PropTypes.func,
  isFlipped: PropTypes.bool,
  canRemoveBackground: PropTypes.bool,
  onRemoveBackground: PropTypes.func,
  isRemovingBackground: PropTypes.bool,
  removeBackgroundError: PropTypes.string,
  readFileAsDataURL: PropTypes.func,
};

export default ImageUploadPreview;
