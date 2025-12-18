import AppEnvironment from "../../app/app-environment";

const AppData = AppEnvironment.getData() || {};
const AppGlobals = AppEnvironment.getGlobals() || {};

const AVAILABLE_TOGEL_POOL_OPTIONS = Array.isArray(AppData.TOGEL_POOL_OPTIONS)
  ? AppData.TOGEL_POOL_OPTIONS
  : [];

const resolveTogelDrawTimeConfigImpl =
  typeof AppGlobals.resolveTogelDrawTimeConfig === "function"
    ? AppGlobals.resolveTogelDrawTimeConfig
    : null;

const resolveAutoLogoSrc =
  typeof AppData.resolveAutoLogoSrc === "function"
    ? AppData.resolveAutoLogoSrc
    : () => "";

const readFileAsDataURL =
  typeof AppData.readFileAsDataURL === "function"
    ? AppData.readFileAsDataURL
    : async () => null;

const AVAILABLE_LEAGUE_LOGO_OPTIONS = Array.isArray(AppGlobals.LEAGUE_LOGO_OPTIONS)
  ? AppGlobals.LEAGUE_LOGO_OPTIONS
  : [];

const DEFAULT_ESPORT_GAME_OPTIONS = [
  { label: "Age of Empires", value: "assets/ESPORT/logo_game/AGE_OF_EMPIRES.webp" },
  { label: "AOV", value: "assets/ESPORT/logo_game/AOV.webp" },
  { label: "Apex Legends", value: "assets/ESPORT/logo_game/APEX_LEGENDS.webp" },
  { label: "Brawl Stars", value: "assets/ESPORT/logo_game/BRAWL_STARS.webp" },
  { label: "Call of Duty", value: "assets/ESPORT/logo_game/CALL_OF_DUTY.webp" },
  {
    label: "Call of Duty Mobile",
    value: "assets/ESPORT/logo_game/CALL_OF_DUTY_MOBILE.webp",
  },
  { label: "Counter Strike", value: "assets/ESPORT/logo_game/COUNTER_STRIKE.webp" },
  { label: "Crossfire", value: "assets/ESPORT/logo_game/CROSSFIRE.webp" },
  { label: "Dota 2", value: "assets/ESPORT/logo_game/DOTA_2.webp" },
  { label: "FIFA", value: "assets/ESPORT/logo_game/FIFA.webp" },
  { label: "King of Glory", value: "assets/ESPORT/logo_game/KING_OF_GLORY.webp" },
  { label: "League of Legends", value: "assets/ESPORT/logo_game/LOL.webp" },
  {
    label: "League of Legends: Wild Rift",
    value: "assets/ESPORT/logo_game/LOL_WILD_RIFT.webp",
  },
  { label: "Mobile Legends", value: "assets/ESPORT/logo_game/MOBILE_LEGENDS.webp" },
  { label: "NBA 2K", value: "assets/ESPORT/logo_game/NBA_2K.webp" },
  { label: "Overwatch", value: "assets/ESPORT/logo_game/OVERWATCH.webp" },
  { label: "PUBG", value: "assets/ESPORT/logo_game/PUBG.webp" },
  { label: "PUBG Mobile", value: "assets/ESPORT/logo_game/PUBG_MOBILE.webp" },
  {
    label: "Rainbow Six Siege",
    value: "assets/ESPORT/logo_game/RAINBOW_SIX_SIEGE.webp",
  },
  { label: "Rocket League", value: "assets/ESPORT/logo_game/ROCKET_LEAGUE.webp" },
  { label: "StarCraft 2", value: "assets/ESPORT/logo_game/STARCRAFT_2.webp" },
  {
    label: "StarCraft: Brood War",
    value: "assets/ESPORT/logo_game/STARCRAFT_BROOD_WAR.webp",
  },
  { label: "Valorant", value: "assets/ESPORT/logo_game/VALORANT.webp" },
  { label: "Warcraft 3", value: "assets/ESPORT/logo_game/WARCRAFT_3.webp" },
];

const AVAILABLE_ESPORT_GAME_OPTIONS =
  Array.isArray(AppData.ESPORT_GAME_OPTIONS) && AppData.ESPORT_GAME_OPTIONS.length
    ? AppData.ESPORT_GAME_OPTIONS
    : DEFAULT_ESPORT_GAME_OPTIONS;

const getTogelDrawTimeConfig = (pool, variant) =>
  typeof resolveTogelDrawTimeConfigImpl === "function"
    ? resolveTogelDrawTimeConfigImpl(pool, variant)
    : { options: [] };

export const matchListFormEnv = {
  AVAILABLE_TOGEL_POOL_OPTIONS,
  AVAILABLE_LEAGUE_LOGO_OPTIONS,
  AVAILABLE_ESPORT_GAME_OPTIONS,
  resolveAutoLogoSrc,
  readFileAsDataURL,
  getTogelDrawTimeConfig,
};

export default matchListFormEnv;
