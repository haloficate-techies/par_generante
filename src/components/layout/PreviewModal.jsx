import React from "react";
import { Download, FileArchive } from "lucide-react";

const PreviewModal = ({
  isOpen,
  imageSrc,
  onClose,
  onDownloadPng,
  onDownloadZip,
  isRendering,
  isBulkDownloading,
  bulkProgress = 0,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="relative w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-lg font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          aria-label="Tutup banner penuh"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl shadow-black/60">
          {imageSrc ? (
            <img src={imageSrc} alt="Banner ukuran penuh" className="w-full rounded-xl" />
          ) : (
            <p className="text-center text-sm text-slate-300">Gagal memuat gambar.</p>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onDownloadPng}
            disabled={isRendering || isBulkDownloading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200 sm:flex-none"
          >
            <Download size={18} className="shrink-0" aria-hidden="true" />
            <span>Download PNG</span>
          </button>
          <button
            type="button"
            onClick={onDownloadZip}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition sm:flex-none ${
              isBulkDownloading
                ? "border-brand-yellow/40 text-brand-yellow/70"
                : "border-slate-700 text-slate-200 hover:border-brand-yellow hover:text-brand-yellow"
            }`}
          >
            {isBulkDownloading ? (
              `Menyiapkan ZIP (${Math.round(Math.min(Math.max(bulkProgress, 0), 1) * 100)}%)`
            ) : (
              <>
                <FileArchive size={18} className="shrink-0" aria-hidden="true" />
                <span>Download Semua Brand (ZIP)</span>
              </>
            )}
          </button>
        </div>
        {isBulkDownloading ? (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
            <div className="h-1 flex-1 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-brand-yellow transition-all"
                style={{ width: `${Math.min(Math.max(bulkProgress, 0), 1) * 100}%` }}
              />
            </div>
            <span className="min-w-[3ch] text-right text-slate-200">
              {Math.round(Math.min(Math.max(bulkProgress, 0), 1) * 100)}%
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PreviewModal;
