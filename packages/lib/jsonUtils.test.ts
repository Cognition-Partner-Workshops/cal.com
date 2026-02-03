import { describe, expect, it, vi } from "vitest";

import { validJson } from "./jsonUtils";

describe("validJson", () => {
  it("should return parsed object for valid JSON object", () => {
    const result = validJson('{"a": 1, "b": "hello"}');
    expect(result).toEqual({ a: 1, b: "hello" });
  });

  it("should return parsed array for valid JSON array", () => {
    const result = validJson("[1, 2, 3]");
    expect(result).toEqual([1, 2, 3]);
  });

  it("should return false for invalid JSON", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = validJson("not valid json");
    expect(result).toBe(false);
    consoleSpy.mockRestore();
  });

  it("should return false for primitive JSON values (string)", () => {
    const result = validJson('"hello"');
    expect(result).toBe(false);
  });

  it("should return false for primitive JSON values (number)", () => {
    const result = validJson("42");
    expect(result).toBe(false);
  });

  it("should return false for primitive JSON values (boolean)", () => {
    const result = validJson("true");
    expect(result).toBe(false);
  });

  it("should return false for null JSON", () => {
    const result = validJson("null");
    expect(result).toBe(false);
  });

  it("should handle nested objects", () => {
    const result = validJson('{"a": {"b": {"c": 1}}}');
    expect(result).toEqual({ a: { b: { c: 1 } } });
  });

  it("should handle empty object", () => {
    const result = validJson("{}");
    expect(result).toEqual({});
  });

  it("should handle empty array", () => {
    const result = validJson("[]");
    expect(result).toEqual([]);
  });
});
