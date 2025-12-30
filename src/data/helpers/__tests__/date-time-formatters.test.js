import { describe, expect, it } from "vitest";

import { formatDate, formatTime } from "../date-time-formatters";

describe("formatDate", () => {
  it("formats valid ISO date strings", () => {
    expect(formatDate("2025-01-15")).toContain("2025");
  });

  it("returns placeholder for empty or invalid input", () => {
    expect(formatDate("")).toBe("Tanggal TBD");
    expect(formatDate(null)).toBe("Tanggal TBD");
    expect(formatDate(undefined)).toBe("Tanggal TBD");
    expect(formatDate("not-a-date")).toBe("Tanggal TBD");
  });

  it("handles leap years", () => {
    expect(formatDate("2024-02-29")).toContain("2024");
  });
});

describe("formatTime", () => {
  it("appends WIB to provided time string", () => {
    expect(formatTime("18:30")).toBe("18:30 WIB");
    expect(formatTime("00:00")).toBe("00:00 WIB");
  });

  it("returns placeholder for falsy values", () => {
    expect(formatTime("")).toBe("Waktu TBD");
    expect(formatTime(null)).toBe("Waktu TBD");
    expect(formatTime(undefined)).toBe("Waktu TBD");
  });

  it("accepts loosely formatted strings", () => {
    expect(formatTime("invalid")).toBe("invalid WIB");
  });
});

