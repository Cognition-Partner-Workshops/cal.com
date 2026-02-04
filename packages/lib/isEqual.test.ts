import { describe, expect, it } from "vitest";

import { isEqual } from "./isEqual";

describe("isEqual", () => {
  describe("primitive values", () => {
    it("should return true for identical primitive values", () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual("hello", "hello")).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
      expect(isEqual(0, 0)).toBe(true);
      expect(isEqual("", "")).toBe(true);
    });

    it("should return false for different primitive values", () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual("hello", "world")).toBe(false);
      expect(isEqual(true, false)).toBe(false);
      expect(isEqual(0, 1)).toBe(false);
      expect(isEqual("", "a")).toBe(false);
    });

    it("should return false for different types", () => {
      expect(isEqual(1, "1")).toBe(false);
      expect(isEqual(true, 1)).toBe(false);
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(0, false)).toBe(false);
      expect(isEqual("", false)).toBe(false);
    });
  });

  describe("null and undefined", () => {
    it("should return true for null === null and undefined === undefined", () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it("should return false for null vs undefined", () => {
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(undefined, null)).toBe(false);
    });

    it("should return false when comparing null/undefined with other values", () => {
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(null, "")).toBe(false);
      expect(isEqual(null, {})).toBe(false);
      expect(isEqual(null, [])).toBe(false);
      expect(isEqual(undefined, 0)).toBe(false);
      expect(isEqual(undefined, "")).toBe(false);
      expect(isEqual(undefined, {})).toBe(false);
    });
  });

  describe("arrays", () => {
    it("should return true for identical arrays", () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
      expect(isEqual([true, false], [true, false])).toBe(true);
    });

    it("should return false for arrays with different lengths", () => {
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
      expect(isEqual([], [1])).toBe(false);
    });

    it("should return false for arrays with different elements", () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual(["a", "b"], ["a", "c"])).toBe(false);
      expect(isEqual([true, false], [false, true])).toBe(false);
    });

    it("should handle nested arrays", () => {
      expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
      expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
      expect(isEqual([[[1]]], [[[1]]])).toBe(true);
      expect(isEqual([[[1]]], [[[2]]])).toBe(false);
    });
  });

  describe("objects", () => {
    it("should return true for identical objects", () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ name: "John", age: 30 }, { name: "John", age: 30 })).toBe(true);
    });

    it("should return true for objects with same keys in different order", () => {
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(isEqual({ x: "hello", y: "world" }, { y: "world", x: "hello" })).toBe(true);
    });

    it("should return false for objects with different number of keys", () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
      expect(isEqual({}, { a: 1 })).toBe(false);
    });

    it("should return false for objects with different values", () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual({ name: "John" }, { name: "Jane" })).toBe(false);
    });

    it("should return false for objects with different keys", () => {
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(isEqual({ x: 1 }, { y: 1 })).toBe(false);
    });

    it("should handle nested objects", () => {
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
      expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
      expect(isEqual({ a: { b: 1 } }, { a: { c: 1 } })).toBe(false);
    });
  });

  describe("mixed structures", () => {
    it("should handle objects containing arrays", () => {
      expect(isEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true);
      expect(isEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 4] })).toBe(false);
    });

    it("should handle arrays containing objects", () => {
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false);
    });

    it("should handle deeply nested mixed structures", () => {
      const obj1 = {
        users: [
          { name: "John", tags: ["admin", "user"] },
          { name: "Jane", tags: ["user"] },
        ],
        settings: { theme: "dark", notifications: { email: true, sms: false } },
      };
      const obj2 = {
        users: [
          { name: "John", tags: ["admin", "user"] },
          { name: "Jane", tags: ["user"] },
        ],
        settings: { theme: "dark", notifications: { email: true, sms: false } },
      };
      const obj3 = {
        users: [
          { name: "John", tags: ["admin", "user"] },
          { name: "Jane", tags: ["moderator"] },
        ],
        settings: { theme: "dark", notifications: { email: true, sms: false } },
      };

      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });
  });
});
