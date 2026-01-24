import React from "react";
import PropTypes from "prop-types";
import { useMatchForm } from "../../contexts";
import MatchBasicInfoInputs from "./MatchBasicInfoInputs";
import MatchScoreInputs from "./MatchScoreInputs";
import MatchLogosSection from "./MatchLogosSection";
import MatchEsportsSection from "./MatchEsportsSection";
import MatchPlayerImagesSection from "./MatchPlayerImagesSection";

const MatchFieldset = ({
  match,
  index,
  isEsportsMode = false,
  gameOptions = [],
  showScoreInputs = false,
  showBigMatchExtras = false,
  teamPlaceholders = {},
}) => {
  const { handlers, media, removalState } = useMatchForm();
  const {
    onMatchFieldChange,
    onAutoLogoRequest,
    onLogoAdjust,
    onPlayerImageAdjust,
    onPlayerImageFlipToggle,
    onRemovePlayerBackground,
    onRemoveLogoBackground,
  } = handlers;
  const {
    resolveAutoLogoSrc = () => "",
    readFileAsDataURL = async () => null,
    canUseBackgroundRemoval = false,
  } = media;
  const {
    player: playerBackgroundRemovalState = {},
    logo: logoBackgroundRemovalState = {},
  } = removalState;

  return (
    <fieldset className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
      <legend className="px-2 text-sm font-semibold text-slate-300">
        Pertandingan {index + 1}
      </legend>
      <MatchBasicInfoInputs
        index={index}
        match={match}
        onMatchFieldChange={onMatchFieldChange}
        teamPlaceholders={teamPlaceholders}
      />
      {showScoreInputs && (
        <MatchScoreInputs
          index={index}
          match={match}
          onMatchFieldChange={onMatchFieldChange}
        />
      )}
      <MatchLogosSection
        index={index}
        match={match}
        onMatchFieldChange={onMatchFieldChange}
        onAutoLogoRequest={onAutoLogoRequest}
        onLogoAdjust={onLogoAdjust}
        resolveAutoLogoSrc={resolveAutoLogoSrc}
        canUseBackgroundRemoval={canUseBackgroundRemoval}
        onRemoveLogoBackground={onRemoveLogoBackground}
        logoBackgroundRemovalState={logoBackgroundRemovalState}
        readFileAsDataURL={readFileAsDataURL}
      />
      {isEsportsMode && (
        <MatchEsportsSection
          index={index}
          match={match}
          gameOptions={gameOptions}
          onMatchFieldChange={onMatchFieldChange}
        />
      )}
      {showBigMatchExtras && (
        <MatchPlayerImagesSection
          index={index}
          match={match}
          onMatchFieldChange={onMatchFieldChange}
          onPlayerImageAdjust={onPlayerImageAdjust}
          onPlayerImageFlipToggle={onPlayerImageFlipToggle}
          onRemovePlayerBackground={onRemovePlayerBackground}
          playerBackgroundRemovalState={playerBackgroundRemovalState}
          canUseBackgroundRemoval={canUseBackgroundRemoval}
          readFileAsDataURL={readFileAsDataURL}
        />
      )}
    </fieldset>
  );
};

const matchShape = PropTypes.shape({
  teamHome: PropTypes.string,
  teamAway: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  scoreHome: PropTypes.string,
  scoreAway: PropTypes.string,
  teamHomeLogo: PropTypes.string,
  teamAwayLogo: PropTypes.string,
  teamHomePlayerImage: PropTypes.string,
  teamAwayPlayerImage: PropTypes.string,
  gameLogo: PropTypes.string,
});

const gameOptionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

MatchFieldset.propTypes = {
  match: matchShape.isRequired,
  index: PropTypes.number.isRequired,
  isEsportsMode: PropTypes.bool,
  gameOptions: PropTypes.arrayOf(gameOptionShape),
  showScoreInputs: PropTypes.bool,
  showBigMatchExtras: PropTypes.bool,
  teamPlaceholders: PropTypes.shape({
    home: PropTypes.string,
    away: PropTypes.string,
  }),
};

export default MatchFieldset;
