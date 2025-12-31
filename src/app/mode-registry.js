import AppEnvironment from "./app-environment";
import { MODE_CONFIG } from "./config/modules/mode/mode.config";

const VALID_MODE_IDS = MODE_CONFIG.map((mode) => mode.id);
const isDevelopment = import.meta.env.DEV;

const layoutConfigs = {};
let defaultLayoutConfig = null;

const registerModeLayout = (modeId, config) => {
  if (!config || typeof config.renderContent !== "function") {
    if (isDevelopment) {
      console.warn(`[ModeRegistry] Invalid layout config for "${modeId}": missing renderContent function`);
    }
    return;
  }

  if (!modeId || modeId === "default") {
    defaultLayoutConfig = Object.freeze(config);
    if (isDevelopment) {
      console.log("[ModeRegistry] Registered default layout");
    }
    return;
  }

  if (isDevelopment && !VALID_MODE_IDS.includes(modeId)) {
    console.error(
      `[ModeRegistry] Unknown modeId "${modeId}". Valid modes: ${VALID_MODE_IDS.join(", ")}`
    );
  }

  layoutConfigs[modeId] = Object.freeze(config);

  if (isDevelopment) {
    console.log(`[ModeRegistry] Registered layout for mode "${modeId}"`);
  }
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
  if (!modeId) {
    if (isDevelopment) {
      console.warn("[ModeRegistry] Cannot register module without modeId");
    }
    return;
  }

  const normalizedConfig = {
    id: modeId,
    type: config.type || "match",
    features: config.features || {},
  };

  if (modeId === "default") {
    defaultModule = Object.freeze(normalizedConfig);
    if (isDevelopment) {
      console.log("[ModeRegistry] Registered default module");
    }
    return;
  }

  if (isDevelopment && !VALID_MODE_IDS.includes(modeId)) {
    console.error(
      `[ModeRegistry] Unknown modeId "${modeId}" for module registration. Valid modes: ${VALID_MODE_IDS.join(", ")}`
    );
  }

  modules[modeId] = Object.freeze(normalizedConfig);

  if (isDevelopment) {
    console.log(
      `[ModeRegistry] Registered module for mode "${modeId}" (type: ${normalizedConfig.type})`
    );
  }
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

if (isDevelopment) {
  registry.getRegisteredModes = () => ({
    layouts: Object.keys(layoutConfigs),
    modules: Object.keys(modules),
    validModeIds: [...VALID_MODE_IDS],
  });
}

export { registerModeLayout, getModeLayoutConfig, registerModeModule, getModeModule };
