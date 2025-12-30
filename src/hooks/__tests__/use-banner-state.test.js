import { act, renderHook } from "@testing-library/react-hooks";
import { describe, expect, it, vi } from "vitest";
import useBannerState from "../use-banner-state";
import { createTestMatch, createTestMatches, mockAutoLogoResolver } from "./test-utils";

describe("useBannerState", () => {
  const renderBannerHook = (config = {}) => renderHook(() => useBannerState(config));

  describe("initialization", () => {
    it("initializes with correct default state", () => {
      const { result } = renderBannerHook();

      expect(result.current.state).toMatchObject({
        title: "",
        matches: [],
        activeMatchCount: 1,
        brandLogoSrc: "",
        leagueLogoSrc: "",
        footerSrc: "",
        footerLink: "",
      });
    });

    it("respects maxMatches constraint when seeded with many matches", () => {
      const matches = createTestMatches(4);
      const { result } = renderBannerHook({ initialMatches: matches, maxMatches: 2 });

      expect(result.current.state.matches).toHaveLength(4);
      expect(result.current.state.activeMatchCount).toBe(2);
    });
  });

  describe("setTitle action", () => {
    it("updates the title value", () => {
      const { result } = renderBannerHook();

      act(() => {
        result.current.actions.setTitle("Liga 1 Pekan 3");
      });

      expect(result.current.state.title).toBe("Liga 1 Pekan 3");
    });

    it("coerces falsy values to empty string", () => {
      const { result } = renderBannerHook();

      act(() => {
        result.current.actions.setTitle(null);
      });

      expect(result.current.state.title).toBe("");
    });
  });

  describe("setBrandLogo action", () => {
    it("updates brand logo source", () => {
      const { result } = renderBannerHook();

      act(() => {
        result.current.actions.setBrandLogo("/brand.png");
      });

      expect(result.current.state.brandLogoSrc).toBe("/brand.png");
    });

    it("updates footer when provided and clears footer link", () => {
      const { result } = renderBannerHook();

      act(() => {
        result.current.actions.setFooter("/footer.png", "https://example.com");
      });

      act(() => {
        result.current.actions.setBrandLogo("/brand.png", { footerSrc: "/brand-footer.png" });
      });

      expect(result.current.state.brandLogoSrc).toBe("/brand.png");
      expect(result.current.state.footerSrc).toBe("/brand-footer.png");
      expect(result.current.state.footerLink).toBe("");
    });

    it("retains existing footer image when none provided", () => {
      const { result } = renderBannerHook();

      act(() => {
        result.current.actions.setFooter("/footer.png", "https://example.com");
      });

      act(() => {
        result.current.actions.setBrandLogo("/brand.png");
      });

      expect(result.current.state.footerSrc).toBe("/footer.png");
      expect(result.current.state.footerLink).toBe("");
    });
  });

  describe("updateMatchField action", () => {
    it("updates basic match fields", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.updateMatchField(0, "scoreHome", 3);
      });

      expect(result.current.state.matches[0].scoreHome).toBe(3);
    });

    it("triggers auto logo when team name changes", () => {
      const autoResolver = mockAutoLogoResolver({ "New Team": "/new-team.png" });
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({
        initialMatches: matches,
        resolveAutoTeamLogoSrc: autoResolver,
      });

      act(() => {
        result.current.actions.updateMatchField(0, "teamHome", "New Team");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamHomeLogo).toBe("/new-team.png");
      expect(updatedMatch.teamHomeLogoIsAuto).toBe(true);
      expect(autoResolver).toHaveBeenCalledWith("New Team");
    });

    it("does not override manual logos with auto logos", () => {
      const matches = [
        createTestMatch({
          teamHomeLogo: "/manual.png",
          teamHomeLogoIsAuto: false,
        }),
      ];
      const autoResolver = mockAutoLogoResolver({ "Any Team": "/auto.png" });
      const { result } = renderBannerHook({
        initialMatches: matches,
        resolveAutoTeamLogoSrc: autoResolver,
      });

      act(() => {
        result.current.actions.updateMatchField(0, "teamHome", "Any Team");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamHomeLogo).toBe("/manual.png");
      expect(updatedMatch.teamHomeLogoIsAuto).toBe(false);
    });

    it("resets logo adjustments when logo source changes", () => {
      const matches = [
        createTestMatch({
          teamHomeLogo: "/auto.png",
          teamHomeLogoIsAuto: true,
          teamHomeLogoScale: 1.5,
          teamHomeLogoOffsetX: 0.4,
          teamHomeLogoOffsetY: -0.4,
        }),
      ];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.updateMatchField(0, "teamHomeLogo", "/custom.png");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamHomeLogo).toBe("/custom.png");
      expect(updatedMatch.teamHomeLogoIsAuto).toBe(false);
      expect(updatedMatch.teamHomeLogoScale).toBe(1);
      expect(updatedMatch.teamHomeLogoOffsetX).toBe(0);
      expect(updatedMatch.teamHomeLogoOffsetY).toBe(0);
    });

    it("resets player adjustments when player image changes", () => {
      const matches = [
        createTestMatch({
          teamHomePlayerImage: "/player.png",
          teamHomePlayerScale: 1.3,
          teamHomePlayerOffsetX: 0.4,
          teamHomePlayerOffsetY: -0.3,
          teamHomePlayerFlip: true,
        }),
      ];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.updateMatchField(0, "teamHomePlayerImage", "/new-player.png");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamHomePlayerImage).toBe("/new-player.png");
      expect(updatedMatch.teamHomePlayerScale).toBe(1);
      expect(updatedMatch.teamHomePlayerOffsetX).toBe(0);
      expect(updatedMatch.teamHomePlayerOffsetY).toBe(0);
      expect(updatedMatch.teamHomePlayerFlip).toBe(false);
    });

    it("handles unknown fields gracefully", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.updateMatchField(0, "customField", "value");
      });

      expect(result.current.state.matches[0].customField).toBe("value");
    });
  });

  describe("autoLogo action", () => {
    it("applies home auto logo when available", () => {
      const matches = [createTestMatch({ teamHome: "Home FC" })];
      const resolver = mockAutoLogoResolver({ "Home FC": "/home.png" });
      const { result } = renderBannerHook({
        initialMatches: matches,
        resolveAutoTeamLogoSrc: resolver,
      });

      act(() => {
        result.current.actions.autoLogo(0, "home");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamHomeLogo).toBe("/home.png");
      expect(updatedMatch.teamHomeLogoIsAuto).toBe(true);
      expect(updatedMatch.teamHomeLogoScale).toBe(1);
    });

    it("applies away auto logo when available", () => {
      const matches = [createTestMatch({ teamAway: "Away FC" })];
      const resolver = mockAutoLogoResolver({ "Away FC": "/away.png" });
      const { result } = renderBannerHook({
        initialMatches: matches,
        resolveAutoTeamLogoSrc: resolver,
      });

      act(() => {
        result.current.actions.autoLogo(0, "away");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamAwayLogo).toBe("/away.png");
      expect(updatedMatch.teamAwayLogoIsAuto).toBe(true);
      expect(updatedMatch.teamAwayLogoScale).toBe(1);
    });

    it("clears logo when auto logo is unavailable", () => {
      const matches = [
        createTestMatch({
          teamHome: "Home FC",
          teamHomeLogo: "/manual.png",
          teamHomeLogoIsAuto: true,
          teamHomeLogoScale: 1.2,
        }),
      ];
      const resolver = mockAutoLogoResolver({});
      const { result } = renderBannerHook({
        initialMatches: matches,
        resolveAutoTeamLogoSrc: resolver,
      });

      act(() => {
        result.current.actions.autoLogo(0, "home");
      });

      const updatedMatch = result.current.state.matches[0];
      expect(updatedMatch.teamHomeLogo).toBe("");
      expect(updatedMatch.teamHomeLogoIsAuto).toBe(false);
      expect(updatedMatch.teamHomeLogoScale).toBe(1);
    });
  });

  describe("adjustLogo action", () => {
    it("clamps scale between 0.25 and 3", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustLogo(0, "home", { scale: 10 });
      });

      expect(result.current.state.matches[0].teamHomeLogoScale).toBe(3);

      act(() => {
        result.current.actions.adjustLogo(0, "home", { scale: 0.1 });
      });

      expect(result.current.state.matches[0].teamHomeLogoScale).toBe(0.25);
    });

    it("clamps offsetX between -0.75 and 0.75", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustLogo(0, "home", { offsetX: 2 });
      });

      expect(result.current.state.matches[0].teamHomeLogoOffsetX).toBe(0.75);

      act(() => {
        result.current.actions.adjustLogo(0, "home", { offsetX: -5 });
      });

      expect(result.current.state.matches[0].teamHomeLogoOffsetX).toBe(-0.75);
    });

    it("clamps offsetY between -0.75 and 0.75", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustLogo(0, "home", { offsetY: -5 });
      });

      expect(result.current.state.matches[0].teamHomeLogoOffsetY).toBe(-0.75);

      act(() => {
        result.current.actions.adjustLogo(0, "home", { offsetY: 5 });
      });

      expect(result.current.state.matches[0].teamHomeLogoOffsetY).toBe(0.75);
    });

    it("does not modify other matches", () => {
      const matches = createTestMatches(2);
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustLogo(0, "home", { scale: 2 });
      });

      expect(result.current.state.matches[1].teamHomeLogoScale).toBe(1);
    });
  });

  describe("adjustPlayer action", () => {
    it("clamps scale between 0.7 and 1.5", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustPlayer(0, "home", { scale: 10 });
      });
      expect(result.current.state.matches[0].teamHomePlayerScale).toBe(1.5);

      act(() => {
        result.current.actions.adjustPlayer(0, "home", { scale: 0.2 });
      });
      expect(result.current.state.matches[0].teamHomePlayerScale).toBe(0.7);
    });

    it("updates offsetX in allowed range", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustPlayer(0, "home", { offsetX: 0.3 });
      });

      expect(result.current.state.matches[0].teamHomePlayerOffsetX).toBe(0.3);
    });

    it("updates offsetY in allowed range", () => {
      const matches = [createTestMatch()];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustPlayer(0, "home", { offsetY: -0.4 });
      });

      expect(result.current.state.matches[0].teamHomePlayerOffsetY).toBe(-0.4);
    });

    it("handles matches without player images", () => {
      const matches = [createTestMatch({ teamHomePlayerImage: "" })];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.adjustPlayer(0, "home", { scale: 1.2 });
      });

      expect(result.current.state.matches[0].teamHomePlayerScale).toBe(1.2);
    });
  });

  describe("togglePlayerFlip action", () => {
    it("toggles flip state when player image exists", () => {
      const matches = [createTestMatch({ teamHomePlayerImage: "/player.png" })];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.togglePlayerFlip(0, "home");
      });
      expect(result.current.state.matches[0].teamHomePlayerFlip).toBe(true);

      act(() => {
        result.current.actions.togglePlayerFlip(0, "home");
      });
      expect(result.current.state.matches[0].teamHomePlayerFlip).toBe(false);
    });

    it("does not toggle when player image missing", () => {
      const matches = [createTestMatch({ teamHomePlayerImage: "" })];
      const { result } = renderBannerHook({ initialMatches: matches });

      act(() => {
        result.current.actions.togglePlayerFlip(0, "home");
      });

      expect(result.current.state.matches[0].teamHomePlayerFlip).toBe(false);
    });
  });

  describe("setMatchCount action", () => {
    it("expands matches array when increasing count", () => {
      const createInitialMatches = vi.fn((count) =>
        Array.from({ length: count }).map((_, index) =>
          createTestMatch({ teamHome: `Generated ${index}` })
        )
      );
      const { result } = renderBannerHook({
        initialMatches: createTestMatches(1),
        maxMatches: 5,
        createInitialMatches,
      });

      act(() => {
        result.current.actions.setMatchCount(3);
      });

      expect(result.current.state.matches).toHaveLength(3);
      expect(result.current.state.activeMatchCount).toBe(3);
      expect(createInitialMatches).toHaveBeenCalledWith(2);
    });

    it("does not shrink matches array when decreasing", () => {
      const initialMatches = createTestMatches(3);
      const { result } = renderBannerHook({ initialMatches, maxMatches: 5 });

      act(() => {
        result.current.actions.setMatchCount(1);
      });

      expect(result.current.state.matches).toHaveLength(3);
      expect(result.current.state.activeMatchCount).toBe(1);
    });

    it("respects maxMatches limit", () => {
      const createInitialMatches = vi.fn((count) => createTestMatches(count));
      const { result } = renderBannerHook({
        initialMatches: createTestMatches(2),
        maxMatches: 4,
        createInitialMatches,
      });

      act(() => {
        result.current.actions.setMatchCount(10);
      });

      expect(result.current.state.matches).toHaveLength(4);
      expect(result.current.state.activeMatchCount).toBe(4);
    });
  });
});

