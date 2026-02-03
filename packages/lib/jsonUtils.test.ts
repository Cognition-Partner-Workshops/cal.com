import { describe, expect, it, vi } from "vitest";

import { validJson } from "./jsonUtils";

describe("validJson", () => {
  describe("valid JSON strings", () => {
    it("should parse valid JSON object", () => {
      const result = validJson('{"a": 1, "b": 2}');
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("should parse valid JSON array", () => {
      const result = validJson("[1, 2, 3]");
      expect(result).toEqual([1, 2, 3]);
    });

    it("should parse empty JSON object", () => {
      const result = validJson("{}");
      expect(result).toEqual({});
    });

    it("should parse empty JSON array", () => {
      const result = validJson("[]");
      expect(result).toEqual([]);
    });

    it("should parse nested JSON", () => {
      const result = validJson('{"nested": {"a": 1}, "arr": [1, 2]}');
      expect(result).toEqual({ nested: { a: 1 }, arr: [1, 2] });
    });
  });

  describe("invalid JSON strings", () => {
    it("should return false for invalid JSON", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const result = validJson("not valid json");
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it("should return false for malformed JSON", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const result = validJson('{"a": 1,}');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it("should return false for empty string", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const result = validJson("");
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe("non-object JSON values", () => {
    it("should return false for JSON string primitive", () => {
      const result = validJson('"hello"');
      expect(result).toBe(false);
    });

    it("should return false for JSON number primitive", () => {
      const result = validJson("42");
      expect(result).toBe(false);
    });

    it("should return false for JSON boolean primitive", () => {
      const result = validJson("true");
      expect(result).toBe(false);
    });

    it("should return false for JSON null", () => {
      const result = validJson("null");
      expect(result).toBe(false);
    });
  });
});
