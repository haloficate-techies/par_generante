import AppEnvironment from "./app-environment";

const layoutConfigs = {};
let defaultConfig = null;

const registerModeLayout = (modeId, config) => {
  if (!config || typeof config.renderContent !== "function") {
    return;
  }
  if (!modeId || modeId === "default") {
    defaultConfig = config;
    return;
  }
  layoutConfigs[modeId] = config;
};

const getModeLayoutConfig = (modeId) => {
  if (modeId && layoutConfigs[modeId]) {
    return layoutConfigs[modeId];
  }
  return defaultConfig;
};

AppEnvironment.registerModeLayout(registerModeLayout);
AppEnvironment.setModeLayoutResolver(getModeLayoutConfig);

const registry = AppEnvironment.getModeRegistry();
registry.registerModeLayout = registerModeLayout;
registry.getModeLayoutConfig = getModeLayoutConfig;
