export const normalizeTogelDigits = (digits = []) => {
  const effectiveLength = digits.length > 0 ? digits.length : 3;
  return Array.from({ length: effectiveLength }).map((_, index) => {
    const value = digits[index];
    if (typeof value === "string" && value.length > 0) {
      return value.replace(/\D/g, "").slice(-1) || "0";
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(Math.abs(Math.floor(value)) % 10);
    }
    return "0";
  });
};
