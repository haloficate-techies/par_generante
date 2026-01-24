import React from "react";
import PropTypes from "prop-types";
import RaffleWinnersSection from "./match-form/sections/RaffleWinnersSection";
import BannerMetadataSection from "./match-form/sections/BannerMetadataSection";
import MatchesSection from "./match-form/sections/MatchesSection";
import TogelControlsSection from "./match-form/sections/TogelControlsSection";
import TogelDigitsSection from "./match-form/sections/TogelDigitsSection";
import {
  useMatchCountAdjuster,
  useMatchFormState,
  useTogelControls,
} from "./match-form/hooks";
import { MatchFormProvider } from "./match-form/contexts";
import { matchListFormEnv } from "./match-form/env";

const {
  AVAILABLE_TOGEL_POOL_OPTIONS,
  AVAILABLE_LEAGUE_LOGO_OPTIONS,
  AVAILABLE_ESPORT_GAME_OPTIONS,
  resolveAutoLogoSrc,
  readFileAsDataURL,
  getTogelDrawTimeConfig,
} = matchListFormEnv;

const optionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const backgroundRemovalStateShape = PropTypes.shape({
  loading: PropTypes.bool,
  error: PropTypes.string,
});

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
  gameName: PropTypes.string,
});

const MatchListForm = ({
  title = "",
  onTitleChange,
  matches = [],
  onMatchFieldChange,
  onAutoLogoRequest,
  onLogoAdjust,
  onPlayerImageAdjust,
  onPlayerImageFlipToggle,
  brandLogoSrc = "",
  onBrandLogoChange,
  brandOptions = [],
  backgroundSrc = "",
  footerSrc = "",
  activeSubMenu,
  matchCount,
  onMatchCountChange,
  matchCountOptions = [],
  activeMode,
  activeModeConfig,
  togelPool,
  onTogelPoolChange,
  togelPoolVariant,
  onTogelPoolVariantChange,
  togelDigits = [],
  onTogelDigitChange,
  togelDrawTime,
  onTogelDrawTimeChange,
  modeFeatures = {},
  showTitleFieldOverride,
  leagueLogoSrc = "",
  onLeagueLogoChange,
  isBigMatchLayout = false,
  leagueLogoOptions = AVAILABLE_LEAGUE_LOGO_OPTIONS,
  onRemovePlayerBackground,
  playerBackgroundRemovalState = {},
  onRemoveLogoBackground,
  logoBackgroundRemovalState = {},
  isBackgroundRemovalAvailable = false,
  raffleSlug = "",
  onRaffleSlugChange,
  onFetchRaffleData,
  raffleWinners = [],
  raffleInfo = null,
  isFetchingRaffle = false,
  raffleFetchError = "",
}) => {
  const {
    effectiveMatchCount,
    minMatchCount,
    maxMatchCount,
    adjustMatchCount,
  } = useMatchCountAdjuster({
    matchCount,
    matchCountOptions,
    matchesLength: matches.length,
    onMatchCountChange,
  });

  const {
    selectedPool: resolvedTogelPool,
    selectedVariant: resolvedTogelVariant,
    selectedPoolOption,
    poolVariants,
    shouldShowVariantSelector,
    handlePoolChange,
    handleVariantChange,
  } = useTogelControls({
    pools: AVAILABLE_TOGEL_POOL_OPTIONS,
    selectedPool: togelPool,
    selectedVariant: togelPoolVariant,
    onPoolChange: onTogelPoolChange,
    onVariantChange: onTogelPoolVariantChange,
  });

  const drawTimeConfig = getTogelDrawTimeConfig(
    resolvedTogelPool,
    resolvedTogelVariant
  );

  const {
    isTogelMode,
    isEsportsMode,
    isRaffleMode,
    isScoreLayoutActive,
    shouldShowMatches,
    drawTimeOptions,
    shouldShowDrawTimeSelector,
    shouldShowDigits,
    digitGridClass,
    availableGameOptions,
    isBigMatchLayoutActive,
    shouldShowTitleField,
  } = useMatchFormState({
    modeFeatures,
    activeMode,
    activeSubMenu,
    showTitleFieldOverride,
    isBigMatchLayout,
    togelPool: resolvedTogelPool,
    togelPoolVariant: resolvedTogelVariant,
    togelDigits,
    drawTimeConfig,
    availableEsportGameOptions: AVAILABLE_ESPORT_GAME_OPTIONS,
  });
  return (
    <MatchFormProvider
      onMatchFieldChange={onMatchFieldChange}
      onAutoLogoRequest={onAutoLogoRequest}
      onLogoAdjust={onLogoAdjust}
      onPlayerImageAdjust={onPlayerImageAdjust}
      onPlayerImageFlipToggle={onPlayerImageFlipToggle}
      onRemovePlayerBackground={onRemovePlayerBackground}
      playerBackgroundRemovalState={playerBackgroundRemovalState}
      canUseBackgroundRemoval={isBackgroundRemovalAvailable}
      onRemoveLogoBackground={onRemoveLogoBackground}
      logoBackgroundRemovalState={logoBackgroundRemovalState}
      resolveAutoLogoSrc={resolveAutoLogoSrc}
      readFileAsDataURL={readFileAsDataURL}
    >
      <form className="grid gap-6">
        <BannerMetadataSection
          showTitleField={shouldShowTitleField}
          title={title}
          titlePlaceholder={activeModeConfig?.titlePlaceholder}
          onTitleChange={onTitleChange}
          brandLogoSrc={brandLogoSrc}
          footerSrc={footerSrc}
          onBrandLogoChange={onBrandLogoChange}
          brandOptions={brandOptions}
          backgroundSrc={backgroundSrc}
          showLeagueLogoInput={isBigMatchLayoutActive}
          leagueLogoSrc={leagueLogoSrc}
          onLeagueLogoChange={onLeagueLogoChange}
          leagueLogoOptions={leagueLogoOptions}
        />
        {isRaffleMode && (
          <RaffleWinnersSection
            slugValue={raffleSlug}
            onSlugChange={onRaffleSlugChange}
            onFetch={onFetchRaffleData}
            isLoading={isFetchingRaffle}
            winners={raffleWinners}
            fetchError={raffleFetchError}
            raffleInfo={raffleInfo}
          />
        )}
        <MatchesSection
          shouldShowMatches={shouldShowMatches}
          effectiveMatchCount={effectiveMatchCount}
          minMatchCount={minMatchCount}
          maxMatchCount={maxMatchCount}
          adjustMatchCount={adjustMatchCount}
          matches={matches}
          isEsportsMode={isEsportsMode}
          availableGameOptions={availableGameOptions}
          showScoreInputs={isScoreLayoutActive}
          showBigMatchExtras={isBigMatchLayoutActive}
          teamPlaceholders={activeModeConfig?.teamPlaceholders}
        disableMatchCountAdjuster={isBigMatchLayoutActive}
        />
        <TogelControlsSection
          isTogelMode={isTogelMode}
          pools={AVAILABLE_TOGEL_POOL_OPTIONS}
          selectedPool={resolvedTogelPool}
          onPoolChange={handlePoolChange}
          showVariantSelector={shouldShowVariantSelector}
          poolVariants={poolVariants}
          selectedVariant={resolvedTogelVariant}
          onVariantChange={handleVariantChange}
          selectedPoolOption={selectedPoolOption}
          drawTimeConfig={drawTimeConfig}
          drawTimeOptions={drawTimeOptions}
          togelDrawTime={togelDrawTime}
          onTogelDrawTimeChange={onTogelDrawTimeChange}
          shouldShowDrawTimeSelector={shouldShowDrawTimeSelector}
        />
        <TogelDigitsSection
          shouldShowDigits={shouldShowDigits}
          digitGridClass={digitGridClass}
          togelDigits={togelDigits}
          onTogelDigitChange={onTogelDigitChange}
        />
      </form>
    </MatchFormProvider>
  );
};

