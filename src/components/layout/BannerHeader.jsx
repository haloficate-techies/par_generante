import React, { memo } from "react";
import AppEnvironment from "../../app/app-environment";

const AppGlobals = AppEnvironment.getGlobals() || {};
const DEFAULT_MODE_OPTIONS = Array.isArray(AppGlobals.MODE_CONFIG) ? AppGlobals.MODE_CONFIG : [];

const BannerHeaderComponent = ({
  activeModeConfig,
  activeMode,
  activeSubMenu,
  onModeChange,
  onSubMenuChange,
  lastRenderAt,
  options = DEFAULT_MODE_OPTIONS,
}) => {
  const subMenus = Array.isArray(activeModeConfig?.subMenus) ? activeModeConfig.subMenus : [];
  const showSubMenus = subMenus.length > 0;

  const gradientActiveClasses =
    "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-fuchsia-900/40";
  const inactiveClasses = "bg-slate-800/70 text-slate-300 hover:text-white";

  return (
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
          <div className="flex flex-wrap gap-2">
            {options.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onModeChange(mode.id)}
                  className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-fuchsia-300/40 ${
                    isActive ? gradientActiveClasses : inactiveClasses
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
          {showSubMenus ? (
            <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-2">
              {subMenus.map((menuItem) => {
                const isSelected = activeSubMenu === menuItem.id;
                return (
                  <button
                    key={menuItem.id}
                    type="button"
                    onClick={() => onSubMenuChange?.(menuItem.id)}
                    className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-fuchsia-300/40 ${
                      isSelected ? gradientActiveClasses : inactiveClasses
                    }`}
                  >
                    {menuItem.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

const BannerHeader = memo(BannerHeaderComponent);
AppEnvironment.registerComponent("BannerHeader", BannerHeader);

export default BannerHeader;
