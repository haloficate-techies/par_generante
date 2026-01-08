import { DEFAULT_BRAND_PALETTE } from "../constants";
import {
  drawRoundedRectPath,
  fillRoundedRectCached,
} from "../geometry";
import { formatRupiah } from "./format";
import { darkenColor, lightenColor, mixColors } from "../../color-utils";

const toRgba = (hex, alpha) => {
  if (!hex || typeof hex !== "string") return `rgba(0, 0, 0, ${alpha})`;
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const drawRaffleWinnersTable = (
  ctx,
  winners = [],
  { startY = 0, palette = DEFAULT_BRAND_PALETTE, maxRows = 20 } = {}
) => {
  if (!ctx) return;
  const paletteSafe = palette || DEFAULT_BRAND_PALETTE;
  const headerStart =
    paletteSafe?.headerStart || DEFAULT_BRAND_PALETTE.headerStart;
  const headerEnd = paletteSafe?.headerEnd || DEFAULT_BRAND_PALETTE.headerEnd;
  const accent = paletteSafe?.accent || DEFAULT_BRAND_PALETTE.accent;
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
  const panelRadius = Math.max(22, Math.min(26, panelHeight * 0.06));

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 22;
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.fillStyle = "rgba(11, 18, 32, 0.86)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, panelRadius);
  const panelTintStart = mixColors(headerStart, "#0b1220", 0.7);
  const panelTintEnd = mixColors(headerEnd, "#0b1220", 0.75);
  const panelGradient = ctx.createLinearGradient(
    panelX,
    panelY,
    panelX,
    panelY + panelHeight
  );
  panelGradient.addColorStop(0, panelTintStart);
  panelGradient.addColorStop(1, panelTintEnd);
  ctx.fillStyle = panelGradient;
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.strokeStyle = toRgba(accent, 0.2);
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.clip();
  const glassGradient = ctx.createLinearGradient(
    panelX,
    panelY,
    panelX,
    panelY + panelHeight
  );
  glassGradient.addColorStop(0, toRgba(lightenColor(panelTintStart, 0.25), 0.25));
  glassGradient.addColorStop(0.45, "rgba(255, 255, 255, 0.05)");
  glassGradient.addColorStop(1, toRgba(darkenColor(panelTintEnd, 0.35), 0.3));
  ctx.fillStyle = glassGradient;
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

  const vignette = ctx.createRadialGradient(
    panelX + panelWidth / 2,
    panelY + panelHeight / 2,
    Math.min(panelWidth, panelHeight) * 0.2,
    panelX + panelWidth / 2,
    panelY + panelHeight / 2,
    Math.max(panelWidth, panelHeight) * 0.65
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.clip();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 12;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
  ctx.lineWidth = 16;
  ctx.stroke();
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
  const rowRadius = Math.max(12, Math.min(14, rowHeight * 0.35));
  const headerFontSize = Math.max(20, rowHeight * 0.38);
  const usernameTextColor = "#f8fafc";
  const headerBarX = panelX + innerPadding;
  const headerBarWidth = panelWidth - innerPadding * 2;
  const headerBarY = panelY + innerPadding + contentOffset;
  const headerBarRadius = Math.max(16, Math.min(18, headerBarHeight * 0.4));
  const rowsStartY = headerBarY + headerBarHeight + headerSpacing;

  ctx.save();
  const gridX = panelX + innerPadding;
  const gridY = panelY + innerPadding;
  const gridWidth = panelWidth - innerPadding * 2;
  const gridHeight = panelHeight - innerPadding * 2;
  ctx.beginPath();
  ctx.rect(gridX, gridY, gridWidth, gridHeight);
  ctx.clip();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.05;
  const gridSpacing = 36;
  for (let x = gridX; x <= gridX + gridWidth; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, gridY);
    ctx.lineTo(x, gridY + gridHeight);
    ctx.stroke();
  }
  for (let y = gridY; y <= gridY + gridHeight; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(gridX, y);
    ctx.lineTo(gridX + gridWidth, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

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
  drawRoundedRectPath(
    ctx,
    headerBarX,
    headerBarY,
    headerBarWidth,
    headerBarHeight,
    headerBarRadius
  );
  const headerGradient = ctx.createLinearGradient(
    headerBarX,
    headerBarY,
    headerBarX,
    headerBarY + headerBarHeight
  );
  headerGradient.addColorStop(0, headerStart);
  headerGradient.addColorStop(1, headerEnd);
  ctx.fillStyle = headerGradient;
  ctx.fill();
  ctx.clip();
  const bevelGradient = ctx.createLinearGradient(
    headerBarX,
    headerBarY,
    headerBarX,
    headerBarY + headerBarHeight
  );
  bevelGradient.addColorStop(0, toRgba(lightenColor(headerStart, 0.25), 0.6));
  bevelGradient.addColorStop(0.5, "rgba(255,255,255,0.08)");
  bevelGradient.addColorStop(0.75, "rgba(0,0,0,0.12)");
  bevelGradient.addColorStop(1, toRgba(darkenColor(headerEnd, 0.25), 0.35));
  ctx.fillStyle = bevelGradient;
  ctx.fillRect(headerBarX, headerBarY, headerBarWidth, headerBarHeight);
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(
    headerBarX,
    headerBarY + headerBarHeight - 3,
    headerBarWidth,
    3
  );
  ctx.restore();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  if (totalColumns > 1) {
    const dividerX =
      panelX +
      innerPadding +
      columnWidth +
      Math.max(0, columnGap / 2);
    const dividerY = headerBarY + headerBarHeight;
    const dividerHeight =
      panelY + panelHeight - innerPadding - dividerY;
    ctx.save();
    const dividerGradient = ctx.createLinearGradient(
      dividerX,
      dividerY,
      dividerX,
      dividerY + dividerHeight
    );
    dividerGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
    dividerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.shadowColor = "rgba(255,255,255,0.08)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = dividerGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dividerX, dividerY);
    ctx.lineTo(dividerX, dividerY + dividerHeight);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dividerX, dividerY);
    ctx.lineTo(dividerX, dividerY + dividerHeight);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dividerX - 1, dividerY);
    ctx.lineTo(dividerX - 1, dividerY + dividerHeight);
    ctx.moveTo(dividerX + 1, dividerY);
    ctx.lineTo(dividerX + 1, dividerY + dividerHeight);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.textBaseline = "middle";

  for (let columnIndex = 0; columnIndex < totalColumns; columnIndex += 1) {
    const columnX =
      panelX + innerPadding + columnIndex * (columnWidth + columnGap);
    const columnHeaderY = headerBarY + headerBarHeight / 2;
    const headerSplitX = columnX + columnWidth * 0.5;
    const headerLeftCenter = columnX + columnWidth * 0.25;
    const headerRightCenter = columnX + columnWidth * 0.75;
    const headerTextSize = Math.max(16, Math.round(headerBarHeight * 0.34));
    ctx.font = `700 ${headerTextSize}px Poppins`;
    ctx.shadowColor = "rgba(15, 23, 42, 0.6)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.textAlign = "center";
    ctx.fillStyle = usernameTextColor;
    ctx.fillText("USERNAME", headerLeftCenter, columnHeaderY);
    ctx.fillText("NOMINAL", headerRightCenter, columnHeaderY);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const subDividerX = headerSplitX;
    const subDividerY = headerBarY + Math.max(6, headerBarHeight * 0.15);
    const subDividerHeight = headerBarHeight - Math.max(12, headerBarHeight * 0.3);
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.06)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(subDividerX, subDividerY);
    ctx.lineTo(subDividerX, subDividerY + subDividerHeight);
    ctx.stroke();
    ctx.restore();

    const startIndex = columnIndex * chunkSize;
    const columnData = safeWinners.slice(startIndex, startIndex + chunkSize);
    columnData.forEach((winner, rowIndex) => {
      const rowTop = rowsStartY + rowIndex * rowHeight;
      const centerY = rowTop + rowHeight / 2;
      ctx.save();
      ctx.fillStyle =
        rowIndex % 2 === 0
          ? "rgba(12, 18, 30, 0.55)"
          : "rgba(12, 18, 30, 0.35)";
      fillRoundedRectCached(
        ctx,
        columnX,
        rowTop,
        columnWidth,
        rowHeight - 6,
        rowRadius
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      drawRoundedRectPath(
        ctx,
        columnX,
        rowTop,
        columnWidth,
        rowHeight - 6,
        rowRadius
      );
      ctx.stroke();

      ctx.fillStyle = toRgba(accent, 0.18);
      drawRoundedRectPath(
        ctx,
        columnX + 4,
        rowTop + 6,
        6,
        Math.max(8, rowHeight - 18),
        Math.max(6, rowRadius - 2)
      );
      ctx.fill();

      const separatorY = rowTop + rowHeight - 6;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(columnX + 12, separatorY);
      ctx.lineTo(columnX + columnWidth - 12, separatorY);
      ctx.stroke();
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
      const usernameFontSize = Math.max(20, rowHeight * 0.42);
      ctx.font = `600 ${Math.round(usernameFontSize)}px Poppins`;
      ctx.textAlign = "left";
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(username, columnX + 18, centerY);

      const prizeFontSize = Math.max(18, rowHeight * 0.36);
      ctx.font = `600 ${Math.round(prizeFontSize)}px Poppins`;
      const prizeTextWidth = ctx.measureText(prizeAmountLabel).width;
      const badgePaddingX = 12;
      const badgePaddingY = 6;
      const badgeHeight = Math.min(rowHeight - 12, prizeFontSize + badgePaddingY * 2);
      const badgeWidth = prizeTextWidth + badgePaddingX * 2;
      const badgeX = columnX + columnWidth - 12 - badgeWidth;
      const badgeY = centerY - badgeHeight / 2;

      ctx.save();
      ctx.shadowColor = "rgba(110, 250, 207, 0.25)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "rgba(110, 250, 207, 0.12)";
      ctx.strokeStyle = "rgba(110, 250, 207, 0.35)";
      ctx.lineWidth = 1;
      drawRoundedRectPath(
        ctx,
        badgeX,
        badgeY,
        badgeWidth,
        badgeHeight,
        Math.max(10, Math.min(12, badgeHeight / 2))
      );
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = toRgba(accent, 0.15);
      ctx.stroke();
      ctx.restore();

      ctx.textAlign = "right";
      ctx.fillStyle = "#b6ffe6";
      ctx.fillText(prizeAmountLabel, badgeX + badgeWidth - badgePaddingX, centerY);
    });
  }

  ctx.restore();
};
