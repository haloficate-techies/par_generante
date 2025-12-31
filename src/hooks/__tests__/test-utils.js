import { vi } from "vitest";

const DEFAULT_MATCH = {
  teamHome: "Home FC",
  teamAway: "Away FC",
  teamHomeLogo: "",
  teamAwayLogo: "",
  teamHomeLogoIsAuto: false,
  teamAwayLogoIsAuto: false,
  teamHomeLogoScale: 1,
  teamAwayLogoScale: 1,
  teamHomeLogoOffsetX: 0,
  teamHomeLogoOffsetY: 0,
  teamAwayLogoOffsetX: 0,
  teamAwayLogoOffsetY: 0,
  teamHomePlayer: "Home Player",
  teamAwayPlayer: "Away Player",
  teamHomePlayerImage: "",
  teamAwayPlayerImage: "",
  teamHomePlayerScale: 1,
  teamHomePlayerOffsetX: 0,
  teamHomePlayerOffsetY: 0,
  teamHomePlayerFlip: false,
  teamAwayPlayerScale: 1,
  teamAwayPlayerOffsetX: 0,
  teamAwayPlayerOffsetY: 0,
  teamAwayPlayerFlip: false,
  scoreHome: 0,
  scoreAway: 0,
};

const DEFAULT_MODE_CONFIG = {
  id: "football",
  label: "Football",
  features: {},
};

let originalFetch = globalThis.fetch;

export const createTestMatch = (overrides = {}) => ({
  ...DEFAULT_MATCH,
  ...overrides,
});

export const createTestMatches = (count = 2, overrides = {}) =>
  Array.from({ length: count }, (_, index) =>
    createTestMatch(typeof overrides === "function" ? overrides(index) : overrides)
  );

export const mockAutoLogoResolver = (mapping = {}) => {
  const lookup = new Map(Object.entries(mapping));
  return vi.fn((teamName) => lookup.get(teamName) || "");
};

export const createModeConfig = (overrides = {}) => ({
  ...DEFAULT_MODE_CONFIG,
  ...overrides,
});

export const mockFetch = (payload = {}, options = {}) => {
  const { ok = true, status = 200, delay = 0 } = options;
  const mockResponse = {
    ok,
    status,
    json: vi.fn().mockResolvedValue(payload),
    text: vi.fn().mockResolvedValue(typeof payload === "string" ? payload : JSON.stringify(payload)),
  };
  globalThis.fetch = vi.fn(
    () =>
      new Promise((resolve) => {
        if (!delay) {
          resolve(mockResponse);
          return;
        }
        setTimeout(() => resolve(mockResponse), delay);
      })
  );
  return mockResponse;
};

export const restoreFetch = () => {
  globalThis.fetch = originalFetch;
};

