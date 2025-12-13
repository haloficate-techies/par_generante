const BIG_MATCH_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const formatBigMatchDateLabel = (dateString) => {
  if (!dateString) return "";
  try {
    const parsed = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return dateString;
    }
    return BIG_MATCH_DATE_FORMATTER.format(parsed);
  } catch (error) {
    return dateString;
  }
};

export const getTodayDateLabel = () => {
  try {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Failed to format date label:", error);
    return "";
  }
};

const shouldUsePreviousDateForTogel = (poolCode, variantLabel, drawTime) => {
  if (!poolCode || !variantLabel || !drawTime) {
    return false;
  }
  const normalizedPool = poolCode.toLowerCase();
  const normalizedVariant = variantLabel.toUpperCase();
  const normalizedTime = drawTime.trim().replace(/\./g, ":");
  return (
    normalizedPool === "toto_macau" &&
    normalizedVariant === "4D" &&
    normalizedTime === "00:00"
  );
};

export const resolveTogelDateLabel = ({
  poolCode,
  variantLabel,
  drawTime,
} = {}) => {
  try {
    const targetDate = new Date();
    if (shouldUsePreviousDateForTogel(poolCode, variantLabel, drawTime)) {
      targetDate.setDate(targetDate.getDate() - 1);
    }
    return targetDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Failed to resolve togel date label:", error);
    return "";
  }
};
