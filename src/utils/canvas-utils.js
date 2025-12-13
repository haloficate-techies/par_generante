import { drawBackground, drawOverlay } from "./canvas/background";
import { drawBrandLogo, drawHeader } from "./canvas/header";
import {
  drawMatches,
  drawScoreboardMatches,
  drawBigMatchLayout,
} from "./canvas/matches";
import { drawTogelResult } from "./canvas/togel/index";
import {
  drawRaffleDateCapsule,
  drawRaffleWinnersTable,
} from "./canvas/raffle/index";
import { drawFooter, drawMiniFooterBanner } from "./canvas/footer";

export const CanvasUtils = {
  drawBackground,
  drawOverlay,
  drawBrandLogo,
  drawHeader,
  drawFooter,
  drawMiniFooterBanner,
  drawMatches,
  drawScoreboardMatches,
  drawBigMatchLayout,
  drawTogelResult,
  drawRaffleDateCapsule,
  drawRaffleWinnersTable,
};

if (typeof window !== "undefined") {
  Object.assign(window, CanvasUtils);
}
