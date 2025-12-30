/**
 * Indonesian locale formatter used across match components.
 * Produces strings like "15 Jan 2025".
 */
const MATCH_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/**
 * Formats a YYYY-MM-DD string into Indonesian locale text.
 *
 * @param {string} dateString - ISO date string.
 * @returns {string} Human-readable date or "Tanggal TBD" placeholder.
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Tanggal TBD";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Tanggal TBD";
  }
  return MATCH_DATE_FORMATTER.format(date);
};

/**
 * Appends WIB suffix to provided time string, handling placeholders.
 *
 * @param {string} timeString - HH:mm time representation.
 * @returns {string} Formatted label or "Waktu TBD".
 */
export const formatTime = (timeString) => {
  if (!timeString) return "Waktu TBD";
  return `${timeString} WIB`;
};

export default {
  formatDate,
  formatTime,
};

