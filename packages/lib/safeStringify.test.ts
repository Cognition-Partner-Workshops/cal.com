import { describe, expect, it } from "vitest";

import { safeStringify } from "./safeStringify";

describe("safeStringify", () => {
  it("should stringify simple objects", () => {
    const obj = { a: 1, b: "hello" };
    expect(safeStringify(obj)).toBe('{"a":1,"b":"hello"}');
  });

  it("should stringify arrays", () => {
    const arr = [1, 2, 3];
    expect(safeStringify(arr)).toBe("[1,2,3]");
  });

  it("should stringify primitive values", () => {
    expect(safeStringify("hello")).toBe('"hello"');
    expect(safeStringify(42)).toBe("42");
    expect(safeStringify(true)).toBe("true");
    expect(safeStringify(null)).toBe("null");
  });

  it("should handle Error objects by extracting stack or message", () => {
    const error = new Error("Test error");
    const result = safeStringify(error);
    expect(result).toContain("Test error");
    expect(typeof result).toBe("string");
  });

  it("should handle Error objects without stack", () => {
    const error = new Error("Test error");
    error.stack = undefined;
    const result = safeStringify(error);
    expect(result).toBe('"Test error"');
  });

  it("should handle circular references gracefully", () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj; // Create circular reference
    // Should not throw, returns the original object
    const result = safeStringify(obj);
    expect(result).toBe(obj);
  });

  it("should handle nested objects", () => {
    const obj = { a: { b: { c: 1 } } };
    expect(safeStringify(obj)).toBe('{"a":{"b":{"c":1}}}');
  });

  it("should handle empty objects and arrays", () => {
    expect(safeStringify({})).toBe("{}");
    expect(safeStringify([])).toBe("[]");
  });
});
