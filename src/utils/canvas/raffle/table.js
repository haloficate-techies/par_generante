import { DEFAULT_BRAND_PALETTE } from "../constants";
import {
  drawRoundedRectPath,
  fillRoundedRectCached,
} from "../geometry";
import { ensureSubduedGradientColor } from "../color";
import { formatRupiah } from "./format";

export const drawRaffleWinnersTable = (
  ctx,
  winners = [],
  { startY = 0, palette = DEFAULT_BRAND_PALETTE, maxRows = 20 } = {}
) => {
  if (!ctx) return;
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const panelPaddingX = Math.max(48, canvasWidth * 0.075);
  const panelWidth = canvasWidth - panelPaddingX * 2;
  const panelX = panelPaddingX;
  const topSpacing = startY + 12;
  const footerGuard = 130;
  const rawHeight = canvasHeight - topSpacing - footerGuard;
  const panelHeight = Math.max(320, rawHeight);
  const panelY = topSpacing;
  const innerPadding = Math.max(24, panelWidth * 0.03);

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 22;
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, 32);
  ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, 32);
  const gradient = ctx.createLinearGradient(
    panelX,
    panelY,
    panelX,
    panelY + panelHeight
  );
  gradient.addColorStop(
    0,
    palette?.headerStart || DEFAULT_BRAND_PALETTE.headerStart
  );
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();

  const safeWinners = Array.isArray(winners)
    ? winners.slice(0, Math.max(1, maxRows))
    : [];
  if (!safeWinners.length) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#cbd5f5";
    ctx.font = "500 26px Poppins";
    ctx.fillText(
      "Data pemenang belum tersedia",
      panelX + panelWidth / 2,
      panelY + panelHeight / 2
    );
    ctx.restore();
    return;
  }

  const chunkSize = 10;
  const totalColumns = Math.min(2, Math.ceil(safeWinners.length / chunkSize));
  const columnGap = totalColumns > 1 ? Math.max(36, panelWidth * 0.04) : 0;
  const columnWidth =
    (panelWidth - innerPadding * 2 - columnGap * (totalColumns - 1)) /
    totalColumns;
  const rowsPerColumn = chunkSize;
  const headerBarHeight = Math.max(32, Math.min(panelHeight * 0.11, 58));
  const availableHeight = panelHeight - innerPadding * 2;
  const headerSpacing = Math.max(18, headerBarHeight * 0.35);
  const preferredRowHeight = Math.min(78, Math.max(56, panelHeight * 0.055));
  let rowHeight = preferredRowHeight;
  let contentHeight =
    headerBarHeight + headerSpacing + rowHeight * rowsPerColumn;
  if (contentHeight > availableHeight) {
    rowHeight = Math.max(
      40,
      (availableHeight - headerBarHeight - headerSpacing) / rowsPerColumn
    );
    contentHeight =
      headerBarHeight + headerSpacing + rowHeight * rowsPerColumn;
  }
  const contentOffset = Math.max(0, (availableHeight - contentHeight) / 2);
  const rowRadius = Math.min(22, rowHeight / 2.4);
  const headerFontSize = Math.max(20, rowHeight * 0.38);
  const usernameTextColor = "#f8fafc";
  const headerBarX = panelX + innerPadding;
  const headerBarWidth = panelWidth - innerPadding * 2;
  const headerBarY = panelY + innerPadding + contentOffset;
  const headerBarRadius = Math.min(20, headerBarHeight / 2.4);
  const rowsStartY = headerBarY + headerBarHeight + headerSpacing;

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.3)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  drawRoundedRectPath(
    ctx,
    headerBarX,
    headerBarY,
    headerBarWidth,
    headerBarHeight,
    headerBarRadius
  );
  ctx.restore();

  ctx.save();
  const headerGradient = ctx.createLinearGradient(
    headerBarX,
    headerBarY,
    headerBarX,
    headerBarY + headerBarHeight
  );
  headerGradient.addColorStop(
    0,
    ensureSubduedGradientColor(palette?.headerStart, "#fcd34d", 0.45)
  );
  headerGradient.addColorStop(
    1,
    ensureSubduedGradientColor(palette?.headerEnd, "#d97706", 0.45)
  );
  ctx.fillStyle = headerGradient;
  ctx.fill();
  ctx.save();
  drawRoundedRectPath(
    ctx,
    headerBarX,
    headerBarY,
    headerBarWidth,
    headerBarHeight,
    headerBarRadius
  );
  ctx.clip();
  const bevelGradient = ctx.createLinearGradient(
    headerBarX,
    headerBarY,
    headerBarX,
    headerBarY + headerBarHeight
  );
  bevelGradient.addColorStop(0, "rgba(255,255,255,0.65)");
  bevelGradient.addColorStop(0.4, "rgba(255,255,255,0.12)");
  bevelGradient.addColorStop(0.6, "rgba(0,0,0,0.08)");
  bevelGradient.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = bevelGradient;
  ctx.fillRect(headerBarX, headerBarY, headerBarWidth, headerBarHeight);
  ctx.restore();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.save();
  ctx.textBaseline = "middle";

  for (let columnIndex = 0; columnIndex < totalColumns; columnIndex += 1) {
    const columnX =
      panelX + innerPadding + columnIndex * (columnWidth + columnGap);
    const columnHeaderY = headerBarY + headerBarHeight / 2;

    ctx.font = `600 ${Math.round(headerFontSize)}px Poppins`;
    ctx.textAlign = "left";
    ctx.fillStyle = usernameTextColor;
    ctx.fillText("USERNAME", columnX + 16, columnHeaderY);
    ctx.textAlign = "right";
    ctx.fillText("NOMINAL", columnX + columnWidth - 16, columnHeaderY);

    const startIndex = columnIndex * chunkSize;
    const columnData = safeWinners.slice(startIndex, startIndex + chunkSize);
    columnData.forEach((winner, rowIndex) => {
      const rowTop = rowsStartY + rowIndex * rowHeight;
      const centerY = rowTop + rowHeight / 2;
      ctx.save();
      ctx.fillStyle =
        rowIndex % 2 === 0
          ? "rgba(15, 23, 42, 0.45)"
          : "rgba(15, 23, 42, 0.3)";
      fillRoundedRectCached(
        ctx,
        columnX,
        rowTop,
        columnWidth,
        rowHeight - 6,
        rowRadius
      );
      ctx.restore();

      const username =
        winner?.displayUsername ||
        winner?.username ||
        winner?.ticket_code ||
        `Pemenang ${startIndex + rowIndex + 1}`;
      const prizeAmountLabel =
        winner?.formattedPrizeAmount ||
        winner?.displayPrizeAmount ||
        formatRupiah(winner?.prize_amount);
      ctx.font = `600 ${Math.max(20, rowHeight * 0.42)}px Poppins`;
      ctx.textAlign = "left";
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(username, columnX + 12, centerY);

      ctx.textAlign = "right";
      ctx.fillStyle = "#6efacf";
      ctx.fillText(prizeAmountLabel, columnX + columnWidth - 12, centerY);
    });
  }

  ctx.restore();
};
