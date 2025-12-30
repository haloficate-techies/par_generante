import { INDONESIAN_DAY_NAMES } from "../constants/day-names";

const resolveTotoSingaporeDrawTimeConfig = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  const dayName = INDONESIAN_DAY_NAMES[dayIndex];

  if (dayIndex === 2 || dayIndex === 5) {
    return {
      options: [],
      helperText: `Pools sedang libur (${dayName})`,
      disabledReason: "Pools sedang libur untuk hari ini.",
    };
  }

  const time = dayIndex === 1 || dayIndex === 4 ? "17:35" : "17:40";
  return {
    options: [time],
    helperText: `Jadwal hari ini (${dayName})`,
  };
};

export { resolveTotoSingaporeDrawTimeConfig };

export default resolveTotoSingaporeDrawTimeConfig;

