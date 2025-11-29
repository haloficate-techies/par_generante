import { CanvasUtils } from "../../utils/canvas-utils";
import AppEnvironment from "../../app/app-environment";

const { drawRaffleWinnersTable } = typeof CanvasUtils === "object" ? CanvasUtils : window;

const renderRaffleModeLayout = ({
  ctx,
  matchesStartY = 0,
  brandPalette,
  raffleData = {},
}) => {
  if (!ctx || typeof drawRaffleWinnersTable !== "function") {
    return;
  }
  const winners = Array.isArray(raffleData.winners) ? raffleData.winners : [];
  drawRaffleWinnersTable(ctx, winners, {
    startY: matchesStartY,
    palette: brandPalette,
    info: raffleData.info || null,
  });
};

const registerLayouts = () => {
  const registry = AppEnvironment ? AppEnvironment.getModeRegistry() : null;
  const register = registry?.registerModeLayout;
  if (typeof register !== "function") return;
  register("raffle", { renderContent: renderRaffleModeLayout });
};

registerLayouts();

export default renderRaffleModeLayout;
