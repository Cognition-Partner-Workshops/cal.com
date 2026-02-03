import { describe, expect, it } from "vitest";

import { safeStringify } from "./safeStringify";

describe("safeStringify", () => {
  describe("primitive values", () => {
    it("should stringify strings", () => {
      expect(safeStringify("hello")).toBe('"hello"');
    });

    it("should stringify numbers", () => {
      expect(safeStringify(42)).toBe("42");
      expect(safeStringify(3.14)).toBe("3.14");
      expect(safeStringify(-1)).toBe("-1");
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
      const obj = { a: 1, b: "test" };
      expect(safeStringify(obj)).toBe('{"a":1,"b":"test"}');
    });

    it("should stringify empty objects", () => {
      expect(safeStringify({})).toBe("{}");
    });

    it("should stringify nested objects", () => {
      const obj = { outer: { inner: "value" } };
      expect(safeStringify(obj)).toBe('{"outer":{"inner":"value"}}');
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
      expect(safeStringify([1, "two", true, null])).toBe('[1,"two",true,null]');
    });
  });

  describe("Error objects", () => {
    it("should stringify Error message when no stack", () => {
      const error = new Error("Test error");
      const result = safeStringify(error);
      expect(typeof result).toBe("string");
      expect(result).toContain("Test error");
    });

    it("should stringify Error with stack trace", () => {
      const error = new Error("Stack trace error");
      const result = safeStringify(error);
      expect(typeof result).toBe("string");
      expect(result).toContain("Stack trace error");
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

  describe("undefined", () => {
    it("should return undefined as-is (JSON.stringify returns undefined for undefined)", () => {
      const result = safeStringify(undefined);
      expect(result).toBeUndefined();
    });
  });
});
