import { describe, expect, it } from "vitest";

import { isEqual } from "./isEqual";

describe("isEqual", () => {
  describe("primitive values", () => {
    it("should return true for identical primitives", () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual("hello", "hello")).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
    });

    it("should return false for different primitives", () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual("hello", "world")).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    it("should handle null and undefined", () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(undefined, null)).toBe(false);
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(undefined, "")).toBe(false);
    });
  });

  describe("arrays", () => {
    it("should return true for identical arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(["a", "b"], ["a", "b"])).toBe(true);
      expect(isEqual([], [])).toBe(true);
    });

    it("should return false for different arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    it("should handle nested arrays", () => {
      expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
      expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
    });
  });

  describe("objects", () => {
    it("should return true for identical objects", () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({}, {})).toBe(true);
    });

    it("should return false for different objects", () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should handle nested objects", () => {
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it("should handle objects with array values", () => {
      expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
      expect(isEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false);
    });
  });

  describe("mixed types", () => {
    it("should return false for different types", () => {
      expect(isEqual(1, "1")).toBe(false);
      expect(isEqual(null, {})).toBe(false);
    });

    it("should handle empty array vs empty object comparison", () => {
      // Note: The isEqual function treats empty arrays and empty objects as equal
      // because both have 0 keys when checked with Object.keys
      expect(isEqual([], {})).toBe(true);
    });
  });
});
