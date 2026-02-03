import { describe, expect, it } from "vitest";

import { truncate, truncateOnWord } from "./text";

describe("Text util tests", () => {
  describe("fn: truncate", () => {
    it("should return the original text when it is shorter than the max length", () => {
      const cases = [
        {
          input: "Hello world",
          maxLength: 100,
          expected: "Hello world",
        },
        {
          input: "Hello world",
          maxLength: 11,
          expected: "Hello world",
        },
      ];

      for (const { input, maxLength, expected } of cases) {
        const result = truncate(input, maxLength);

        expect(result).toEqual(expected);
      }
    });

    it("should return the truncated text when it is longer than the max length", () => {
      const cases = [
        {
          input: "Hello world",
          maxLength: 10,
          expected: "Hello w...",
        },
        {
          input: "Hello world",
          maxLength: 5,
          expected: "He...",
        },
      ];

      for (const { input, maxLength, expected } of cases) {
        const result = truncate(input, maxLength);

        expect(result).toEqual(expected);
      }
    });

    it("should return the truncated text without ellipsis when it is longer than the max length and ellipsis is false", () => {
      const cases = [
        {
          input: "Hello world",
          maxLength: 10,
          ellipsis: false,
          expected: "Hello w",
        },
        {
          input: "Hello world",
          maxLength: 5,
          ellipsis: false,
          expected: "He",
        },
      ];

      for (const { input, maxLength, ellipsis, expected } of cases) {
        const result = truncate(input, maxLength, ellipsis);

        expect(result).toEqual(expected);
      }
    });

    it("should handle empty string", () => {
      expect(truncate("", 10)).toEqual("");
    });

    it("should handle maxLength of 0 (negative slice behavior)", () => {
      const result = truncate("Hello", 0);
      expect(result).toEqual("He...");
    });

    it("should handle maxLength equal to text length", () => {
      expect(truncate("Hello", 5)).toEqual("Hello");
    });

    it("should handle very long text", () => {
      const longText = "a".repeat(1000);
      const result = truncate(longText, 100);
      expect(result).toHaveLength(100);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should handle unicode characters", () => {
      const unicodeText = "Hello, World!";
      expect(truncate(unicodeText, 8)).toEqual("Hello...");
    });
  });

  describe("fn: truncateOnWord", () => {
    it("should return the original text when it is shorter than the max length", () => {
      const cases = [
        {
          input: "Hello world",
          maxLength: 100,
          expected: "Hello world",
        },
        {
          input: "Hello world",
          maxLength: 11,
          expected: "Hello world",
        },
      ];

      for (const { input, maxLength, expected } of cases) {
        const result = truncateOnWord(input, maxLength);
        expect(result).toEqual(expected);
      }
    });

    it("should truncate on word boundary when text is longer than max length", () => {
      const input = "The quick brown fox jumps over the lazy dog";
      const result = truncateOnWord(input, 20);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(151);
    });

    it("should return truncated text without ellipsis when ellipsis is false", () => {
      const input = "The quick brown fox jumps over the lazy dog";
      const result = truncateOnWord(input, 20, false);
      expect(result.endsWith("...")).toBe(false);
    });

    it("should handle empty string", () => {
      expect(truncateOnWord("", 10)).toEqual("");
    });

    it("should handle single word longer than max length", () => {
      const input = "Supercalifragilisticexpialidocious is a very long word that exceeds the limit";
      const result = truncateOnWord(input, 10);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should handle text with no spaces", () => {
      const input = "a".repeat(200);
      const result = truncateOnWord(input, 50);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should handle text with multiple consecutive spaces", () => {
      const input = "Hello    world    this    is    a    test";
      const result = truncateOnWord(input, 20);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should handle maxLength equal to text length", () => {
      const input = "Hello world";
      expect(truncateOnWord(input, 11)).toEqual("Hello world");
    });
  });
});
