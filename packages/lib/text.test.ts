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
      const shortText = "Hello world";
      expect(truncateOnWord(shortText, 100)).toEqual("Hello world");
      expect(truncateOnWord(shortText, 20)).toEqual("Hello world");
    });

    it("should truncate text longer than max length", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to look nicer when displayed to users in the interface and this continues on and on with more words";
      const result = truncateOnWord(longText, 50);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(151);
    });

    it("should not cut words in the middle", () => {
      const text =
        "Hello wonderful world of programming and development that goes on and on with many words to ensure we have enough text to trigger truncation behavior and more";
      const result = truncateOnWord(text, 50);
      const withoutEllipsis = result.replace("...", "");
      expect(text.includes(withoutEllipsis)).toBe(true);
    });

    it("should add ellipsis by default when text is truncated", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to look nicer when displayed to users in the interface and more text here to make it long";
      const result = truncateOnWord(longText, 50);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should not add ellipsis when ellipsis parameter is false", () => {
      const longText =
        "This is a very long text that needs to be truncated at a word boundary to look nicer when displayed to users in the interface and more text here to make it long";
      const result = truncateOnWord(longText, 50, false);
      expect(result.endsWith("...")).toBe(false);
    });

    it("should handle text with no spaces by returning empty string with ellipsis", () => {
      const noSpaceText =
        "Thisisaverylongtextwithoutanyspacesthatgoesonandontotriggertruncationbehaviorandmakesurewehavemorethan148charactersandkeepgoingtomakeit200chars";
      const result = truncateOnWord(noSpaceText, 50);
      expect(result).toBe("...");
    });
  });
});
