import AppEnvironment from "../../app/app-environment";

const registerModeModules = () => {
  const registry = AppEnvironment ? AppEnvironment.getModeRegistry() : null;
  const register = registry?.registerModeModule;
  if (typeof register !== "function") {
    return;
  }

  const baseFeatures = {
    showTitle: true,
    skipHeader: false,
    includeMiniBanner: false,
    showGameOptions: false,
    showTogelControls: false,
  };

  const createMatchModule = (modeId, featureOverrides = {}) => ({
    type: "match",
    features: { ...baseFeatures, ...featureOverrides },
  });

  register("default", createMatchModule("default"));
  register("football", createMatchModule("football"));
  register("basketball", createMatchModule("basketball"));
  register(
    "esports",
    createMatchModule("esports", {
      showTitle: false,
      skipHeader: true,
      includeMiniBanner: true,
      showGameOptions: true,
    })
  );
};

registerModeModules();

export {};
