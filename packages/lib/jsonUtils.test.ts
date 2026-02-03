import { describe, expect, it, vi } from "vitest";

import { validJson } from "./jsonUtils";

describe("validJson", () => {
  it("returns parsed object for valid JSON object", () => {
    const result = validJson('{"name": "test", "value": 123}');
    expect(result).toEqual({ name: "test", value: 123 });
  });

  it("returns parsed array for valid JSON array", () => {
    const result = validJson("[1, 2, 3]");
    expect(result).toEqual([1, 2, 3]);
  });

  it("returns false for invalid JSON", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = validJson("not valid json");
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("Invalid JSON:", expect.any(SyntaxError));
    consoleSpy.mockRestore();
  });

  it("returns false for JSON primitive string", () => {
    const result = validJson('"just a string"');
    expect(result).toBe(false);
  });

  it("returns false for JSON primitive number", () => {
    const result = validJson("42");
    expect(result).toBe(false);
  });

  it("returns false for JSON primitive boolean", () => {
    const result = validJson("true");
    expect(result).toBe(false);
  });

  it("returns false for JSON null", () => {
    const result = validJson("null");
    expect(result).toBe(false);
  });

  it("returns parsed object for nested JSON", () => {
    const result = validJson('{"outer": {"inner": "value"}}');
    expect(result).toEqual({ outer: { inner: "value" } });
  });

  it("returns false for empty string", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = validJson("");
    expect(result).toBe(false);
    consoleSpy.mockRestore();
  });
});
