import { describe, expect, it } from "vitest";

import { normalizeTogelDigits } from "../utils/canvas/togel/digits";
import { resolveTogelDateLabel } from "../utils/canvas/date";

describe("Canvas helper utils", () => {
  it("normalizeTogelDigits normalizes various inputs", () => {
    expect(normalizeTogelDigits(["12", 3, "", undefined])).toEqual(["2", "3", "0", "0"]);
    expect(normalizeTogelDigits([9, "05", "a", "7"])).toEqual(["9", "5", "0", "7"]);
    expect(normalizeTogelDigits([])).toEqual(["0", "0", "0"]);
  });

  it("resolveTogelDateLabel rolls back for toto_macau 4D midnight", () => {
    const now = new Date();
    const prevDay = new Date(now);
    prevDay.setDate(now.getDate() - 1);
    const expected = prevDay.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const label = resolveTogelDateLabel({
      poolCode: "toto_macau",
      variantLabel: "4D",
      drawTime: "00:00",
    });
    expect(label).toBe(expected);
  });

  it("resolveTogelDateLabel returns today otherwise", () => {
    const now = new Date();
    const expected = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const label = resolveTogelDateLabel({
      poolCode: "others",
      variantLabel: "4D",
      drawTime: "12:00",
    });
    expect(label).toBe(expected);
  });
});
