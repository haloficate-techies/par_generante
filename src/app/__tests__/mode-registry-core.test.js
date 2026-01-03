import { describe, expect, it, vi } from "vitest";
import { createModeRegistry } from "../mode-registry-core";

const createLogger = () => ({
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
});

describe("createModeRegistry", () => {
  it("returns default layout when mode is missing", () => {
    const registry = createModeRegistry(
      { modeConfig: [{ id: "football" }] },
      { isDevelopment: true }
    );
    const defaultLayout = { renderContent: vi.fn() };
    const footballLayout = { renderContent: vi.fn() };

    registry.registerModeLayout("default", defaultLayout);
    registry.registerModeLayout("football", footballLayout);

    expect(registry.getModeLayoutConfig("unknown")).toBe(defaultLayout);
    expect(registry.getModeLayoutConfig("football")).toBe(footballLayout);
  });

  it("returns default module when mode is missing", () => {
    const registry = createModeRegistry(
      { modeConfig: [{ id: "togel" }] },
      { isDevelopment: true }
    );

    registry.registerModeModule("default", { features: { showTitle: true } });
    registry.registerModeModule("togel", { type: "togel", features: { showTitle: false } });

    expect(registry.getModeModule("unknown")?.id).toBe("default");
    expect(registry.getModeModule("togel")?.type).toBe("togel");
  });

  it("logs warnings for invalid registrations in dev", () => {
    const logger = createLogger();
    const registry = createModeRegistry(
      { modeConfig: [{ id: "football" }], logger },
      { isDevelopment: true }
    );

    registry.registerModeLayout("football", {});
    registry.registerModeModule("", { type: "match" });

    expect(logger.warn).toHaveBeenCalled();
  });
});
