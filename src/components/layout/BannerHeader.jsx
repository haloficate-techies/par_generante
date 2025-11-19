import React, { memo } from "react";
import AppEnvironment from "../../app/app-environment";

const AppGlobals = AppEnvironment.getGlobals() || {};
const DEFAULT_MODE_OPTIONS = Array.isArray(AppGlobals.MODE_CONFIG) ? AppGlobals.MODE_CONFIG : [];

const BannerHeaderComponent = ({
  activeModeConfig,
  activeMode,
  onModeChange,
  lastRenderAt,
  options = DEFAULT_MODE_OPTIONS,
}) => (
  <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-yellow">{activeModeConfig.title}</h1>
          <p className="text-sm text-slate-400">{activeModeConfig.subtitle}</p>
        </div>
        <div className="text-xs text-slate-500">
          Preview terakhir: {lastRenderAt ? lastRenderAt.toLocaleString("id-ID") : "belum tersedia"}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
        {options.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-yellow/60 ${
              activeMode === mode.id
                ? "bg-brand-yellow text-slate-900 shadow"
                : "bg-slate-800/70 text-slate-300 hover:text-white"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  </header>
);

const BannerHeader = memo(BannerHeaderComponent);
AppEnvironment.registerComponent("BannerHeader", BannerHeader);

export default BannerHeader;
