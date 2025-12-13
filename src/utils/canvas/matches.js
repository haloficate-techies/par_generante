import {
  DEFAULT_BRAND_PALETTE,
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

export const drawMatches = (
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
  const isFootballScheduleLayout =
    isFootballMode && (options?.activeSubMenu || "schedule") === "schedule";
  const isFootballScoresLayout =
    isFootballMode && options?.activeSubMenu === "scores";
  const matchCount = Math.max(matches.length, 1);
  const shouldApplyScorePadding =
    isFootballScoresLayout && matchCount <= 3;
  const layoutPaddingY = shouldApplyScorePadding
    ? Math.max(32, ctx.canvas.height * 0.035)
    : 0;
  const paddedTop = startY + layoutPaddingY;
  const paddedBottom = bottomLimit - layoutPaddingY;
  const availableHeight = Math.max(paddedBottom - paddedTop, 240);

  if (isFootballScheduleLayout || isFootballScoresLayout) {
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
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "#0f172a";
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
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.fillStyle = "#f8fafc";
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
          .join(" • ") || "JADWAL TBD";
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

    ctx.restore();
    return;
  }

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

  if (adjustedHeight > availableHeight) {
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

  const isEsportsMode = options?.mode === "esports";
  const isBasketballMode = options?.mode === "basketball";
  const baseInset = isEsportsMode ? 130 : 90;
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

  matches.forEach((match, index) => {
    let cardX = baseInset;
    let esportsSlot = null;
    if (isEsportsMode) {
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
      if (isEsportsMode || isBasketballMode || isFootballMode) {
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
    if (isEsportsMode || isBasketballMode || isFootballMode) {
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

    if (isEsportsMode && esportsSlot) {
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

  ctx.restore();
};


export const drawScoreboardMatches = (
  ctx,
  matches = [],
  startY = 0,
  palette = DEFAULT_BRAND_PALETTE,
  options = {}
) => {
  if (!ctx || !Array.isArray(matches) || matches.length === 0) {
    return;
  }

  const canvasWidth = ctx.canvas.width;
  const referenceWidth = 1080;
  const scale = canvasWidth / referenceWidth || 1;
  const baseRowHeight = 150;
  const baseGap = 32;
  const baseCircleSize = 110;
  const baseCenterWidth = 240;
  const baseCenterHeight = 108;
  const baseTextPadding = 28;
  const paddingX = 90 * scale;
  const extraBottomSpacing = Math.max(options?.extraBottomSpacing ?? 0, 0);
  const infoLabel = typeof options?.infoLabel === "string" ? options.infoLabel.trim() : "";
  const FOOTER_HEIGHT = 110;
  const FOOTER_SPACING = 60 + extraBottomSpacing;
  const bottomLimit = ctx.canvas.height - (FOOTER_HEIGHT + FOOTER_SPACING);

  const infoBadgeSpacing = 28 * scale;
  let contentStart = startY;
  if (infoLabel) {
    const badgeHeight = 48 * scale;
    const horizontalPadding = 36 * scale;
    const badgeText = infoLabel.toUpperCase();
    ctx.save();
    ctx.font = `700 ${Math.round(24 * scale)}px "Poppins", sans-serif`;
    const textWidth = ctx.measureText(badgeText).width;
    const badgeWidth = Math.min(
      canvasWidth - paddingX * 2,
      textWidth + horizontalPadding * 2
    );
    const badgeX = (canvasWidth - badgeWidth) / 2;
    const badgeY = startY;
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 6 * scale;
    drawRoundedRectPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    const infoGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
    infoGradient.addColorStop(0, palette?.headerStart || "#f59e0b");
    infoGradient.addColorStop(1, palette?.headerEnd || "#d97706");
    ctx.fillStyle = infoGradient;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = `700 ${Math.round(24 * scale)}px "Poppins", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textX = canvasWidth / 2;
    const textY = badgeY + badgeHeight / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = -1 * scale;
    ctx.shadowOffsetY = -1 * scale;
    ctx.fillText(badgeText, textX, textY);

    ctx.fillStyle = "#f8fafc";
    ctx.shadowColor = "rgba(15, 23, 42, 0.4)";
    ctx.shadowBlur = 14 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4 * scale;
    ctx.fillText(badgeText, textX, textY);
    ctx.restore();

    contentStart = badgeY + badgeHeight + infoBadgeSpacing;
  }

  const matchCount = Math.max(matches.length, 1);
  const rawAvailable = bottomLimit - contentStart;
  const availableHeight = Math.max(rawAvailable, 220);
  const baseTotalHeight = matchCount * baseRowHeight + Math.max(matchCount - 1, 0) * baseGap;
  const layoutScale = baseTotalHeight > availableHeight ? availableHeight / baseTotalHeight : 1;

  const rowHeight = Math.max(90 * scale, baseRowHeight * scale * layoutScale);
  const gap = Math.max(14 * scale, baseGap * scale * layoutScale);
  const centerPanelWidth = Math.max(200 * scale, baseCenterWidth * scale * layoutScale);
  const centerPanelHeight = Math.max(80 * scale, baseCenterHeight * scale * layoutScale);
  const barHeight = centerPanelHeight;
  const circleSizeCandidate = Math.max(barHeight - 6 * scale, 60 * scale);
  const circleSize = Math.min(circleSizeCandidate, baseCircleSize * scale);
  const textPadding = Math.max(18 * scale, baseTextPadding * scale * layoutScale);
  const barRadius = barHeight / 2;
  const centerRadius = Math.min(centerPanelHeight / 2, 36 * scale);
  const adjustedHeight =
    matchCount * rowHeight + Math.max(matchCount - 1, 0) * gap;
  const verticalOffset =
    adjustedHeight < availableHeight ? (availableHeight - adjustedHeight) / 2 : 0;

  const nameBarStartColor = "#192133";
  const nameBarEndColor = "#0f172a";
  const scoreStartColor = palette?.footerStart || "#ef4444";
  const scoreEndColor = palette?.footerEnd || "#ea580c";
  const labelColor = "rgba(248, 250, 252, 0.95)";

  const normalizeScore = (value) => {
    const strValue = value === null || value === undefined ? "" : String(value);
    const digits = strValue.replace(/[^0-9]/g, "").slice(0, 3);
    return digits || "0";
  };

  const renderTeamLabel = (name, areaX, areaWidth, centerY) => {
    if (areaWidth <= 0) return;
    const fallback = "YOUR TEAM";
    const rawLabel = name && name.trim() ? name : fallback;
    const upperLabel = rawLabel.toUpperCase();
    const layout = layoutTeamName(ctx, upperLabel, {
      maxWidth: areaWidth,
      maxFontSize: 32 * scale,
      minFontSize: 16 * scale,
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
    });
    const lines = layout.lines && layout.lines.length ? layout.lines : [upperLabel];
    const lineSpacing = layout.fontSize * 1.15;
    let startY = centerY - (lineSpacing * (lines.length - 1)) / 2;
    ctx.save();
    ctx.fillStyle = labelColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `700 ${Math.round(layout.fontSize)}px "Poppins", sans-serif`;
    lines.forEach((line) => {
      const targetX = areaX + areaWidth / 2;
      ctx.fillText(line.toUpperCase(), targetX, startY);
      startY += lineSpacing;
    });
    ctx.restore();
  };

  matches.forEach((match, index) => {
    const rowTop = contentStart + verticalOffset + index * (rowHeight + gap);
    const rowCenterY = rowTop + rowHeight / 2;
    const barX = paddingX;
    const barWidth = Math.max(canvasWidth - paddingX * 2, 320 * scale);
    const barY = rowCenterY - barHeight / 2;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 8 * scale;
    drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    const barGradient = ctx.createLinearGradient(barX, rowCenterY, barX + barWidth, rowCenterY);
    barGradient.addColorStop(0, nameBarStartColor);
    barGradient.addColorStop(1, nameBarEndColor);
    ctx.fillStyle = barGradient;
    ctx.fill();
    ctx.restore();

    const centerX = (canvasWidth - centerPanelWidth) / 2;
    const centerY = rowCenterY - centerPanelHeight / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 26 * scale;
    ctx.shadowOffsetY = 12 * scale;
    drawRoundedRectPath(ctx, centerX, centerY, centerPanelWidth, centerPanelHeight, centerRadius);
    const centerGradient = ctx.createLinearGradient(
      centerX,
      centerY,
      centerX + centerPanelWidth,
      centerY + centerPanelHeight
    );
    centerGradient.addColorStop(0, scoreStartColor);
    centerGradient.addColorStop(1, scoreEndColor);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.restore();

    const scoreText = `${normalizeScore(match.scoreHome)} - ${normalizeScore(match.scoreAway)}`;
    ctx.save();
    ctx.font = `800 ${Math.round(48 * scale)}px "Montserrat", "Poppins", sans-serif`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * scale;
    ctx.fillText(scoreText, canvasWidth / 2, rowCenterY);
    ctx.restore();

    const logoY = rowCenterY - circleSize / 2;
    const leftLogoX = barX + 7 * scale;
    const rightLogoX = barX + barWidth - circleSize - 7 * scale;

    drawLogoTile(ctx, match.homeLogoImage, leftLogoX, logoY, circleSize, match.teamHome, {
      scale: match.teamHomeLogoScale,
      offsetX: match.teamHomeLogoOffsetX,
      offsetY: match.teamHomeLogoOffsetY,
    });
    drawLogoTile(ctx, match.awayLogoImage, rightLogoX, logoY, circleSize, match.teamAway, {
      scale: match.teamAwayLogoScale,
      offsetX: match.teamAwayLogoOffsetX,
      offsetY: match.teamAwayLogoOffsetY,
    });

    const leftAreaStart = leftLogoX + circleSize + textPadding;
    const leftAreaEnd = canvasWidth / 2 - centerPanelWidth / 2 - textPadding;
    const leftAreaWidth = Math.max(60 * scale, leftAreaEnd - leftAreaStart);
    const rightAreaEnd = rightLogoX - textPadding;
    const rightAreaStart = canvasWidth / 2 + centerPanelWidth / 2 + textPadding;
    const rightAreaWidth = Math.max(60 * scale, rightAreaEnd - rightAreaStart);

    renderTeamLabel(match.teamHome, leftAreaStart, leftAreaWidth, rowCenterY);
    renderTeamLabel(match.teamAway, rightAreaStart, rightAreaWidth, rowCenterY);
  });
};


export const drawBigMatchLayout = (
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
    activeSubMenu: "schedule",
    brandDisplayName,
    customCenterLabel: {
      title: "VS",
      subtitle,
    },
  });
};
