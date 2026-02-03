import { describe, expect, it } from "vitest";

import { formatPhoneNumber } from "./formatPhoneNumber";

describe("formatPhoneNumber", () => {
  describe("valid phone numbers", () => {
    it("should format US phone numbers", () => {
      expect(formatPhoneNumber("+14155551234")).toBe("+1 415 555 1234");
    });

    it("should format UK phone numbers", () => {
      expect(formatPhoneNumber("+442071234567")).toBe("+44 20 7123 4567");
    });

    it("should format German phone numbers", () => {
      expect(formatPhoneNumber("+4930123456")).toBe("+49 30 123456");
    });

    it("should format French phone numbers", () => {
      expect(formatPhoneNumber("+33123456789")).toBe("+33 1 23 45 67 89");
    });

    it("should format Australian phone numbers", () => {
      expect(formatPhoneNumber("+61212345678")).toBe("+61 2 1234 5678");
    });

    it("should handle phone numbers with country code", () => {
      expect(formatPhoneNumber("+12025551234")).toBe("+1 202 555 1234");
    });
  });

  describe("invalid phone numbers", () => {
    it("should throw ParseError for invalid phone numbers", () => {
      expect(() => formatPhoneNumber("invalid")).toThrow();
      expect(() => formatPhoneNumber("123")).toThrow();
      expect(() => formatPhoneNumber("abc123")).toThrow();
    });

    it("should throw ParseError for empty string", () => {
      expect(() => formatPhoneNumber("")).toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle phone numbers with spaces", () => {
      const result = formatPhoneNumber("+1 415 555 1234");
      expect(result).toBe("+1 415 555 1234");
    });

    it("should handle phone numbers with dashes", () => {
      const result = formatPhoneNumber("+1-415-555-1234");
      expect(result).toBe("+1 415 555 1234");
    });

    it("should handle phone numbers with parentheses", () => {
      const result = formatPhoneNumber("+1 (415) 555-1234");
      expect(result).toBe("+1 415 555 1234");
    });
  });
});
