import { describe, expect, it } from "vitest";

import { createInitialMatches } from "../match-factory";

describe("createInitialMatches", () => {
  it("creates the requested number of matches", () => {
    const matches = createInitialMatches(5);
    expect(matches).toHaveLength(5);
  });

  it("produces ISO formatted date for each match", () => {
    const [match] = createInitialMatches(1);
    expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("fills all required fields with defaults", () => {
    const [match] = createInitialMatches(1);
    expect(match).toMatchObject({
      teamHome: "",
      teamAway: "",
      time: "18:30",
      gameLogo: null,
      gameName: "",
      teamHomeLogo: null,
      teamHomeLogoIsAuto: false,
      teamAwayLogo: null,
      teamAwayLogoIsAuto: false,
      scoreHome: "0",
      scoreAway: "0",
      teamHomePlayerImage: null,
      teamAwayPlayerImage: null,
    });
  });

  it("initializes logo and player transforms", () => {
    const [match] = createInitialMatches(1);
    expect(match.teamHomeLogoScale).toBe(1);
    expect(match.teamHomeLogoOffsetX).toBe(0);
    expect(match.teamHomeLogoOffsetY).toBe(0);
    expect(match.teamAwayLogoScale).toBe(1);
    expect(match.teamAwayLogoOffsetX).toBe(0);
    expect(match.teamAwayLogoOffsetY).toBe(0);
    expect(match.teamHomePlayerScale).toBe(1);
    expect(match.teamHomePlayerOffsetX).toBe(0);
    expect(match.teamHomePlayerOffsetY).toBe(0);
    expect(match.teamAwayPlayerScale).toBe(1);
    expect(match.teamAwayPlayerOffsetX).toBe(0);
    expect(match.teamAwayPlayerOffsetY).toBe(0);
  });

  it("returns an empty array for zero count", () => {
    expect(createInitialMatches(0)).toEqual([]);
  });
});