MatchListForm.propTypes = {
  // Metadata
  title: PropTypes.string,
  onTitleChange: PropTypes.func,
  brandLogoSrc: PropTypes.string,
  onBrandLogoChange: PropTypes.func,
  brandOptions: PropTypes.arrayOf(optionShape),
  backgroundSrc: PropTypes.string,
  footerSrc: PropTypes.string,
  leagueLogoSrc: PropTypes.string,
  onLeagueLogoChange: PropTypes.func,
  leagueLogoOptions: PropTypes.arrayOf(optionShape),
  isBigMatchLayout: PropTypes.bool,
  showTitleFieldOverride: PropTypes.bool,

  // Matches
  matches: PropTypes.arrayOf(matchShape),
  onMatchFieldChange: PropTypes.func,
  onAutoLogoRequest: PropTypes.func,
  onLogoAdjust: PropTypes.func,
  onPlayerImageAdjust: PropTypes.func,
  onPlayerImageFlipToggle: PropTypes.func,
  activeSubMenu: PropTypes.string,
  matchCount: PropTypes.number,
  onMatchCountChange: PropTypes.func,
  matchCountOptions: PropTypes.arrayOf(PropTypes.number),

  // Mode & toggles
  activeMode: PropTypes.string,
  activeModeConfig: PropTypes.shape({
    titlePlaceholder: PropTypes.string,
    teamPlaceholders: PropTypes.shape({
      home: PropTypes.string,
      away: PropTypes.string,
    }),
  }),
  modeFeatures: PropTypes.shape({
    showTogelControls: PropTypes.bool,
    showGameOptions: PropTypes.bool,
    showMatches: PropTypes.bool,
    showTitle: PropTypes.bool,
  }),

  // Togel controls
  togelPool: PropTypes.string,
  onTogelPoolChange: PropTypes.func,
  togelPoolVariant: PropTypes.string,
  onTogelPoolVariantChange: PropTypes.func,
  togelDigits: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onTogelDigitChange: PropTypes.func,
  togelDrawTime: PropTypes.string,
  onTogelDrawTimeChange: PropTypes.func,

  // Background removal
  onRemovePlayerBackground: PropTypes.func,
  playerBackgroundRemovalState: PropTypes.objectOf(
    backgroundRemovalStateShape
  ),
  onRemoveLogoBackground: PropTypes.func,
  logoBackgroundRemovalState: PropTypes.objectOf(
    backgroundRemovalStateShape
  ),
  isBackgroundRemovalAvailable: PropTypes.bool,

  // Raffle
  raffleSlug: PropTypes.string,
  onRaffleSlugChange: PropTypes.func,
  onFetchRaffleData: PropTypes.func,
  raffleWinners: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      prize: PropTypes.string,
    })
  ),
  raffleInfo: PropTypes.object,
  isFetchingRaffle: PropTypes.bool,
  raffleFetchError: PropTypes.string,
};

export default MatchListForm;
