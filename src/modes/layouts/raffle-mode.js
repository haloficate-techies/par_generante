import { CanvasUtils } from "../../utils/canvas-utils";
import AppEnvironment from "../../app/app-environment";

const { drawRaffleWinnersTable, drawRaffleDateCapsule } =
  typeof CanvasUtils === "object" ? CanvasUtils : window;

const renderRaffleModeLayout = ({
  ctx,
  matchesStartY = 0,
  brandPalette,
  raffleData = {},
}) => {
  if (!ctx || typeof drawRaffleWinnersTable !== "function") {
    return;
  }

  let contentStartY = matchesStartY;
  if (raffleData.eventLabel && typeof drawRaffleDateCapsule === "function") {
    const extraOffset = drawRaffleDateCapsule(ctx, raffleData.eventLabel, {
      startY: matchesStartY,
      palette: brandPalette,
    });
    contentStartY += extraOffset;
  }

  const winners = Array.isArray(raffleData.winners) ? raffleData.winners : [];
  drawRaffleWinnersTable(ctx, winners, {
    startY: contentStartY,
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
