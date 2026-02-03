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
          input: "Short text",
          maxLength: 50,
          expected: "Short text",
        },
      ];

      for (const { input, maxLength, expected } of cases) {
        const result = truncateOnWord(input, maxLength);
        expect(result).toEqual(expected);
      }
    });

    it("should truncate on word boundary with ellipsis", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to make it look nicer when displayed to users in the interface and this text is definitely longer than the maximum length allowed";
      const result = truncateOnWord(longText, 150);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(151); // 148 + "..."
    });

    it("should truncate without ellipsis when ellipsis is false", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to make it look nicer when displayed to users in the interface";
      const result = truncateOnWord(longText, 150, false);
      expect(result.endsWith("...")).toBe(false);
    });

    it("should handle text with no spaces", () => {
      const noSpaceText = "a".repeat(200);
      const result = truncateOnWord(noSpaceText, 150);
      // When there's no space, lastIndexOf returns -1, so substring(0, -1) returns empty string
      expect(result).toBe("...");
    });
  });
});
