import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import AppEnvironment from "../app/app-environment";
import { BANNER_BACKGROUND_LOOKUP, BANNER_BACKGROUND_FILES } from "../domains/brand";
import { MODE_BACKGROUND_DEFAULTS } from "../app/config/modules/assets/asset.constants";
import { resolveImageAssetSrc } from "../app/config/modules/assets/asset.resolvers";
import { TOGEL_BACKGROUND_EXTENSION_PRIORITY } from "../app/config/modules/togel/togel.constants";

const BACKGROUND_LOOKUP = BANNER_BACKGROUND_LOOKUP || {};
const AVAILABLE_BANNER_BACKGROUNDS = BANNER_BACKGROUND_FILES || [];

const useBackgroundManager = (activeMode) => {
  const togelBackgroundRequestIdRef = useRef(0);
  const footballDefaultBackground = useMemo(
    () =>
      BACKGROUND_LOOKUP.BACKGROUND ||
      BACKGROUND_LOOKUP.DEFAULT ||
      (AVAILABLE_BANNER_BACKGROUNDS.length > 0 ? AVAILABLE_BANNER_BACKGROUNDS[0] : null),
    []
  );
  const [selectedFootballBackground, setSelectedFootballBackground] = useState(
    footballDefaultBackground
  );
  useEffect(() => {
    if (footballDefaultBackground) {
      setSelectedFootballBackground((prev) => prev || footballDefaultBackground);
    }
  }, [footballDefaultBackground]);
  const [selectedBasketballBackground, setSelectedBasketballBackground] = useState(
    MODE_BACKGROUND_DEFAULTS.basketball
  );
  const [selectedEsportsBackground, setSelectedEsportsBackground] = useState(
    MODE_BACKGROUND_DEFAULTS.esports
  );
  const [togelBackgroundSrc, setTogelBackgroundSrc] = useState(MODE_BACKGROUND_DEFAULTS.togel);

  const applyTogelBackgroundPath = useCallback((rawPath) => {
    if (!rawPath) {
      togelBackgroundRequestIdRef.current += 1;
      setTogelBackgroundSrc("");
      return;
    }
    const requestId = togelBackgroundRequestIdRef.current + 1;
    togelBackgroundRequestIdRef.current = requestId;
    setTogelBackgroundSrc(rawPath);
    resolveImageAssetSrc(rawPath, TOGEL_BACKGROUND_EXTENSION_PRIORITY).then((resolvedPath) => {
      if (togelBackgroundRequestIdRef.current !== requestId) {
        return;
      }
      setTogelBackgroundSrc(resolvedPath || rawPath);
    });
  }, []);

  const backgroundSrc = useMemo(() => {
    const modeDefaultBackground = MODE_BACKGROUND_DEFAULTS[activeMode];
    switch (activeMode) {
      case "football":
        return selectedFootballBackground || modeDefaultBackground || footballDefaultBackground;
      case "basketball":
        return (
          selectedBasketballBackground ||
          modeDefaultBackground ||
          MODE_BACKGROUND_DEFAULTS.basketball ||
          footballDefaultBackground
        );
      case "togel":
        return togelBackgroundSrc || modeDefaultBackground || MODE_BACKGROUND_DEFAULTS.togel;
      case "esports":
        return (
          selectedEsportsBackground ||
          modeDefaultBackground ||
          MODE_BACKGROUND_DEFAULTS.esports ||
          footballDefaultBackground
        );
      default:
        return modeDefaultBackground || selectedFootballBackground || footballDefaultBackground;
    }
  }, [
    activeMode,
    footballDefaultBackground,
    selectedBasketballBackground,
    selectedEsportsBackground,
    selectedFootballBackground,
    togelBackgroundSrc,
  ]);

  return {
    footballDefaultBackground,
    backgroundSrc,
    selectedFootballBackground,
    setSelectedFootballBackground,
    selectedBasketballBackground,
    setSelectedBasketballBackground,
    selectedEsportsBackground,
    setSelectedEsportsBackground,
    togelBackgroundSrc,
    applyTogelBackgroundPath,
  };
};

AppEnvironment.registerHook("useBackgroundManager", useBackgroundManager);

export default useBackgroundManager;
