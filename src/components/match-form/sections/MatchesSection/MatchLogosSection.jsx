import React from "react";
import PropTypes from "prop-types";
import ImageUploadPreview from "../../ui/ImageUploadPreview";
import { buildLogoSlotKey } from "../../utils";

const MatchLogosSection = ({
  index,
  match,
  onMatchFieldChange,
  onAutoLogoRequest,
  onLogoAdjust,
  resolveAutoLogoSrc,
  canUseBackgroundRemoval,
  onRemoveLogoBackground,
  logoBackgroundRemovalState,
  readFileAsDataURL,
}) => {
  const homeLogoRemovalKey = buildLogoSlotKey(index, "home");
  const awayLogoRemovalKey = buildLogoSlotKey(index, "away");
  const homeLogoRemovalState = logoBackgroundRemovalState[homeLogoRemovalKey] || {};
  const awayLogoRemovalState = logoBackgroundRemovalState[awayLogoRemovalKey] || {};

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <ImageUploadPreview
        label="Logo Tuan Rumah"
        helperText="PNG transparan 1:1 disarankan."
        previewSrc={match.teamHomeLogo}
        onChange={(value) => onMatchFieldChange(index, "teamHomeLogo", value)}
        inputId={`home-logo-${index}`}
        ratioHint="1:1 (maks 300x300 px)"
        isAuto={match.teamHomeLogoIsAuto}
        onAutoFetch={() => onAutoLogoRequest?.(index, "home")}
        canAutoFetch={Boolean(resolveAutoLogoSrc(match.teamHome))}
        scale={match.teamHomeLogoScale}
        offsetX={match.teamHomeLogoOffsetX}
        offsetY={match.teamHomeLogoOffsetY}
        onAdjust={(adjustments) => onLogoAdjust?.(index, "home", adjustments)}
        canRemoveBackground={canUseBackgroundRemoval}
        onRemoveBackground={() =>
          onRemoveLogoBackground?.(index, "home", match.teamHomeLogo)
        }
        isRemovingBackground={Boolean(homeLogoRemovalState.loading)}
        removeBackgroundError={homeLogoRemovalState.error || ""}
        readFileAsDataURL={readFileAsDataURL}
      />
      <ImageUploadPreview
        label="Logo Tim Tamu"
        helperText="PNG transparan 1:1 disarankan."
        previewSrc={match.teamAwayLogo}
        onChange={(value) => onMatchFieldChange(index, "teamAwayLogo", value)}
        inputId={`away-logo-${index}`}
        ratioHint="1:1 (maks 300x300 px)"
        isAuto={match.teamAwayLogoIsAuto}
        onAutoFetch={() => onAutoLogoRequest?.(index, "away")}
        canAutoFetch={Boolean(resolveAutoLogoSrc(match.teamAway))}
        scale={match.teamAwayLogoScale}
        offsetX={match.teamAwayLogoOffsetX}
        offsetY={match.teamAwayLogoOffsetY}
        onAdjust={(adjustments) => onLogoAdjust?.(index, "away", adjustments)}
        canRemoveBackground={canUseBackgroundRemoval}
        onRemoveBackground={() =>
          onRemoveLogoBackground?.(index, "away", match.teamAwayLogo)
        }
        isRemovingBackground={Boolean(awayLogoRemovalState.loading)}
        removeBackgroundError={awayLogoRemovalState.error || ""}
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
  onAutoLogoRequest: PropTypes.func,
  onLogoAdjust: PropTypes.func,
  resolveAutoLogoSrc: PropTypes.func.isRequired,
  canUseBackgroundRemoval: PropTypes.bool,
  onRemoveLogoBackground: PropTypes.func,
  logoBackgroundRemovalState: PropTypes.object.isRequired,
  readFileAsDataURL: PropTypes.func.isRequired,
};

export default MatchLogosSection;

