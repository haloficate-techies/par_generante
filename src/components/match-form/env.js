import { TOGEL_POOL_OPTIONS, resolveTogelDrawTimeConfig } from "../../domains/togel";
import { ESPORT_GAME_OPTIONS } from "../../domains/brand";
import { getAutoTeamLogoSrc } from "../../domains/teams";
import { readFileAsDataURL } from "../../utils/image-loader";
import { LEAGUE_LOGO_OPTIONS } from "../../app/index.js";

const AVAILABLE_TOGEL_POOL_OPTIONS = Array.isArray(TOGEL_POOL_OPTIONS) ? TOGEL_POOL_OPTIONS : [];
const AVAILABLE_LEAGUE_LOGO_OPTIONS = Array.isArray(LEAGUE_LOGO_OPTIONS)
  ? LEAGUE_LOGO_OPTIONS
  : [];
const AVAILABLE_ESPORT_GAME_OPTIONS =
  Array.isArray(ESPORT_GAME_OPTIONS) && ESPORT_GAME_OPTIONS.length ? ESPORT_GAME_OPTIONS : [];
const resolveAutoLogoSrc = getAutoTeamLogoSrc;
const getTogelDrawTimeConfig = (pool, variant) =>
  typeof resolveTogelDrawTimeConfig === "function"
    ? resolveTogelDrawTimeConfig(pool, variant)
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
