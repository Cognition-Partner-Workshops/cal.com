import { describe, expect, it } from "vitest";

import { objectsToCsv, sanitizeValue } from "./csvUtils";

describe("csvUtils", () => {
  describe("sanitizeValue", () => {
    it("should return plain values unchanged", () => {
      expect(sanitizeValue("hello")).toBe("hello");
      expect(sanitizeValue("123")).toBe("123");
    });

    it("should wrap values with commas in quotes", () => {
      expect(sanitizeValue("hello,world")).toBe('"hello,world"');
    });

    it("should wrap values with newlines in quotes", () => {
      expect(sanitizeValue("hello\nworld")).toBe('"hello\nworld"');
    });

    it("should double-escape quotes and wrap in quotes", () => {
      expect(sanitizeValue('say "hello"')).toBe('"say ""hello"""');
    });

    it("should handle empty string", () => {
      expect(sanitizeValue("")).toBe("");
    });
  });

  describe("objectsToCsv", () => {
    it("should convert array of objects to CSV string", () => {
      const data = [
        { name: "John", age: "30", city: "NYC" },
        { name: "Jane", age: "25", city: "LA" },
      ];
      const result = objectsToCsv(data);
      expect(result).toBe("name,age,city\nJohn,30,NYC\nJane,25,LA");
    });

    it("should return empty string for empty array", () => {
      expect(objectsToCsv([])).toBe("");
    });

    it("should handle values with special characters", () => {
      const data = [{ name: 'John "Jr"', note: "hello,world" }];
      const result = objectsToCsv(data);
      expect(result).toContain('"John ""Jr"""');
      expect(result).toContain('"hello,world"');
    });

    it("should handle single row", () => {
      const data = [{ id: "1", status: "active" }];
      const result = objectsToCsv(data);
      expect(result).toBe("id,status\n1,active");
    });

    it("should handle undefined values", () => {
      const data = [{ name: "John", value: undefined }] as Record<string, unknown>[];
      const result = objectsToCsv(data);
      expect(result).toContain("name,value");
      expect(result).toContain("John,");
    });
  });
});
