import React, { useCallback } from "react";
import AppEnvironment from "../app/app-environment";
import RaffleWinnersSection from "./match-list-form/sections/RaffleWinnersSection";
import BannerMetadataSection from "./match-list-form/sections/BannerMetadataSection";
import MatchesSection from "./match-list-form/sections/MatchesSection";
import TogelControlsSection from "./match-list-form/sections/TogelControlsSection";
import TogelDigitsSection from "./match-list-form/sections/TogelDigitsSection";
// -------- Reusable UI blocks --------
const AppData = AppEnvironment.getData() || {};
const AppGlobals = AppEnvironment.getGlobals() || {};
const AVAILABLE_TOGEL_POOL_OPTIONS =
  Array.isArray(AppData.TOGEL_POOL_OPTIONS) ? AppData.TOGEL_POOL_OPTIONS : [];
const resolveTogelDrawTimeConfigImpl =
  typeof AppGlobals.resolveTogelDrawTimeConfig === "function"
    ? AppGlobals.resolveTogelDrawTimeConfig
    : null;
const resolveAutoLogoSrc =
  typeof AppData.resolveAutoLogoSrc === "function" ? AppData.resolveAutoLogoSrc : () => "";
const readFileAsDataURL =
  typeof AppData.readFileAsDataURL === "function" ? AppData.readFileAsDataURL : async () => null;
const AVAILABLE_LEAGUE_LOGO_OPTIONS =
  Array.isArray(AppGlobals.LEAGUE_LOGO_OPTIONS) ? AppGlobals.LEAGUE_LOGO_OPTIONS : [];

const DEFAULT_ESPORT_GAME_OPTIONS = [
  { label: "Age of Empires", value: "assets/ESPORT/logo_game/AGE_OF_EMPIRES.webp" },
  { label: "AOV", value: "assets/ESPORT/logo_game/AOV.webp" },
  { label: "Apex Legends", value: "assets/ESPORT/logo_game/APEX_LEGENDS.webp" },
  { label: "Brawl Stars", value: "assets/ESPORT/logo_game/BRAWL_STARS.webp" },
  { label: "Call of Duty", value: "assets/ESPORT/logo_game/CALL_OF_DUTY.webp" },
  {
    label: "Call of Duty Mobile",
    value: "assets/ESPORT/logo_game/CALL_OF_DUTY_MOBILE.webp",
  },
  { label: "Counter Strike", value: "assets/ESPORT/logo_game/COUNTER_STRIKE.webp" },
  { label: "Crossfire", value: "assets/ESPORT/logo_game/CROSSFIRE.webp" },
  { label: "Dota 2", value: "assets/ESPORT/logo_game/DOTA_2.webp" },
  { label: "FIFA", value: "assets/ESPORT/logo_game/FIFA.webp" },
  { label: "King of Glory", value: "assets/ESPORT/logo_game/KING_OF_GLORY.webp" },
  { label: "League of Legends", value: "assets/ESPORT/logo_game/LOL.webp" },
  {
    label: "League of Legends: Wild Rift",
    value: "assets/ESPORT/logo_game/LOL_WILD_RIFT.webp",
  },
  { label: "Mobile Legends", value: "assets/ESPORT/logo_game/MOBILE_LEGENDS.webp" },
  { label: "NBA 2K", value: "assets/ESPORT/logo_game/NBA_2K.webp" },
  { label: "Overwatch", value: "assets/ESPORT/logo_game/OVERWATCH.webp" },
  { label: "PUBG", value: "assets/ESPORT/logo_game/PUBG.webp" },
  { label: "PUBG Mobile", value: "assets/ESPORT/logo_game/PUBG_MOBILE.webp" },
  {
    label: "Rainbow Six Siege",
    value: "assets/ESPORT/logo_game/RAINBOW_SIX_SIEGE.webp",
  },
  { label: "Rocket League", value: "assets/ESPORT/logo_game/ROCKET_LEAGUE.webp" },
  { label: "StarCraft 2", value: "assets/ESPORT/logo_game/STARCRAFT_2.webp" },
  {
    label: "StarCraft: Brood War",
    value: "assets/ESPORT/logo_game/STARCRAFT_BROOD_WAR.webp",
  },
  { label: "Valorant", value: "assets/ESPORT/logo_game/VALORANT.webp" },
  { label: "Warcraft 3", value: "assets/ESPORT/logo_game/WARCRAFT_3.webp" },
];

const AVAILABLE_ESPORT_GAME_OPTIONS =
  Array.isArray(AppData.ESPORT_GAME_OPTIONS) && AppData.ESPORT_GAME_OPTIONS.length
    ? AppData.ESPORT_GAME_OPTIONS
    : DEFAULT_ESPORT_GAME_OPTIONS;

const getTogelDrawTimeConfig = (pool, variant) =>
  typeof resolveTogelDrawTimeConfigImpl === "function"
    ? resolveTogelDrawTimeConfigImpl(pool, variant)
    : { options: [] };

