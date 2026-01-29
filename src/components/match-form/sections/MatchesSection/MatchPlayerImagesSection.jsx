import React from "react";
import PropTypes from "prop-types";
import ImageUploadPreview from "../../ui/ImageUploadPreview";
import { buildPlayerSlotKey } from "../../utils";

const MatchPlayerImagesSection = ({
  index,
  match,
  onMatchFieldChange,
  onPlayerImageAdjust,
  onPlayerImageFlipToggle,
  onRemovePlayerBackground,
  playerBackgroundRemovalState,
  canUseBackgroundRemoval,
  readFileAsDataURL,
}) => {
  const homeRemovalKey = buildPlayerSlotKey(index, "home");
  const awayRemovalKey = buildPlayerSlotKey(index, "away");
  const homeRemovalState = playerBackgroundRemovalState[homeRemovalKey] || {};
  const awayRemovalState = playerBackgroundRemovalState[awayRemovalKey] || {};

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <ImageUploadPreview
        label="Foto Pemain Tim Tuan Rumah"
        helperText="Gunakan gambar PNG/JPG dengan latar bersih."
        previewSrc={match.teamHomePlayerImage}
        onChange={(value) => onMatchFieldChange(index, "teamHomePlayerImage", value)}
        inputId={`home-player-${index}`}
        ratioHint="Format potret disarankan"
        helperAsTooltip
        unifiedSlot
        hideManualInputWhenPreview
        slotHeight="h-40"
        scale={match.teamHomePlayerScale}
        offsetX={match.teamHomePlayerOffsetX}
        offsetY={match.teamHomePlayerOffsetY}
        onAdjust={(adjustments) => onPlayerImageAdjust?.(index, "home", adjustments)}
        onToggleFlip={() => onPlayerImageFlipToggle?.(index, "home")}
        isFlipped={Boolean(match.teamHomePlayerFlip)}
        canRemoveBackground={canUseBackgroundRemoval}
        onRemoveBackground={() =>
          onRemovePlayerBackground?.(index, "home", match.teamHomePlayerImage)
        }
        isRemovingBackground={Boolean(homeRemovalState.loading)}
        isBackgroundRemoved={Boolean(homeRemovalState.removed)}
        removeBackgroundError={homeRemovalState.error || ""}
        progressiveDisclosure
        emptyStateHint="Upload foto pemain untuk mengatur tampilan di banner"
        allowManualInputWhenEmpty
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
        label="Foto Pemain Tim Tandang"
        helperText="Gunakan gambar PNG/JPG dengan latar bersih."
        previewSrc={match.teamAwayPlayerImage}
        onChange={(value) => onMatchFieldChange(index, "teamAwayPlayerImage", value)}
        inputId={`away-player-${index}`}
        ratioHint="Format potret disarankan"
        helperAsTooltip
        unifiedSlot
        hideManualInputWhenPreview
        slotHeight="h-40"
        scale={match.teamAwayPlayerScale}
        offsetX={match.teamAwayPlayerOffsetX}
        offsetY={match.teamAwayPlayerOffsetY}
        onAdjust={(adjustments) => onPlayerImageAdjust?.(index, "away", adjustments)}
        onToggleFlip={() => onPlayerImageFlipToggle?.(index, "away")}
        isFlipped={Boolean(match.teamAwayPlayerFlip)}
        canRemoveBackground={canUseBackgroundRemoval}
        onRemoveBackground={() =>
          onRemovePlayerBackground?.(index, "away", match.teamAwayPlayerImage)
        }
        isRemovingBackground={Boolean(awayRemovalState.loading)}
        isBackgroundRemoved={Boolean(awayRemovalState.removed)}
        removeBackgroundError={awayRemovalState.error || ""}
        progressiveDisclosure
        emptyStateHint="Upload foto pemain untuk mengatur tampilan di banner"
        allowManualInputWhenEmpty
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
  teamHomePlayerImage: PropTypes.string,
  teamHomePlayerScale: PropTypes.number,
  teamHomePlayerOffsetX: PropTypes.number,
  teamHomePlayerOffsetY: PropTypes.number,
  teamHomePlayerFlip: PropTypes.bool,
  teamAwayPlayerImage: PropTypes.string,
  teamAwayPlayerScale: PropTypes.number,
  teamAwayPlayerOffsetX: PropTypes.number,
  teamAwayPlayerOffsetY: PropTypes.number,
  teamAwayPlayerFlip: PropTypes.bool,
});

MatchPlayerImagesSection.propTypes = {
  index: PropTypes.number.isRequired,
  match: matchShape.isRequired,
  onMatchFieldChange: PropTypes.func.isRequired,
  onPlayerImageAdjust: PropTypes.func,
  onPlayerImageFlipToggle: PropTypes.func,
  onRemovePlayerBackground: PropTypes.func,
  playerBackgroundRemovalState: PropTypes.object.isRequired,
  canUseBackgroundRemoval: PropTypes.bool,
  readFileAsDataURL: PropTypes.func.isRequired,
};

export default MatchPlayerImagesSection;

