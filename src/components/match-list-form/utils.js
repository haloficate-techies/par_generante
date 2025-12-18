export const buildPlayerSlotKey = (index, side) => `${index}-${side}`;
export const buildLogoSlotKey = (index, side) => `${index}-${side}-logo`;

export const formatPrizeCurrency = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value || "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
};
