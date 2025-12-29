import AppEnvironment from "./app-environment";

const layoutConfigs = {};
let defaultLayoutConfig = null;

const registerModeLayout = (modeId, config) => {
  if (!config || typeof config.renderContent !== "function") {
    return;
  }
  if (!modeId || modeId === "default") {
    defaultLayoutConfig = config;
    return;
  }
  layoutConfigs[modeId] = config;
};

const getModeLayoutConfig = (modeId) => {
  if (modeId && layoutConfigs[modeId]) {
    return layoutConfigs[modeId];
  }
  return defaultLayoutConfig;
};

const modules = {};
let defaultModule = null;

const registerModeModule = (modeId, config = {}) => {
  if (!modeId) return;
  const normalizedConfig = {
    id: modeId,
    type: config.type || "match",
    features: config.features || {},
  };
  if (modeId === "default") {
    defaultModule = normalizedConfig;
    return;
  }
  modules[modeId] = normalizedConfig;
};

const getModeModule = (modeId) => {
  if (modeId && modules[modeId]) {
    return modules[modeId];
  }
  return defaultModule;
};

AppEnvironment.registerModeLayout(registerModeLayout);
AppEnvironment.setModeLayoutResolver(getModeLayoutConfig);

AppEnvironment.registerModeModule(registerModeModule);
AppEnvironment.setModeModuleResolver(getModeModule);

const registry = AppEnvironment.getModeRegistry();
registry.registerModeLayout = registerModeLayout;
registry.getModeLayoutConfig = getModeLayoutConfig;
registry.registerModeModule = registerModeModule;
registry.getModeModule = getModeModule;
registry.modules = modules;

export { registerModeLayout, getModeLayoutConfig, registerModeModule, getModeModule };
