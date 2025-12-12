import AppData from "../../data/app-data";

const formatMatchDateLabel =
  AppData.formatDate ||
  ((dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    try {
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  });

const formatMatchTimeLabel =
  AppData.formatTime ||
  ((timeString) => {
    if (!timeString) return "";
    return timeString;
  });

export { formatMatchDateLabel, formatMatchTimeLabel };
