import React, { createContext, useContext, useMemo } from "react";

const MatchFormContext = createContext(null);

export const MatchFormProvider = ({
  children,
  onMatchFieldChange,
  onAutoLogoRequest,
  onLogoAdjust,
  onPlayerImageAdjust,
  onPlayerImageFlipToggle,
  onRemovePlayerBackground,
  playerBackgroundRemovalState = {},
  canUseBackgroundRemoval = false,
  onRemoveLogoBackground,
  logoBackgroundRemovalState = {},
  resolveAutoLogoSrc,
  readFileAsDataURL,
}) => {
  const value = useMemo(
    () => ({
      handlers: {
        onMatchFieldChange,
        onAutoLogoRequest,
        onLogoAdjust,
        onPlayerImageAdjust,
        onPlayerImageFlipToggle,
        onRemovePlayerBackground,
        onRemoveLogoBackground,
      },
      media: {
        resolveAutoLogoSrc,
        readFileAsDataURL,
        canUseBackgroundRemoval,
      },
      removalState: {
        player: playerBackgroundRemovalState,
        logo: logoBackgroundRemovalState,
      },
    }),
    [
      canUseBackgroundRemoval,
      onAutoLogoRequest,
      onLogoAdjust,
      onMatchFieldChange,
      onPlayerImageAdjust,
      onPlayerImageFlipToggle,
      onRemoveLogoBackground,
      onRemovePlayerBackground,
      playerBackgroundRemovalState,
      logoBackgroundRemovalState,
      readFileAsDataURL,
      resolveAutoLogoSrc,
    ]
  );

  return (
    <MatchFormContext.Provider value={value}>
      {children}
    </MatchFormContext.Provider>
  );
};

export const useMatchForm = () => {
  const context = useContext(MatchFormContext);
  if (!context) {
    throw new Error("useMatchForm must be used within a MatchFormProvider");
  }
  return context;
};

