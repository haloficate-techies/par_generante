import AppEnvironment from "../app/app-environment";

// -------- Shared helpers --------
export const DEFAULT_BRAND_PALETTE = {
  headerStart: "#6366f1",
  headerEnd: "#ec4899",
  footerStart: "#22c55e",
  footerEnd: "#0d9488",
  accent: "#38bdf8",
};

export const PLACEHOLDER_COLORS = {
  fill: "#1f2937",
  border: "rgba(148, 163, 184, 0.4)",
  text: "#e2e8f0",
};

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

const normalizeTeamName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const TEAM_AUTO_LOGO_SOURCES = [
  {
    names: ["arsenal", "arsenal fc"],
    source: "https://upload.wikimedia.org/wikipedia/hif/8/82/Arsenal_FC.png?size=256",
  },
  {
    names: ["aston villa", "aston villa fc"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Aston_Villa_FC_new_crest.svg/250px-Aston_Villa_FC_new_crest.svg.png?size=256",
  },
  {
    names: ["afc bournemouth", "bournemouth"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/AFC_Bournemouth_%282013%29.svg/912px-AFC_Bournemouth_%282013%29.svg.png?size=256",
  },
  {
    names: ["brentford", "brentford fc"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Brentford_FC_crest.svg/1200px-Brentford_FC_crest.svg.png?size=256",
  },
  {
    names: ["brighton and hove albion", "brighton", "brighton hove albion"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/331.png?size=256",
  },
  {
    names: ["burnley", "burnley fc"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Burnley_FC_Logo.svg/250px-Burnley_FC_Logo.svg.png?size=256",
  },
  {
    names: ["chelsea", "chelsea fc"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png?size=256",
  },
  {
    names: ["crystal palace", "crystal palace fc"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/384.png?size=256",
  },
  {
    names: ["everton", "everton fc"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/368.png?size=256",
  },
  {
    names: ["fulham", "fulham fc"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Fulham_FC_%28shield%29.svg/901px-Fulham_FC_%28shield%29.svg.png?size=256",
  },
  {
    names: ["liverpool", "liverpool fc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/800px-Liverpool_FC.svg.png?size=256",
  },
  {
    names: ["luton town", "luton"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Luton_Town_logo.svg/1200px-Luton_Town_logo.svg.png?size=256",
  },
  {
    names: ["manchester city", "man city", "manchester city fc"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png?size=256",
  },
  {
    names: ["manchester united", "man united", "man utd"],
    source: "https://upload.wikimedia.org/wikipedia/hif/f/ff/Manchester_United_FC_crest.png?size=256",
  },
  {
    names: ["newcastle united", "newcastle"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Newcastle_United_Logo.svg/1192px-Newcastle_United_Logo.svg.png?size=256",
  },
  {
    names: ["nottingham forest", "forest"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Nottingham_Forest_F.C._logo.svg/1024px-Nottingham_Forest_F.C._logo.svg.png?size=256",
  },
  {
    names: ["sheffield united", "sheffield utd"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Sheffield_United_FC_logo.svg/1200px-Sheffield_United_FC_logo.svg.png?size=256",
  },
  {
    names: ["tottenham hotspur", "tottenham", "spurs"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/584px-Tottenham_Hotspur.svg.png?size=256",
  },
  {
    names: ["west ham united", "west ham"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/West_Ham_United_FC_logo.svg/1079px-West_Ham_United_FC_logo.svg.png?size=256",
  },
  {
    names: ["wolverhampton wanderers", "wolves"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Wolverhampton_Wanderers_FC_crest.svg/250px-Wolverhampton_Wanderers_FC_crest.svg.png?size=256",
  },
  {
    names: ["bayern munich", "fc bayern", "bayern"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/2048px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png?size=256",
  },
  {
    names: ["borussia dortmund", "dortmund", "bvb"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/1200px-Borussia_Dortmund_logo.svg.png?size=256",
  },
  {
    names: ["rb leipzig", "leipzig"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/1200px-RB_Leipzig_2014_logo.svg.png?size=256",
  },
  {
    names: ["bayer leverkusen", "leverkusen"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/1200px-Bayer_04_Leverkusen_logo.svg.png?size=256",
  },
  {
    names: ["union berlin"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1._FC_Union_Berlin_Logo.svg/1200px-1._FC_Union_Berlin_Logo.svg.png?size=256",
  },
  {
    names: ["freiburg", "sc freiburg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/SC_Freiburg_logo.svg/841px-SC_Freiburg_logo.svg.png?size=256",
  },
  {
    names: ["eintracht frankfurt", "frankfurt"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/125.png?size=256",
  },
  {
    names: ["vfl wolfsburg", "wolfsburg"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/VfL_Wolfsburg_Logo.svg/1200px-VfL_Wolfsburg_Logo.svg.png?size=256",
  },
  {
    names: ["mainz 05", "mainz"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Mainz_05_crest.svg/1200px-Mainz_05_crest.svg.png?size=256",
  },
  {
    names: ["borussia monchengladbach", "monchengladbach", "gladbach"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/250px-Borussia_M%C3%B6nchengladbach_logo.svg.png?size=256",
  },
  {
    names: ["fc koln", "1 fc koln", "koln", "cologne"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/1._FC_Koeln_Logo_2014%E2%80%93.svg/1054px-1._FC_Koeln_Logo_2014%E2%80%93.svg.png?size=256",
  },
  {
    names: ["hoffenheim", "tsg hoffenheim"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Logo_TSG_Hoffenheim.svg/1005px-Logo_TSG_Hoffenheim.svg.png?size=256",
  },
  {
    names: ["augsburg", "fc augsburg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/FC_Augsburg_logo.svg/920px-FC_Augsburg_logo.svg.png?size=256",
  },
  {
    names: ["stuttgart", "vfb stuttgart"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/1103px-VfB_Stuttgart_1893_Logo.svg.png?size=256",
  },
  {
    names: ["bochum", "vfl bochum"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/VfL_Bochum_logo.svg/1140px-VfL_Bochum_logo.svg.png?size=256",
  },
  {
    names: ["darmstadt", "sv darmstadt 98"],
    source: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Darmstadt_98_football_club_new_logo_2015.png?size=256",
  },
  {
    names: ["heidenheim", "1 fc heidenheim"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/1._FC_Heidenheim_1846.svg/973px-1._FC_Heidenheim_1846.svg.png?size=256",
  },
  {
    names: ["werder bremen", "bremen"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/798px-SV-Werder-Bremen-Logo.svg.png?size=256",
  },
  {
    names: ["barcelona", "fc barcelona", "barca"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1183px-FC_Barcelona_%28crest%29.svg.png?size=256",
  },
  {
    names: ["real madrid"],
    source: "https://upload.wikimedia.org/wikipedia/sco/thumb/5/56/Real_Madrid_CF.svg/1464px-Real_Madrid_CF.svg.png?size=256",
  },
  {
    names: ["atletico madrid", "atletico de madrid"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/1068.png?size=256",
  },
  {
    names: ["real sociedad"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Real_Sociedad_logo.svg/1044px-Real_Sociedad_logo.svg.png?size=256",
  },
  {
    names: ["villarreal"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Villarreal_CF_logo-en.svg/962px-Villarreal_CF_logo-en.svg.png?size=256",
  },
  {
    names: ["real betis", "betis"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Real_betis_logo.svg/1200px-Real_betis_logo.svg.png?size=256",
  },
  {
    names: ["athletic club", "athletic bilbao", "bilbao"],
    source: "https://img.uefa.com/imgml/TP/teams/logos/240x240/50125.png?size=256",
  },
  {
    names: ["girona"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9812.png?size=256",
  },
  {
    names: ["sevilla"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/243.png?size=256",
  },
  {
    names: ["valencia"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/94.png?size=256",
  },
  {
    names: ["osasuna"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/3/38/CA_Osasuna_2024_crest.svg/895px-CA_Osasuna_2024_crest.svg.png?size=256",
  },
  {
    names: ["celta vigo", "celta"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/RC_Celta_de_Vigo_logo.svg/676px-RC_Celta_de_Vigo_logo.svg.png?size=256",
  },
  {
    names: ["getafe"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Getafe_logo.svg/1148px-Getafe_logo.svg.png?size=256",
  },
  {
    names: ["almeria"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/UD_Almeria_logo.svg/887px-UD_Almeria_logo.svg.png?size=256",
  },
  {
    names: ["cadiz", "cadiz cf"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/C%C3%A1diz_CF_logo.svg/777px-C%C3%A1diz_CF_logo.svg.png?size=256",
  },
  {
    names: ["granada", "granada cf"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Logo_of_Granada_Club_de_F%C3%BAtbol.svg/536px-Logo_of_Granada_Club_de_F%C3%BAtbol.svg.png?size=256",
  },
  {
    names: ["rayo vallecano", "rayo"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Rayo_Vallecano_logo.svg/1200px-Rayo_Vallecano_logo.svg.png?size=256",
  },
  {
    names: ["mallorca"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Rcd_mallorca.svg/906px-Rcd_mallorca.svg.png?size=256",
  },
  {
    names: ["las palmas"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/2/20/UD_Las_Palmas_logo.svg/696px-UD_Las_Palmas_logo.svg.png?size=256",
  },
  {
    names: ["alaves"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Deportivo_Alaves_logo_%282020%29.svg/1200px-Deportivo_Alaves_logo_%282020%29.svg.png?size=256",
  },
  {
    names: ["ac milan", "milan"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/250px-Logo_of_AC_Milan.svg.png?size=256",
  },
  {
    names: ["inter milan", "inter", "internazionale"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png?size=256",
  },
  {
    names: ["juventus"],
    source: "https://1000logos.net/wp-content/uploads/2021/05/Juventus-logo.png?size=256",
  },
  {
    names: ["napoli", "ssc napoli"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/114.png?size=256",
  },
  {
    names: ["roma", "as roma"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/104.png?size=256",
  },
  {
    names: ["lazio"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/S.S._Lazio_badge.svg/1200px-S.S._Lazio_badge.svg.png?size=256",
  },
  {
    names: ["atalanta"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/105.png?size=256",
  },
  {
    names: ["fiorentina"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg/1200px-ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg.png?size=256",
  },
  {
    names: ["bologna"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/107.png?size=256",
  },
  {
    names: ["torino"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500/239.png?size=256",
  },
  {
    names: ["udinese"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Udinese_Calcio_logo.svg/1200px-Udinese_Calcio_logo.svg.png?size=256",
  },
  {
    names: ["sassuolo"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/US_Sassuolo_Calcio_logo.svg/1095px-US_Sassuolo_Calcio_logo.svg.png?size=256",
  },
  {
    names: ["genoa"],
    source: "https://upload.wikimedia.org/wikipedia/min/4/4e/Genoa_cfc.png?size=256",
  },
  {
    names: ["lecce"],
    source: "https://upload.wikimedia.org/wikipedia/it/thumb/3/36/US_Lecce_Stemma.svg/820px-US_Lecce_Stemma.svg.png?size=256",
  },
  {
    names: ["monza"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Logo_of_AC_Monza.png/500px-Logo_of_AC_Monza.png?20220615144419?size=256",
  },
  {
    names: ["empoli"],
    source: "https://upload.wikimedia.org/wikipedia/commons/9/94/Empoli_FC.png?size=256",
  },
  {
    names: ["cagliari"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Cagliari_Calcio_1920.svg/992px-Cagliari_Calcio_1920.svg.png?size=256",
  },
  {
    names: ["hellas verona", "verona"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Hellas_Verona_FC_logo_%282020%29.svg/1176px-Hellas_Verona_FC_logo_%282020%29.svg.png?size=256",
  },
  {
    names: ["salernitana"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/US_Salernitana_1919_logo.svg/1200px-US_Salernitana_1919_logo.svg.png?size=256",
  },
  {
    names: ["frosinone"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Frosinone_Calcio_logo.svg/1056px-Frosinone_Calcio_logo.svg.png?size=256",
  },
  {
    names: ["paris saint germain", "psg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png?size=256",
  },
  {
    names: ["marseille", "olympique marseille", "om"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Olympique_Marseille_logo.svg/927px-Olympique_Marseille_logo.svg.png?size=256",
  },
  {
    names: ["lyon", "olympique lyon", "olympique lyonnais", "ol"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/167.png?size=256",
  },
  {
    names: ["monaco", "as monaco"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/LogoASMonacoFC2021.svg/692px-LogoASMonacoFC2021.svg.png?size=256",
  },
  {
    names: ["lille", "losc lille"],
    source: "https://1000logos.net/wp-content/uploads/2020/09/Lille-Olympique-logo.png?size=256",
  },
  {
    names: ["nice", "ogc nice"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/2502.png?size=256",
  },
  {
    names: ["rennes", "stade rennais"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Stade_Rennais_FC.svg/983px-Stade_Rennais_FC.svg.png?size=256",
  },
  {
    names: ["montpellier"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Montpellier_HSC_logo.svg/1200px-Montpellier_HSC_logo.svg.png?size=256",
  },
  {
    names: ["strasbourg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Racing_Club_de_Strasbourg_logo.svg/1200px-Racing_Club_de_Strasbourg_logo.svg.png?size=256",
  },
  {
    names: ["reims"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3243.png?size=256",
  },
  {
    names: ["brest"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Stade_Brestois_29_logo.svg/990px-Stade_Brestois_29_logo.svg.png?size=256",
  },
  {
    names: ["toulouse"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Toulouse_FC_2018_logo.svg/1200px-Toulouse_FC_2018_logo.svg.png?size=256",
  },
  {
    names: ["nantes"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/165.png?size=256",
  },
  {
    names: ["lorient"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/273.png?size=256",
  },
  {
    names: ["metz"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/FC_Metz_2021_Logo.svg/839px-FC_Metz_2021_Logo.svg.png?size=256",
  },
  {
    names: ["clermont", "clermont foot"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Clermont_Foot_logo.svg/1015px-Clermont_Foot_logo.svg.png?size=256",
  },
  {
    names: ["lens"],
    source: "hthttps://upload.wikimedia.org/wikipedia/en/thumb/c/cc/RC_Lens_logo.svg/893px-RC_Lens_logo.svg.png?size=256",
  },
  {
    names: ["angers"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Angers_SCO_logo.svg/1006px-Angers_SCO_logo.svg.png?size=256",
  },
  {
    names: ["auxerre"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500/172.png?size=256",
  },
  // Liga 1 Indonesia
  {
    names: ["arema", "arema fc", "arema malang"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Arema_FC_2017_logo.svg/1072px-Arema_FC_2017_logo.svg.png?size=256",
  },
  {
    names: ["bali united", "bali united fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/5/5e/Bali_United_logo.svg/881px-Bali_United_logo.svg.png?size=256",
  },
  {
    names: ["borneo fc", "borneo fc samarinda", "borneo samarinda"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/4/4d/Logo_Borneo_FC.svg/932px-Logo_Borneo_FC.svg.png?size=256",
  },
  {
    names: ["dewa united", "dewa united fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/5/53/Dewa_United_FC.png?size=256",
  },
  {
    names: ["madura united", "madura united fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/8/8a/Madura_United_FC.png?size=256",
  },
  {
    names: ["persib", "persib bandung"],
    source: "https://upload.wikimedia.org/wikipedia/en/8/85/Persib_Bandung_Football_Logo.png?size=256",
  },
  {
    names: ["persija", "persija jakarta"],
    source: "https://upload.wikimedia.org/wikipedia/id/9/94/Persija_Jakarta_logo.png?size=256",
  },
  {
    names: ["persebaya", "persebaya surabaya"],
    source: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi23-kQDXzE8u2w6bCdzqSXmLo3YzMgNIPb908jPISefuDc-8Jay3_9XF_uFKO9Fwov3ec_WfYZRKU8GTAR7JFK2GPk9o11svcnAEvw1Aeqg89-FS3fZWQTBUHUN79iy2j_tLeCnsPfH06lm3XcEKK9uR0Mml12ru4Ri4suP1Th0WL2_zu6lwe-uA/w265-h320/Persebaya%20Surabaya%20Logo.png?size=256",
  },
  {
    names: ["psm", "psm makassar"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/PSS_Sleman_logo.svg/1001px-PSS_Sleman_logo.svg.png?size=256",
  },
  {
    names: ["psis", "psis semarang"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/f/f5/PSIS_logo.svg/762px-PSIS_logo.svg.png?size=256",
  },
  {
    names: ["pss", "pss sleman"],
    source: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwtCg3nlC9tn8nczCAaUDZCVYv0335hyphenhyphenEuHqwkqf4Hm9uRS2xmvGOdR_7dKA5RvBCpOILyiJUm3L4B3ggr-GuAbRh2TzTQtOPps0X-5iTI3UjZ9m7jMxXWm2xgNe9FxobwEGDf0rYt_DE/s2048/Logo+PSS+%2528Persatuan+Sepak+bola+Sleman%2529.png?size=256",
  },
  {
    names: ["persik", "persik kediri"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Persik_Kediri_logo.svg/1200px-Persik_Kediri_logo.svg.png?size=256",
  },
  {
    names: ["persis", "persis solo"],
    source: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwTeStOozJyWuO7Z9hFpB-NqGlMH4XsYs9cWmkcPv0DnPbSJljVBA9fhj2Wr_whHunYUH5mf3_-ZLQYfPLCHEq1UN8N0lCsqLycLHcfIXI9Dm3jMI6nbI4YWK8lTcra4H0FLEVNFfaN5sHvwmRRoMns7LXREvRWJ7zT7YqmrPipPm_L-7cWrPw2w/w320-h320/Persis%20Solo.png?size=256",
  },
  {
    names: ["persita", "persita tangerang"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/9/95/Persita_logo_%282020%29.svg/1000px-Persita_logo_%282020%29.svg.png?size=256",
  },
  {
    names: ["barito putera", "ps barito putera"],
    source: "https://upload.wikimedia.org/wikipedia/id/b/b8/Barito_Putera_logo.png?size=256",
  },
  {
    names: ["rans nusantara", "rans fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/6/6f/RANS_Nusantara_FC_logo_baru.svg/1200px-RANS_Nusantara_FC_logo_baru.svg.png?size=256",
  },
  {
    names: ["bhayangkara", "bhayangkara fc", "bhayangkara presisi"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Bhayangkara_FC_logo.svg/822px-Bhayangkara_FC_logo.svg.png?size=256",
  },
  {
    names: ["psbs", "psbs biak"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/9/9b/Logo_PSBS_Biak_baru.png/250px-Logo_PSBS_Biak_baru.png?size=256",
  },
  {
    names: ["semen padang"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Semen_Padang_FC_logo.svg/1200px-Semen_Padang_FC_logo.svg.png?size=256",
  },
  // FIFA U-17 World Cup 2023 flag fallbacks
  {
    names: ["indonesia", "indonesia u17", "indonesia u-17", "timnas indonesia", "timnas indonesia u17"],
    source: "https://flagcdn.com/w320/id.png",
  },
  {
    names: ["brasil", "brazil", "timnas brasil", "brasil u17", "brazil u17"],
    source: "https://flagcdn.com/w320/br.png",
  },
  {
    names: ["inggris", "england", "timnas inggris", "inggris u17", "england u17"],
    source: "https://flagcdn.com/w320/gb.png",
  },
  {
    names: ["prancis", "perancis", "france", "timnas prancis", "prancis u17"],
    source: "https://flagcdn.com/w320/fr.png",
  },
  {
    names: ["jepang", "japan", "timnas jepang", "jepang u17"],
    source: "https://flagcdn.com/w320/jp.png",
  },
  {
    names: ["meksiko", "mexico", "timnas meksiko", "meksiko u17"],
    source: "https://flagcdn.com/w320/mx.png",
  },
  {
    names: ["selandia baru", "new zealand", "timnas selandia baru", "selandia baru u17", "new zealand u17"],
    source: "https://flagcdn.com/w320/nz.png",
  },
  {
    names: ["korea selatan", "korsel", "korea republic", "south korea", "korea selatan u17"],
    source: "https://flagcdn.com/w320/kr.png",
  },
  {
    names: ["spanyol", "spain", "timnas spanyol", "spanyol u17"],
    source: "https://flagcdn.com/w320/es.png",
  },
  {
    names: ["amerika serikat", "usa", "timnas amerika serikat", "amerika serikat u17", "united states u17"],
    source: "https://flagcdn.com/w320/us.png",
  },
  {
    names: ["kanada", "canada", "timnas kanada", "kanada u17"],
    source: "https://flagcdn.com/w320/ca.png",
  },
  {
    names: ["jerman", "germany", "timnas jerman", "jerman u17"],
    source: "https://flagcdn.com/w320/de.png",
  },
  {
    names: ["argentina", "timnas argentina", "argentina u17"],
    source: "https://flagcdn.com/w320/ar.png",
  },
  {
    names: ["senegal", "timnas senegal", "senegal u17"],
    source: "https://flagcdn.com/w320/sn.png",
  },
  {
    names: ["mali", "timnas mali", "mali u17"],
    source: "https://flagcdn.com/w320/ml.png",
  },
  {
    names: ["burkina faso", "timnas burkina faso", "burkina faso u17"],
    source: "https://flagcdn.com/w320/bf.png",
  },
  {
    names: ["maroko", "morocco", "timnas maroko", "maroko u17"],
    source: "https://flagcdn.com/w320/ma.png",
  },
  {
    names: ["ekuador", "ecuador", "timnas ekuador", "ekuador u17"],
    source: "https://flagcdn.com/w320/ec.png",
  },
  {
    names: ["panama", "timnas panama", "panama u17"],
    source: "https://flagcdn.com/w320/pa.png",
  },
  {
    names: ["uzbekistan", "timnas uzbekistan", "uzbekistan u17"],
    source: "https://flagcdn.com/w320/uz.png",
  },
  {
    names: ["polandia", "poland", "timnas polandia", "polandia u17"],
    source: "https://flagcdn.com/w320/pl.png",
  },
  {
    names: ["venezuela", "timnas venezuela", "venezuela u17"],
    source: "https://flagcdn.com/w320/ve.png",
  },
  {
    names: ["iran", "timnas iran", "iran u17"],
    source: "https://flagcdn.com/w320/ir.png",
  },
  {
    names: ["kaledonia baru", "new caledonia", "timnas kaledonia baru", "kaledonia baru u17"],
    source: "https://flagcdn.com/w320/nc.png",
  },
];

const TEAM_AUTO_LOGO_LOOKUP = TEAM_AUTO_LOGO_SOURCES.reduce((acc, entry) => {
  entry.names.forEach((name) => {
    const key = normalizeTeamName(name);
    if (key) {
      acc[key] = entry.source;
    }
  });
  return acc;
}, {});

const TEAM_LOGO_IMAGE_CACHE = new Map();

const getAutoTeamLogoSrc = (teamName) => {
  const normalized = normalizeTeamName(teamName);
  if (!normalized) return "";
  return TEAM_AUTO_LOGO_LOOKUP[normalized] || "";
};

export const resolveAutoTeamLogoSrc = (teamName) => getAutoTeamLogoSrc(teamName);

const BRAND_NAMES = [
  "303VIP",
  "7METER",
  "ADOBET88",
  "AIRASIABET",
  "BIGDEWA",
  "BOLA88",
  "DEWABET",
  "DEWACASH",
  "DEWAGG",
  "DEWAHUB",
  "DEWASCORE",
  "GOLBOS",
  "IDNGOAL",
  "JAVAPLAY88",
  "KLIKFIFA",
  "KOINVEGAS",
  "MESINGG",
  "NYALABET",
  "PLAYSLOTS88",
  "PROPLAY88",
  "SIGAPBET",
  "SKOR88",
  "TIGERASIA88",
  "VEGASSLOTS",
];

const ESPORT_GAME_OPTIONS = [
  { label: "Age of Empires", value: "assets/ESPORT/logo_game/AGE_OF_EMPIRES.webp" },
  { label: "AOV", value: "assets/ESPORT/logo_game/AOV.webp" },
  { label: "Apex Legends", value: "assets/ESPORT/logo_game/APEX_LEGENDS.webp" },
  { label: "Brawl Stars", value: "assets/ESPORT/logo_game/BRAWL_STARS.webp" },
  { label: "Call of Duty", value: "assets/ESPORT/logo_game/CALL_OF_DUTY.webp" },
  { label: "Call of Duty Mobile", value: "assets/ESPORT/logo_game/CALL_OF_DUTY_MOBILE.webp" },
  { label: "Counter Strike", value: "assets/ESPORT/logo_game/COUNTER_STRIKE.webp" },
  { label: "Crossfire", value: "assets/ESPORT/logo_game/CROSSFIRE.webp" },
  { label: "Dota 2", value: "assets/ESPORT/logo_game/DOTA_2.webp" },
  { label: "FIFA", value: "assets/ESPORT/logo_game/FIFA.webp" },
  { label: "King of Glory", value: "assets/ESPORT/logo_game/KING_OF_GLORY.webp" },
  { label: "League of Legends", value: "assets/ESPORT/logo_game/LOL.webp" },
  { label: "League of Legends: Wild Rift", value: "assets/ESPORT/logo_game/LOL_WILD_RIFT.webp" },
  { label: "Mobile Legends", value: "assets/ESPORT/logo_game/MOBILE_LEGENDS.webp" },
  { label: "NBA 2K", value: "assets/ESPORT/logo_game/NBA_2K.webp" },
  { label: "Overwatch", value: "assets/ESPORT/logo_game/OVERWATCH.webp" },
  { label: "PUBG", value: "assets/ESPORT/logo_game/PUBG.webp" },
  { label: "PUBG Mobile", value: "assets/ESPORT/logo_game/PUBG_MOBILE.webp" },
  { label: "Rainbow Six Siege", value: "assets/ESPORT/logo_game/RAINBOW_SIX_SIEGE.webp" },
  { label: "Rocket League", value: "assets/ESPORT/logo_game/ROCKET_LEAGUE.webp" },
  { label: "StarCraft 2", value: "assets/ESPORT/logo_game/STARCRAFT_2.webp" },
  { label: "StarCraft: Brood War", value: "assets/ESPORT/logo_game/STARCRAFT_BROOD_WAR.webp" },
  { label: "Valorant", value: "assets/ESPORT/logo_game/VALORANT.webp" },
  { label: "Warcraft 3", value: "assets/ESPORT/logo_game/WARCRAFT_3.webp" },
];

const ESPORT_MINI_BANNER_FOOTER = "assets/ESPORT/mini_banner_footer/MINI_BANNER_FOOTER.webp";

const BANNER_BACKGROUND_FILES = (() => {
  const baseList = ["assets/BOLA/banner_background/BACKGROUND.webp"];
  const brandBackgrounds = BRAND_NAMES.map(
    (brandName) => `assets/BOLA/banner_background/${brandName}.webp`
  );
  return [...baseList, ...brandBackgrounds];
})();

const BANNER_BACKGROUND_LOOKUP = BANNER_BACKGROUND_FILES.reduce((acc, path) => {
  const fileName = path.split("/").pop() || "";
  const baseName = fileName.includes(".")
    ? fileName.slice(0, fileName.lastIndexOf("."))
    : fileName;
  if (baseName) {
    acc[baseName.toUpperCase()] = path;
  }
  return acc;
}, {});

if (BANNER_BACKGROUND_LOOKUP.BACKGROUND && !BANNER_BACKGROUND_LOOKUP.DEFAULT) {
  BANNER_BACKGROUND_LOOKUP.DEFAULT = BANNER_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return BANNER_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  return (
    BANNER_BACKGROUND_LOOKUP[brandName.toUpperCase()] ||
    BANNER_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const BASKETBALL_BRAND_BACKGROUND_DIRECTORY = "assets/BASKET/banner_background";
const BASKETBALL_BRAND_BACKGROUND_LOOKUP = BRAND_NAMES.reduce(
  (acc, brandName) => {
    if (!acc.BACKGROUND) {
      acc.BACKGROUND = `${BASKETBALL_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp`;
    }
    const normalizedKey = brandName && typeof brandName === "string" ? brandName.toUpperCase() : "";
    if (normalizedKey) {
      acc[normalizedKey] = `${BASKETBALL_BRAND_BACKGROUND_DIRECTORY}/${brandName}.webp`;
    }
    return acc;
  },
  { BACKGROUND: `${BASKETBALL_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp` }
);

if (
  BASKETBALL_BRAND_BACKGROUND_LOOKUP.BACKGROUND &&
  !BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT
) {
  BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT =
    BASKETBALL_BRAND_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveBasketballBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  const key = brandName.toUpperCase();
  return (
    BASKETBALL_BRAND_BACKGROUND_LOOKUP[key] ||
    BASKETBALL_BRAND_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const ESPORT_BRAND_BACKGROUND_DIRECTORY = "assets/ESPORT/banner_background";
const ESPORT_BRAND_BACKGROUND_LOOKUP = BRAND_NAMES.reduce(
  (acc, brandName) => {
    if (!acc.BACKGROUND) {
      acc.BACKGROUND = `${ESPORT_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp`;
    }
    const normalizedKey = brandName && typeof brandName === "string" ? brandName.toUpperCase() : "";
    if (normalizedKey) {
      acc[normalizedKey] = `${ESPORT_BRAND_BACKGROUND_DIRECTORY}/${brandName}.webp`;
    }
    return acc;
  },
  { BACKGROUND: `${ESPORT_BRAND_BACKGROUND_DIRECTORY}/BACKGROUND.webp` }
);

if (ESPORT_BRAND_BACKGROUND_LOOKUP.BACKGROUND && !ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT) {
  ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT = ESPORT_BRAND_BACKGROUND_LOOKUP.BACKGROUND;
}

const resolveEsportBrandBackgroundPath = (brandName) => {
  if (!brandName) {
    return ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT || null;
  }
  const key = brandName.toUpperCase();
  return (
    ESPORT_BRAND_BACKGROUND_LOOKUP[key] ||
    ESPORT_BRAND_BACKGROUND_LOOKUP.DEFAULT ||
    null
  );
};

const BRAND_ASSET_ENTRIES = BRAND_NAMES.map((brandName) => {
  const footballBackgroundPath = resolveBrandBackgroundPath(brandName);
  const basketballBackgroundPath = resolveBasketballBrandBackgroundPath(brandName);
  const esportsBackgroundPath = resolveEsportBrandBackgroundPath(brandName);
  return {
    name: brandName,
    headerPath: `assets/BRAND/${brandName}.webp`,
    footerPath: `assets/BOLA/banner_footer/${brandName}.webp`,
    backgroundPath: footballBackgroundPath,
    backgroundByMode: {
      football: footballBackgroundPath,
      basketball: basketballBackgroundPath,
      esports: esportsBackgroundPath,
    },
  };
});

const BRAND_LOGO_OPTIONS = BRAND_ASSET_ENTRIES.map((entry) => ({
  label: entry.name,
  value: entry.headerPath,
  brand: entry.name,
  footerValue: entry.footerPath,
  backgroundValue: entry.backgroundPath,
  backgroundByMode: entry.backgroundByMode,
}));

const BANNER_FOOTER_OPTIONS = BRAND_ASSET_ENTRIES.map((entry) => ({
  label: entry.name,
  value: entry.footerPath,
  brand: entry.name,
  headerValue: entry.headerPath,
}));

export const createInitialMatches = (count) => {
  const today = new Date();
  const formatDateISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return Array.from({ length: count }).map(() => {
    const matchDate = new Date(today);
    const homeName = "";
    const awayName = "";
    const homeLogo = "";
    const awayLogo = "";
    return {
      teamHome: homeName,
      teamAway: awayName,
      date: formatDateISO(matchDate),
      time: "18:30",
      gameLogo: null,
      gameName: "",
      teamHomeLogo: homeLogo || null,
      teamHomeLogoIsAuto: false,
      teamHomeLogoScale: 1,
      teamHomeLogoOffsetX: 0,
      teamHomeLogoOffsetY: 0,
      teamAwayLogo: awayLogo || null,
      teamAwayLogoIsAuto: false,
      teamAwayLogoScale: 1,
      teamAwayLogoOffsetX: 0,
      teamAwayLogoOffsetY: 0,
      scoreHome: "0",
      scoreAway: "0",
      teamHomePlayerImage: null,
      teamAwayPlayerImage: null,
      teamHomePlayerScale: 1,
      teamHomePlayerOffsetX: 0,
      teamHomePlayerOffsetY: 0,
      teamAwayPlayerScale: 1,
      teamAwayPlayerOffsetX: 0,
      teamAwayPlayerOffsetY: 0,
    };
  });
};

export const readFileAsDataURL = (
  file,
  { maxDimension = 640, outputType = "image/png" } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const finalizeWithFileReader = () => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    };

    loadImage(objectUrl)
      .then((image) => {
        URL.revokeObjectURL(objectUrl);
        const maxSide = Math.max(image.width, image.height);
        if (!maxSide || maxSide <= maxDimension) {
          finalizeWithFileReader();
          return;
        }
        const scale = maxDimension / maxSide;
        const targetWidth = Math.max(1, Math.round(image.width * scale));
        const targetHeight = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL(outputType));
      })
      .catch((error) => {
        console.warn("Gagal mengoptimasi gambar upload, pakai ukuran asli.", error);
        URL.revokeObjectURL(objectUrl);
        finalizeWithFileReader();
      });
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const attemptLoad = (useCrossOrigin = true) => {
      const img = new Image();
      if (
        useCrossOrigin &&
        typeof src === "string" &&
        src &&
        !src.startsWith("data:") &&
        !src.startsWith("blob:")
      ) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        if (useCrossOrigin) {
          attemptLoad(false);
          return;
        }
        reject(error);
      };
      img.src = src;
    };
    attemptLoad(true);
  });

export const loadOptionalImage = async (src) => {
  if (!src) return null;
  try {
    return await loadImage(src);
  } catch (error) {
    console.warn("Gagal memuat gambar opsional:", src, error);
    return null;
  }
};

const createWorkingCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  return { canvas, context };
};

const calculateCornerBackground = (imageData, width, height) => {
  const samplePoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
  ];

  const totals = { r: 0, g: 0, b: 0 };
  let count = 0;

  for (const [x, y] of samplePoints) {
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const index = (y * width + x) * 4;
    const alpha = imageData.data[index + 3];
    if (alpha < 255) continue;
    totals.r += imageData.data[index];
    totals.g += imageData.data[index + 1];
    totals.b += imageData.data[index + 2];
    count += 1;
  }

  if (count === 0) {
    return null;
  }

  return {
    r: totals.r / count,
    g: totals.g / count,
    b: totals.b / count,
  };
};

const calculateColorDistance = (colorA, colorB) => {
  const dr = colorA.r - colorB.r;
  const dg = colorA.g - colorB.g;
  const db = colorA.b - colorB.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const findOpaqueBounds = (imageData, width, height) => {
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = imageData.data[index + 3];
      if (alpha > 20) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) {
    return null;
  }

  return {
    x: Math.max(0, minX - 2),
    y: Math.max(0, minY - 2),
    width: Math.min(width, maxX + 2) - Math.max(0, minX - 2),
    height: Math.min(height, maxY + 2) - Math.max(0, minY - 2),
  };
};

const ensureTransparentBackground = async (image) => {
  try {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return image;

    const { canvas, context } = createWorkingCanvas(width, height);
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);

    let alreadyTransparent = false;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 255) {
        alreadyTransparent = true;
        break;
      }
    }
    if (alreadyTransparent) {
      return image;
    }

    const backgroundColor = calculateCornerBackground(imageData, width, height);
    if (!backgroundColor) {
      return image;
    }

    const brightness =
      (backgroundColor.r + backgroundColor.g + backgroundColor.b) / 3;
    if (brightness < 205) {
      return image;
    }

    const toleranceBase = 36;
    const tolerance =
      brightness > 245 ? toleranceBase * 0.75 : toleranceBase * 1.4;
    const whiteCutoff = Math.max(230, brightness - 6);
    const softRange = tolerance * 1.6;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const current = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };
      const distance = calculateColorDistance(current, backgroundColor);
      const luma = (current.r + current.g + current.b) / 3;
      if (distance <= tolerance || luma >= whiteCutoff) {
        imageData.data[i + 3] = 0;
      } else if (distance <= softRange) {
        const normalized = Math.min(
          1,
          Math.max(0, (distance - tolerance) / (softRange - tolerance))
        );
        imageData.data[i + 3] = Math.round(
          imageData.data[i + 3] * normalized * normalized
        );
      }
    }

    // Bersihkan noise alpha rendah agar tidak menyisakan halo abu-abu
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 24) {
        imageData.data[i] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    const bounds = findOpaqueBounds(imageData, width, height);
    if (!bounds) {
      return image;
    }

    const squareSize = Math.max(bounds.width, bounds.height);
    const squareCanvas = document.createElement("canvas");
    squareCanvas.width = squareSize;
    squareCanvas.height = squareSize;
    const squareContext = squareCanvas.getContext("2d");
    squareContext.clearRect(0, 0, squareSize, squareSize);
    squareContext.drawImage(
      canvas,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      (squareSize - bounds.width) / 2,
      (squareSize - bounds.height) / 2,
      bounds.width,
      bounds.height
    );

    const dataUrl = squareCanvas.toDataURL("image/png");
    const processedImage = await loadImage(dataUrl);
    return processedImage;
  } catch (error) {
    console.warn("Gagal membersihkan latar belakang logo otomatis:", error);
    return image;
  }
};

const loadTeamLogoImage = async (src, { applyAutoProcessing = false } = {}) => {
  if (!src) return null;
  const cacheKey = `${applyAutoProcessing ? "auto" : "raw"}|${src}`;
  const cached = TEAM_LOGO_IMAGE_CACHE.get(cacheKey);
  if (cached) {
    if (cached instanceof Promise) {
      return cached;
    }
    return cached;
  }

  const loader = (async () => {
    const image = await loadOptionalImage(src);
    if (!image) return null;
    if (applyAutoProcessing) {
      return ensureTransparentBackground(image);
    }
    return image;
  })()
    .then((result) => {
      TEAM_LOGO_IMAGE_CACHE.set(cacheKey, result);
      return result;
    })
    .catch((error) => {
      TEAM_LOGO_IMAGE_CACHE.delete(cacheKey);
      throw error;
    });

  TEAM_LOGO_IMAGE_CACHE.set(cacheKey, loader);
  return loader;
};

const MATCH_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatDate = (dateString) => {
  if (!dateString) return "Tanggal TBD";
  const date = new Date(`${dateString}T00:00:00`);
  return MATCH_DATE_FORMATTER.format(date);
};

export const formatTime = (timeString) => {
  if (!timeString) return "Waktu TBD";
  return `${timeString} WIB`;
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

export const rgbToHex = (r, g, b) => {
  const toHex = (component) =>
    component.toString(16).padStart(2, "0");
  return `#${toHex(clamp(Math.round(r), 0, 255))}${toHex(
    clamp(Math.round(g), 0, 255)
  )}${toHex(clamp(Math.round(b), 0, 255))}`;
};

const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const mixColors = (baseHex, targetHex, amount) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const normalizedAmount = clamp(amount, 0, 1);
  const mixChannel = (channel) =>
    clamp(
      base[channel] +
        (target[channel] - base[channel]) * normalizedAmount,
      0,
      255
    );
  return rgbToHex(
    mixChannel("r"),
    mixChannel("g"),
    mixChannel("b")
  );
};

const lightenColor = (hex, amount) =>
  mixColors(hex, "#ffffff", clamp(amount, 0, 1));
const darkenColor = (hex, amount) =>
  mixColors(hex, "#000000", clamp(amount, 0, 1));

const colorDistance = (colorA, colorB) => {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
  );
};

const deriveBrandPalette = (image) => {
  if (!image) return DEFAULT_BRAND_PALETTE;
  try {
    const sampleSize = 96;
    const aspect = image.width / image.height || 1;
    const width = sampleSize;
    const height = Math.max(1, Math.round(sampleSize / aspect));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 160) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = `${r >> 3}-${g >> 3}-${b >> 3}`;
      let entry = buckets.get(key);
      if (!entry) {
        entry = { count: 0, r: 0, g: 0, b: 0 };
        buckets.set(key, entry);
      }
      entry.count += 1;
      entry.r += r;
      entry.g += g;
      entry.b += b;
    }

    const bucketArray = Array.from(buckets.values()).filter(
      (entry) => entry.count > 0
    );
    if (!bucketArray.length) {
      return DEFAULT_BRAND_PALETTE;
    }
    const enrichedBuckets = bucketArray
      .map((entry) => {
        const rAvg = entry.r / entry.count;
        const gAvg = entry.g / entry.count;
        const bAvg = entry.b / entry.count;
        const hex = rgbToHex(rAvg, gAvg, bAvg);
        const { s, l } = rgbToHsl(rAvg, gAvg, bAvg);
        return {
          count: entry.count,
          hex,
          saturation: s,
          lightness: l,
        };
      })
      .sort((a, b) => b.count - a.count);

    const vibrantCandidates = enrichedBuckets.filter(
      (entry) => entry.saturation >= 0.2 && entry.lightness >= 0.15 && entry.lightness <= 0.8
    );
    const candidates =
      vibrantCandidates.length > 0 ? vibrantCandidates : enrichedBuckets;

    const primaryEntry = candidates[0];
    const primary = primaryEntry?.hex ?? DEFAULT_BRAND_PALETTE.headerStart;

    let secondaryEntry =
      candidates.slice(1).find(
        (entry) => colorDistance(entry.hex, primary) >= 80
      ) ?? candidates[1];

    if (!secondaryEntry) {
      secondaryEntry = {
        hex: lightenColor(primary, 0.25),
        saturation: 1,
        lightness: 0.5,
      };
    }

    let secondary = secondaryEntry.hex;
    if (colorDistance(primary, secondary) < 60) {
      secondary = lightenColor(primary, 0.25);
    }

    const headerStart = lightenColor(primary, 0.05);
    const headerEnd = lightenColor(secondary, 0.12);
    const footerStart = lightenColor(primary, 0.12);
    const footerEnd = darkenColor(secondary, 0.18);
    const accent = lightenColor(secondary, 0.3);

    return {
      headerStart,
      headerEnd,
      footerStart,
      footerEnd,
      accent,
    };
  } catch (error) {
    console.warn("Gagal mengambil palet logo:", error);
    return DEFAULT_BRAND_PALETTE;
  }
};

const getInitials = (name) => {
  if (!name) return "FC";
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? words[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
};

export const applyFittedFont = (
  ctx,
  text,
  { maxSize, minSize = 12, weight = 600, maxWidth, family = '"Poppins", sans-serif' }
) => {
  let size = maxSize;
  const floor = Math.max(8, minSize);
  while (size > floor) {
    ctx.font = `${weight} ${Math.round(size)}px ${family}`;
    if (!maxWidth || ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  ctx.font = `${weight} ${Math.round(floor)}px ${family}`;
  return floor;
};

export const clampMin = (value, min) => Math.max(min, value);

export const drawLogoTile = (
  ctx,
  image,
  x,
  y,
  size,
  fallbackName,
  options = {}
) => {
  const radius = size / 2;
  const centerX = x + radius;
  const centerY = y + radius;
  const borderWidth = Math.max(2, size * 0.08);
  const {
    scale = 1,
    offsetX = 0,
    offsetY = 0,
    paddingRatio = 0.08,
  } = options || {};

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();

  if (image) {
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
    ctx.shadowBlur = Math.max(14, size * 0.4);
    ctx.shadowOffsetY = Math.max(4, size * 0.12);
    ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.clip();
    const usableSize = size * (1 - paddingRatio);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const baseScale =
      imageWidth && imageHeight
        ? Math.max(usableSize / imageWidth, usableSize / imageHeight)
        : 1;
    const effectiveScale = baseScale * clamp(scale ?? 1, 0.7, 1.5);
    const renderWidth =
      imageWidth && imageHeight ? imageWidth * effectiveScale : usableSize;
    const renderHeight =
      imageWidth && imageHeight ? imageHeight * effectiveScale : usableSize;
    const offsetLimit = usableSize * 0.5;
    const offsetXPx = clamp(offsetX ?? 0, -0.75, 0.75) * offsetLimit;
    const offsetYPx = clamp(offsetY ?? 0, -0.75, 0.75) * offsetLimit;
    const renderX = centerX - renderWidth / 2 + offsetXPx;
    const renderY = centerY - renderHeight / 2 + offsetYPx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      centerX - usableSize / 2,
      centerY - usableSize / 2,
      usableSize,
      usableSize
    );
    ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = borderWidth;
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.fillStyle = PLACEHOLDER_COLORS.fill;
    ctx.fill();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = PLACEHOLDER_COLORS.border;
    ctx.stroke();

    ctx.save();
    ctx.clip();
    ctx.fillStyle = PLACEHOLDER_COLORS.text;
    ctx.font = `700 ${size * 0.38}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(fallbackName), centerX, centerY);
    ctx.restore();
  }

  ctx.restore();
};

const APP_DATA_BUNDLE = {
  BRAND_LOGO_OPTIONS,
  BANNER_FOOTER_OPTIONS,
  BRAND_ASSET_ENTRIES,
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
  DEFAULT_BRAND_PALETTE,
  deriveBrandPalette,
  PLACEHOLDER_COLORS,
  normalizeTeamName,
  getAutoTeamLogoSrc,
  resolveAutoTeamLogoSrc,
  resolveAutoLogoSrc: resolveAutoTeamLogoSrc,
  loadTeamLogoImage,
  loadOptionalImage,
  createInitialMatches,
  readFileAsDataURL,
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
  TOGEL_POOL_OPTIONS,
};

AppEnvironment.setData(APP_DATA_BUNDLE);

export default APP_DATA_BUNDLE;
