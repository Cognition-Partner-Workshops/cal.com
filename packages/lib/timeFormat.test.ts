import { describe, expect, it } from "vitest";

import { TimeFormat, getTimeFormatStringFromUserTimeFormat } from "./timeFormat";

describe("timeFormat", () => {
  describe("TimeFormat enum", () => {
    it("should have correct values", () => {
      expect(TimeFormat.TWELVE_HOUR).toBe("h:mma");
      expect(TimeFormat.TWENTY_FOUR_HOUR).toBe("HH:mm");
    });
  });

  describe("getTimeFormatStringFromUserTimeFormat", () => {
    it("should return TWENTY_FOUR_HOUR format when timeFormat is 24", () => {
      expect(getTimeFormatStringFromUserTimeFormat(24)).toBe(TimeFormat.TWENTY_FOUR_HOUR);
    });

    it("should return TWELVE_HOUR format when timeFormat is 12", () => {
      expect(getTimeFormatStringFromUserTimeFormat(12)).toBe(TimeFormat.TWELVE_HOUR);
    });

    it("should return TWELVE_HOUR format when timeFormat is null", () => {
      expect(getTimeFormatStringFromUserTimeFormat(null)).toBe(TimeFormat.TWELVE_HOUR);
    });

    it("should return TWELVE_HOUR format when timeFormat is undefined", () => {
      expect(getTimeFormatStringFromUserTimeFormat(undefined)).toBe(TimeFormat.TWELVE_HOUR);
    });

    it("should return TWELVE_HOUR format for any other number", () => {
      expect(getTimeFormatStringFromUserTimeFormat(0)).toBe(TimeFormat.TWELVE_HOUR);
      expect(getTimeFormatStringFromUserTimeFormat(1)).toBe(TimeFormat.TWELVE_HOUR);
    });
  });
});
