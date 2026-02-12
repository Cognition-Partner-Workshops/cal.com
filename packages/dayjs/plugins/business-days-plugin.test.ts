import dayjs from "dayjs";
import { describe, it, expect, beforeEach } from "vitest";

import BusinessDaysPlugin from "./business-days-plugin";

dayjs.extend(BusinessDaysPlugin);

describe("BusinessDaysPlugin", () => {
  beforeEach(() => {
    dayjs.setWorkingWeekdays([1, 2, 3, 4, 5]);
    dayjs.setHolidays([]);
    dayjs.setHolidayFormat("YYYY-MM-DD");
    dayjs.setAdditionalWorkingDays([]);
    dayjs.setAdditionalWorkingDayFormat("YYYY-MM-DD");
  });

  describe("getWorkingWeekdays / setWorkingWeekdays", () => {
    it("returns default working weekdays", () => {
      expect(dayjs.getWorkingWeekdays()).toEqual([1, 2, 3, 4, 5]);
    });

    it("allows setting custom working weekdays", () => {
      dayjs.setWorkingWeekdays([1, 2, 3]);
      expect(dayjs.getWorkingWeekdays()).toEqual([1, 2, 3]);
    });
  });

  describe("getHolidays / setHolidays", () => {
    it("returns empty holidays by default", () => {
      expect(dayjs.getHolidays()).toEqual([]);
    });

    it("allows setting holidays", () => {
      dayjs.setHolidays(["2024-12-25"]);
      expect(dayjs.getHolidays()).toEqual(["2024-12-25"]);
    });
  });

  describe("getHolidayFormat / setHolidayFormat", () => {
    it("returns holiday format", () => {
      expect(dayjs.getHolidayFormat()).toBe("YYYY-MM-DD");
    });

    it("allows setting holiday format", () => {
      dayjs.setHolidayFormat("MM-DD");
      expect(dayjs.getHolidayFormat()).toBe("MM-DD");
    });
  });

  describe("getAdditionalWorkingDays / setAdditionalWorkingDays", () => {
    it("returns empty additional working days by default", () => {
      expect(dayjs.getAdditionalWorkingDays()).toEqual([]);
    });

    it("allows setting additional working days", () => {
      dayjs.setAdditionalWorkingDays(["2024-12-28"]);
      expect(dayjs.getAdditionalWorkingDays()).toEqual(["2024-12-28"]);
    });
  });

  describe("getAdditionalWorkingDayFormat / setAdditionalWorkingDayFormat", () => {
    it("returns additional working day format", () => {
      expect(dayjs.getAdditionalWorkingDayFormat()).toBe("YYYY-MM-DD");
    });

    it("allows setting additional working day format", () => {
      dayjs.setAdditionalWorkingDayFormat("MM-DD");
      expect(dayjs.getAdditionalWorkingDayFormat()).toBe("MM-DD");
    });
  });

  describe("isHoliday", () => {
    it("returns false when no holidays are set", () => {
      dayjs.setHolidays([]);
      expect(dayjs("2024-12-25").isHoliday()).toBe(false);
    });

    it("returns true for a holiday date", () => {
      dayjs.setHolidays(["2024-12-25"]);
      dayjs.setHolidayFormat("YYYY-MM-DD");
      expect(dayjs("2024-12-25").isHoliday()).toBe(true);
    });

    it("returns false for a non-holiday date", () => {
      dayjs.setHolidays(["2024-12-25"]);
      dayjs.setHolidayFormat("YYYY-MM-DD");
      expect(dayjs("2024-12-26").isHoliday()).toBe(false);
    });
  });

  describe("isAdditionalWorkingDay", () => {
    it("returns false when no additional working days are set", () => {
      expect(dayjs("2024-12-28").isAdditionalWorkingDay()).toBe(false);
    });

    it("returns true for an additional working day", () => {
      dayjs.setAdditionalWorkingDays(["2024-12-28"]);
      dayjs.setAdditionalWorkingDayFormat("YYYY-MM-DD");
      expect(dayjs("2024-12-28").isAdditionalWorkingDay()).toBe(true);
    });

    it("returns false for a non-additional working day", () => {
      dayjs.setAdditionalWorkingDays(["2024-12-28"]);
      dayjs.setAdditionalWorkingDayFormat("YYYY-MM-DD");
      expect(dayjs("2024-12-29").isAdditionalWorkingDay()).toBe(false);
    });
  });

  describe("isBusinessDay", () => {
    it("returns true for a weekday (Mon-Fri)", () => {
      expect(dayjs("2024-12-09").isBusinessDay()).toBe(true);
    });

    it("returns false for a weekend (Saturday)", () => {
      expect(dayjs("2024-12-07").isBusinessDay()).toBe(false);
    });

    it("returns false for a weekend (Sunday)", () => {
      expect(dayjs("2024-12-08").isBusinessDay()).toBe(false);
    });

    it("returns false for a holiday even if it's a weekday", () => {
      dayjs.setHolidays(["2024-12-25"]);
      dayjs.setHolidayFormat("YYYY-MM-DD");
      expect(dayjs("2024-12-25").isBusinessDay()).toBe(false);
    });

    it("returns true for an additional working day even if it's a weekend", () => {
      dayjs.setAdditionalWorkingDays(["2024-12-07"]);
      dayjs.setAdditionalWorkingDayFormat("YYYY-MM-DD");
      expect(dayjs("2024-12-07").isBusinessDay()).toBe(true);
    });
  });

  describe("businessDaysAdd", () => {
    it("adds business days skipping weekends", () => {
      const friday = dayjs("2024-12-06");
      const result = friday.businessDaysAdd(1);
      expect(result.format("YYYY-MM-DD")).toBe("2024-12-09");
    });

    it("adds multiple business days", () => {
      const monday = dayjs("2024-12-09");
      const result = monday.businessDaysAdd(5);
      expect(result.format("YYYY-MM-DD")).toBe("2024-12-16");
    });

    it("handles negative days (going backwards)", () => {
      const monday = dayjs("2024-12-09");
      const result = monday.businessDaysAdd(-1);
      expect(result.format("YYYY-MM-DD")).toBe("2024-12-06");
    });

    it("skips holidays", () => {
      dayjs.setHolidays(["2024-12-09"]);
      dayjs.setHolidayFormat("YYYY-MM-DD");
      const friday = dayjs("2024-12-06");
      const result = friday.businessDaysAdd(1);
      expect(result.format("YYYY-MM-DD")).toBe("2024-12-10");
    });
  });

  describe("businessDaysSubtract", () => {
    it("subtracts business days", () => {
      const monday = dayjs("2024-12-09");
      const result = monday.businessDaysSubtract(1);
      expect(result.format("YYYY-MM-DD")).toBe("2024-12-06");
    });

    it("subtracts multiple business days", () => {
      const friday = dayjs("2024-12-13");
      const result = friday.businessDaysSubtract(5);
      expect(result.format("YYYY-MM-DD")).toBe("2024-12-06");
    });
  });

  describe("businessDiff", () => {
    it("returns 0 for the same day", () => {
      const day = dayjs("2024-12-09");
      expect(day.businessDiff(day)).toBe(0);
    });

    it("returns positive diff for later date", () => {
      const monday = dayjs("2024-12-09");
      const friday = dayjs("2024-12-13");
      expect(friday.businessDiff(monday)).toBe(4);
    });

    it("returns negative diff for earlier date", () => {
      const monday = dayjs("2024-12-09");
      const friday = dayjs("2024-12-13");
      expect(monday.businessDiff(friday)).toBe(-4);
    });

    it("excludes weekends", () => {
      const friday = dayjs("2024-12-06");
      const nextMonday = dayjs("2024-12-09");
      expect(nextMonday.businessDiff(friday)).toBe(1);
    });
  });

  describe("nextBusinessDay", () => {
    it("returns the next business day from a weekday", () => {
      const thursday = dayjs("2024-12-05");
      expect(thursday.nextBusinessDay().format("YYYY-MM-DD")).toBe("2024-12-06");
    });

    it("skips weekends", () => {
      const friday = dayjs("2024-12-06");
      expect(friday.nextBusinessDay().format("YYYY-MM-DD")).toBe("2024-12-09");
    });
  });

  describe("prevBusinessDay", () => {
    it("returns the previous business day from a weekday", () => {
      const tuesday = dayjs("2024-12-10");
      expect(tuesday.prevBusinessDay().format("YYYY-MM-DD")).toBe("2024-12-09");
    });

    it("skips weekends", () => {
      const monday = dayjs("2024-12-09");
      expect(monday.prevBusinessDay().format("YYYY-MM-DD")).toBe("2024-12-06");
    });
  });

  describe("businessDaysInMonth", () => {
    it("returns business days for a month", () => {
      const dec2024 = dayjs("2024-12-01");
      const businessDays = dec2024.businessDaysInMonth();
      expect(businessDays.length).toBe(22);
      expect(businessDays[0].format("YYYY-MM-DD")).toBe("2024-12-02");
    });

    it("returns empty array for invalid date", () => {
      const invalid = dayjs("invalid");
      expect(invalid.businessDaysInMonth()).toEqual([]);
    });
  });

  describe("lastBusinessDayOfMonth", () => {
    it("returns the last business day of the month", () => {
      const dec2024 = dayjs("2024-12-01");
      const lastBDay = dec2024.lastBusinessDayOfMonth();
      expect(lastBDay.format("YYYY-MM-DD")).toBe("2024-12-31");
    });
  });

  describe("businessWeeksInMonth", () => {
    it("returns business weeks for a month", () => {
      const dec2024 = dayjs("2024-12-01");
      const weeks = dec2024.businessWeeksInMonth();
      expect(weeks.length).toBeGreaterThan(0);
      weeks.forEach((week) => {
        week.forEach((day) => {
          expect(day.isBusinessDay()).toBe(true);
        });
      });
    });

    it("returns empty array for invalid date", () => {
      const invalid = dayjs("invalid");
      expect(invalid.businessWeeksInMonth()).toEqual([]);
    });
  });
});
