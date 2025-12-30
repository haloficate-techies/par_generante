import { premierLeagueTeams } from "./leagues/premier-league";
import { bundesligaTeams } from "./leagues/bundesliga";
import { laLigaTeams } from "./leagues/la-liga";
import { serieATeams } from "./leagues/serie-a";
import { ligue1Teams } from "./leagues/ligue-1";
import { belgianProLeagueTeams } from "./leagues/belgian-pro-league";
import { championshipTeams } from "./leagues/championship";
import { ligaPortugalTeams } from "./leagues/liga-portugal";
import { brasileiraoTeams } from "./leagues/brasileirao";
import { eredivisieTeams } from "./leagues/eredivisie";
import { mlsTeams } from "./leagues/mls";
import { ligaMxTeams } from "./leagues/liga-mx";
import { ligaArgentinaTeams } from "./leagues/liga-argentina";
import { jLeagueTeams } from "./leagues/j-league";
import { kLeagueTeams } from "./leagues/k-league";
import { saudiProLeagueTeams } from "./leagues/saudi-pro-league";
import { aLeagueTeams } from "./leagues/a-league";
import { nbaTeams } from "./leagues/nba";
import { superLigTeams } from "./leagues/super-lig";
import { danishSuperligaTeams } from "./leagues/danish-superliga";
import {
  championsLeagueTeams,
  europaConferenceLeagueTeams,
  europaLeagueTeams,
  uefaCompetitionTeams,
} from "./leagues/uefa-competitions";
import { liga1IndonesiaTeams } from "./leagues/liga-1-indonesia";
import { nationalTeamFallbacks } from "./leagues/national-teams";

const TEAM_AUTO_LOGO_SOURCES = [
  ...premierLeagueTeams,
  ...bundesligaTeams,
  ...laLigaTeams,
  ...serieATeams,
  ...ligue1Teams,
  ...belgianProLeagueTeams,
  ...championshipTeams,
  ...ligaPortugalTeams,
  ...brasileiraoTeams,
  ...eredivisieTeams,
  ...mlsTeams,
  ...ligaMxTeams,
  ...ligaArgentinaTeams,
  ...jLeagueTeams,
  ...kLeagueTeams,
  ...saudiProLeagueTeams,
  ...aLeagueTeams,
  ...nbaTeams,
  ...superLigTeams,
  ...danishSuperligaTeams,
  ...uefaCompetitionTeams,
  ...liga1IndonesiaTeams,
  ...nationalTeamFallbacks,
];

export {
  aLeagueTeams,
  belgianProLeagueTeams,
  brasileiraoTeams,
  bundesligaTeams,
  championsLeagueTeams,
  championshipTeams,
  danishSuperligaTeams,
  eredivisieTeams,
  europaConferenceLeagueTeams,
  europaLeagueTeams,
  jLeagueTeams,
  kLeagueTeams,
  laLigaTeams,
  liga1IndonesiaTeams,
  ligaArgentinaTeams,
  ligaMxTeams,
  ligaPortugalTeams,
  ligue1Teams,
  mlsTeams,
  nationalTeamFallbacks,
  nbaTeams,
  premierLeagueTeams,
  saudiProLeagueTeams,
  serieATeams,
  superLigTeams,
  uefaCompetitionTeams,
};

export default TEAM_AUTO_LOGO_SOURCES;

