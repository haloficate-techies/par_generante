import {
  DEFAULT_BRAND_PALETTE,
  TEAM_LOGO_PLACEHOLDER_COLORS,
  applyFittedFont,
  clamp,
  clampMin,
  formatDate,
  formatTime,
  drawLogoTile,
} from "./constants";
import {
  ensureSubduedGradientColor,
  pickReadableTextColor,
  getRelativeLuminanceSafe,
} from "./color";
import { formatBigMatchDateLabel } from "./date";
import { drawRoundedRectPath } from "./geometry";
import {
  layoutTeamName,
  drawPlayerPortraitCard,
  drawVsBadge,
  drawEsportsGameSlot,
} from "./matches/helpers";

const drawMatches = (
  ctx,
  matches,
  startY = 220,
  palette = DEFAULT_BRAND_PALETTE,
  options = {}
) => {
  ctx.save();
  const paletteSafe = palette ?? DEFAULT_BRAND_PALETTE;
  const headerStart = paletteSafe?.headerStart ?? DEFAULT_BRAND_PALETTE.headerStart;
  const headerEnd = paletteSafe?.headerEnd ?? DEFAULT_BRAND_PALETTE.headerEnd;
  const footerStart = paletteSafe?.footerStart ?? DEFAULT_BRAND_PALETTE.footerStart;
  const footerEnd = paletteSafe?.footerEnd ?? DEFAULT_BRAND_PALETTE.footerEnd;
  const dateTextColor = pickReadableTextColor(headerStart, headerEnd, { preferLight: true });
  const timeTextColor = pickReadableTextColor(footerStart, footerEnd, { preferLight: true });
  const darkerGradientColor =
    getRelativeLuminanceSafe(headerStart) <= getRelativeLuminanceSafe(headerEnd)
      ? headerStart
      : headerEnd;
  const extraBottomSpacing = clampMin(options?.extraBottomSpacing ?? 0, 0);
  const customCenterLabel = options?.customCenterLabel || null;
  const brandDisplayName = options?.brandDisplayName || "";
  const FOOTER_HEIGHT = 110;
  const FOOTER_SPACING = 60 + extraBottomSpacing;
  const footerGuard = FOOTER_HEIGHT + FOOTER_SPACING;
  const bottomLimit = ctx.canvas.height - footerGuard;
  const isFootballMode = options?.mode === "football";
  const isBasketballMode = options?.mode === "basketball";
  const isEsportsMode = options?.mode === "esports";
  const footballSubMenu = isFootballMode ? options?.activeSubMenu || "schedule" : null;
  const isFootballScoresLayout =
    isFootballMode && footballSubMenu === "scores";
  const isBasketballScheduleLayout =
    isBasketballMode && (options?.activeSubMenu || "schedule") === "schedule";
  const matchCount = Math.max(matches.length, 1);
  const shouldApplyScorePadding =
    isFootballScoresLayout && matchCount <= 3;
  const layoutPaddingY = shouldApplyScorePadding
    ? Math.max(32, ctx.canvas.height * 0.035)
    : 0;
  const paddedTop = startY + layoutPaddingY;
  const paddedBottom = bottomLimit - layoutPaddingY;
  const availableHeight = Math.max(paddedBottom - paddedTop, 240);

  // =====================================================================
  // ROW RENDERERS
  // - Basketball: schedule rows
  // - Football: schedule/scores/bigmatch rows
  // - Default/Esports: standard schedule rows
  // =====================================================================

  // ===== Rows: Basketball (schedule) =====
  const drawBasketballScheduleRows = () => {
    const baseRowHeight = 90;
    const baseRowGap = 26;
    const baseRibbonHeight = 26;
    const baseRibbonOverlap = 10;
    const baseInset = Math.max(60, ctx.canvas.width * 0.08);
    const frontWidth = ctx.canvas.width - baseInset * 2;
    const rowGap = clampMin(baseRowGap, 14);
    const rawRowTotal = matchCount * baseRowHeight + Math.max(matchCount - 1, 0) * rowGap;
    const scale = rawRowTotal > availableHeight ? availableHeight / rawRowTotal : 1;

    const rowHeight = clampMin(baseRowHeight * scale, 72);
    const accentExtra = Math.max(8, 10 * scale);
    const accentOffset = Math.max(4, 6 * scale);
    const accentHeight = rowHeight + accentExtra;
    const ribbonHeight = clampMin(baseRibbonHeight * scale, 18);
    const ribbonOverlap = Math.max(6, baseRibbonOverlap * scale);
    const gap = clampMin(rowGap * scale, 12);
    const layoutHeight =
      matchCount * accentHeight + Math.max(matchCount - 1, 0) * gap;
    const verticalOffset =
      layoutHeight < availableHeight ? (availableHeight - layoutHeight) / 2 : 0;

    const frontColor = "#edf2f0";
    const accentStartColor = ensureSubduedGradientColor(
      paletteSafe?.headerStart ?? DEFAULT_BRAND_PALETTE.headerStart,
      DEFAULT_BRAND_PALETTE.headerStart,
      0.35
    );
    const accentEndColor = ensureSubduedGradientColor(
      paletteSafe?.headerEnd ?? DEFAULT_BRAND_PALETTE.headerEnd,
      DEFAULT_BRAND_PALETTE.headerEnd,
      0.35
    );
    const logoHolderColor = "#2e86de";
    const vsGradientStart = ensureSubduedGradientColor(
      paletteSafe?.headerStart ?? DEFAULT_BRAND_PALETTE.headerStart,
      DEFAULT_BRAND_PALETTE.headerStart,
      0.2
    );
    const vsGradientMid = ensureSubduedGradientColor(
      paletteSafe?.headerEnd ?? DEFAULT_BRAND_PALETTE.headerEnd,
      DEFAULT_BRAND_PALETTE.headerEnd,
      0.3
    );
    const vsGradientEnd = ensureSubduedGradientColor(
      paletteSafe?.footerStart ?? DEFAULT_BRAND_PALETTE.footerStart,
      DEFAULT_BRAND_PALETTE.footerStart,
      0.4
    );
    const ribbonStartColor = ensureSubduedGradientColor(
      paletteSafe?.footerStart ?? DEFAULT_BRAND_PALETTE.footerStart,
      DEFAULT_BRAND_PALETTE.footerStart,
      0.4
    );
    const ribbonEndColor = ensureSubduedGradientColor(
      paletteSafe?.footerEnd ?? DEFAULT_BRAND_PALETTE.footerEnd,
      DEFAULT_BRAND_PALETTE.footerEnd,
      0.4
    );
    const nameColor = "#111827";
    const vsTextColorThreshold = 0.55;

    const hexToRgb = (hex) => {
      if (!hex || typeof hex !== "string") return null;
      const raw = hex.replace("#", "").trim();
      const normalized =
        raw.length === 3
          ? raw
              .split("")
              .map((ch) => ch + ch)
              .join("")
          : raw;
      if (normalized.length !== 6) return null;
      const value = Number.parseInt(normalized, 16);
      if (!Number.isFinite(value)) return null;
      return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
      };
    };

    const getRelativeLuminance = (rgb) => {
      if (!rgb) return 0;
      const toLinear = (channel) => {
        const srgb = channel / 255;
        return srgb <= 0.03928
          ? srgb / 12.92
          : Math.pow((srgb + 0.055) / 1.055, 2.4);
      };
      const r = toLinear(rgb.r);
      const g = toLinear(rgb.g);
      const b = toLinear(rgb.b);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const blendHexColors = (colors) => {
      const values = colors
        .map((color) => hexToRgb(color))
        .filter(Boolean);
      if (!values.length) return { r: 0, g: 0, b: 0 };
      const total = values.reduce(
        (acc, value) => ({
          r: acc.r + value.r,
          g: acc.g + value.g,
          b: acc.b + value.b,
        }),
        { r: 0, g: 0, b: 0 }
      );
      const count = values.length;
      return {
        r: Math.round(total.r / count),
        g: Math.round(total.g / count),
        b: Math.round(total.b / count),
      };
    };

    const pickVsTextStyle = (gradientColors) => {
      const blended = blendHexColors(gradientColors);
      const luminance = getRelativeLuminance(blended);
      const isDark = luminance < vsTextColorThreshold;
      return {
        fill: isDark ? "#ffffff" : "#111827",
        stroke: isDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)",
      };
    };

    const fillTextTracking = (text, centerX, centerY, trackingValue) => {
      const chars = text.split("");
      const widths = chars.map((ch) => ctx.measureText(ch).width);
      const totalWidth =
        widths.reduce((sum, width) => sum + width, 0) +
        trackingValue * Math.max(chars.length - 1, 0);
      let cursorX = centerX - totalWidth / 2;
      chars.forEach((ch, idx) => {
        const half = widths[idx] / 2;
        const drawX = cursorX + half;
        ctx.fillText(ch, drawX, centerY);
        cursorX += widths[idx] + trackingValue;
      });
    };

    const strokeTextTracking = (text, centerX, centerY, trackingValue) => {
      const chars = text.split("");
      const widths = chars.map((ch) => ctx.measureText(ch).width);
      const totalWidth =
        widths.reduce((sum, width) => sum + width, 0) +
        trackingValue * Math.max(chars.length - 1, 0);
      let cursorX = centerX - totalWidth / 2;
      chars.forEach((ch, idx) => {
        const half = widths[idx] / 2;
        const drawX = cursorX + half;
        ctx.strokeText(ch, drawX, centerY);
        cursorX += widths[idx] + trackingValue;
      });
    };

    const vsWidth = Math.max(76, 98 * scale);
    const logoSize = rowHeight;
    const gapBetweenLogoAndText = Math.max(12, 16 * scale);
    const TEXT_INNER_PAD = Math.max(10, 14 * scale);

    const drawTrapezoid = (x, y, width, height, bottomInset) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width - bottomInset, y + height);
      ctx.lineTo(x + bottomInset, y + height);
      ctx.closePath();
    };

    const drawLogoHolder = (image, x, y, size, fallbackName, adjustments = {}) => {
  const hasImage = !!image;

  // âœ… Background biru hanya kalau tidak ada logo image
  if (!hasImage) {
    ctx.save();
    ctx.fillStyle = logoHolderColor;
    ctx.fillRect(x, y, size, size); // sharp
    ctx.restore();
  }

  if (hasImage) {
    // draw image (tanpa background biru)
    const padding = size * 0.1;
    const slot = size - padding * 2;
    const naturalWidth = image.naturalWidth || image.width || slot;
    const naturalHeight = image.naturalHeight || image.height || slot;
    const baseScale = Math.min(slot / naturalWidth, slot / naturalHeight);
    const userScale = clamp(adjustments.scale ?? 1, 0.7, 1.5);
    const renderWidth = naturalWidth * baseScale * userScale;
    const renderHeight = naturalHeight * baseScale * userScale;
    const offsetRangeX = Math.max((slot - renderWidth) / 2, 0);
    const offsetRangeY = Math.max((slot - renderHeight) / 2, 0);
    const offsetX = clamp(adjustments.offsetX ?? 0, -0.75, 0.75);
    const offsetY = clamp(adjustments.offsetY ?? 0, -0.75, 0.75);
    const renderX =
      x + padding + (slot - renderWidth) / 2 + offsetX * offsetRangeX;
    const renderY =
      y + padding + (slot - renderHeight) / 2 + offsetY * offsetRangeY;

    ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
  } else {
    // fallback initials (di atas background biru)
    const fallback = (fallbackName || "FC").trim().toUpperCase();
    ctx.save();
    ctx.fillStyle = "#f8fafc";
    ctx.font = `800 ${Math.round(size * 0.28)}px "Poppins", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = fallback
      .split(/\s+/)
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2);

    ctx.fillText(initials || "FC", x + size / 2, y + size / 2);
    ctx.restore();
    }
  };


    const renderTeamName = (label, fallback, x, width, centerY) => {
      if (width <= 0) return;
      const text = (label && label.trim()) || fallback || "Tim TBD";
      const upper = text.toUpperCase();
      const longNameScale = upper.length >= 13 ? 0.92 : 1;
      const layout = layoutTeamName(ctx, upper, {
        maxWidth: width,
        maxFontSize: Math.max(22, 30 * scale) * longNameScale,
        minFontSize: 16,
        fontWeight: 800,
        fontFamily: '"Oswald", sans-serif',
      });
      const lines = layout.lines && layout.lines.length ? layout.lines : [upper];
      const lineHeight = layout.fontSize * (lines.length > 1 ? 1.05 : 1);
      const firstLineY = centerY - ((lines.length - 1) * lineHeight) / 2;
      ctx.save();
      ctx.fillStyle = nameColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = Math.max(0.9, 1.4 * scale);
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = Math.max(1, 1.2 * scale);
      ctx.font = `800 ${Math.round(layout.fontSize)}px "Oswald", sans-serif`;
      if (lines.length === 1) {
        const tracking = Math.max(0.5, 1.2 * scale);
        strokeTextTracking(lines[0], x + width / 2, firstLineY, tracking);
        fillTextTracking(lines[0], x + width / 2, firstLineY, tracking);
      } else {
        lines.forEach((line, index) => {
          const lineY = firstLineY + index * lineHeight;
          ctx.strokeText(line, x + width / 2, lineY);
          ctx.fillText(line, x + width / 2, lineY);
        });
      }
      ctx.restore();
    };

    matches.forEach((match, index) => {
      const rowTop = paddedTop + verticalOffset + index * (accentHeight + gap);
      const gapX = Math.max(18, 24 * scale);
      const frontInsetY = Math.max(8, 10 * scale);
      const accentWidth = frontWidth + gapX * 2;
      const accentY = rowTop;
      const frontY = rowTop + accentExtra - accentOffset + frontInsetY;
      const accentX = ctx.canvas.width / 2 - accentWidth / 2;
      const frontX = accentX + gapX;
      const centerY = frontY + rowHeight / 2;

      const accentBottomInset = Math.max(16, accentWidth * 0.04);
      const frontBottomInset = Math.max(12, frontWidth * 0.035);

      ctx.save();
      drawTrapezoid(accentX, accentY, accentWidth, accentHeight, accentBottomInset);
      const accentGradient = ctx.createLinearGradient(
        accentX,
        accentY,
        accentX + accentWidth,
        accentY + accentHeight
      );
      accentGradient.addColorStop(0, accentStartColor);
      accentGradient.addColorStop(1, accentEndColor);
      ctx.fillStyle = accentGradient;
      ctx.fill();
      ctx.restore();

      ctx.save();
      drawTrapezoid(frontX, frontY, frontWidth, rowHeight, frontBottomInset);
      ctx.fillStyle = frontColor;
      ctx.fill();
      ctx.restore();
      ctx.save();
      drawTrapezoid(frontX, frontY, frontWidth, rowHeight, frontBottomInset);
      ctx.clip();
      ctx.beginPath();
      ctx.moveTo(frontX, frontY + 1);
      ctx.lineTo(frontX + frontWidth, frontY + 1);
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = Math.max(1, 1.4 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(frontX, frontY + rowHeight - 1);
      ctx.lineTo(frontX + frontWidth, frontY + rowHeight - 1);
      ctx.strokeStyle = "rgba(0,0,0,0.10)";
      ctx.lineWidth = Math.max(1, 1.4 * scale);
      ctx.stroke();
      ctx.restore();

      const leftColX = frontX;
      const leftColW = (frontWidth - vsWidth) / 2;
      const rightColX = frontX + leftColW + vsWidth;
      const logoY = frontY;

      const EDGE_INSET_PX = 14;
      const CENTER_PULL_PX = 16;
      const homeLogoX = frontX + EDGE_INSET_PX + CENTER_PULL_PX;
      const awayLogoX = frontX + frontWidth - logoSize - EDGE_INSET_PX - CENTER_PULL_PX;

      drawLogoHolder(match.homeLogoImage, homeLogoX, logoY, logoSize, match.teamHome, {
        scale: match.teamHomeLogoScale,
        offsetX: match.teamHomeLogoOffsetX,
        offsetY: match.teamHomeLogoOffsetY,
      });
      drawLogoHolder(match.awayLogoImage, awayLogoX, logoY, logoSize, match.teamAway, {
        scale: match.teamAwayLogoScale,
        offsetX: match.teamAwayLogoOffsetX,
        offsetY: match.teamAwayLogoOffsetY,
      });

      const leftTextSlotX = homeLogoX + logoSize + gapBetweenLogoAndText + TEXT_INNER_PAD;
      const leftTextSlotW = Math.max(
        40,
        leftColX + leftColW - leftTextSlotX - TEXT_INNER_PAD
      );
      const rightTextSlotX = rightColX + TEXT_INNER_PAD;
      const rightTextSlotW = Math.max(
        40,
        awayLogoX - gapBetweenLogoAndText - rightTextSlotX - TEXT_INNER_PAD
      );

      renderTeamName(match.teamHome, "Tuan Rumah", leftTextSlotX, leftTextSlotW, centerY);
      renderTeamName(match.teamAway, "Tim Tamu", rightTextSlotX, rightTextSlotW, centerY);

      const vsX = frontX + (frontWidth - vsWidth) / 2;
      const vsY = frontY;
      const vsHeight = rowHeight;
      ctx.save();
      const vsGradient = ctx.createLinearGradient(
        vsX,
        vsY,
        vsX,
        vsY + vsHeight
      );
      vsGradient.addColorStop(0, vsGradientStart);
      vsGradient.addColorStop(0.55, vsGradientMid);
      vsGradient.addColorStop(1, vsGradientEnd);
      ctx.fillStyle = vsGradient;
      ctx.fillRect(vsX, vsY, vsWidth, vsHeight);
      ctx.restore();

      const vsTextStyle = pickVsTextStyle([
        vsGradientStart,
        vsGradientMid,
        vsGradientEnd,
      ]);
      ctx.save();
      let vsFontSize = Math.round(vsHeight * 0.68);
      ctx.font = `900 ${vsFontSize}px "Poppins", sans-serif`;
      const maxTextWidth = vsWidth * 0.9;
      let measuredWidth = ctx.measureText("VS").width;
      let guard = 0;
      while (measuredWidth > maxTextWidth && vsFontSize > 12 && guard < 12) {
        vsFontSize = Math.round(vsFontSize * 0.95);
        ctx.font = `900 ${vsFontSize}px "Poppins", sans-serif`;
        measuredWidth = ctx.measureText("VS").width;
        guard += 1;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = vsTextStyle.fill;
      ctx.strokeStyle = vsTextStyle.stroke;
      ctx.lineWidth = Math.max(1, 2 * scale);
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = Math.max(1, 3 * scale);
      ctx.shadowOffsetY = Math.max(1, 2 * scale);
      ctx.fillText("VS", vsX + vsWidth / 2, vsY + vsHeight / 2 + 1);
      ctx.shadowColor = "transparent";
      ctx.strokeText("VS", vsX + vsWidth / 2, vsY + vsHeight / 2 + 1);
      ctx.restore();

      const dateLabel = (formatDate(match.date) || "Jadwal TBD").toUpperCase();
      const timeLabel = match.time ? formatTime(match.time) : "WAKTU TBD";
      const ribbonText = `${dateLabel} - ${timeLabel}`.toUpperCase();
      ctx.save();
      let ribbonFontSize = Math.round(Math.max(12, 16 * scale));
      ctx.font = `700 ${ribbonFontSize}px "Poppins", sans-serif`;
      let textWidth = ctx.measureText(ribbonText).width;
      const ribbonPaddingX = Math.max(22, 30 * scale);
      const ribbonMaxWidth = frontWidth * 0.95;
      let ribbonWidth = Math.min(
        ribbonMaxWidth,
        Math.max(200, textWidth + ribbonPaddingX * 2)
      );
      let ribbonGuard = 0;
      while (textWidth + ribbonPaddingX * 2 > ribbonWidth && ribbonGuard < 6) {
        ribbonFontSize = Math.round(ribbonFontSize * 0.94);
        ctx.font = `700 ${ribbonFontSize}px "Poppins", sans-serif`;
        textWidth = ctx.measureText(ribbonText).width;
        ribbonWidth = Math.min(
          ribbonMaxWidth,
          Math.max(200, textWidth + ribbonPaddingX * 2)
        );
        ribbonGuard += 1;
      }
      const ribbonX = frontX + frontWidth / 2 - ribbonWidth / 2;
      const ribbonY = frontY + rowHeight - ribbonOverlap;
      const ribbonBottomInset = Math.max(10, ribbonHeight * 0.35);
      drawTrapezoid(ribbonX, ribbonY, ribbonWidth, ribbonHeight, ribbonBottomInset);
      const ribbonGradient = ctx.createLinearGradient(
        ribbonX,
        ribbonY,
        ribbonX + ribbonWidth,
        ribbonY + ribbonHeight
      );
      ribbonGradient.addColorStop(0, ribbonStartColor);
      ribbonGradient.addColorStop(1, ribbonEndColor);
      ctx.fillStyle = ribbonGradient;
      ctx.fill();
      const ribbonCenterX = ribbonX + ribbonWidth / 2;
      const ribbonCenterY = ribbonY + ribbonHeight / 2 + 1;
      const tracking = Math.max(0.6, 1.4 * scale);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `800 ${Math.round(Math.max(13, 17 * scale))}px "Poppins", sans-serif`;
      ctx.fillStyle = "#f9fafb";
      ctx.strokeStyle = "rgba(0,0,0,0.60)";
      ctx.lineWidth = Math.max(0.8, 1.4 * scale);
      ctx.shadowColor = "rgba(0,0,0,0.30)";
      ctx.shadowBlur = Math.max(1, 2 * scale);
      ctx.shadowOffsetY = Math.max(1, 1.2 * scale);
      if (tracking > 0.5) {
        fillTextTracking(ribbonText, ribbonCenterX, ribbonCenterY, tracking);
        strokeTextTracking(ribbonText, ribbonCenterX, ribbonCenterY, tracking);
      } else {
        ctx.fillText(ribbonText, ribbonCenterX, ribbonCenterY);
        ctx.strokeText(ribbonText, ribbonCenterX, ribbonCenterY);
      }
      ctx.restore();
    });
  };

  // ===== Rows: Football (schedule/scores/bigmatch) =====
  const drawFootballRows = ({ isScoresLayout = false, centerLabel = null } = {}) => {
    const isFootballScoresLayout = Boolean(isScoresLayout);
    const customCenterLabel = centerLabel;
    const baseRowHeight = 118;
    const baseRowGap = 22;
    const baseTotal =
      matchCount * baseRowHeight + Math.max(matchCount - 1, 0) * baseRowGap;
    const scheduleScale =
      baseTotal > availableHeight ? availableHeight / baseTotal : 1;
    const rowHeight = clampMin(baseRowHeight * scheduleScale, 76);
    const rowGap = clampMin(baseRowGap * scheduleScale, 28);
    const layoutHeight =
      matchCount * rowHeight + Math.max(matchCount - 1, 0) * rowGap;
    const verticalOffset =
      layoutHeight < availableHeight
        ? (availableHeight - layoutHeight) / 2
        : 0;
    const marginX = Math.max(56, ctx.canvas.width * 0.08);
    const badgeScale = 1.5;
    const baseCircleRadius = Math.max(rowHeight * 0.34, 34);
    const circleRadius = baseCircleRadius * badgeScale;
    const barHeight = Math.max(
      rowHeight * (customCenterLabel ? 0.75 : 0.6),
      customCenterLabel ? 90 : 50
    );
    const textGap = customCenterLabel
      ? Math.max(28, 34 * scheduleScale)
      : Math.max(18, 28 * scheduleScale);
    const topMarginSpace = Math.max((rowHeight - barHeight) / 2, 0);
    const maxDateCapsuleHeight = Math.max(
      14,
      topMarginSpace + Math.min(4, topMarginSpace * 0.2)
    );
    const scoreDateCapsuleHeight = isFootballScoresLayout
      ? Math.min(Math.max(20, 26 * scheduleScale), maxDateCapsuleHeight)
      : 0;

    const drawTeamBadge = (
      image,
      centerX,
      centerY,
      radius,
      fallbackLetter,
      logoAdjustments = {}
    ) => {
      const badgeBackgroundFill = "#d7d9de";

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = badgeBackgroundFill;
      ctx.fill();
      ctx.clip();
      if (image) {
        const slotSize = radius * 2;
        const naturalWidth = Math.max(1, image.naturalWidth || image.width || slotSize);
        const naturalHeight = Math.max(1, image.naturalHeight || image.height || slotSize);
        const containScale = Math.min(slotSize / naturalWidth, slotSize / naturalHeight);
        const userScale = clamp(Number(logoAdjustments.scale) || 1, 0.7, 1.5);
        const insetMultiplier = 0.65;
        const renderScale = clamp(containScale * insetMultiplier * userScale, 0, containScale);
        const renderWidth = naturalWidth * renderScale;
        const renderHeight = naturalHeight * renderScale;
        const offsetRangeX = Math.max((slotSize - renderWidth) / 2, 0);
        const offsetRangeY = Math.max((slotSize - renderHeight) / 2, 0);
        const offsetX = clamp(Number(logoAdjustments.offsetX) || 0, -0.75, 0.75);
        const offsetY = clamp(Number(logoAdjustments.offsetY) || 0, -0.75, 0.75);
        const renderX = centerX - renderWidth / 2 + offsetX * offsetRangeX;
        const renderY = centerY - renderHeight / 2 + offsetY * offsetRangeY;
        ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
      } else {
        ctx.fillStyle = "#0f172a";
        ctx.font = `700 ${Math.round(radius * 0.85)}px "Poppins", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(fallbackLetter, centerX, centerY);
      }
      ctx.restore();
      ctx.save();
      ctx.lineWidth = Math.max(4, radius * 0.2);
      ctx.strokeStyle = darkerGradientColor || "#ef4444";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawTeamBlock = (label, fallback, areaX, areaWidth, centerY, { textCenterBias = 0 } = {}) => {
      if (areaWidth <= 0) return;
      const baseText = (label && label.trim()) || fallback;
      const upper = baseText.toUpperCase();
      const maxFontSizeBase = customCenterLabel
        ? label ? 40 : 34
        : 28;
      const layout = layoutTeamName(ctx, upper, {
        maxWidth: areaWidth,
        maxFontSize: Math.max(maxFontSizeBase * scheduleScale, 16),
        minFontSize: customCenterLabel ? 18 : 12,
        fontWeight: customCenterLabel ? 800 : 700,
        fontFamily: '"Poppins", sans-serif',
      });
      const lines =
        layout.lines && layout.lines.length ? layout.lines : [upper];
      const lineHeight = layout.fontSize * (lines.length > 1 ? 1.05 : 1);
      const firstLineY = centerY - ((lines.length - 1) * lineHeight) / 2;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      ctx.font = `700 ${Math.round(layout.fontSize)}px "Poppins", sans-serif`;
      lines.forEach((line, idx) => {
        ctx.fillText(line, areaX + areaWidth / 2 + textCenterBias, firstLineY + idx * lineHeight);
      });
      ctx.restore();
    };

    matches.forEach((match, index) => {
      const rowTop =
        paddedTop + verticalOffset + index * (rowHeight + rowGap);
      const centerY = rowTop + rowHeight / 2;
      const leftCircleCenterX = marginX + circleRadius;
      const rightCircleCenterX = ctx.canvas.width - marginX - circleRadius;
      const barX = leftCircleCenterX;
      const barWidth = rightCircleCenterX - leftCircleCenterX;
      const barY = centerY - barHeight / 2;
      const targetCenterWidth = customCenterLabel
        ? 110 * scheduleScale
        : 200 * scheduleScale;
      const minCenterWidth = customCenterLabel ? 90 * scheduleScale : 160 * scheduleScale;
      const maxCenterWidth = customCenterLabel ? 130 * scheduleScale : 240 * scheduleScale;
      const centerWidth = clamp(targetCenterWidth, minCenterWidth, maxCenterWidth);
      const centerX = ctx.canvas.width / 2 - centerWidth / 2;
      const baseInset = customCenterLabel ? 0.3 : 0.12;
      const centerTopInset = Math.max(centerWidth * baseInset, 18 * scheduleScale);
      const centerBottom = barY + barHeight;
      const shouldRenderPlayerCards = Boolean(customCenterLabel);
      if (shouldRenderPlayerCards) {
        const baseCardHeight = rowHeight * 3.2;
        const playerCardHeight = clamp(
          baseCardHeight,
          280,
          Math.min(ctx.canvas.height * 0.58, 520)
        );
        const homePlayerCardHeight = Math.min(playerCardHeight + 120, ctx.canvas.height * 0.7);
        const awayPlayerCardHeight = Math.min(playerCardHeight + 120, ctx.canvas.height * 0.7);
        const basePlayerCardWidth = clamp(
          playerCardHeight * 0.62,
          220,
          Math.min(ctx.canvas.width * 0.32, 380)
        );
        const homePlayerCardWidth = clamp(
          basePlayerCardWidth * 1.75,
          basePlayerCardWidth,
          Math.min(ctx.canvas.width * 0.64, basePlayerCardWidth + 420)
        );
        const awayPlayerCardWidth = clamp(
          basePlayerCardWidth * 1.75,
          basePlayerCardWidth,
          Math.min(ctx.canvas.width * 0.64, basePlayerCardWidth + 420)
        );
        const desiredCardY = centerY - playerCardHeight * 0.75;
        const minCardY = Math.max(80, paddedTop - playerCardHeight * 0.4);
        const cardBottomGuard = FOOTER_HEIGHT + FOOTER_SPACING + 36;
        const maxCardY = Math.max(
          minCardY,
          ctx.canvas.height - cardBottomGuard - playerCardHeight
        );
        const playerCardY = clamp(desiredCardY, minCardY, maxCardY);
        const cardMarginX = Math.max(24, ctx.canvas.width * 0.035);
        const homeCardHorizontalOffset = Math.max(homePlayerCardWidth * 0.18, 70);
        const homeCardX = cardMarginX + homeCardHorizontalOffset;
        const awayCardHorizontalOffset = Math.max(awayPlayerCardWidth * 0.18, 70);
        const awayCardX =
          ctx.canvas.width - cardMarginX - awayPlayerCardWidth - awayCardHorizontalOffset;
        const homeCardLift = Math.max(playerCardHeight * 0.2, 80);
        const additionalHomeOffset = Math.max(playerCardHeight * 0.25, 110);
        const finalHomeLift = Math.max(playerCardHeight * 0.15, 80);
        const homeMinCardY = Math.max(20, paddedTop - homePlayerCardHeight * 0.8);
        const homeCardY = Math.max(
          homeMinCardY,
          playerCardY -
            Math.max(playerCardHeight * 0.55, 120) -
            homeCardLift -
            additionalHomeOffset -
            finalHomeLift
        );
        drawPlayerPortraitCard(ctx, match.homePlayerImage, {
          x: homeCardX,
          y: homeCardY,
          width: homePlayerCardWidth,
          height: homePlayerCardHeight,
          palette: paletteSafe,
          label: "",
          adjustments: {
            scale: match.teamHomePlayerScale,
            offsetX: match.teamHomePlayerOffsetX,
            offsetY: match.teamHomePlayerOffsetY,
            flip: match.teamHomePlayerFlip,
          },
          showPlaceholderLabel: !match.homePlayerImage,
        });
        const awayCardDrop = Math.max(awayPlayerCardHeight * 0.2, 80);
        const additionalAwayOffset = Math.max(awayPlayerCardHeight * 0.25, 110);
        const finalAwayDrop = Math.max(awayPlayerCardHeight * 0.15, 80);
        const awayMinCardY = Math.max(20, paddedTop - awayPlayerCardHeight * 0.8);
        const awayCardY = Math.max(
          awayMinCardY,
          playerCardY -
            Math.max(playerCardHeight * 0.55, 120) -
            awayCardDrop -
            additionalAwayOffset -
            finalAwayDrop
        );
        drawPlayerPortraitCard(ctx, match.awayPlayerImage, {
          x: awayCardX,
          y: awayCardY,
          width: awayPlayerCardWidth,
          height: awayPlayerCardHeight,
          palette: paletteSafe,
          label: "",
          adjustments: {
            scale: match.teamAwayPlayerScale,
            offsetX: match.teamAwayPlayerOffsetX,
            offsetY: match.teamAwayPlayerOffsetY,
            flip: match.teamAwayPlayerFlip,
          },
          align: "right",
          showPlaceholderLabel: !match.awayPlayerImage,
        });
      }

      if (customCenterLabel) {
        const pillHeight = Math.max(34, 42 * scheduleScale);
        const pillPaddingX = Math.max(24, 32 * scheduleScale);
        const dateLabelRaw = formatBigMatchDateLabel(match.date) || "";
        const timeLabelRaw = match.time ? formatTime(match.time) : "";
        const pillLabel = [dateLabelRaw.toUpperCase(), timeLabelRaw.toUpperCase()]
          .filter(Boolean)
          .join(" â€¢ ") || "JADWAL TBD";
        const maxPillWidth = Math.min(ctx.canvas.width - marginX, centerWidth + 480);
        ctx.save();
        ctx.font = `700 ${Math.round(Math.max(20, 28 * scheduleScale))}px "Poppins", sans-serif`;
        const textWidth = ctx.measureText(pillLabel).width;
        const basePillWidth = clamp(textWidth + pillPaddingX * 2, 380, maxPillWidth);
        const trapezoidInset = Math.max(pillHeight * 0.13, 20);
        const pillWidth = Math.min(maxPillWidth, basePillWidth + trapezoidInset * 3);
        const pillX = ctx.canvas.width / 2 - pillWidth / 2;
        const pillY = barY - pillHeight;
        ctx.beginPath();
        ctx.moveTo(pillX, pillY + pillHeight);
        ctx.lineTo(pillX + trapezoidInset, pillY);
        ctx.lineTo(pillX + pillWidth - trapezoidInset, pillY);
        ctx.lineTo(pillX + pillWidth, pillY + pillHeight);
        ctx.closePath();
        const pillGradient = ctx.createLinearGradient(pillX, pillY, pillX + pillWidth, pillY + pillHeight);
        const trapezoidGradientStart = ensureSubduedGradientColor(
          headerStart,
          DEFAULT_BRAND_PALETTE.headerStart,
          0.2
        );
        const trapezoidGradientEnd = ensureSubduedGradientColor(
          headerEnd,
          DEFAULT_BRAND_PALETTE.headerEnd,
          0.2
        );
        pillGradient.addColorStop(0, trapezoidGradientStart);
        pillGradient.addColorStop(1, trapezoidGradientEnd);
        ctx.fillStyle = pillGradient;
        ctx.fill();
        const textCenterX = pillX + pillWidth / 2;
        const textCenterY = pillY + pillHeight / 2 + 1;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
        ctx.fillText(pillLabel, textCenterX, textCenterY + 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(pillLabel, textCenterX, textCenterY);
        ctx.restore();

        const ctaPrefix = "Dukung tim jagoanmu dengan pasang taruhan di ";
        const brandNameForCta = (brandDisplayName || "Golbos").trim() || "Golbos";
        const primaryTextColor = "#ffffff";
        const fallbackTextColor = "#f2f2f2";
        const letterSpacing = clamp(2 * scheduleScale, 1, 3);
        const estimatedScheduleFontSize = Math.max(28, 36 * scheduleScale);
        const baseCtaFontSize = clamp(
          estimatedScheduleFontSize * 0.75,
          estimatedScheduleFontSize * 0.7,
          estimatedScheduleFontSize * 0.8
        );
        const buildCtaSegments = (fontSize) => [
          {
            text: ctaPrefix,
            font: `400 ${Math.round(fontSize)}px "Montserrat", "Poppins", sans-serif`,
          },
          {
            text: brandNameForCta,
            font: `500 ${Math.round(fontSize)}px "Montserrat", "Poppins", sans-serif`,
          },
        ];
        const measureSegmentedWidth = (segments) => {
          let width = 0;
          let totalChars = 0;
          segments.forEach((segment) => {
            if (!segment?.text) return;
            ctx.font = segment.font;
            const chars = segment.text.split("");
            totalChars += chars.length;
            chars.forEach((char) => {
              width += ctx.measureText(char).width;
            });
          });
          const spacingCount = Math.max(totalChars - 1, 0);
          return width + spacingCount * letterSpacing;
        };
        const baseSegments = buildCtaSegments(baseCtaFontSize);
        const maxCtaWidth = ctx.canvas.width - marginX * 2;
        const baseWidth = measureSegmentedWidth(baseSegments);
        const shrinkFactor =
          baseWidth > maxCtaWidth ? clamp(maxCtaWidth / baseWidth, 0.9, 1) : 1;
        const finalFontSize = baseCtaFontSize * shrinkFactor;
        const ctaSegments = buildCtaSegments(finalFontSize);
        const ctaTextWidth = measureSegmentedWidth(ctaSegments);
        const ctaY = barY + barHeight + Math.max(24, 36 * scheduleScale);
        const startX = ctx.canvas.width / 2 - ctaTextWidth / 2;
        const drawSegmentedText = (segments, draw) => {
          let cursorX = startX;
          segments.forEach((segment, segmentIndex) => {
            if (!segment?.text) return;
            ctx.font = segment.font;
            const chars = segment.text.split("");
            chars.forEach((char, charIndex) => {
              draw(char, cursorX, ctaY);
              cursorX += ctx.measureText(char).width;
              const hasMore =
                charIndex < chars.length - 1 ||
                segmentIndex < segments.length - 1;
              if (hasMore) {
                cursorX += letterSpacing;
              }
            });
          });
        };
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = clamp(2.5 * scheduleScale, 2, 3);
        ctx.shadowOffsetY = 1;
        ctx.shadowOffsetX = 0;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 1;
        drawSegmentedText(ctaSegments, (char, x, y) => ctx.strokeText(char, x, y));
        ctx.fillStyle = primaryTextColor || fallbackTextColor;
        drawSegmentedText(ctaSegments, (char, x, y) => ctx.fillText(char, x, y));
        ctx.restore();
      }

      if (isFootballScoresLayout && scoreDateCapsuleHeight > 0) {
        const scoreDateLabel = (formatDate(match.date) || "").toUpperCase();
        if (scoreDateLabel) {
          const dateFontSize = Math.max(18, 20 * scheduleScale);
          const dateHeight = scoreDateCapsuleHeight;
          const dateTopInset = Math.max(centerTopInset * 0.45, 12 * scheduleScale);
          const bottomLeft = centerX - centerTopInset;
          const bottomRight = centerX + centerWidth + centerTopInset;
          const topLeft = bottomLeft + dateTopInset;
          const topRight = bottomRight - dateTopInset;
          const bottomY = barY + Math.max(0.5, scheduleScale * 0.6);
          const topY = bottomY - dateHeight;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(bottomLeft, bottomY);
          ctx.lineTo(bottomRight, bottomY);
          ctx.lineTo(topRight, topY);
          ctx.lineTo(topLeft, topY);
          ctx.closePath();
          const dateGradient = ctx.createLinearGradient(
            bottomLeft,
            bottomY,
            bottomRight,
            topY
          );
          dateGradient.addColorStop(
            0,
            ensureSubduedGradientColor(
              paletteSafe?.footerStart,
              DEFAULT_BRAND_PALETTE.footerStart,
              0.45
            )
          );
          dateGradient.addColorStop(
            0.6,
            ensureSubduedGradientColor(
              paletteSafe?.headerEnd,
              DEFAULT_BRAND_PALETTE.headerEnd,
              0.35
            )
          );
          dateGradient.addColorStop(
            1,
            ensureSubduedGradientColor(
              paletteSafe?.headerStart,
              DEFAULT_BRAND_PALETTE.headerStart,
              0.35
            )
          );
          ctx.fillStyle = dateGradient;
          ctx.fill();
          ctx.fillStyle = "#f8fafc";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `700 ${Math.round(dateFontSize)}px "Poppins", sans-serif`;
          const textCenterX = (topLeft + topRight) / 2;
          const textCenterY = topY + dateHeight / 2;
          ctx.fillText(scoreDateLabel, textCenterX, textCenterY);
          ctx.restore();
        }
      }
      ctx.save();
      drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barHeight / 2);
      ctx.fillStyle = "rgba(248, 250, 252, 0.96)";
      ctx.fill();
      ctx.strokeStyle = darkerGradientColor || "#ef4444";
      ctx.lineWidth = Math.max(4, barHeight * 0.06);
      ctx.stroke();
      ctx.restore();

      const centerGradient = ctx.createLinearGradient(
        centerX,
        barY,
        centerX + centerWidth,
        centerBottom
      );
      const trapezoidStartColor = ensureSubduedGradientColor(
        headerStart,
        DEFAULT_BRAND_PALETTE.headerStart
      );
      const trapezoidMidColor = ensureSubduedGradientColor(
        headerEnd,
        DEFAULT_BRAND_PALETTE.headerEnd
      );
      const trapezoidEndColor = ensureSubduedGradientColor(
        paletteSafe?.footerStart ?? DEFAULT_BRAND_PALETTE.footerStart,
        DEFAULT_BRAND_PALETTE.footerStart,
        0.45
      );
      centerGradient.addColorStop(0, trapezoidStartColor);
      centerGradient.addColorStop(0.6, trapezoidMidColor);
      centerGradient.addColorStop(1, trapezoidEndColor);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerBottom);
      ctx.lineTo(centerX + centerWidth, centerBottom);
      ctx.lineTo(centerX + centerWidth + centerTopInset, barY);
      ctx.lineTo(centerX - centerTopInset, barY);
      ctx.closePath();
      ctx.fillStyle = centerGradient;
      ctx.fill();
      ctx.restore();

      const fallbackScore = (value) => {
        if (typeof value === "number" && Number.isFinite(value)) {
          return value;
        }
        if (value === null || value === undefined || value === "") {
          return 0;
        }
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : 0;
      };
      let dateLabel = isFootballScoresLayout
        ? `${fallbackScore(match.scoreHome)} - ${fallbackScore(match.scoreAway)}`
        : (formatDate(match.date) || "JADWAL TBD").toUpperCase();
      let timeLabel = isFootballScoresLayout
        ? ""
        : (match.time ? formatTime(match.time) : "WAKTU TBD").toUpperCase();
      if (customCenterLabel) {
        dateLabel = (customCenterLabel.title || customCenterLabel.text || "VS").toUpperCase();
        timeLabel = customCenterLabel.subtitle
          ? customCenterLabel.subtitle.toUpperCase()
          : "";
      }
      const dateFont = Math.max(
        18,
        (isFootballScoresLayout ? 40 : customCenterLabel ? 72 : 24) * scheduleScale
      );
      const timeFont = Math.max(
        24,
        (isFootballScoresLayout ? 32 : 28) * scheduleScale
      );
      const centerTextX = centerX + centerWidth / 2;
      const centerBandHeight = barHeight * (isFootballScoresLayout ? 0.8 : 0.5);
      const centerBandPadding = customCenterLabel ? 0 : Math.max(8, 10 * scheduleScale);
      const dateAreaHeight = centerBandHeight * (isFootballScoresLayout ? 1 : 0.45);
      const timeAreaHeight = isFootballScoresLayout
        ? 0
        : centerBandHeight * 0.55;
      const dateCenterY = isFootballScoresLayout
        ? centerY
        : barY + centerBandPadding + dateAreaHeight / 2;
      const timeCenterY = isFootballScoresLayout
        ? null
        : barY + barHeight - centerBandPadding - timeAreaHeight / 2;
      const shouldHideTimeLabel = Boolean(customCenterLabel);
      const effectiveTimeCenterY = shouldHideTimeLabel ? null : timeCenterY;
      const dateTextCenterY = customCenterLabel
        ? barY + barHeight / 2
        : dateCenterY;
      const gradientEndY = isFootballScoresLayout || shouldHideTimeLabel
        ? dateTextCenterY + dateFont
        : effectiveTimeCenterY + timeFont;
      const textGradient = ctx.createLinearGradient(
        centerTextX,
        dateTextCenterY - dateFont,
        centerTextX,
        gradientEndY
      );
      textGradient.addColorStop(0, "#f8fafc");
      textGradient.addColorStop(0.55, "#d1d5db");
      textGradient.addColorStop(1, "#4b5563");
      const centerOffset = customCenterLabel ? 0 : 1;
      const drawBeveledText = (text, fontSize, centerY, fontWeight = 700) => {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontWeight} ${Math.round(fontSize)}px "Poppins", sans-serif`;
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = "#111827";
        ctx.fillText(text, centerTextX, centerY + centerOffset);
        ctx.restore();
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontWeight} ${Math.round(fontSize)}px "Poppins", sans-serif`;
        ctx.fillStyle = textGradient;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = Math.max(1, fontSize * 0.05);
        ctx.fillText(text, centerTextX, centerY - centerOffset);
        ctx.strokeText(text, centerTextX, centerY - centerOffset);
        ctx.restore();
      };
      drawBeveledText(dateLabel, dateFont, dateTextCenterY, customCenterLabel ? 800 : 700);
      if (!isFootballScoresLayout && timeLabel && !shouldHideTimeLabel) {
        drawBeveledText(timeLabel, timeFont, effectiveTimeCenterY, 800);
      }

      const sideTextPadding = customCenterLabel ? textGap + 8 : textGap;
      const centerGapPadding = customCenterLabel ? textGap + 12 : textGap;
      const teamTextBias = customCenterLabel ? 18 * scheduleScale : 0;

      const leftTextX = leftCircleCenterX + circleRadius + sideTextPadding;
      const leftAreaEnd = centerX - centerGapPadding;
      const leftTextWidth = Math.max(60, leftAreaEnd - leftTextX);

      const rightTextX = centerX + centerWidth + centerGapPadding;
      const rightAreaEnd = rightCircleCenterX - circleRadius - sideTextPadding;
      const rightTextWidth = Math.max(60, rightAreaEnd - rightTextX);

      drawTeamBlock(
        match.teamHome,
        "Tuan Rumah",
        leftTextX,
        leftTextWidth,
        centerY,
        { textCenterBias: customCenterLabel ? -teamTextBias : 0 }
      );
      drawTeamBlock(
        match.teamAway,
        "Tim Tamu",
        rightTextX,
        rightTextWidth,
        centerY,
        { textCenterBias: customCenterLabel ? teamTextBias : 0 }
      );

      const homeBadgeLetter =
        (match.teamHome && match.teamHome.trim()[0]?.toUpperCase()) || "H";
      const awayBadgeLetter =
        (match.teamAway && match.teamAway.trim()[0]?.toUpperCase()) || "A";

      drawTeamBadge(
        match.homeLogoImage,
        leftCircleCenterX,
        centerY,
        circleRadius,
        homeBadgeLetter,
        {
          scale: match.teamHomeLogoScale,
          offsetX: match.teamHomeLogoOffsetX,
          offsetY: match.teamHomeLogoOffsetY,
        }
      );
      drawTeamBadge(
        match.awayLogoImage,
        rightCircleCenterX,
        centerY,
        circleRadius,
        awayBadgeLetter,
        {
          scale: match.teamAwayLogoScale,
          offsetX: match.teamAwayLogoOffsetX,
          offsetY: match.teamAwayLogoOffsetY,
        }
      );
    });

  };

  // ===== Rows: Default + Esports (standard schedule) =====
  const drawStandardScheduleRows = (useEsportsLayout = false) => {
    const isEsportsLayout = Boolean(useEsportsLayout);
    const baseDateHeight = 36;
    const baseCardHeight = 132;
    const baseBetweenBarAndCard = 8;
    const baseRowGap = 26;
    const baseTimeWidth = 140;

    const baseRowTotal =
      baseDateHeight + baseBetweenBarAndCard + baseCardHeight;
    const baseTotalHeight =
      matchCount * baseRowTotal +
      Math.max(matchCount - 1, 0) * baseRowGap;

    let scale =
      baseTotalHeight > availableHeight
        ? availableHeight / baseTotalHeight
        : 1;

    let dateHeight = clampMin(baseDateHeight * scale, 20);
    let cardHeight = clampMin(baseCardHeight * scale, 88);
    let betweenBarAndCard = clampMin(
      baseBetweenBarAndCard * scale,
      4
    );
    let rowGap = clampMin(baseRowGap * scale, 10);
    let rowTotal = dateHeight + betweenBarAndCard + cardHeight;
    let adjustedHeight =
      matchCount * rowTotal + Math.max(matchCount - 1, 0) * rowGap;

    if (isEsportsLayout) {
      const fixedRowHeight = clampMin(110, 90);
      const minGap = 12;
      const maxGap = 36;

      scale = 1;
      dateHeight = 0;
      betweenBarAndCard = 0;
      cardHeight = fixedRowHeight;
      rowTotal = cardHeight;

      rowGap =
        matchCount > 1
          ? clamp(
              (availableHeight - matchCount * rowTotal) / (matchCount - 1),
              minGap,
              maxGap
            )
          : 0;
      adjustedHeight =
        matchCount * rowTotal + Math.max(matchCount - 1, 0) * rowGap;
    } else if (adjustedHeight > availableHeight) {
      const overflowScale = availableHeight / adjustedHeight;
      dateHeight = clampMin(dateHeight * overflowScale, 20);
      cardHeight = clampMin(cardHeight * overflowScale, 88);
      betweenBarAndCard = clampMin(
        betweenBarAndCard * overflowScale,
        4
      );
      rowGap = clampMin(rowGap * overflowScale, 10);

      rowTotal = dateHeight + betweenBarAndCard + cardHeight;
      adjustedHeight =
        matchCount * rowTotal + Math.max(matchCount - 1, 0) * rowGap;
    }

    const detailScale = Math.min(scale, rowTotal / baseRowTotal);
    const spacingScale = Math.min(scale, rowGap / baseRowGap || scale);

    const verticalOffset =
      adjustedHeight < availableHeight
        ? (availableHeight - adjustedHeight) / 2
        : 0;

    const baseInset = isEsportsLayout ? 130 : 90;
    const cardWidth = ctx.canvas.width - baseInset * 2;
    const dateTimeGap = Math.max(16, 26 * spacingScale);
    const innerPaddingX = Math.max(28, 38 * detailScale);
    const innerPaddingY = Math.max(12, 20 * detailScale);
    const gapBetweenBlocks = Math.max(18, 28 * detailScale);
    const vsDiameter = Math.max(88, 112 * detailScale);
    const cardRadius = Math.max(24, 34 * detailScale);
    const nameAreaHeight = cardHeight - innerPaddingY * 2;

    const nameFontFamily = '"Poppins", sans-serif';
    const nameFontWeight = 700;

    const buildTeamNameLayout = (label, width, fallback, forcedMaxFontSize) => {
      if (width <= 0) return null;
      const baseText = (label && label.trim()) || fallback || "Tim TBD";
      const rawText = baseText.toUpperCase();
      const paddingX = Math.max(14, 22 * detailScale);
      const availableWidth = Math.max(0, width - paddingX * 2);
      const targetMaxFontSize =
        forcedMaxFontSize ?? Math.min(38 * detailScale, nameAreaHeight * 0.58);
      const layout = layoutTeamName(ctx, rawText, {
        maxWidth: availableWidth,
        maxFontSize: targetMaxFontSize,
        minFontSize: 18,
        fontWeight: nameFontWeight,
        fontFamily: nameFontFamily,
      });
      return { text: rawText, layout };
    };

    const renderTeamNameLayout = (info, x, width, centerY) => {
      if (!info || !info.layout) return;
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#e2e8f0";
      ctx.textAlign = "center";
      ctx.font = `${nameFontWeight} ${Math.round(info.layout.fontSize)}px ${nameFontFamily}`;
      const lines =
        info.layout.lines && info.layout.lines.length ? info.layout.lines : [info.text];
      const lineCount = lines.length;
      const lineHeight = info.layout.fontSize * (lineCount > 1 ? 1.08 : 1);
      const firstLineY = centerY - ((lineCount - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, x + width / 2, firstLineY + index * lineHeight);
      });
      ctx.restore();
    };

    const drawTextFitRect = (
      text,
      x,
      y,
      width,
      height,
      {
        color = "#111827",
        weight = 800,
        family = '"Poppins", sans-serif',
        minSize = 10,
        maxSize = Math.max(10, height * 0.7),
      } = {}
    ) => {
      const content = (text ?? "").toString();
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      applyFittedFont(ctx, content, {
        maxSize,
        minSize,
        weight,
        maxWidth: Math.max(0, width * 0.92),
        family,
      });
      ctx.fillStyle = color;
      ctx.fillText(content, x + width / 2, y + height / 2);
      ctx.restore();
    };

    const drawBroadcastLetter = (text, x, y, width, height, maxSize) => {
      const content = (text ?? "").toString();
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      applyFittedFont(ctx, content, {
        maxSize: maxSize ?? Math.max(10, height * 0.9),
        minSize: 10,
        weight: 900,
        maxWidth: Math.max(0, width * 0.92),
        family: '"Poppins", sans-serif',
      });
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = Math.max(1, cardHeight * 0.02);
      ctx.shadowOffsetX = 0;
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = Math.max(2, cardHeight * 0.035);
      ctx.fillStyle = "#ffffff";
      ctx.strokeText(content, centerX, centerY);
      ctx.fillText(content, centerX, centerY);
      ctx.restore();
    };

    const drawLogoBoxRect = (image, x, y, size, fallbackName) => {
      ctx.save();
      ctx.fillStyle = "#6B7280";
      ctx.fillRect(x, y, size, size);

      if (image) {
        const padding = size * 0.12;
        const slot = size - padding * 2;
        const naturalWidth = image.naturalWidth || image.width || slot;
        const naturalHeight = image.naturalHeight || image.height || slot;
        const scale = Math.min(slot / naturalWidth, slot / naturalHeight);
        const renderWidth = naturalWidth * scale;
        const renderHeight = naturalHeight * scale;
        const renderX = x + (size - renderWidth) / 2;
        const renderY = y + (size - renderHeight) / 2;
        ctx.drawImage(image, renderX, renderY, renderWidth, renderHeight);
        ctx.restore();
        return;
      }

      const raw = (fallbackName || "FC").trim().toUpperCase();
      const initials = raw
        .split(/\s+/)
        .map((word) => word[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2);
      drawTextFitRect(initials || "FC", x, y, size, size, {
        color: "#ffffff",
        weight: 900,
        maxSize: size * 0.42,
        minSize: 10,
      });
      ctx.restore();
    };

    const drawTeamNameRect = (label, x, y, width, height) => {
      const text = ((label && label.trim()) || "TBD").toUpperCase();
      const layout = layoutTeamName(ctx, text, {
        maxWidth: Math.max(0, width * 0.9),
        maxFontSize: Math.max(14, height * 0.42),
        minFontSize: 12,
        fontWeight: 900,
        fontFamily: '"Poppins", sans-serif',
      });
      const lines =
        layout.lines && layout.lines.length ? layout.lines.slice(0, 2) : [text];
      const lineCount = lines.length;
      const lineHeight = layout.fontSize * (lineCount > 1 ? 1.05 : 1);
      const firstLineY = y + height / 2 - ((lineCount - 1) * lineHeight) / 2;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${Math.round(layout.fontSize)}px "Poppins", sans-serif`;
      lines.forEach((line, idx) => {
        ctx.fillText(line, x + width / 2, firstLineY + idx * lineHeight);
      });
      ctx.restore();
    };

    matches.forEach((match, index) => {
      let cardX = baseInset;
      let esportsSlot = null;
      if (isEsportsLayout) {
        const slotSize = cardHeight;
        const slotGap = Math.max(18, 28 * detailScale);
        const combinedWidth = slotSize + slotGap + cardWidth;
        const startX = Math.max(12, (ctx.canvas.width - combinedWidth) / 2);
        esportsSlot = {
          x: startX,
          y: 0, // placeholder, set later
          size: slotSize,
        };
        cardX = startX + slotSize + slotGap;
      }

      const rowTop =
        startY + verticalOffset + index * (rowTotal + rowGap);
      const barY = rowTop;
      const cardY = barY + dateHeight + betweenBarAndCard;

      if (isEsportsLayout) {
        const rowX = baseInset;
        const rowY = cardY;
        const rowHeight = cardHeight;
        const frontWidth = cardWidth;

        const logoBoxSize = rowHeight;
        const centerWidth = rowHeight * 1.6;
        const rawNameBarWidth =
          (frontWidth - (logoBoxSize * 2 + centerWidth)) / 2;
        const nameBarWidth = Math.max(0, rawNameBarWidth);

        const dateHeightRect = rowHeight * 0.22;
        const timeHeightRect = rowHeight * 0.22;
        const centerStackGap = Math.max(6, rowHeight * 0.06);
        const gameSize = Math.max(
          40,
          rowHeight - dateHeightRect - timeHeightRect - centerStackGap * 2
        );

        const blueName = "#2B2FFF";
        const redDate = "#EF4444";
        const yellowGame = "#FACC15";
        const greenTime = "#22C55E";

        const columnGap = Math.max(14, rowHeight * 0.12);
        const totalBlocksWidth =
          nameBarWidth * 2 + logoBoxSize * 2 + centerWidth + columnGap * 4;
        const contentX = rowX + (frontWidth - totalBlocksWidth) / 2;

        const leftNameX = contentX;
        const leftLogoX = leftNameX + nameBarWidth + columnGap;
        const centerX = leftLogoX + logoBoxSize + columnGap;
        const rightLogoX = centerX + centerWidth + columnGap;
        const rightNameX = rightLogoX + logoBoxSize + columnGap;

        const blueInsetY = Math.max(10, rowHeight * 0.18);
        const blueY = rowY + blueInsetY;
        const blueH = rowHeight - blueInsetY * 2;
        const nameRectInsetX = Math.max(12, rowHeight * 0.12);
        const nameRectWidth = Math.max(0, nameBarWidth - nameRectInsetX);

        ctx.save();
        ctx.fillStyle = blueName;
        ctx.fillRect(leftNameX, blueY, nameRectWidth, blueH);
        ctx.fillRect(rightNameX + nameRectInsetX, blueY, nameRectWidth, blueH);
        ctx.restore();

        drawTeamNameRect(match.teamHome, leftNameX, blueY, nameRectWidth, blueH);
        drawTeamNameRect(match.teamAway, rightNameX + nameRectInsetX, blueY, nameRectWidth, blueH);

        drawLogoBoxRect(
          match.homeLogoImage,
          leftLogoX,
          rowY,
          logoBoxSize,
          match.teamHome
        );
        drawLogoBoxRect(
          match.awayLogoImage,
          rightLogoX,
          rowY,
          logoBoxSize,
          match.teamAway
        );

        const dateText = (formatDate(match.date) || "JADWAL TBD").toUpperCase();
        const timeText = (match.time ? formatTime(match.time) : "WAKTU TBD").toUpperCase();

        const dateRect = {
          x: centerX,
          y: rowY,
          w: centerWidth,
          h: dateHeightRect,
        };
        const gameRect = {
          x: centerX + (centerWidth - gameSize) / 2,
          y: rowY + dateHeightRect + centerStackGap,
          w: gameSize,
          h: gameSize,
        };
        const timeRect = {
          x: centerX,
          y: gameRect.y + gameRect.h + centerStackGap,
          w: centerWidth,
          h: timeHeightRect,
        };

        ctx.save();
        ctx.fillStyle = redDate;
        ctx.fillRect(dateRect.x, dateRect.y, dateRect.w, dateRect.h);
        ctx.fillStyle = yellowGame;
        ctx.fillRect(gameRect.x, gameRect.y, gameRect.w, gameRect.h);
        ctx.fillStyle = greenTime;
        ctx.fillRect(timeRect.x, timeRect.y, timeRect.w, timeRect.h);
        ctx.restore();

        drawTextFitRect(dateText, dateRect.x, dateRect.y, dateRect.w, dateRect.h, {
          color: "#ffffff",
          weight: 900,
          maxSize: dateRect.h * 0.75,
          minSize: 10,
        });

        drawTextFitRect(timeText, timeRect.x, timeRect.y, timeRect.w, timeRect.h, {
          color: "#111827",
          weight: 900,
          maxSize: timeRect.h * 0.75,
          minSize: 10,
        });

        if (match.gameLogoImage) {
          const padding = gameSize * 0.12;
          const slot = gameSize - padding * 2;
          const naturalWidth =
            match.gameLogoImage.naturalWidth || match.gameLogoImage.width || slot;
          const naturalHeight =
            match.gameLogoImage.naturalHeight || match.gameLogoImage.height || slot;
          const containScale = Math.min(slot / naturalWidth, slot / naturalHeight);
          const renderWidth = naturalWidth * containScale;
          const renderHeight = naturalHeight * containScale;
          const renderX = gameRect.x + (gameRect.w - renderWidth) / 2;
          const renderY = gameRect.y + (gameRect.h - renderHeight) / 2;
          ctx.drawImage(match.gameLogoImage, renderX, renderY, renderWidth, renderHeight);
        } else {
          drawTextFitRect("GAME", gameRect.x, gameRect.y, gameRect.w, gameRect.h, {
            color: "#111827",
            weight: 900,
            maxSize: gameRect.h * 0.42,
            minSize: 10,
          });
        }

        const sideGap = Math.max(0, (centerWidth - gameSize) / 2);
        const letterSize = Math.max(14, gameRect.h * 0.92);
        drawBroadcastLetter("V", centerX, gameRect.y, sideGap, gameRect.h, letterSize);
        drawBroadcastLetter(
          "S",
          gameRect.x + gameRect.w,
          gameRect.y,
          sideGap,
          gameRect.h,
          letterSize
        );

        return;
      }

      const timeWidth = Math.max(105, baseTimeWidth * scale);
      const dateLabel = formatDate(match.date);
      const timeLabel = match.time ? formatTime(match.time) : "Waktu TBD";

      const dateLeftLimit = cardX;
      const dateRightLimit = cardX + cardWidth - timeWidth - dateTimeGap;
      const availableDateWidth = Math.max(0, dateRightLimit - dateLeftLimit);
      const datePaddingX = Math.max(16, 22 * detailScale);
      const pillRadius = Math.max(dateHeight / 2, 14);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (availableDateWidth > 0) {
        const minDateWidth = Math.min(
          availableDateWidth,
          clampMin(180 * detailScale, 140)
        );
        const maxTextWidth =
          availableDateWidth > datePaddingX * 2
            ? availableDateWidth - datePaddingX * 2
            : undefined;
        applyFittedFont(ctx, dateLabel, {
          maxSize: Math.max(20, 28 * detailScale),
          minSize: 16,
          weight: 700,
          maxWidth: maxTextWidth,
        });
        const dateTextWidth = ctx.measureText(dateLabel).width;
        let dateWidth = Math.min(
          availableDateWidth,
          Math.max(minDateWidth, dateTextWidth + datePaddingX * 2)
        );
        const desiredCenter = cardX + cardWidth / 2;
        let dateX = desiredCenter - dateWidth / 2;
        if (dateX < dateLeftLimit) dateX = dateLeftLimit;
        if (dateX + dateWidth > dateRightLimit) {
          dateX = Math.max(dateLeftLimit, dateRightLimit - dateWidth);
        }
        ctx.save();
        drawRoundedRectPath(ctx, dateX, barY, dateWidth, dateHeight, pillRadius);
        const dateGradient = ctx.createLinearGradient(
          dateX,
          barY,
          dateX + dateWidth,
          barY + dateHeight
        );
        dateGradient.addColorStop(0, headerStart);
        dateGradient.addColorStop(1, headerEnd);
        ctx.fillStyle = dateGradient;
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = dateTextColor;
        if (isEsportsLayout || isBasketballMode || isFootballMode) {
          ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
          ctx.shadowBlur = Math.max(6, 12 * detailScale);
          ctx.shadowOffsetY = Math.max(1, 2 * detailScale);
        }
        ctx.fillText(dateLabel, dateX + dateWidth / 2, barY + dateHeight / 2);
      } else {
        applyFittedFont(ctx, dateLabel, {
          maxSize: Math.max(20, 28 * detailScale),
          minSize: 16,
          weight: 700,
        });
      }

      const timeX = cardX + cardWidth - timeWidth;
      ctx.save();
      drawRoundedRectPath(ctx, timeX, barY, timeWidth, dateHeight, pillRadius);
      const timeGradient = ctx.createLinearGradient(
        timeX,
        barY,
        timeX + timeWidth,
        barY + dateHeight
      );
      timeGradient.addColorStop(0, footerStart);
      timeGradient.addColorStop(1, footerEnd);
      ctx.fillStyle = timeGradient;
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = timeTextColor;
      ctx.font = `700 ${Math.max(18, 24 * detailScale)}px Poppins`;
      if (isEsportsLayout || isBasketballMode || isFootballMode) {
        ctx.shadowColor = "rgba(15, 23, 42, 0.65)";
        ctx.shadowBlur = Math.max(6, 12 * detailScale);
        ctx.shadowOffsetY = Math.max(1, 2 * detailScale);
      }
      ctx.fillText(timeLabel, timeX + timeWidth / 2, barY + dateHeight / 2);

      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
      ctx.shadowBlur = Math.max(20, 34 * detailScale);
      ctx.shadowOffsetY = Math.max(8, 14 * detailScale);
      drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      const cardGradient = ctx.createLinearGradient(
        cardX,
        cardY,
        cardX + cardWidth,
        cardY + cardHeight
      );
      cardGradient.addColorStop(0, "#1f2937");
      cardGradient.addColorStop(0.5, "#111827");
      cardGradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = cardGradient;
      ctx.fill();
      ctx.restore();

      ctx.save();
      drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
      ctx.lineWidth = Math.max(1.6, 2.2 * detailScale);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      drawRoundedRectPath(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius);
      const glassGradient = ctx.createLinearGradient(
        cardX,
        cardY,
        cardX,
        cardY + cardHeight
      );
      glassGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      glassGradient.addColorStop(1, "rgba(148, 163, 184, 0.04)");
      ctx.fillStyle = glassGradient;
      ctx.fill();
      ctx.restore();

      const innerTop = cardY + innerPaddingY;
      const textCenterY = innerTop + nameAreaHeight / 2;

      const logoSize = Math.min(
        nameAreaHeight,
        Math.max(78, 104 * detailScale)
      );
      const logoY = innerTop + (nameAreaHeight - logoSize) / 2;

      const leftLogoX = cardX + innerPaddingX;
      const rightLogoX = cardX + cardWidth - innerPaddingX - logoSize;

      if (isEsportsLayout && esportsSlot) {
        const slotSize = esportsSlot.size;
        const slotY = cardY;
        drawEsportsGameSlot(ctx, esportsSlot.x, slotY, slotSize, {
          logoImage: match.gameLogoImage,
          label: match.gameName,
        });
      }

      drawLogoTile(
        ctx,
        match.homeLogoImage,
        leftLogoX,
        logoY,
        logoSize,
        match.teamHome,
        {
          scale: match.teamHomeLogoScale,
          offsetX: match.teamHomeLogoOffsetX,
          offsetY: match.teamHomeLogoOffsetY,
          placeholderColors: TEAM_LOGO_PLACEHOLDER_COLORS,
        }
      );
      drawLogoTile(
        ctx,
        match.awayLogoImage,
        rightLogoX,
        logoY,
        logoSize,
        match.teamAway,
        {
          scale: match.teamAwayLogoScale,
          offsetX: match.teamAwayLogoOffsetX,
          offsetY: match.teamAwayLogoOffsetY,
          placeholderColors: TEAM_LOGO_PLACEHOLDER_COLORS,
        }
      );

      const leftNameX = leftLogoX + logoSize + gapBetweenBlocks;
      const vsRadius = vsDiameter / 2;
      const vsCenterX = cardX + cardWidth / 2;
      const leftNameEnd = vsCenterX - vsRadius - gapBetweenBlocks;
      const leftNameWidth = Math.max(0, leftNameEnd - leftNameX);

      const rightNameX = vsCenterX + vsRadius + gapBetweenBlocks;
      const rightNameEnd = rightLogoX - gapBetweenBlocks;
      const rightNameWidth = Math.max(0, rightNameEnd - rightNameX);

      const homeNameLayout = buildTeamNameLayout(match.teamHome, leftNameWidth, "Tuan Rumah");
      const awayNameLayout = buildTeamNameLayout(match.teamAway, rightNameWidth, "Tim Tamu");
      let normalizedHomeLayout = homeNameLayout;
      let normalizedAwayLayout = awayNameLayout;
      if (homeNameLayout && awayNameLayout) {
        const sharedFontSize = Math.min(
          homeNameLayout.layout.fontSize || 0,
          awayNameLayout.layout.fontSize || 0
        );
        if (Number.isFinite(sharedFontSize) && sharedFontSize > 0) {
          if (sharedFontSize < (homeNameLayout.layout.fontSize || 0) - 0.1) {
            normalizedHomeLayout = buildTeamNameLayout(
              match.teamHome,
              leftNameWidth,
              "Tuan Rumah",
              sharedFontSize
            );
          }
          if (sharedFontSize < (awayNameLayout.layout.fontSize || 0) - 0.1) {
            normalizedAwayLayout = buildTeamNameLayout(
              match.teamAway,
              rightNameWidth,
              "Tim Tamu",
              sharedFontSize
            );
          }
        }
      }

      renderTeamNameLayout(normalizedHomeLayout, leftNameX, leftNameWidth, textCenterY);
      renderTeamNameLayout(normalizedAwayLayout, rightNameX, rightNameWidth, textCenterY);

      drawVsBadge(ctx, vsCenterX, textCenterY, vsRadius, detailScale);
    });
  };

  // ===== Rows: Esports (schedule wrapper) =====
  const drawEsportsScheduleRows = () => {
    drawStandardScheduleRows(true);
  };

  // =====================================================================
  // LAYOUT ROUTERS
  // =====================================================================

  // ===== Layout: Football (submenu router) =====
  const drawFootballLayout = () => {
    const rawSubMenu = footballSubMenu || "schedule";
    const effectiveSubMenu =
      rawSubMenu === "schedule" && customCenterLabel ? "bigmatch" : rawSubMenu;

    const drawFootballScheduleRows = () =>
      drawFootballRows({ isScoresLayout: false, centerLabel: null });
    const drawFootballScoresRows = () =>
      drawFootballRows({ isScoresLayout: true, centerLabel: null });
    const drawFootballBigMatch = () =>
      drawFootballRows({
        isScoresLayout: false,
        centerLabel: customCenterLabel || { title: "VS" },
      });

    if (effectiveSubMenu === "scores") {
      drawFootballScoresRows();
      return;
    }
    if (effectiveSubMenu === "bigmatch") {
      drawFootballBigMatch();
      return;
    }
    drawFootballScheduleRows();
  };

  // =====================================================================
  // ROUTING (pick mode/submenu layout)
  // =====================================================================

  if (isFootballMode) {
    drawFootballLayout();
    ctx.restore();
    return;
  }

  if (isBasketballScheduleLayout) {
    drawBasketballScheduleRows();
    ctx.restore();
    return;
  }

  if (isEsportsMode) {
    drawEsportsScheduleRows();
    ctx.restore();
    return;
  }

  drawStandardScheduleRows();
  ctx.restore();
};


const drawBigMatchLayout = (
  ctx,
  {
    matchesWithImages = [],
    matchesStartY = 0,
    brandPalette = DEFAULT_BRAND_PALETTE,
    bigMatchDetails = {},
    brandDisplayName = "",
  } = {}
) => {
  if (!ctx || !matchesWithImages.length) {
    return;
  }

  const subtitle = bigMatchDetails?.matchDateLabel
    ? bigMatchDetails.matchDateLabel.toUpperCase()
    : "";

  const singleMatch = [matchesWithImages[0]];
  const canvasHeight = ctx.canvas?.height || 1080;
  const desiredOffset = Math.max(canvasHeight * 0.38, 320);
  const maxAllowedStart = canvasHeight - 360;
  const adjustedStartY = Math.min(
    maxAllowedStart,
    Math.max(matchesStartY, matchesStartY + desiredOffset)
  );
  drawMatches(ctx, singleMatch, adjustedStartY, brandPalette, {
    mode: "football",
    activeSubMenu: "bigmatch",
    brandDisplayName,
    customCenterLabel: {
      title: "VS",
      subtitle,
    },
  });
};

// =====================================================================
// EXPORTS
// =====================================================================

export { drawMatches, drawBigMatchLayout };