const MatchListForm = ({
  title,
  onTitleChange,
  matches,
  onMatchFieldChange,
  onAutoLogoRequest,
  onLogoAdjust,
  onPlayerImageAdjust,
  onPlayerImageFlipToggle,
  brandLogoSrc,
  onBrandLogoChange,
  brandOptions,
  backgroundSrc,
  footerSrc,
  activeSubMenu,
  matchCount,
  onMatchCountChange,
  matchCountOptions,
  activeMode,
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
  const resolveFeatureFlag = (value, fallback) =>
    typeof value === "boolean" ? value : fallback;
  const isTogelMode = resolveFeatureFlag(modeFeatures.showTogelControls, activeMode === "togel");
  const isEsportsMode = resolveFeatureFlag(modeFeatures.showGameOptions, activeMode === "esports");
  const isFootballMode = activeMode === "football";
  const isRaffleMode = activeMode === "raffle";
  const isScoreLayoutActive = isFootballMode && activeSubMenu === "scores";
  const shouldShowMatches = resolveFeatureFlag(modeFeatures.showMatches, !isTogelMode);
  const effectiveMatchCount =
    typeof matchCount === "number" ? matchCount : matches.length;
  const availableMatchCountOptions =
    Array.isArray(matchCountOptions) && matchCountOptions.length > 0
      ? matchCountOptions
      : [1, 2, 3, 4, 5];
  const minMatchCount = Math.min(...availableMatchCountOptions);
  const maxMatchCount = Math.max(...availableMatchCountOptions);

  const adjustMatchCount = (nextCount) => {
    if (!onMatchCountChange) return;
    const normalized = Math.min(Math.max(nextCount, minMatchCount), maxMatchCount);
    if (normalized !== effectiveMatchCount) {
      onMatchCountChange(normalized);
    }
  };

  const selectedPoolOption = AVAILABLE_TOGEL_POOL_OPTIONS.find(
    (option) => option.value === togelPool
  );
  const poolVariantOptions = selectedPoolOption?.modes ?? [];
  const shouldShowVariantSelector =
    isTogelMode && poolVariantOptions.length > 1;
  const drawTimeConfig = getTogelDrawTimeConfig(togelPool, togelPoolVariant);
  const isTotoSingaporeHoliday =
    togelPool === "toto_singapore" && Boolean(drawTimeConfig.disabledReason);
  const shouldShowDigits =
    isTogelMode &&
    Boolean(togelPoolVariant) &&
    Array.isArray(togelDigits) &&
    togelDigits.length > 0 &&
    !isTotoSingaporeHoliday;
  const digitCount = shouldShowDigits ? togelDigits.length : 0;
  const digitGridClass =
    digitCount === 3
      ? "sm:grid-cols-3 md:grid-cols-3"
      : digitCount === 4
        ? "sm:grid-cols-4 md:grid-cols-4"
        : "sm:grid-cols-4 md:grid-cols-5";

  const handleTogelPoolChange = useCallback(
    (event) => {
      const nextPool = event.target.value;
      onTogelPoolChange?.(nextPool);
      const option = AVAILABLE_TOGEL_POOL_OPTIONS.find(
        (item) => item.value === nextPool
      );
      const modes = option?.modes ?? [];
      if (modes.length === 1) {
        onTogelPoolVariantChange?.(modes[0]);
      } else {
        onTogelPoolVariantChange?.("");
      }
    },
    [onTogelPoolChange, onTogelPoolVariantChange]
  );

  const handleTogelVariantChange = useCallback(
    (event) => {
      onTogelPoolVariantChange?.(event.target.value);
    },
    [onTogelPoolVariantChange]
  );

  const drawTimeOptions = drawTimeConfig.options ?? [];
  const shouldShowDrawTimeSelector =
    isTogelMode &&
    (drawTimeOptions.length > 0 || Boolean(drawTimeConfig.disabledReason));
  const availableGameOptions = isEsportsMode ? AVAILABLE_ESPORT_GAME_OPTIONS : [];
  const isBigMatchLayoutActive = Boolean(isBigMatchLayout);
  const resolvedShowTitle = resolveFeatureFlag(
    modeFeatures.showTitle,
    !isTogelMode && !isEsportsMode
  );
  const shouldShowTitleField =
    typeof showTitleFieldOverride === "boolean"
      ? showTitleFieldOverride
      : !isTogelMode && resolvedShowTitle;
  return (
    <form className="grid gap-6">
      <BannerMetadataSection
        showTitleField={shouldShowTitleField}
        title={title}
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
        onMatchFieldChange={onMatchFieldChange}
        onAutoLogoRequest={onAutoLogoRequest}
        onLogoAdjust={onLogoAdjust}
        onPlayerImageAdjust={onPlayerImageAdjust}
        onPlayerImageFlipToggle={onPlayerImageFlipToggle}
        isEsportsMode={isEsportsMode}
        availableGameOptions={availableGameOptions}
        showScoreInputs={isScoreLayoutActive}
        showBigMatchExtras={isBigMatchLayoutActive}
        disableMatchCountAdjuster={isBigMatchLayoutActive}
        onRemovePlayerBackground={onRemovePlayerBackground}
        playerBackgroundRemovalState={playerBackgroundRemovalState}
        canUseBackgroundRemoval={isBackgroundRemovalAvailable}
        onRemoveLogoBackground={onRemoveLogoBackground}
        logoBackgroundRemovalState={logoBackgroundRemovalState}
        resolveAutoLogoSrc={resolveAutoLogoSrc}
        readFileAsDataURL={readFileAsDataURL}
      />
      <TogelControlsSection
        isTogelMode={isTogelMode}
        pools={AVAILABLE_TOGEL_POOL_OPTIONS}
        selectedPool={togelPool}
        onPoolChange={handleTogelPoolChange}
        showVariantSelector={shouldShowVariantSelector}
        poolVariants={poolVariantOptions}
        selectedVariant={togelPoolVariant}
        onVariantChange={handleTogelVariantChange}
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
  );
};

AppEnvironment.registerComponent("MatchListForm", MatchListForm);

export default MatchListForm;
