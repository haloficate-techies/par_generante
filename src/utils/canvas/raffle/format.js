export const formatRupiah = (value) => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(numeric)) {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(numeric);
    } catch (error) {
      return `Rp ${numeric.toLocaleString("id-ID")}`;
    }
  }
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  return "Rp -";
};
