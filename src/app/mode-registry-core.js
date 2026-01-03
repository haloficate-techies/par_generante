const DEFAULT_MODE_MODULE_TYPE = "match";

const coerceModeIds = (modeConfig) => {
  if (!Array.isArray(modeConfig)) return [];
  return modeConfig
    .map((mode) => mode?.id)
    .filter((id) => typeof id === "string" && id.trim().length > 0);
};

/**
 * Creates a pure mode registry with explicit dependency injection.
 *
 * @param {Object} modeContext
 * @param {Array} [modeContext.modeConfig]
 * @param {Object} [modeContext.logger]
 * @param {Object} [options]
 * @param {boolean} [options.isDevelopment=false]
 * @returns {Object} registry API
 */
export const createModeRegistry = (modeContext = {}, options = {}) => {
  const { modeConfig = [], logger = console } = modeContext;
  const { isDevelopment = false } = options;

  const validModeIds = coerceModeIds(modeConfig);
  const layoutConfigs = {};
  const modules = {};
  let defaultLayoutConfig = null;
  let defaultModule = null;

  const logWarning = (message) => {
    if (!isDevelopment) return;
    if (logger && typeof logger.warn === "function") {
      logger.warn(message);
    }
  };

  const logError = (message) => {
    if (!isDevelopment) return;
    if (logger && typeof logger.error === "function") {
      logger.error(message);
    }
  };

  const logInfo = (message) => {
    if (!isDevelopment) return;
    if (logger && typeof logger.log === "function") {
      logger.log(message);
    }
  };

  const registerModeLayout = (modeId, config) => {
    if (!config || typeof config.renderContent !== "function") {
      logWarning(
        `[ModeRegistry] Invalid layout config for "${modeId}": missing renderContent function`
      );
      return;
    }

    if (!modeId || modeId === "default") {
      defaultLayoutConfig = Object.freeze(config);
      logInfo("[ModeRegistry] Registered default layout");
      return;
    }

    if (isDevelopment && validModeIds.length && !validModeIds.includes(modeId)) {
      logError(`[ModeRegistry] Unknown modeId "${modeId}". Valid modes: ${validModeIds.join(", ")}`);
    }

    layoutConfigs[modeId] = Object.freeze(config);
    logInfo(`[ModeRegistry] Registered layout for mode "${modeId}"`);
  };

  const getModeLayoutConfig = (modeId) => {
    if (modeId && layoutConfigs[modeId]) {
      return layoutConfigs[modeId];
    }
    return defaultLayoutConfig;
  };

  const registerModeModule = (modeId, config = {}) => {
    if (!modeId) {
      logWarning("[ModeRegistry] Cannot register module without modeId");
      return;
    }

    const normalizedConfig = {
      id: modeId,
      type: config.type || DEFAULT_MODE_MODULE_TYPE,
      features: config.features || {},
    };

    if (modeId === "default") {
      defaultModule = Object.freeze(normalizedConfig);
      logInfo("[ModeRegistry] Registered default module");
      return;
    }

    if (isDevelopment && validModeIds.length && !validModeIds.includes(modeId)) {
      logError(
        `[ModeRegistry] Unknown modeId "${modeId}" for module registration. Valid modes: ${validModeIds.join(
          ", "
        )}`
      );
    }

    modules[modeId] = Object.freeze(normalizedConfig);
    logInfo(`[ModeRegistry] Registered module for mode "${modeId}" (type: ${normalizedConfig.type})`);
  };

  const getModeModule = (modeId) => {
    if (modeId && modules[modeId]) {
      return modules[modeId];
    }
    return defaultModule;
  };

  const getRegisteredModes = () => ({
    layouts: Object.keys(layoutConfigs),
    modules: Object.keys(modules),
    validModeIds: [...validModeIds],
  });

  return {
    registerModeLayout,
    getModeLayoutConfig,
    registerModeModule,
    getModeModule,
    getRegisteredModes,
    modules,
  };
};
