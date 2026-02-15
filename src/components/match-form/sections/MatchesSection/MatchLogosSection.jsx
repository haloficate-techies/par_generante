import React from "react";
import PropTypes from "prop-types";
import ImageUploadPreview from "../../ui/ImageUploadPreview";
import { buildLogoSlotKey } from "../../utils";

const MatchLogosSection = ({
  index,
  match,
  onMatchFieldChange,
  onLogoAdjust,
  canUseBackgroundRemoval,
  onRemoveLogoBackground,
  logoBackgroundRemovalState,
  readFileAsDataURL,
}) => {
  const homeLogoRemovalKey = buildLogoSlotKey(index, "home");
  const awayLogoRemovalKey = buildLogoSlotKey(index, "away");
  const homeLogoRemovalState = logoBackgroundRemovalState[homeLogoRemovalKey] || {};
  const awayLogoRemovalState = logoBackgroundRemovalState[awayLogoRemovalKey] || {};
  const homeIsAuto = Boolean(match.teamHomeLogoIsAuto);
  const awayIsAuto = Boolean(match.teamAwayLogoIsAuto);

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <ImageUploadPreview
        label="Logo Tuan Rumah"
        helperText="PNG transparan 1:1 disarankan."
        previewSrc={match.teamHomeLogo}
        onChange={(value) => onMatchFieldChange(index, "teamHomeLogo", value)}
        inputId={`home-logo-${index}`}
        ratioHint="1:1 (maks 300x300 px)"
        helperAsTooltip
        unifiedSlot
        hideManualInputWhenPreview
        slotHeight="h-40"
        autoIndicator={match.teamHomeLogoIsAuto}
        scale={match.teamHomeLogoScale}
        offsetX={match.teamHomeLogoOffsetX}
        offsetY={match.teamHomeLogoOffsetY}
        onAdjust={(adjustments) => onLogoAdjust?.(index, "home", adjustments)}
        canRemoveBackground={canUseBackgroundRemoval && Boolean(match.teamHomeLogo)}
        collapseRemoveActionOnDone
        showRemovedBadge
        onRemoveBackground={
          homeIsAuto ? undefined : () => onRemoveLogoBackground?.(index, "home", match.teamHomeLogo)
        }
        isRemovingBackground={homeIsAuto ? false : Boolean(homeLogoRemovalState.loading)}
        isBackgroundRemoved={homeIsAuto ? true : Boolean(homeLogoRemovalState.removed)}
        removeBackgroundError={homeIsAuto ? "" : homeLogoRemovalState.error || ""}
        adjustmentLabels={{
          scaleLabel: "Ukuran",
          offsetLabel: "Posisi",
          scaleTooltip: "Atur ukuran gambar",
          offsetXTooltip: "Geser horizontal",
          offsetYTooltip: "Geser vertikal",
          scaleAriaLabel: "Ukuran gambar",
          offsetXAriaLabel: "Posisi horizontal",
          offsetYAriaLabel: "Posisi vertikal",
          offsetXLabel: "Horizontal",
          offsetYLabel: "Vertikal",
        }}
        readFileAsDataURL={readFileAsDataURL}
      />
      <ImageUploadPreview
        label="Logo Tim Tamu"
        helperText="PNG transparan 1:1 disarankan."
        previewSrc={match.teamAwayLogo}
        onChange={(value) => onMatchFieldChange(index, "teamAwayLogo", value)}
        inputId={`away-logo-${index}`}
        ratioHint="1:1 (maks 300x300 px)"
        helperAsTooltip
        unifiedSlot
        hideManualInputWhenPreview
        slotHeight="h-40"
        autoIndicator={match.teamAwayLogoIsAuto}
        scale={match.teamAwayLogoScale}
        offsetX={match.teamAwayLogoOffsetX}
        offsetY={match.teamAwayLogoOffsetY}
        onAdjust={(adjustments) => onLogoAdjust?.(index, "away", adjustments)}
        canRemoveBackground={canUseBackgroundRemoval && Boolean(match.teamAwayLogo)}
        collapseRemoveActionOnDone
        showRemovedBadge
        onRemoveBackground={
          awayIsAuto ? undefined : () => onRemoveLogoBackground?.(index, "away", match.teamAwayLogo)
        }
        isRemovingBackground={awayIsAuto ? false : Boolean(awayLogoRemovalState.loading)}
        isBackgroundRemoved={awayIsAuto ? true : Boolean(awayLogoRemovalState.removed)}
        removeBackgroundError={awayIsAuto ? "" : awayLogoRemovalState.error || ""}
        adjustmentLabels={{
          scaleLabel: "Ukuran",
          offsetLabel: "Posisi",
          scaleTooltip: "Atur ukuran gambar",
          offsetXTooltip: "Geser horizontal",
          offsetYTooltip: "Geser vertikal",
          scaleAriaLabel: "Ukuran gambar",
          offsetXAriaLabel: "Posisi horizontal",
          offsetYAriaLabel: "Posisi vertikal",
          offsetXLabel: "Horizontal",
          offsetYLabel: "Vertikal",
        }}
        readFileAsDataURL={readFileAsDataURL}
      />
    </div>
  );
};

const matchShape = PropTypes.shape({
  teamHomeLogo: PropTypes.string,
  teamHomeLogoIsAuto: PropTypes.bool,
  teamHomeLogoScale: PropTypes.number,
  teamHomeLogoOffsetX: PropTypes.number,
  teamHomeLogoOffsetY: PropTypes.number,
  teamAwayLogo: PropTypes.string,
  teamAwayLogoIsAuto: PropTypes.bool,
  teamAwayLogoScale: PropTypes.number,
  teamAwayLogoOffsetX: PropTypes.number,
  teamAwayLogoOffsetY: PropTypes.number,
});

MatchLogosSection.propTypes = {
  index: PropTypes.number.isRequired,
  match: matchShape.isRequired,
  onMatchFieldChange: PropTypes.func.isRequired,
  onLogoAdjust: PropTypes.func,
  canUseBackgroundRemoval: PropTypes.bool,
  onRemoveLogoBackground: PropTypes.func,
  logoBackgroundRemovalState: PropTypes.object.isRequired,
  readFileAsDataURL: PropTypes.func.isRequired,
};

export default MatchLogosSection;
