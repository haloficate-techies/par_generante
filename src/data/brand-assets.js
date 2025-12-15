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

const normalizeBrandKey = (brandName) =>
  typeof brandName === "string" && brandName ? brandName.toUpperCase() : "";

const createBrandBackgroundFiles = (directory) => {
  const baseBackground = `${directory}/BACKGROUND.webp`;
  const brandBackgrounds = BRAND_NAMES.map(
    (brandName) => `${directory}/${brandName}.webp`
  );
  return [baseBackground, ...brandBackgrounds];
};

const createBrandBackgroundLookup = (directory) => {
  const lookup = {
    BACKGROUND: `${directory}/BACKGROUND.webp`,
  };

  BRAND_NAMES.forEach((brandName) => {
    const key = normalizeBrandKey(brandName);
    if (key) {
      lookup[key] = `${directory}/${brandName}.webp`;
    }
  });

  if (lookup.BACKGROUND && !lookup.DEFAULT) {
    lookup.DEFAULT = lookup.BACKGROUND;
  }

  return lookup;
};

const createBrandBackgroundResolver = (lookup) => (brandName) => {
  if (!brandName) {
    return lookup.DEFAULT || null;
  }
  const key = normalizeBrandKey(brandName);
  return lookup[key] || lookup.DEFAULT || null;
};

const BANNER_BACKGROUND_DIRECTORY = "assets/BOLA/banner_background";
const BASKETBALL_BRAND_BACKGROUND_DIRECTORY = "assets/BASKET/banner_background";
const ESPORT_BRAND_BACKGROUND_DIRECTORY = "assets/ESPORT/banner_background";

const BANNER_BACKGROUND_FILES = createBrandBackgroundFiles(BANNER_BACKGROUND_DIRECTORY);
const BANNER_BACKGROUND_LOOKUP = BANNER_BACKGROUND_FILES.reduce((acc, path) => {
  const fileName = path.split("/").pop() || "";
  const baseName = fileName.includes(".") ? fileName.slice(0, fileName.lastIndexOf(".")) : fileName;
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

const BASKETBALL_BRAND_BACKGROUND_LOOKUP =
  createBrandBackgroundLookup(BASKETBALL_BRAND_BACKGROUND_DIRECTORY);
const resolveBasketballBrandBackgroundPath =
  createBrandBackgroundResolver(BASKETBALL_BRAND_BACKGROUND_LOOKUP);

const ESPORT_BRAND_BACKGROUND_LOOKUP =
  createBrandBackgroundLookup(ESPORT_BRAND_BACKGROUND_DIRECTORY);
const resolveEsportBrandBackgroundPath =
  createBrandBackgroundResolver(ESPORT_BRAND_BACKGROUND_LOOKUP);

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

export {
  BANNER_BACKGROUND_DIRECTORY,
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  BANNER_FOOTER_OPTIONS,
  BASKETBALL_BRAND_BACKGROUND_DIRECTORY,
  BASKETBALL_BRAND_BACKGROUND_LOOKUP,
  BRAND_ASSET_ENTRIES,
  BRAND_LOGO_OPTIONS,
  BRAND_NAMES,
  ESPORT_BRAND_BACKGROUND_DIRECTORY,
  ESPORT_BRAND_BACKGROUND_LOOKUP,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
  resolveBasketballBrandBackgroundPath,
  resolveBrandBackgroundPath,
  resolveEsportBrandBackgroundPath,
};

export default {
  BRAND_NAMES,
  ESPORT_GAME_OPTIONS,
  ESPORT_MINI_BANNER_FOOTER,
  BANNER_BACKGROUND_FILES,
  BANNER_BACKGROUND_LOOKUP,
  resolveBrandBackgroundPath,
  BASKETBALL_BRAND_BACKGROUND_LOOKUP,
  resolveBasketballBrandBackgroundPath,
  ESPORT_BRAND_BACKGROUND_LOOKUP,
  resolveEsportBrandBackgroundPath,
  BRAND_ASSET_ENTRIES,
  BRAND_LOGO_OPTIONS,
  BANNER_FOOTER_OPTIONS,
};
