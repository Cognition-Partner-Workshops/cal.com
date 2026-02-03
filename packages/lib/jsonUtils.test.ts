import { describe, expect, it, vi } from "vitest";

import { validJson } from "./jsonUtils";

describe("validJson", () => {
  describe("valid JSON strings", () => {
    it("should return parsed object for valid JSON object", () => {
      const jsonString = '{"name": "John", "age": 30}';
      const result = validJson(jsonString);
      expect(result).toEqual({ name: "John", age: 30 });
    });

    it("should return parsed array for valid JSON array", () => {
      const jsonString = "[1, 2, 3]";
      const result = validJson(jsonString);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should return parsed object for nested JSON", () => {
      const jsonString = '{"user": {"name": "John", "roles": ["admin", "user"]}}';
      const result = validJson(jsonString);
      expect(result).toEqual({ user: { name: "John", roles: ["admin", "user"] } });
    });

    it("should return empty object for empty JSON object", () => {
      const jsonString = "{}";
      const result = validJson(jsonString);
      expect(result).toEqual({});
    });

    it("should return empty array for empty JSON array", () => {
      const jsonString = "[]";
      const result = validJson(jsonString);
      expect(result).toEqual([]);
    });
  });

  describe("invalid JSON strings", () => {
    it("should return false for invalid JSON syntax", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const jsonString = "{invalid json}";
      const result = validJson(jsonString);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it("should return false for plain string (not JSON)", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const jsonString = "hello world";
      const result = validJson(jsonString);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it("should return false for JSON primitive number", () => {
      const jsonString = "42";
      const result = validJson(jsonString);
      expect(result).toBe(false);
    });

    it("should return false for JSON primitive string", () => {
      const jsonString = '"hello"';
      const result = validJson(jsonString);
      expect(result).toBe(false);
    });

    it("should return false for JSON primitive boolean", () => {
      const jsonString = "true";
      const result = validJson(jsonString);
      expect(result).toBe(false);
    });

    it("should return false for JSON null", () => {
      const jsonString = "null";
      const result = validJson(jsonString);
      expect(result).toBe(false);
    });

    it("should return false for empty string", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const jsonString = "";
      const result = validJson(jsonString);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it("should return false for malformed JSON with trailing comma", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const jsonString = '{"a": 1,}';
      const result = validJson(jsonString);
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
