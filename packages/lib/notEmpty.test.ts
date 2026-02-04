import { describe, expect, it } from "vitest";

import notEmpty from "./notEmpty";

describe("notEmpty", () => {
  describe("truthy values", () => {
    it("should return true for non-empty strings", () => {
      expect(notEmpty("hello")).toBe(true);
      expect(notEmpty("a")).toBe(true);
      expect(notEmpty(" ")).toBe(true);
    });

    it("should return true for numbers (including zero)", () => {
      expect(notEmpty(1)).toBe(true);
      expect(notEmpty(-1)).toBe(true);
      expect(notEmpty(100)).toBe(true);
      expect(notEmpty(0.5)).toBe(true);
    });

    it("should return true for boolean true", () => {
      expect(notEmpty(true)).toBe(true);
    });

    it("should return true for objects", () => {
      expect(notEmpty({})).toBe(true);
      expect(notEmpty({ a: 1 })).toBe(true);
      expect(notEmpty({ name: "John" })).toBe(true);
    });

    it("should return true for arrays", () => {
      expect(notEmpty([])).toBe(true);
      expect(notEmpty([1, 2, 3])).toBe(true);
      expect(notEmpty(["a"])).toBe(true);
    });

    it("should return true for functions", () => {
      expect(notEmpty(() => {})).toBe(true);
      expect(notEmpty(function () {})).toBe(true);
    });

    it("should return true for dates", () => {
      expect(notEmpty(new Date())).toBe(true);
    });

    it("should return true for symbols", () => {
      expect(notEmpty(Symbol("test"))).toBe(true);
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

    it("should return false for zero", () => {
      expect(notEmpty(0)).toBe(false);
    });

    it("should return false for boolean false", () => {
      expect(notEmpty(false)).toBe(false);
    });

    it("should return false for NaN", () => {
      expect(notEmpty(NaN)).toBe(false);
    });
  });

  describe("type guard functionality", () => {
    it("should work as a type guard in filter operations", () => {
      const mixedArray: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];
      const filtered = mixedArray.filter(notEmpty);

      expect(filtered).toEqual(["a", "b", "c"]);
      expect(filtered).toHaveLength(3);
    });

    it("should filter out falsy values from arrays", () => {
      const mixedArray: (number | null | undefined)[] = [1, null, 2, undefined, 3];
      const filtered = mixedArray.filter(notEmpty);

      expect(filtered).toEqual([1, 2, 3]);
    });

    it("should preserve objects in filter operations", () => {
      const mixedArray: ({ id: number } | null | undefined)[] = [
        { id: 1 },
        null,
        { id: 2 },
        undefined,
      ];
      const filtered = mixedArray.filter(notEmpty);

      expect(filtered).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
});
