import React, { useCallback } from "react";
import PropTypes from "prop-types";
import useImageUpload from "./hooks/useImageUpload";
import ImagePreviewDisplay from "./ImagePreviewDisplay";
import ImageAdjustmentControls from "./ImageAdjustmentControls";
import ImageActionButtons from "./ImageActionButtons";

const ImageUploadPreview = ({
  label = "",
  helperText = "",
  previewSrc = "",
  onChange,
  inputId = "",
  ratioHint = "",
  slotHeight = "h-32",
  isAuto = false,
  onAutoFetch,
  canAutoFetch = false,
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

  const handleScaleChange = useCallback(
    (event) => {
      const value = Number(event.target.value);
      onAdjust?.({ scale: value });
    },
    [onAdjust]
  );

  const handleOffsetChange = useCallback(
    (event, axis) => {
      const value = Number(event.target.value);
      if (!onAdjust) return;
      onAdjust({ [axis]: value });
    },
    [onAdjust]
  );

  const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
  const normalizedScale = clampValue(scale ?? 1, 0.7, 1.5);
  const normalizedOffsetX = clampValue(offsetX ?? 0, -0.75, 0.75);
  const normalizedOffsetY = clampValue(offsetY ?? 0, -0.75, 0.75);
  const hasAdjustments = Boolean(onAdjust);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="text-xs leading-relaxed text-slate-400">
            {helperText}
          </p>
          {ratioHint && (
            <p className="text-xs text-slate-500">Rasio ideal: {ratioHint}</p>
          )}
          {isAuto && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              <span className="text-[12px] leading-none">?</span>
              Logo otomatis
            </span>
          )}
        </div>
        <ImageActionButtons
          variant="header"
          canAutoFetch={canAutoFetch}
          onAutoFetch={onAutoFetch}
          onReset={handleReset}
        />
      </div>
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
          <span className="mt-1 text-[11px] text-slate-400">
            Klik untuk memilih file
          </span>
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
      {hasAdjustments && (
        <ImageAdjustmentControls
          scale={normalizedScale}
          offsetX={normalizedOffsetX}
          offsetY={normalizedOffsetY}
          onScaleChange={handleScaleChange}
          onOffsetChange={handleOffsetChange}
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
      {inputStatus && (
        <p className="mt-3 text-xs text-emerald-300">{inputStatus}</p>
      )}
      <textarea
        value={manualInput}
        onChange={handleManualInputChange}
        onPaste={handleClipboardPaste}
        placeholder="Paste URL gambar atau data base64 di sini..."
        className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs text-slate-200 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        rows={2}
      />
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
  slotHeight: PropTypes.string,
  isAuto: PropTypes.bool,
  onAutoFetch: PropTypes.func,
  canAutoFetch: PropTypes.bool,
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
