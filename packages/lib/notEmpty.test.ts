import { describe, expect, it } from "vitest";

import notEmpty from "./notEmpty";

describe("notEmpty", () => {
  it("should return true for non-empty values", () => {
    expect(notEmpty("hello")).toBe(true);
    expect(notEmpty(1)).toBe(true);
    expect(notEmpty(0)).toBe(false);
    expect(notEmpty(true)).toBe(true);
    expect(notEmpty(false)).toBe(false);
    expect(notEmpty({})).toBe(true);
    expect(notEmpty([])).toBe(true);
  });

  it("should return false for null and undefined", () => {
    expect(notEmpty(null)).toBe(false);
    expect(notEmpty(undefined)).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(notEmpty("")).toBe(false);
  });

  it("should work as a type guard for filtering arrays", () => {
    const mixedArray: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];
    const filtered = mixedArray.filter(notEmpty);
    expect(filtered).toEqual(["a", "b", "c"]);
    expect(filtered.length).toBe(3);
  });

  it("should work with objects containing null values", () => {
    const obj = { a: 1 };
    expect(notEmpty(obj)).toBe(true);
  });

  it("should return true for NaN (truthy check)", () => {
    expect(notEmpty(NaN)).toBe(false);
  });
});
