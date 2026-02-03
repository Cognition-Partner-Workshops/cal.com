import { describe, expect, it } from "vitest";

import notEmpty from "./notEmpty";

describe("notEmpty", () => {
  describe("truthy values", () => {
    it("should return true for non-empty strings", () => {
      expect(notEmpty("hello")).toBe(true);
      expect(notEmpty("0")).toBe(true);
      expect(notEmpty(" ")).toBe(true);
    });

    it("should return true for numbers (including 0)", () => {
      expect(notEmpty(1)).toBe(true);
      expect(notEmpty(-1)).toBe(true);
      expect(notEmpty(3.14)).toBe(true);
    });

    it("should return true for objects", () => {
      expect(notEmpty({})).toBe(true);
      expect(notEmpty({ a: 1 })).toBe(true);
    });

    it("should return true for arrays", () => {
      expect(notEmpty([])).toBe(true);
      expect(notEmpty([1, 2, 3])).toBe(true);
    });

    it("should return true for boolean true", () => {
      expect(notEmpty(true)).toBe(true);
    });
  });

  describe("falsy values", () => {
    it("should return false for null", () => {
      expect(notEmpty(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(notEmpty(undefined)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(notEmpty("")).toBe(false);
    });

    it("should return false for 0", () => {
      expect(notEmpty(0)).toBe(false);
    });

    it("should return false for boolean false", () => {
      expect(notEmpty(false)).toBe(false);
    });

    it("should return false for NaN", () => {
      expect(notEmpty(NaN)).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should work as a type guard for filtering arrays", () => {
      const mixedArray: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];
      const filtered = mixedArray.filter(notEmpty);
      expect(filtered).toEqual(["a", "b", "c"]);
      expect(filtered.length).toBe(3);
    });

    it("should work with number arrays containing null/undefined", () => {
      const mixedArray: (number | null | undefined)[] = [1, null, 2, undefined, 3];
      const filtered = mixedArray.filter(notEmpty);
      expect(filtered).toEqual([1, 2, 3]);
    });
  });
});
