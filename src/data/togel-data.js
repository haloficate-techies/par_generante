const INDONESIAN_DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

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

const TOGEL_DRAW_TIME_LOOKUP = {
  toto_macau: {
    "4D": ["13:00", "16:00", "19:00", "22:00", "23:00", "00:00"],
    "5D": ["15:15", "21:15"],
  },
  king_kong_pools: {
    "4D": ["17:00", "23:30"],
  },
  lato_lato_lotto: {
    "3D": [
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "00:00",
    ],
    "4D": ["14:00"],
    "5D": ["11:05"],
  },
  toto_singapore: {
    "4D": resolveTotoSingaporeDrawTimeConfig,
  },
  sydney_lotto: {
    "4D": ["13:50"],
  },
  toto_taiwan: {
    "4D": ["19:30"],
  },
  hongkong_lotto: {
    "4D": ["23:00"],
  },
  toto_saigon: {
    "4D": ["21:15"],
    "5D": ["14:45"],
  },
  toto_taipei: {
    "4D": ["18:30"],
    "5D": ["12:30"],
  },
  jakarta_pools: {
    "4D": ["14:00", "23:30"],
    "5D": ["20:00"],
  },
  jowo_pools: {
    "4D": ["09:00", "21:00"],
  },
};

const resolveTogelDrawTimeConfig = (pool, variant) => {
  if (!pool || !variant) {
    return { options: [] };
  }
  const entry = TOGEL_DRAW_TIME_LOOKUP[pool]?.[variant];
  if (!entry) {
    return { options: [] };
  }
  if (typeof entry === "function") {
    const result = entry();
    if (Array.isArray(result)) {
      return { options: result };
    }
    return {
      options: result?.options ?? [],
      helperText: result?.helperText ?? "",
      disabledReason: result?.disabledReason ?? "",
    };
  }
  if (Array.isArray(entry)) {
    return { options: entry };
  }
  if (entry && typeof entry === "object") {
    return {
      options: entry.options ?? [],
      helperText: entry.helperText ?? "",
      disabledReason: entry.disabledReason ?? "",
    };
  }
  return { options: [] };
};

const TOGEL_POOL_OPTIONS = [
  { label: "TOTO MACAU", value: "toto_macau", modes: ["4D", "5D"] },
  { label: "KING KONG POOLS", value: "king_kong_pools", modes: ["4D"] },
  { label: "LATO LATO LOTTO", value: "lato_lato_lotto", modes: ["3D", "4D", "5D"] },
  { label: "TOTO SINGAPORE", value: "toto_singapore", modes: ["4D"] },
  { label: "SYDNEY LOTTO", value: "sydney_lotto", modes: ["4D"] },
  { label: "HONGKONG LOTTO", value: "hongkong_lotto", modes: ["4D"] },
  { label: "TOTO SAIGON", value: "toto_saigon", modes: ["4D", "5D"] },
  { label: "TOTO TAIPEI", value: "toto_taipei", modes: ["4D", "5D"] },
  { label: "TOTO TAIWAN", value: "toto_taiwan", modes: ["4D"] },
  { label: "JAKARTA POOLS", value: "jakarta_pools", modes: ["4D", "5D"] },
  { label: "JOWO POOLS", value: "jowo_pools", modes: ["4D"] },
];

export {
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  TOGEL_POOL_OPTIONS,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
};

export default {
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  TOGEL_POOL_OPTIONS,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
};
