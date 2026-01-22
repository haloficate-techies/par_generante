import { useCallback, useEffect } from "react";

/**
 * Coordinates brand selection side effects such as footers, background overrides, and prefetching.
 *
 * @param {Object} params
 * @param {string} params.activeMode
 * @param {Array} params.availableBrandLogos
 * @param {string} params.brandLogoSrc
 * @param {string} params.defaultRaffleFooter
 * @param {string} params.footballDefaultBackground
 * @param {boolean} params.isRaffleMode
 * @param {Object} params.modeBackgroundDefaults
 * @param {Function} params.prefetchImages
 * @param {Function} params.resolveFooterSrcForBrand
 * @param {Function} params.setBrandLogo
 * @param {Function} params.setFooter
 * @param {Function} params.setSelectedBasketballBackground
 * @param {Function} params.setSelectedEsportsBackground
 * @param {Function} params.setSelectedFootballBackground
 * @param {Function} params.createBrandSlug
 * @returns {Object} Helpers
 * @returns {Function} return.handleBrandLogoSelection
 */
const useBrandSelection = ({
  activeMode,
  availableBrandLogos,
  brandLogoSrc,
  defaultRaffleFooter,
  footballDefaultBackground,
  isRaffleMode,
  modeBackgroundDefaults,
  prefetchImages,
  resolveFooterSrcForBrand,
  setBrandLogo,
  setFooter,
  setSelectedBasketballBackground,
  setSelectedEsportsBackground,
  setSelectedFootballBackground,
  createBrandSlug,
}) => {
  useEffect(() => {
    if (!brandLogoSrc) {
      setFooter(isRaffleMode ? defaultRaffleFooter : "", "");
      return;
    }
    const matchedBrandOption = availableBrandLogos.find(
      (option) => option && option.value === brandLogoSrc
    );
    const brandName = matchedBrandOption?.brand ?? null;
    const nextFooterSrc = resolveFooterSrcForBrand(brandName, brandLogoSrc, activeMode);
    if (nextFooterSrc) {
      setFooter(nextFooterSrc);
    } else {
      setFooter(activeMode === "raffle" ? defaultRaffleFooter : "", "");
    }
  }, [
    activeMode,
    availableBrandLogos,
    brandLogoSrc,
    defaultRaffleFooter,
    isRaffleMode,
    resolveFooterSrcForBrand,
    setFooter,
  ]);

  const handleBrandLogoSelection = useCallback(
    (newValue) => {
      setBrandLogo(newValue);

      if (!newValue) {
        setFooter(isRaffleMode ? defaultRaffleFooter : "", "");
        setSelectedFootballBackground(footballDefaultBackground);
        setSelectedBasketballBackground(modeBackgroundDefaults.basketball);
        setSelectedEsportsBackground(modeBackgroundDefaults.esports);
        return;
      }

      const matchedBrandOption = availableBrandLogos.find(
        (option) => option && option.value === newValue
      );
      let resolvedFooterForPrefetch = null;
      if (matchedBrandOption && matchedBrandOption.brand) {
        const modeAwareFooter = resolveFooterSrcForBrand(
          matchedBrandOption.brand,
          newValue,
          activeMode
        );
        const raffleFooter = activeMode === "raffle" ? defaultRaffleFooter : "";
        const footerToUse = modeAwareFooter || raffleFooter;
        setFooter(footerToUse);
        resolvedFooterForPrefetch = footerToUse;

        const footballBrandBackground =
          (matchedBrandOption.backgroundByMode &&
            matchedBrandOption.backgroundByMode.football) ||
          matchedBrandOption.backgroundValue ||
          footballDefaultBackground;
        const basketballBrandBackground =
          (matchedBrandOption.backgroundByMode &&
            matchedBrandOption.backgroundByMode.basketball) ||
          modeBackgroundDefaults.basketball;
        const esportsBrandBackground =
          (matchedBrandOption.backgroundByMode &&
            matchedBrandOption.backgroundByMode.esports) ||
          modeBackgroundDefaults.esports;
        setSelectedFootballBackground(footballBrandBackground);
        setSelectedBasketballBackground(basketballBrandBackground);
        setSelectedEsportsBackground(esportsBrandBackground);
        const brandSlug = createBrandSlug(matchedBrandOption.brand, {
          uppercase: true,
        });
        setFooter(footerToUse, brandSlug ? `INDO.SKIN/${brandSlug}` : "");
      } else {
        const fallbackFooter = resolveFooterSrcForBrand(null, newValue, activeMode);
        setFooter(fallbackFooter, "");
        resolvedFooterForPrefetch = fallbackFooter;
        setSelectedFootballBackground(footballDefaultBackground);
        setSelectedBasketballBackground(modeBackgroundDefaults.basketball);
        setSelectedEsportsBackground(modeBackgroundDefaults.esports);
      }

      const prefetchCandidates = [
        newValue,
        resolvedFooterForPrefetch,
        matchedBrandOption?.backgroundByMode?.[activeMode],
        matchedBrandOption?.backgroundValue,
        activeMode === "football" ? footballDefaultBackground : null,
        activeMode === "esports" ? modeBackgroundDefaults.esports : null,
        activeMode === "basketball" ? modeBackgroundDefaults.basketball : null,
        activeMode === "raffle" ? modeBackgroundDefaults.raffle : null,
        activeMode === "raffle" && !resolvedFooterForPrefetch ? defaultRaffleFooter : null,
      ].filter(Boolean);
      if (prefetchCandidates.length) {
        prefetchImages(prefetchCandidates);
      }
    },
    [
      activeMode,
      availableBrandLogos,
      createBrandSlug,
      defaultRaffleFooter,
      footballDefaultBackground,
      isRaffleMode,
      modeBackgroundDefaults,
      prefetchImages,
      resolveFooterSrcForBrand,
      setBrandLogo,
      setFooter,
      setSelectedBasketballBackground,
      setSelectedEsportsBackground,
      setSelectedFootballBackground,
    ]
  );

  return { handleBrandLogoSelection };
};

export default useBrandSelection;
