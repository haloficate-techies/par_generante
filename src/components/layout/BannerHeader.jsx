import React, { memo } from "react";

const BannerHeaderComponent = ({
  activeModeConfig,
  activeMode,
  activeSubMenu,
  onModeChange,
  onSubMenuChange,
  lastRenderAt,
  modeConfig,
  options = modeConfig,
}) => {
  const resolvedOptions = Array.isArray(options) ? options : [];
  const subMenus = Array.isArray(activeModeConfig?.subMenus) ? activeModeConfig.subMenus : [];
  const showSubMenus = subMenus.length > 0;

  const activeButtonClasses =
    "bg-brand-yellow text-slate-900 shadow-lg shadow-brand-yellow/40";
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
            Render terakhir: {lastRenderAt ? lastRenderAt.toLocaleString("id-ID") : "belum tersedia"}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
          <div className="flex flex-wrap gap-2">
            {resolvedOptions.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onModeChange(mode.id)}
                    className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 ${
                    isActive ? activeButtonClasses : inactiveClasses
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
                    className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 ${
                      isSelected ? activeButtonClasses : inactiveClasses
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

export default BannerHeader;
