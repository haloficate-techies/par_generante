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
  const showSubMenus = subMenus.length > 1;

  const activeButtonClasses =
    "border-slate-600 bg-slate-800/80 text-slate-100 shadow-inner shadow-slate-950/40";
  const inactiveClasses =
    "border-slate-800/80 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200";
  const tabBaseClasses =
    "flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-600/40";
  const subTabBaseClasses =
    "flex-1 rounded-2xl border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-600/40";

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
                  className={`${tabBaseClasses} ${isActive ? activeButtonClasses : inactiveClasses}`}
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
                    className={`${subTabBaseClasses} ${
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
