import React from "react";
import AppEnvironment from "../../app/app-environment";

const BannerPreviewPanel = ({
  canvasRef,
  isRendering,
  isBulkDownloading,
  onPreviewClick,
  onDownloadPng,
  onDownloadZip,
}) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-auto">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Preview Banner</h2>
        <p className="text-xs text-slate-400">
          Canvas 1080 1080. Gunakan tombol Preview bila perlu refresh manual.
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
      className="w-full max-w-full rounded-xl border border-slate-800 bg-slate-900 shadow-inner shadow-slate-950/40"
    />
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onPreviewClick}
        disabled={isRendering || isBulkDownloading}
        className="flex-1 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200"
      >
        {isRendering ? "Rendering..." : "Preview Banner"}
      </button>
      <button
        type="button"
        onClick={onDownloadPng}
        disabled={isRendering || isBulkDownloading}
        className="flex-1 rounded-lg border border-brand-yellow/60 px-4 py-2 text-sm font-semibold text-brand-yellow transition hover:bg-brand-yellow/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500"
      >
        Download PNG
      </button>
      <button
        type="button"
        onClick={onDownloadZip}
        disabled={isRendering || isBulkDownloading}
        className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
      >
        {isBulkDownloading ? "Menyiapkan ZIP..." : "Download Semua Brand (ZIP)"}
      </button>
    </div>
  </section>
);

AppEnvironment.registerComponent("BannerPreviewPanel", BannerPreviewPanel);

export default BannerPreviewPanel;
