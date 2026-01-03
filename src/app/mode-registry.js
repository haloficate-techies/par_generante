import AppEnvironment from "./app-environment";
import { MODE_CONFIG } from "./config/modules/mode/mode.config";
import { createModeRegistry } from "./mode-registry-core";

const isDevelopment = import.meta.env.DEV;

const registryCore = createModeRegistry(
  { modeConfig: MODE_CONFIG, logger: console },
  { isDevelopment }
);

const {
  registerModeLayout,
  getModeLayoutConfig,
  registerModeModule,
  getModeModule,
  getRegisteredModes,
  modules,
} = registryCore;

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
  registry.getRegisteredModes = getRegisteredModes;
}

export { getModeLayoutConfig, getModeModule };
