import { describe, expect, it, vi } from "vitest";

import { validJson } from "./jsonUtils";

describe("validJson", () => {
  it("should return parsed object for valid JSON object", () => {
    const result = validJson('{"name": "test", "value": 123}');
    expect(result).toEqual({ name: "test", value: 123 });
  });

  it("should return parsed array for valid JSON array", () => {
    const result = validJson('[1, 2, 3]');
    expect(result).toEqual([1, 2, 3]);
  });

  it("should return false for invalid JSON", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = validJson("not valid json");
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should return false for primitive JSON values", () => {
    expect(validJson('"string"')).toBe(false);
    expect(validJson("123")).toBe(false);
    expect(validJson("true")).toBe(false);
    expect(validJson("null")).toBe(false);
  });

  it("should handle nested objects", () => {
    const result = validJson('{"outer": {"inner": "value"}}');
    expect(result).toEqual({ outer: { inner: "value" } });
  });

  it("should handle empty object", () => {
    const result = validJson("{}");
    expect(result).toEqual({});
  });

  it("should handle empty array", () => {
    const result = validJson("[]");
    expect(result).toEqual([]);
  });

  it("should return false for empty string", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = validJson("");
    expect(result).toBe(false);
    consoleSpy.mockRestore();
  });
});
