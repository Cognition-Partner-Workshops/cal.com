import { describe, expect, it } from "vitest";

import { safeStringify } from "./safeStringify";

describe("safeStringify", () => {
  it("should stringify a simple object", () => {
    const obj = { name: "test", value: 123 };
    expect(safeStringify(obj)).toBe('{"name":"test","value":123}');
  });

  it("should stringify an array", () => {
    const arr = [1, 2, 3];
    expect(safeStringify(arr)).toBe("[1,2,3]");
  });

  it("should stringify a string", () => {
    expect(safeStringify("hello")).toBe('"hello"');
  });

  it("should stringify a number", () => {
    expect(safeStringify(42)).toBe("42");
  });

  it("should stringify null", () => {
    expect(safeStringify(null)).toBe("null");
  });

  it("should stringify undefined as undefined (not a valid JSON)", () => {
    expect(safeStringify(undefined)).toBeUndefined();
  });

  it("should stringify a boolean", () => {
    expect(safeStringify(true)).toBe("true");
    expect(safeStringify(false)).toBe("false");
  });

  it("should handle Error objects by extracting stack trace", () => {
    const error = new Error("Test error");
    const result = safeStringify(error);
    expect(typeof result).toBe("string");
    expect(result).toContain("Test error");
  });

  it("should handle Error objects without stack trace", () => {
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
    const obj = { outer: { inner: { value: "deep" } } };
    expect(safeStringify(obj)).toBe('{"outer":{"inner":{"value":"deep"}}}');
  });

  it("should stringify objects with arrays", () => {
    const obj = { items: [1, 2, 3], name: "list" };
    expect(safeStringify(obj)).toBe('{"items":[1,2,3],"name":"list"}');
  });
});
