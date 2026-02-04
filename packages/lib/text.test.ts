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

    it("should truncate on word boundary with ellipsis by default", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to look nicer in the UI when displayed to users. Adding more content here to make sure the text exceeds the maximum length threshold that triggers truncation behavior in the function.";
      const result = truncateOnWord(longText, 200);

      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(151);
    });

    it("should truncate without ellipsis when ellipsis is false", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to look nicer in the UI when displayed to users";
      const result = truncateOnWord(longText, 200, false);

      expect(result.endsWith("...")).toBe(false);
    });

    it("should not cut words in the middle", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to look nicer in the UI when displayed to users";
      const result = truncateOnWord(longText, 200);

      const resultWithoutEllipsis = result.replace("...", "");
      expect(resultWithoutEllipsis.endsWith(" ")).toBe(false);
      expect(resultWithoutEllipsis.match(/\w$/)).toBeTruthy();
    });

    it("should handle text with no spaces", () => {
      const noSpaceText = "ThisIsAVeryLongWordWithNoSpacesAtAllThatShouldBeTruncatedSomehow";
      const result = truncateOnWord(noSpaceText, 30);

      expect(result).toBeDefined();
    });

    it("should handle empty string", () => {
      const result = truncateOnWord("", 100);

      expect(result).toEqual("");
    });
  });
});
