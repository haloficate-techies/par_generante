const internalStore = {
  data: {},
  globals: {},
  hooks: {},
  components: {},
  modeLayouts: {
    register: null,
    resolver: null,
  },
  modeModules: {
    register: null,
    resolver: null,
  },
};

const modeRegistry = {};

const AppEnvironment = {
  getData: () => internalStore.data,
  setData: (data = {}) => {
    internalStore.data = data;
    return internalStore.data;
  },
  getGlobals: () => internalStore.globals,
  setGlobals: (globals = {}) => {
    internalStore.globals = globals;
    return internalStore.globals;
  },
  getHooks: () => internalStore.hooks,
  registerHook: (name, hookFn) => {
    if (!name || typeof hookFn !== "function") return;
    internalStore.hooks[name] = hookFn;
  },
  getHook: (name) => {
    if (!name) return null;
    return internalStore.hooks[name] || null;
  },
  getComponents: () => internalStore.components,
  registerComponent: (name, component) => {
    if (!name || typeof component !== "function") return;
    internalStore.components[name] = component;
  },
  getComponent: (name) => {
    if (!name) return null;
    return internalStore.components[name] || null;
  },
  getModeRegistry: () => modeRegistry,
  registerModeLayout: (registerFn) => {
    if (typeof registerFn === "function") {
      internalStore.modeLayouts.register = registerFn;
      modeRegistry.registerModeLayout = registerFn;
    }
  },
  registerModeModule: (registerFn) => {
    if (typeof registerFn === "function") {
      internalStore.modeModules.register = registerFn;
      modeRegistry.registerModeModule = registerFn;
    }
  },
  setModeLayoutResolver: (resolver) => {
    if (typeof resolver === "function") {
      internalStore.modeLayouts.resolver = resolver;
      modeRegistry.getModeLayoutConfig = resolver;
    }
  },
  setModeModuleResolver: (resolver) => {
    if (typeof resolver === "function") {
      internalStore.modeModules.resolver = resolver;
      modeRegistry.getModeModule = resolver;
    }
  },
  getModeLayoutResolver: () =>
    internalStore.modeLayouts.resolver || (() => null),
  getModeModuleResolver: () =>
    internalStore.modeModules.resolver || (() => null),
};

export default AppEnvironment;
