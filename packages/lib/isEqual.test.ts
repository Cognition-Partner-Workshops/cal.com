import { describe, expect, it } from "vitest";

import { isEqual } from "./isEqual";

describe("isEqual", () => {
  describe("primitive values", () => {
    it("should return true for equal numbers", () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual(0, 0)).toBe(true);
      expect(isEqual(-1, -1)).toBe(true);
    });

    it("should return false for different numbers", () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual(0, 1)).toBe(false);
    });

    it("should return true for equal strings", () => {
      expect(isEqual("hello", "hello")).toBe(true);
      expect(isEqual("", "")).toBe(true);
    });

    it("should return false for different strings", () => {
      expect(isEqual("hello", "world")).toBe(false);
    });

    it("should return true for equal booleans", () => {
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
    });

    it("should return false for different booleans", () => {
      expect(isEqual(true, false)).toBe(false);
    });
  });

  describe("null and undefined", () => {
    it("should return true for null === null", () => {
      expect(isEqual(null, null)).toBe(true);
    });

    it("should return true for undefined === undefined", () => {
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it("should return false for null vs undefined", () => {
      expect(isEqual(null, undefined)).toBe(false);
    });

    it("should return false when comparing null with other values", () => {
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(null, "")).toBe(false);
      expect(isEqual(null, {})).toBe(false);
    });

    it("should return false when comparing undefined with other values", () => {
      expect(isEqual(undefined, 0)).toBe(false);
      expect(isEqual(undefined, "")).toBe(false);
    });
  });

  describe("arrays", () => {
    it("should return true for equal arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([], [])).toBe(true);
    });

    it("should return false for arrays with different lengths", () => {
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should return false for arrays with different values", () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("should handle nested arrays", () => {
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBe(true);
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 5],
          ]
        )
      ).toBe(false);
    });

    it("should handle arrays with objects", () => {
      expect(isEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
      expect(isEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
    });
  });

  describe("objects", () => {
    it("should return true for equal objects", () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({}, {})).toBe(true);
    });

    it("should return false for objects with different keys", () => {
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it("should return false for objects with different values", () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("should return false for objects with different number of keys", () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should handle nested objects", () => {
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
    });

    it("should handle objects with arrays", () => {
      expect(isEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true);
      expect(isEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 4] })).toBe(false);
    });
  });

  describe("mixed types", () => {
    it("should return false for different types", () => {
      expect(isEqual(1, "1")).toBe(false);
      expect(isEqual(0, false)).toBe(false);
    });

    it("should treat empty array and empty object as equal (both have 0 keys)", () => {
      expect(isEqual([], {})).toBe(true);
    });
  });
});
