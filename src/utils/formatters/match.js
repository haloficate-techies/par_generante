import { formatDate, formatTime } from "../../data/helpers/date-time-formatters";

const formatMatchDateLabel = (dateString) => {
  if (!dateString) return "";
  const formatted = formatDate(dateString);
  return typeof formatted === "string" ? formatted : "";
};

const formatMatchTimeLabel = (timeString) => {
  if (!timeString) return "";
  const formatted = formatTime(timeString);
  return typeof formatted === "string" ? formatted : timeString;
};

export { formatMatchDateLabel, formatMatchTimeLabel };
