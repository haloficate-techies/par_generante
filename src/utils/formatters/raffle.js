const RAFFLE_DATE_LOCALE_OPTIONS = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

const formatRaffleDateLabel = (rawValue) => {
  if (!rawValue) return "";
  const trimmed = `${rawValue}`.trim();
  if (!trimmed) return "";
  const normalized = trimmed.replace(" ", "T");
  let parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      parsed = new Date(`${isoMatch[1]}T00:00:00`);
    }
  }
  if (!Number.isNaN(parsed.getTime())) {
    try {
      return parsed.toLocaleDateString("id-ID", RAFFLE_DATE_LOCALE_OPTIONS).toUpperCase();
    } catch (error) {
      return parsed.toDateString().toUpperCase();
    }
  }
  return trimmed.toUpperCase();
};

const formatRaffleEventLabel = (info) => {
  if (!info) return "";
  const eventName = typeof info.name === "string" ? info.name.trim() : "";
  if (eventName) {
    return eventName.toUpperCase();
  }
  return formatRaffleDateLabel(info.endDate || info.periode || "");
};

const extractRaffleSlug = (rawValue) => {
  if (!rawValue) {
    return "";
  }
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const parsed = new URL(trimmed);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.pop() || trimmed;
  } catch (error) {
    return trimmed.replace(/^\/+|\/+$/g, "");
  }
};

const formatPrizeAmountLabel = (value) => {
  const numeric = Number(value);
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
    return value.trim();
  }
  return "Rp -";
};

const mapRaffleWinners = (prizes = []) =>
  prizes.map((winner, index) => {
    const fallbackLabel = `Pemenang ${index + 1}`;
    const usernameSource = winner?.username || winner?.ticket_code || fallbackLabel;
    const displayUsername =
      typeof usernameSource === "string" ? usernameSource : `${usernameSource ?? fallbackLabel}`;
    const formattedPrizeAmount =
      winner?.formattedPrizeAmount ||
      formatPrizeAmountLabel(
        winner?.prize_amount ?? winner?.amount ?? winner?.prizeAmount ?? winner?.total ?? 0
      );
    return {
      ...winner,
      displayUsername,
      formattedPrizeAmount,
    };
  });

export { extractRaffleSlug, formatRaffleEventLabel, mapRaffleWinners };
