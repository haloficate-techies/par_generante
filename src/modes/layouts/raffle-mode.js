import AppEnvironment from "../../app/app-environment";
import {
  drawRaffleWinnersTable,
  drawRaffleDateCapsule,
} from "../../utils/canvas";

/**
 * Renders raffle mode layout with event capsule and winners table.
 *
 * @param {Object} params
 * @param {CanvasRenderingContext2D} params.ctx
 * @param {number} params.matchesStartY
 * @param {Object} params.brandPalette
 * @param {Object} params.raffleData
 * @param {string} params.raffleData.eventLabel
 * @param {Array} params.raffleData.winners
 * @param {Object} params.raffleData.info
 */
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

