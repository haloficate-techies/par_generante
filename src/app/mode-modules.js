import AppEnvironment from "./app-environment";

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

AppEnvironment.registerModeModule(registerModeModule);
AppEnvironment.setModeModuleResolver(getModeModule);

const registry = AppEnvironment.getModeRegistry();
registry.registerModeModule = registerModeModule;
registry.getModeModule = getModeModule;
registry.modules = modules;
