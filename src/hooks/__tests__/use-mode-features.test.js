import { renderHook } from "@testing-library/react-hooks";
import { describe, expect, it } from "vitest";
import useModeFeatures from "../use-mode-features";
import { createModeConfig } from "./test-utils";

const baseModeConfigs = [
  createModeConfig({ id: "football", label: "Football" }),
  createModeConfig({ id: "togel", label: "Togel" }),
  createModeConfig({ id: "esports", label: "Esports" }),
  createModeConfig({ id: "raffle", label: "Raffle" }),
];

const renderFeatures = ({
  activeMode = "football",
  activeSubMenu = "default",
  modeConfigList = baseModeConfigs,
  resolveModeModule = () => null,
} = {}) =>
  renderHook(() => useModeFeatures(activeMode, activeSubMenu, { modeConfigList, resolveModeModule }));

describe("useModeFeatures", () => {
  describe("football mode", () => {
    it("calculates standard football features", () => {
      const { result } = renderFeatures();

      expect(result.current.activeModeConfig.id).toBe("football");
      expect(result.current.isScoreModeActive).toBe(false);
      expect(result.current.isBigMatchLayout).toBe(false);
      expect(result.current.shouldRenderMatches).toBe(true);
      expect(result.current.shouldSkipHeader).toBe(false);
      expect(result.current.shouldShowTitleInput).toBe(true);
    });

    it("detects big match layout and hides title input", () => {
      const { result } = renderFeatures({ activeSubMenu: "big_match" });

      expect(result.current.isBigMatchLayout).toBe(true);
      expect(result.current.shouldShowTitleInput).toBe(false);
    });

    it("detects scores layout and disables title input", () => {
      const { result } = renderFeatures({ activeSubMenu: "scores" });

      expect(result.current.isScoreModeActive).toBe(true);
      expect(result.current.shouldShowTitleInput).toBe(false);
    });
  });

  describe("togel mode", () => {
    it("sets togel-specific flags", () => {
      const { result } = renderFeatures({ activeMode: "togel" });

      expect(result.current.isTogelMode).toBe(true);
      expect(result.current.shouldRenderMatches).toBe(false);
      expect(result.current.allowCustomTitle).toBe(false);
    });

    it("hides title input and matches", () => {
      const { result } = renderFeatures({ activeMode: "togel" });

      expect(result.current.shouldShowTitleInput).toBe(false);
      expect(result.current.shouldRenderMatches).toBe(false);
    });
  });

  describe("esports mode", () => {
    it("enables mini banner by default and skips header", () => {
      const { result } = renderFeatures({ activeMode: "esports" });

      expect(result.current.isEsportsMode).toBe(true);
      expect(result.current.includeMiniBanner).toBe(true);
      expect(result.current.shouldSkipHeader).toBe(true);
    });

    it("respects module feature overrides", () => {
      const resolveModeModule = () => ({
        features: { includeMiniBanner: false, skipHeader: false, showMatches: true },
      });
      const { result } = renderFeatures({ activeMode: "esports", resolveModeModule });

      expect(result.current.includeMiniBanner).toBe(false);
      expect(result.current.shouldSkipHeader).toBe(false);
      expect(result.current.shouldRenderMatches).toBe(true);
    });
  });

  describe("raffle mode", () => {
    it("can hide matches via module features", () => {
      const resolveModeModule = () => ({ features: { showMatches: false } });
      const { result } = renderFeatures({ activeMode: "raffle", resolveModeModule });

      expect(result.current.isRaffleMode).toBe(true);
      expect(result.current.shouldRenderMatches).toBe(false);
    });

    it("can enable custom title via module features", () => {
      const resolveModeModule = () => ({ features: { showTitle: true } });
      const { result } = renderFeatures({ activeMode: "raffle", resolveModeModule });

      expect(result.current.allowCustomTitle).toBe(true);
      expect(result.current.shouldShowTitleInput).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles missing mode config by falling back to first entry", () => {
      const { result } = renderFeatures({
        activeMode: "unknown",
        modeConfigList: [createModeConfig({ id: "fallback", label: "Fallback" })],
      });

      expect(result.current.activeModeConfig.id).toBe("fallback");
    });

    it("handles missing mode module safely", () => {
      const { result } = renderFeatures({ activeMode: "football", resolveModeModule: () => null });

      expect(result.current.modeFeatures).toEqual({});
      expect(result.current.includeMiniBanner).toBe(false);
    });
  });
});

