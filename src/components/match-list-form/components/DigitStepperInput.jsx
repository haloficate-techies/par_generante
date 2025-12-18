import React from "react";

const DigitStepperInput = ({ label, value = "0", onChange }) => {
  const numericValue = Number.parseInt(value, 10);
  const currentValue = Number.isFinite(numericValue) ? numericValue : 0;
  const clampDigit = (digit) => Math.min(9, Math.max(0, digit));
  const handleManualInput = (event) => {
    const raw = event.target.value.replace(/\D/g, "");
    const digit = raw ? Number.parseInt(raw[raw.length - 1], 10) : 0;
    onChange?.(String(clampDigit(digit)));
  };
  const handleIncrement = () => {
    const nextValue = currentValue >= 9 ? 0 : currentValue + 1;
    onChange?.(String(nextValue));
  };
  const handleDecrement = () => {
    const nextValue = currentValue <= 0 ? 9 : currentValue - 1;
    onChange?.(String(nextValue));
  };
  const handleKeyDown = (event) => {
    const { key } = event;
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      onChange?.(key);
      return;
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      handleIncrement();
      return;
    }
    if (key === "ArrowDown") {
      event.preventDefault();
      handleDecrement();
      return;
    }
    if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      onChange?.("0");
    }
  };

  const ArrowIcon = ({ direction = "up" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      {direction === "up" ? (
        <path d="M6 15l6-6 6 6" />
      ) : (
        <path d="M18 9l-6 6-6-6" />
      )}
    </svg>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="flex w-16 flex-col items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/70 px-2 py-3 text-slate-100 shadow-inner shadow-black/40">
        <button
          type="button"
          onClick={handleIncrement}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:text-white"
          aria-label="Naikkan digit"
        >
          <ArrowIcon direction="up" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={String(currentValue)}
          onChange={handleManualInput}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-center text-3xl font-semibold tracking-wider text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
        />
        <button
          type="button"
          onClick={handleDecrement}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:text-white"
          aria-label="Turunkan digit"
        >
          <ArrowIcon direction="down" />
        </button>
      </div>
    </div>
  );
};

export default DigitStepperInput;
