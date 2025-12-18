import React from "react";

const MatchCountAdjuster = ({
  count,
  minCount,
  maxCount,
  onChange,
}) => (
  <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 md:flex-row md:items-center md:justify-between">
    <div className="md:w-56">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Jumlah Pertandingan Ditampilkan
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        Banner memuat maksimal 5 pertandingan agar tata letak tetap rapi dan mudah dibaca.
      </p>
    </div>
    <div className="flex items-center justify-center gap-6 md:gap-10">
      <button
        type="button"
        onClick={() => onChange(count - 1)}
        disabled={count <= minCount}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-lg font-bold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
        aria-label="Kurangi jumlah pertandingan"
      >
        -
      </button>
      <span className="text-4xl font-bold text-slate-100">{count}</span>
      <button
        type="button"
        onClick={() => onChange(count + 1)}
        disabled={count >= maxCount}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-lg font-bold text-slate-200 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
        aria-label="Tambah jumlah pertandingan"
      >
        +
      </button>
    </div>
  </div>
);

export default MatchCountAdjuster;
