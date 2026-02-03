import { describe, expect, it } from "vitest";

import { safeStringify } from "./safeStringify";

describe("safeStringify", () => {
  it("should stringify simple objects", () => {
    const obj = { name: "test", value: 123 };
    const result = safeStringify(obj);
    expect(result).toBe('{"name":"test","value":123}');
  });

  it("should stringify arrays", () => {
    const arr = [1, 2, 3];
    const result = safeStringify(arr);
    expect(result).toBe("[1,2,3]");
  });

  it("should stringify primitive values", () => {
    expect(safeStringify("hello")).toBe('"hello"');
    expect(safeStringify(123)).toBe("123");
    expect(safeStringify(true)).toBe("true");
    expect(safeStringify(null)).toBe("null");
  });

  it("should handle Error objects by extracting stack or message", () => {
    const error = new Error("Test error message");
    const result = safeStringify(error);
    expect(typeof result).toBe("string");
    expect(result).toContain("Test error message");
  });

  it("should handle Error without stack", () => {
    const error = new Error("Test error");
    error.stack = undefined;
    const result = safeStringify(error);
    expect(result).toBe('"Test error"');
  });

  it("should handle circular references gracefully", () => {
    const obj: Record<string, unknown> = { name: "test" };
    obj.self = obj;
    const result = safeStringify(obj);
    expect(result).toBe(obj);
  });

  it("should stringify nested objects", () => {
    const obj = { outer: { inner: { deep: "value" } } };
    const result = safeStringify(obj);
    expect(result).toBe('{"outer":{"inner":{"deep":"value"}}}');
  });

  it("should stringify empty objects and arrays", () => {
    expect(safeStringify({})).toBe("{}");
    expect(safeStringify([])).toBe("[]");
  });
});
