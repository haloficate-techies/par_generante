import React from "react";
import AppEnvironment from "../../app/app-environment";

const PreviewModal = ({ isOpen, imageSrc, onClose }) => {
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
          aria-label="Tutup preview"
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
            <img src={imageSrc} alt="Preview banner penuh" className="w-full rounded-xl" />
          ) : (
            <p className="text-center text-sm text-slate-300">Gagal memuat gambar preview.</p>
          )}
        </div>
      </div>
    </div>
  );
};

AppEnvironment.registerComponent("PreviewModal", PreviewModal);

export default PreviewModal;
