import { describe, expect, it } from "vitest";

import notEmpty from "./notEmpty";

describe("notEmpty", () => {
  it("should return true for non-empty values", () => {
    expect(notEmpty("hello")).toBe(true);
    expect(notEmpty(1)).toBe(true);
    expect(notEmpty(0)).toBe(false); // 0 is falsy
    expect(notEmpty(true)).toBe(true);
    expect(notEmpty(false)).toBe(false); // false is falsy
    expect(notEmpty({})).toBe(true);
    expect(notEmpty([])).toBe(true);
  });

  it("should return false for null", () => {
    expect(notEmpty(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(notEmpty(undefined)).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(notEmpty("")).toBe(false);
  });

  it("should work as a type guard in filter operations", () => {
    const mixedArray: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];
    const filtered = mixedArray.filter(notEmpty);
    expect(filtered).toEqual(["a", "b", "c"]);
    expect(filtered.length).toBe(3);
  });

  it("should work with numbers including zero", () => {
    const numbersWithNull: (number | null)[] = [1, null, 2, 0, 3];
    const filtered = numbersWithNull.filter(notEmpty);
    // Note: 0 is falsy so it will be filtered out
    expect(filtered).toEqual([1, 2, 3]);
  });

  it("should preserve non-null objects", () => {
    const objects: ({ id: number } | null)[] = [{ id: 1 }, null, { id: 2 }];
    const filtered = objects.filter(notEmpty);
    expect(filtered).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
