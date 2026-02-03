import { describe, expect, it } from "vitest";

import { safeStringify } from "./safeStringify";

describe("safeStringify", () => {
  describe("primitive values", () => {
    it("should stringify numbers", () => {
      expect(safeStringify(42)).toBe("42");
      expect(safeStringify(0)).toBe("0");
      expect(safeStringify(-1)).toBe("-1");
    });

    it("should stringify strings", () => {
      expect(safeStringify("hello")).toBe('"hello"');
      expect(safeStringify("")).toBe('""');
    });

    it("should stringify booleans", () => {
      expect(safeStringify(true)).toBe("true");
      expect(safeStringify(false)).toBe("false");
    });

    it("should stringify null", () => {
      expect(safeStringify(null)).toBe("null");
    });
  });

  describe("objects", () => {
    it("should stringify simple objects", () => {
      expect(safeStringify({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
    });

    it("should stringify empty objects", () => {
      expect(safeStringify({})).toBe("{}");
    });

    it("should stringify nested objects", () => {
      expect(safeStringify({ a: { b: 1 } })).toBe('{"a":{"b":1}}');
    });
  });

  describe("arrays", () => {
    it("should stringify arrays", () => {
      expect(safeStringify([1, 2, 3])).toBe("[1,2,3]");
    });

    it("should stringify empty arrays", () => {
      expect(safeStringify([])).toBe("[]");
    });

    it("should stringify arrays with mixed types", () => {
      expect(safeStringify([1, "a", true])).toBe('[1,"a",true]');
    });
  });

  describe("Error objects", () => {
    it("should stringify error message when no stack", () => {
      const error = new Error("Test error");
      const result = safeStringify(error);
      expect(typeof result).toBe("string");
      expect(result).toContain("Test error");
    });

    it("should stringify error with stack trace", () => {
      const error = new Error("Test error with stack");
      const result = safeStringify(error);
      expect(typeof result).toBe("string");
      expect(result).toContain("Test error with stack");
    });
  });

  describe("circular references", () => {
    it("should handle circular references gracefully", () => {
      const obj: Record<string, unknown> = { a: 1 };
      obj.self = obj;
      const result = safeStringify(obj);
      expect(result).toBe(obj);
    });
  });
});
