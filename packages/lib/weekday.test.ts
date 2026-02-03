import { describe, expect, it } from "vitest";

import { nameOfDay, weekdayNames } from "./weekday";

describe("Weekday tests", () => {
  describe("fn: weekdayNames", () => {
    it("should return the weekday names for a given locale", () => {
      const locales = ["en-US", "en-CA", "en-GB", "en-AU"];

      for (const locale of locales) {
        const result = weekdayNames(locale);

        const expected = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        expect(result).toEqual(expected);
      }
    });

    it("should return the weekday names for a given locale and format", () => {
      const locales = ["en-US", "en-CA", "en-GB", "en-AU"];

      for (const locale of locales) {
        const result = weekdayNames(locale, 0, "short");

        const expected = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        expect(result).toEqual(expected);
      }
    });

    it("should return the weekday names for a given locale and week start offset", () => {
      const locales = ["en-US", "en-CA", "en-GB", "en-AU"];

      for (const locale of locales) {
        const result = weekdayNames(locale, 1);

        const expected = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        expect(result).toEqual(expected);
      }
    });
  });

  describe("fn: nameOfDay", () => {
    it("should return the name of the day for a given locale", () => {
      const locales = ["en-US", "en-CA", "en-GB", "en-AU"];
      const days = [
        { day: 0, expected: "Sunday" },
        { day: 1, expected: "Monday" },
        { day: 2, expected: "Tuesday" },
        { day: 3, expected: "Wednesday" },
        { day: 4, expected: "Thursday" },
        { day: 5, expected: "Friday" },
        { day: 6, expected: "Saturday" },
      ];

      for (const locale of locales) {
        for (const { day, expected } of days) {
          const result = nameOfDay(locale, day);

          expect(result).toEqual(expected);
        }
      }
    });

    it("should return short format day names", () => {
      expect(nameOfDay("en-US", 0, "short")).toEqual("Sun");
      expect(nameOfDay("en-US", 1, "short")).toEqual("Mon");
      expect(nameOfDay("en-US", 6, "short")).toEqual("Sat");
    });

    it("should handle undefined locale by using default", () => {
      const result = nameOfDay(undefined, 0);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle array of locales", () => {
      const result = nameOfDay(["en-US", "en-GB"], 0);
      expect(result).toEqual("Sunday");
    });

    it("should handle day values greater than 6 (wrapping behavior)", () => {
      const result = nameOfDay("en-US", 7);
      expect(typeof result).toBe("string");
    });

    it("should handle negative day values", () => {
      const result = nameOfDay("en-US", -1);
      expect(typeof result).toBe("string");
    });
  });

  describe("fn: weekdayNames - edge cases", () => {
    it("should handle week start of 6 (Saturday)", () => {
      const result = weekdayNames("en-US", 6);
      expect(result[0]).toEqual("Saturday");
      expect(result[1]).toEqual("Sunday");
    });

    it("should handle array of locales", () => {
      const result = weekdayNames(["en-US", "en-GB"]);
      expect(result).toEqual(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    });

    it("should return 7 days regardless of week start", () => {
      for (let weekStart = 0; weekStart <= 6; weekStart++) {
        const result = weekdayNames("en-US", weekStart);
        expect(result).toHaveLength(7);
      }
    });

    it("should handle negative week start", () => {
      const result = weekdayNames("en-US", -1);
      expect(result).toHaveLength(7);
    });

    it("should handle week start greater than 6", () => {
      const result = weekdayNames("en-US", 7);
      expect(result).toHaveLength(7);
    });
  });
});
