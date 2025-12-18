import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const ImageUploadPreview = ({
  label,
  helperText,
  previewSrc,
  onChange,
  inputId,
  ratioHint,
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
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!previewSrc) {
      setManualInput("");
      setInputStatus("");
      return;
    }
    if (/^https?:\/\//i.test(previewSrc)) {
      setManualInput(previewSrc);
      setInputStatus("");
      return;
    }
    if (previewSrc.startsWith("data:")) {
      setManualInput("");
      setInputStatus("Gambar clipboard siap dipakai.");
      return;
    }
    setManualInput(previewSrc);
    setInputStatus("");
  }, [previewSrc]);

  const startAsyncRequest = useCallback(() => {
    requestIdRef.current += 1;
    const currentId = requestIdRef.current;
    setIsLoading(true);
    return currentId;
  }, []);

  const finishAsyncRequest = useCallback((requestId) => {
    if (requestIdRef.current === requestId) {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    requestIdRef.current += 1;
    setIsLoading(false);
    setManualInput("");
    setInputStatus("");
    onChange(null);
    onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
  }, [onAdjust, onChange]);

  const handleFileSelection = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        handleReset();
        return;
      }
      if (!file.type.startsWith("image/")) {
        window.alert("Silakan upload file gambar (JPG/PNG/SVG).");
        return;
      }
      const requestId = startAsyncRequest();
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (requestIdRef.current !== requestId) return;
        onChange(dataUrl);
        onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
        setInputStatus("Gambar upload berhasil dimuat.");
      } catch (error) {
        console.error(error);
        window.alert("Gagal membaca file gambar. Coba lagi.");
      } finally {
        finishAsyncRequest(requestId);
      }
    },
    [finishAsyncRequest, handleReset, onAdjust, onChange, readFileAsDataURL, startAsyncRequest]
  );

  const handleClipboardPaste = useCallback(
    async (event) => {
      const { clipboardData } = event;
      if (!clipboardData) return;

      const items = clipboardData.items ? Array.from(clipboardData.items) : [];
      const imageItem = items.find((item) => item.type?.startsWith("image/"));

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (!file) return;
        event.preventDefault();
        const requestId = startAsyncRequest();
        try {
          const dataUrl = await readFileAsDataURL(file);
          if (requestIdRef.current !== requestId) return;
          onChange(dataUrl);
          onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
          setInputStatus("Gambar clipboard berhasil dimuat.");
        } catch (error) {
          console.error(error);
          window.alert("Gagal memuat gambar dari clipboard. Coba lagi.");
        } finally {
          finishAsyncRequest(requestId);
        }
        return;
      }

      const text = clipboardData.getData("text/plain");
      if (text) {
        event.preventDefault();
        const normalized = text.trim();
        onChange(normalized || null);
        onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
        setManualInput(normalized);
        setInputStatus("");
      }
    },
    [finishAsyncRequest, onAdjust, onChange, readFileAsDataURL, startAsyncRequest]
  );

  const handleManualInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setManualInput(value);
      const normalized = value.trim();
      onChange(normalized ? normalized : null);
      onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
      setInputStatus("");
    },
    [onAdjust, onChange]
  );

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
  const clampedScale = clampValue(scale ?? 1, 0.7, 1.5);
  const clampedOffsetX = clampValue(offsetX ?? 0, -0.75, 0.75);
  const clampedOffsetY = clampValue(offsetY ?? 0, -0.75, 0.75);
  const previewOffsetX = isFlipped ? -clampedOffsetX : clampedOffsetX;
  const transformStyle = {
    transform: `translate(${previewOffsetX * 50}%, ${clampedOffsetY * 50}%) scale(${clampedScale})`,
  };
  const mirrorWrapperStyle = isFlipped ? { transform: "scaleX(-1)" } : undefined;
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
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
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
        <div
          className={`relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900/60 ${slotHeight}`}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={transformStyle}
          >
            <div style={mirrorWrapperStyle} className="h-full w-full">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt={label}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-sm text-slate-500">Belum ada gambar</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {hasAdjustments && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Skala Logo ({Math.round(clampedScale * 100)}%)
            </label>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.01"
              value={clampedScale}
              onChange={handleScaleChange}
              className="w-full accent-brand-yellow"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Offset Logo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="range"
                min="-0.75"
                max="0.75"
                step="0.01"
                value={clampedOffsetX}
                onChange={(event) => handleOffsetChange(event, "offsetX")}
                className="w-full accent-brand-yellow"
              />
              <input
                type="range"
                min="-0.75"
                max="0.75"
                step="0.01"
                value={clampedOffsetY}
                onChange={(event) => handleOffsetChange(event, "offsetY")}
                className="w-full accent-brand-yellow"
              />
            </div>
          </div>
        </div>
      )}
      {(onToggleFlip || canRemoveBackground) && (
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
      )}
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

export default ImageUploadPreview;
