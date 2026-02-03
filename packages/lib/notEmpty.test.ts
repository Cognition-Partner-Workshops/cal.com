import { describe, expect, it } from "vitest";

import notEmpty from "./notEmpty";

describe("notEmpty", () => {
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

    it("should return false for false", () => {
      expect(notEmpty(false)).toBe(false);
    });

    it("should return false for NaN", () => {
      expect(notEmpty(NaN)).toBe(false);
    });
  });

  describe("truthy values", () => {
    it("should return true for non-empty string", () => {
      expect(notEmpty("hello")).toBe(true);
      expect(notEmpty(" ")).toBe(true);
    });

    it("should return true for non-zero numbers", () => {
      expect(notEmpty(1)).toBe(true);
      expect(notEmpty(-1)).toBe(true);
      expect(notEmpty(0.1)).toBe(true);
    });

    it("should return true for true", () => {
      expect(notEmpty(true)).toBe(true);
    });

    it("should return true for objects", () => {
      expect(notEmpty({})).toBe(true);
      expect(notEmpty({ a: 1 })).toBe(true);
    });

    it("should return true for arrays", () => {
      expect(notEmpty([])).toBe(true);
      expect(notEmpty([1, 2, 3])).toBe(true);
    });

    it("should return true for functions", () => {
      expect(notEmpty(() => {})).toBe(true);
    });
  });

  describe("type guard usage", () => {
    it("should filter out null and undefined from arrays", () => {
      const arr: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];
      const filtered = arr.filter(notEmpty);
      expect(filtered).toEqual(["a", "b", "c"]);
    });

    it("should filter out falsy values from arrays", () => {
      const arr: (number | null | undefined)[] = [1, null, 2, undefined, 3];
      const filtered = arr.filter(notEmpty);
      expect(filtered).toEqual([1, 2, 3]);
    });
  });
});
