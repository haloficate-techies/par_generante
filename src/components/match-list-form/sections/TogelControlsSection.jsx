import React, { useId } from "react";

const TogelControlsSection = ({
  isTogelMode,
  pools,
  selectedPool,
  onPoolChange,
  showVariantSelector,
  poolVariants,
  selectedVariant,
  onVariantChange,
  selectedPoolOption,
  drawTimeConfig,
  drawTimeOptions,
  togelDrawTime,
  onTogelDrawTimeChange,
  shouldShowDrawTimeSelector,
}) => {
  const poolSelectId = useId();
  const variantSelectId = useId();

  if (!isTogelMode) {
    return null;
  }
  return (
    <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
      <div>
        <h3 className="text-base font-semibold text-slate-100">
          Pengaturan Pools Togel
        </h3>
        <p className="text-xs text-slate-400">
          Pilih pools dan mode keluarannya sebelum merender banner.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5 text-slate-300">
          <label
            htmlFor={poolSelectId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Pools
          </label>
          <select
            id={poolSelectId}
            value={selectedPool}
            onChange={onPoolChange}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/30 transition focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          >
            <option value="">Pilih pools</option>
            {pools.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {showVariantSelector && (
          <div className="flex flex-col gap-1.5 text-slate-300">
            <label
              htmlFor={variantSelectId}
              className="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Mode Keluaran
            </label>
            <select
              id={variantSelectId}
              value={selectedVariant}
              onChange={onVariantChange}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/30 transition focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
            >
              <option value="">Pilih mode</option>
              {poolVariants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {!showVariantSelector && selectedPool && poolVariants.length === 1 && (
        <p className="text-xs text-slate-400">
          Mode keluaran hanya: {poolVariants[0]}
        </p>
      )}
      {!selectedPool && (
        <p className="text-xs text-rose-300">
          Pilih pools terlebih dahulu untuk menentukan mode keluaran.
        </p>
      )}
      {shouldShowDrawTimeSelector && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm font-semibold text-slate-200">
            Jam Keluaran {selectedPoolOption?.label?.toUpperCase() ?? ""} ({selectedVariant})
          </p>
          <p className="text-xs text-slate-400">
            {drawTimeConfig.helperText || "Pilih salah satu jam keluaran di bawah ini."}
          </p>
          {drawTimeConfig.disabledReason ? (
            <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {drawTimeConfig.disabledReason}
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {drawTimeOptions.map((time) => {
                const isActive = togelDrawTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onTogelDrawTimeChange?.(time)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ${
                      isActive
                        ? "bg-brand-yellow text-slate-900 shadow"
                        : "border border-slate-700 text-slate-200 hover:border-brand-yellow/80"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TogelControlsSection;

