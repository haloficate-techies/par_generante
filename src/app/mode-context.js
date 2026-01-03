import { MODE_CONFIG } from "./config/modules/mode/mode.config";
import { getModeLayoutConfig, getModeModule } from "./mode-registry";

const defaultTimeProvider = {
  now: () => new Date(),
};

export const createModeContext = (overrides = {}) => {
  const registry = {
    getModeLayoutConfig,
    getModeModule,
    ...(overrides.registry || {}),
  };

  return {
    modeConfig: MODE_CONFIG,
    brandConfig: null,
    assets: null,
    featureFlags: {},
    timeProvider: defaultTimeProvider,
    envDerived: {},
    ...overrides,
    registry,
  };
};
