import React from "react";
import PropTypes from "prop-types";
import DigitStepperInput from "../ui/DigitStepperInput";

const TogelDigitsSection = ({
  shouldShowDigits = false,
  digitGridClass = "",
  togelDigits = [],
  onTogelDigitChange,
}) => {
  if (!shouldShowDigits) {
    return null;
  }
  return (
    <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-100">
          Nomor Keluaran
        </h3>
        <p className="text-xs text-slate-400">
          Setiap kolom mewakili satu digit. Gunakan panah untuk menyesuaikan angka dengan cepat.
        </p>
      </div>
      <div className={`grid gap-3 justify-items-center ${digitGridClass}`}>
        {togelDigits.map((digit, index) => (
          <DigitStepperInput
            key={`digit-${index}`}
            label={`Digit ${index + 1}`}
            value={digit}
            onChange={(nextDigit) => onTogelDigitChange?.(index, nextDigit)}
          />
        ))}
      </div>
    </section>
  );
};

TogelDigitsSection.propTypes = {
  shouldShowDigits: PropTypes.bool,
  digitGridClass: PropTypes.string,
  togelDigits: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onTogelDigitChange: PropTypes.func,
};

export default TogelDigitsSection;

