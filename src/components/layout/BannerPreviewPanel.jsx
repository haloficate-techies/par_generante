import React from "react";
import { Download, FileArchive, ZoomIn } from "lucide-react";

const BannerPreviewPanel = ({
  canvasRef,
  isRendering,
  isBulkDownloading,
  bulkProgress = 0,
  hidePreviewAction = false,
  onPreviewClick,
  onDownloadPng,
  onDownloadZip,
}) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-auto">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Banner Penuh</h2>
        <p className="text-xs text-slate-400">
          Lihat tampilan banner ukuran penuh sebelum diunduh
        </p>
      </div>
      <span className="rounded-full bg-brand-yellow/10 px-3 py-1 text-xs font-semibold text-brand-yellow">
        1:1 Square
      </span>
    </div>
    <canvas
      ref={canvasRef}
      width="1080"
      height="1080"
      className="w-full max-w-full aspect-square rounded-xl border border-slate-800 bg-slate-900 shadow-inner shadow-slate-950/40"
    />
    <div className="flex flex-wrap gap-3">
      {!hidePreviewAction ? (
        <button
          type="button"
          onClick={onPreviewClick}
          disabled={isRendering || isBulkDownloading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-yellow/60 px-3 py-1.5 text-sm font-medium text-brand-yellow transition hover:bg-brand-yellow/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500"
        >
          {isRendering ? (
            "Rendering..."
          ) : (
            <>
              <ZoomIn size={20} className="shrink-0" aria-hidden="true" />
              <span>Lihat Banner Penuh</span>
            </>
          )}
        </button>
      ) : null}
        <button
          type="button"
          onClick={onDownloadPng}
          disabled={isRendering || isBulkDownloading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-yellow px-3 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200"
        >
          <Download size={18} className="shrink-0" aria-hidden="true" />
          <span>Download PNG</span>
        </button>
        <button
          type="button"
          onClick={onDownloadZip}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
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
      <div className="flex items-center gap-2 text-xs text-slate-300">
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
  </section>
);

export default BannerPreviewPanel;
