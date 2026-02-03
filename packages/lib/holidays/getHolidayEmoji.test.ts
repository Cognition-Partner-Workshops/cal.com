import { describe, expect, it } from "vitest";

import { getHolidayEmoji, DEFAULT_HOLIDAY_EMOJI } from "./getHolidayEmoji";

describe("getHolidayEmoji", () => {
  describe("Christmas holidays", () => {
    it("should return Christmas tree emoji for Christmas", () => {
      expect(getHolidayEmoji("Christmas Day")).toBe("🎄");
      expect(getHolidayEmoji("Christmas Eve")).toBe("🎄");
      expect(getHolidayEmoji("Xmas")).toBe("🎄");
    });

    it("should handle different languages", () => {
      expect(getHolidayEmoji("Noël")).toBe("🎄");
      expect(getHolidayEmoji("Navidad")).toBe("🎄");
      expect(getHolidayEmoji("Weihnachten")).toBe("🎄");
    });
  });

  describe("New Year holidays", () => {
    it("should return fireworks emoji for New Year", () => {
      expect(getHolidayEmoji("New Year's Day")).toBe("🎆");
      expect(getHolidayEmoji("New Year")).toBe("🎆");
    });

    it("should return dragon emoji for Chinese New Year", () => {
      expect(getHolidayEmoji("Chinese New Year")).toBe("🐉");
      expect(getHolidayEmoji("Lunar New Year")).toBe("🐉");
      expect(getHolidayEmoji("Spring Festival")).toBe("🐉");
    });
  });

  describe("Easter holidays", () => {
    it("should return chick emoji for Easter", () => {
      expect(getHolidayEmoji("Easter Sunday")).toBe("🐣");
      expect(getHolidayEmoji("Easter Monday")).toBe("🐣");
    });

    it("should return cross emoji for Good Friday", () => {
      expect(getHolidayEmoji("Good Friday")).toBe("✝️");
    });
  });

  describe("US holidays", () => {
    it("should return turkey emoji for Thanksgiving", () => {
      expect(getHolidayEmoji("Thanksgiving Day")).toBe("🦃");
      expect(getHolidayEmoji("Thanksgiving")).toBe("🦃");
    });

    it("should return fireworks emoji for Independence Day", () => {
      expect(getHolidayEmoji("Independence Day")).toBe("🎆");
      expect(getHolidayEmoji("4th of July")).toBe("🎆");
      expect(getHolidayEmoji("Fourth of July")).toBe("🎆");
    });

    it("should return fist emoji for MLK Day", () => {
      expect(getHolidayEmoji("Martin Luther King Jr. Day")).toBe("✊");
    });

    it("should return fist emoji for Juneteenth", () => {
      expect(getHolidayEmoji("Juneteenth")).toBe("✊");
    });
  });

  describe("Religious holidays", () => {
    it("should return menorah emoji for Hanukkah", () => {
      expect(getHolidayEmoji("Hanukkah")).toBe("🕎");
      expect(getHolidayEmoji("Chanukah")).toBe("🕎");
    });

    it("should return crescent moon emoji for Eid", () => {
      expect(getHolidayEmoji("Eid al-Fitr")).toBe("🌙");
      expect(getHolidayEmoji("Ramadan")).toBe("🌙");
    });

    it("should return sheep emoji for Eid al-Adha", () => {
      expect(getHolidayEmoji("Eid al-Adha")).toBe("🐑");
    });

    it("should return lamp emoji for Diwali", () => {
      expect(getHolidayEmoji("Diwali")).toBe("🪔");
      expect(getHolidayEmoji("Deepavali")).toBe("🪔");
    });
  });

  describe("Valentine's Day", () => {
    it("should return hearts emoji for Valentine's Day", () => {
      expect(getHolidayEmoji("Valentine's Day")).toBe("💕");
      expect(getHolidayEmoji("San Valentín")).toBe("💕");
    });
  });

  describe("Halloween", () => {
    it("should return pumpkin emoji for Halloween", () => {
      expect(getHolidayEmoji("Halloween")).toBe("🎃");
    });

    it("should return pumpkin emoji for All Saints Day", () => {
      expect(getHolidayEmoji("All Saints' Day")).toBe("🎃");
    });
  });

  describe("Mother's and Father's Day", () => {
    it("should return flowers emoji for Mother's Day", () => {
      expect(getHolidayEmoji("Mother's Day")).toBe("💐");
    });

    it("should return tie emoji for Father's Day", () => {
      expect(getHolidayEmoji("Father's Day")).toBe("👔");
    });
  });

  describe("Labor Day", () => {
    it("should return worker emoji for Labor Day", () => {
      expect(getHolidayEmoji("Labor Day")).toBe("👷");
      expect(getHolidayEmoji("Labour Day")).toBe("👷");
      expect(getHolidayEmoji("May Day")).toBe("👷");
    });
  });

  describe("St. Patrick's Day", () => {
    it("should return shamrock emoji for St. Patrick's Day", () => {
      expect(getHolidayEmoji("St. Patrick's Day")).toBe("☘️");
      expect(getHolidayEmoji("Saint Patrick's Day")).toBe("☘️");
    });
  });

  describe("Memorial and Veterans Day", () => {
    it("should return medal emoji for Memorial Day", () => {
      expect(getHolidayEmoji("Memorial Day")).toBe("🎖️");
      expect(getHolidayEmoji("Veterans Day")).toBe("🎖️");
      expect(getHolidayEmoji("Remembrance Day")).toBe("🎖️");
    });
  });

  describe("Default emoji", () => {
    it("should return default calendar emoji for unknown holidays", () => {
      expect(getHolidayEmoji("Some Random Day")).toBe(DEFAULT_HOLIDAY_EMOJI);
      expect(getHolidayEmoji("Unknown Event")).toBe(DEFAULT_HOLIDAY_EMOJI);
      expect(getHolidayEmoji("")).toBe(DEFAULT_HOLIDAY_EMOJI);
    });
  });

  describe("Case insensitivity", () => {
    it("should match regardless of case", () => {
      expect(getHolidayEmoji("CHRISTMAS")).toBe("🎄");
      expect(getHolidayEmoji("christmas")).toBe("🎄");
      expect(getHolidayEmoji("ChRiStMaS")).toBe("🎄");
    });
  });
});
