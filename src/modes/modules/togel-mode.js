import AppEnvironment from "../../app/app-environment";

const registerModeModules = () => {
  const registry = AppEnvironment ? AppEnvironment.getModeRegistry() : null;
  const register = registry?.registerModeModule;
  if (typeof register !== "function") return;

  register("togel", {
    type: "togel",
    features: {
      showTitle: false,
      skipHeader: false,
      includeMiniBanner: false,
      showGameOptions: false,
      showTogelControls: true,
      showMatches: false,
    },
  });
};

registerModeModules();

export {};
