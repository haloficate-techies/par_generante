import { describe, expect, it } from "vitest";

import {
  buildImageSourceCandidates,
  buildProxiedImageUrl,
  getProxyHostFromUrl,
  matchesAllowlistedHost,
  shouldProxyHost,
} from "../image-proxy";

describe("getProxyHostFromUrl", () => {
  it("extracts hostname from valid urls", () => {
    expect(getProxyHostFromUrl("https://example.com/logo.png")).toBe("example.com");
    expect(getProxyHostFromUrl("https://sub.example.com/path")).toBe("sub.example.com");
  });

  it("returns empty string for invalid inputs", () => {
    expect(getProxyHostFromUrl("")).toBe("");
    expect(getProxyHostFromUrl("not-a-url")).toBe("");
    expect(getProxyHostFromUrl(null)).toBe("");
  });
});

describe("matchesAllowlistedHost", () => {
  it("supports wildcard host", () => {
    expect(matchesAllowlistedHost("anything.com", "*")).toBe(true);
  });

  it("matches exact hostname", () => {
    expect(matchesAllowlistedHost("example.com", "example.com")).toBe(true);
    expect(matchesAllowlistedHost("example.com", "other.com")).toBe(false);
  });

  it("matches subdomains", () => {
    expect(matchesAllowlistedHost("sub.example.com", "example.com")).toBe(true);
    expect(matchesAllowlistedHost("deep.sub.example.com", "example.com")).toBe(true);
  });
});

describe("shouldProxyHost", () => {
  it("returns true for allowlisted host", () => {
    expect(shouldProxyHost("upload.wikimedia.org")).toBe(true);
  });

  it("returns false for empty hostname", () => {
    expect(shouldProxyHost("")).toBe(false);
    expect(shouldProxyHost(null)).toBe(false);
  });
});

describe("buildProxiedImageUrl", () => {
  it("returns proxied url for allowlisted host", () => {
    const src = "https://upload.wikimedia.org/logo.png";
    const result = buildProxiedImageUrl(src);
    expect(result).toBeTruthy();
    expect(result).toContain("proxy.superbia.app");
    expect(result).toContain(encodeURIComponent(src));
  });

  it("returns null for non-http protocols", () => {
    expect(buildProxiedImageUrl("data:image/png;base64,abcd")).toBeNull();
    expect(buildProxiedImageUrl("blob:xyz")).toBeNull();
  });

  it("returns null when hostname cannot be parsed", () => {
    expect(buildProxiedImageUrl("https://")).toBeNull();
  });
});

describe("buildImageSourceCandidates", () => {
  it("returns proxied + original for allowlisted host", () => {
    const src = "https://upload.wikimedia.org/logo.png";
    const candidates = buildImageSourceCandidates(src);
    expect(candidates[0]).toContain("proxy.superbia.app");
    expect(candidates[1]).toBe(src);
  });

  it("returns only original for data urls", () => {
    const src = "data:image/png;base64,abcd";
    expect(buildImageSourceCandidates(src)).toEqual([src]);
  });

  it("handles invalid input gracefully", () => {
    expect(buildImageSourceCandidates("")).toEqual([]);
    expect(buildImageSourceCandidates(null)).toEqual([]);
  });
});

