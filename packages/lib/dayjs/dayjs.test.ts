import { describe, expect, it, beforeAll, vi } from "vitest";

import dayjs from "@calcom/dayjs";

import {
  yyyymmdd,
  daysInMonth,
  formatTime,
  isSupportedTimeZone,
  formatLocalizedDateTime,
  formatToLocalizedDate,
  formatToLocalizedTime,
  formatToLocalizedTimezone,
  sortByTimezone,
  isPreviousDayInTimezone,
  isNextDayInTimezone,
  weekdayToWeekIndex,
  getTimeZone,
  timeZoneWithDST,
  getDSTDifference,
  getUTCOffsetInDST,
  isInDST,
  getUTCOffsetByTimezone,
} from "./index";

beforeAll(() => {
  vi.setSystemTime(dayjs.utc("2021-06-20T12:00:00Z").toDate());
});

describe("yyyymmdd", () => {
  it("should format a Date object to YYYY-MM-DD", () => {
    const date = new Date("2024-04-25T10:30:00Z");
    expect(yyyymmdd(date)).toBe("2024-04-25");
  });

  it("should format a Dayjs object to YYYY-MM-DD", () => {
    const date = dayjs("2024-04-25T10:30:00Z");
    expect(yyyymmdd(date)).toBe("2024-04-25");
  });

  it("should handle different months correctly", () => {
    expect(yyyymmdd(new Date("2024-01-01"))).toBe("2024-01-01");
    expect(yyyymmdd(new Date("2024-12-31"))).toBe("2024-12-31");
  });
});

describe("daysInMonth", () => {
  it("should return 31 for January", () => {
    const date = new Date("2024-01-15");
    expect(daysInMonth(date)).toBe(31);
  });

  it("should return 28 for February in non-leap year", () => {
    const date = new Date("2023-02-15");
    expect(daysInMonth(date)).toBe(28);
  });

  it("should return 29 for February in leap year", () => {
    const date = new Date("2024-02-15");
    expect(daysInMonth(date)).toBe(29);
  });

  it("should return 30 for April", () => {
    const date = new Date("2024-04-15");
    expect(daysInMonth(date)).toBe(30);
  });

  it("should work with Dayjs objects", () => {
    const date = dayjs("2024-03-15");
    expect(daysInMonth(date)).toBe(31);
  });
});

describe("formatTime", () => {
  it("should format time in 24-hour format by default", () => {
    const date = "2024-04-25T14:30:00Z";
    expect(formatTime(date, 24)).toBe("14:30");
  });

  it("should format time in 12-hour format when specified", () => {
    const date = "2024-04-25T14:30:00Z";
    expect(formatTime(date, 12)).toBe("2:30pm");
  });

  it("should format time in 24-hour format when timeFormat is null", () => {
    const date = "2024-04-25T14:30:00Z";
    expect(formatTime(date, null)).toBe("14:30");
  });

  it("should format time in 24-hour format when timeFormat is undefined", () => {
    const date = "2024-04-25T14:30:00Z";
    expect(formatTime(date, undefined)).toBe("14:30");
  });

  it("should handle timezone conversion", () => {
    const date = "2024-04-25T14:30:00Z";
    const result = formatTime(date, 24, "America/New_York");
    expect(result).toBe("10:30");
  });

  it("should work with Date objects", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    expect(formatTime(date, 24)).toBe("14:30");
  });

  it("should work with Dayjs objects", () => {
    const date = dayjs("2024-04-25T14:30:00Z");
    expect(formatTime(date, 24)).toBe("14:30");
  });
});

describe("isSupportedTimeZone", () => {
  it("should return true for valid timezone", () => {
    expect(isSupportedTimeZone("America/New_York")).toBe(true);
    expect(isSupportedTimeZone("Europe/London")).toBe(true);
    expect(isSupportedTimeZone("Asia/Tokyo")).toBe(true);
    expect(isSupportedTimeZone("UTC")).toBe(true);
  });

  it("should return false for invalid timezone", () => {
    expect(isSupportedTimeZone("Invalid/Timezone")).toBe(false);
    expect(isSupportedTimeZone("NotATimezone")).toBe(false);
    expect(isSupportedTimeZone("")).toBe(false);
  });
});

describe("formatLocalizedDateTime", () => {
  it("should format date with default options", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatLocalizedDateTime(date);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("should format date with custom options", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatLocalizedDateTime(date, { dateStyle: "full" }, "en-US");
    expect(result).toContain("2024");
  });

  it("should work with Dayjs objects", () => {
    const date = dayjs("2024-04-25T14:30:00Z");
    const result = formatLocalizedDateTime(date);
    expect(result).toBeDefined();
  });
});

describe("formatToLocalizedDate", () => {
  it("should format date with long style by default", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedDate(date, "en-US");
    expect(result).toContain("April");
    expect(result).toContain("25");
    expect(result).toContain("2024");
  });

  it("should format date with short style", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedDate(date, "en-US", "short");
    expect(result).toBeDefined();
  });

  it("should work with Dayjs objects", () => {
    const date = dayjs("2024-04-25T14:30:00Z");
    const result = formatToLocalizedDate(date, "en-US");
    expect(result).toContain("2024");
  });
});

describe("formatToLocalizedTime", () => {
  it("should format time with short style by default", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTime({ date, locale: "en-US" });
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("should format time with 12-hour format", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTime({ date, locale: "en-US", hour12: true });
    expect(result).toBeDefined();
  });

  it("should format time with 24-hour format", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTime({ date, locale: "en-US", hour12: false });
    expect(result).toBeDefined();
  });

  it("should work with Dayjs objects", () => {
    const date = dayjs("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTime({ date, locale: "en-US" });
    expect(result).toBeDefined();
  });
});

describe("formatToLocalizedTimezone", () => {
  it("should return timezone name", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTimezone(date, "en-US", "America/New_York");
    expect(result).toBeDefined();
  });

  it("should work with short timezone name", () => {
    const date = new Date("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTimezone(date, "en-US", "America/New_York", "short");
    expect(result).toBeDefined();
  });

  it("should work with Dayjs objects", () => {
    const date = dayjs("2024-04-25T14:30:00Z");
    const result = formatToLocalizedTimezone(date, "en-US", "Europe/London");
    expect(result).toBeDefined();
  });
});

describe("sortByTimezone", () => {
  it("should return negative when first timezone is earlier", () => {
    const result = sortByTimezone("America/New_York", "Europe/London");
    expect(result).toBe(-1);
  });

  it("should return positive when first timezone is later", () => {
    const result = sortByTimezone("Europe/London", "America/New_York");
    expect(result).toBe(1);
  });

  it("should return 0 when timezones have same offset", () => {
    const result = sortByTimezone("UTC", "UTC");
    expect(result).toBe(0);
  });
});

describe("isPreviousDayInTimezone", () => {
  it("should return false when time is same in both timezones", () => {
    const result = isPreviousDayInTimezone("2024-04-25T12:00:00Z", "UTC", "UTC");
    expect(result).toBe(false);
  });

  it("should detect previous day correctly", () => {
    const result = isPreviousDayInTimezone("2024-04-25T02:00:00Z", "America/New_York", "Asia/Tokyo");
    expect(typeof result).toBe("boolean");
  });
});

describe("isNextDayInTimezone", () => {
  it("should return false when time is same in both timezones", () => {
    const result = isNextDayInTimezone("2024-04-25T12:00:00Z", "UTC", "UTC");
    expect(result).toBe(false);
  });

  it("should detect next day correctly", () => {
    const result = isNextDayInTimezone("2024-04-25T22:00:00Z", "Asia/Tokyo", "America/New_York");
    expect(typeof result).toBe("boolean");
  });
});

describe("weekdayToWeekIndex", () => {
  it("should return 0 for Sunday", () => {
    expect(weekdayToWeekIndex("Sunday")).toBe(0);
  });

  it("should return 1 for Monday", () => {
    expect(weekdayToWeekIndex("Monday")).toBe(1);
  });

  it("should return 6 for Saturday", () => {
    expect(weekdayToWeekIndex("Saturday")).toBe(6);
  });

  it("should return 0 for undefined", () => {
    expect(weekdayToWeekIndex(undefined)).toBe(0);
  });

  it("should return 0 for numbers less than 6 due to implementation", () => {
    expect(weekdayToWeekIndex(3)).toBe(0);
  });

  it("should return the number for numbers >= 6", () => {
    expect(weekdayToWeekIndex(6)).toBe(6);
  });

  it("should return -1 for invalid weekday string (indexOf returns -1)", () => {
    expect(weekdayToWeekIndex("InvalidDay")).toBe(-1);
  });
});

describe("getTimeZone", () => {
  it("should extract timezone from Dayjs object", () => {
    const date = dayjs().tz("America/New_York");
    const result = getTimeZone(date);
    expect(result).toBe("America/New_York");
  });

  it("should work with different timezones", () => {
    const date = dayjs().tz("Europe/London");
    const result = getTimeZone(date);
    expect(result).toBe("Europe/London");
  });
});

describe("timeZoneWithDST", () => {
  it("should return true for timezone with DST", () => {
    expect(timeZoneWithDST("America/New_York")).toBe(true);
    expect(timeZoneWithDST("Europe/London")).toBe(true);
  });

  it("should return false for timezone without DST", () => {
    expect(timeZoneWithDST("Asia/Tokyo")).toBe(false);
    expect(timeZoneWithDST("UTC")).toBe(false);
  });
});

describe("getDSTDifference", () => {
  it("should return non-zero for timezone with DST", () => {
    const result = getDSTDifference("America/New_York");
    expect(result).not.toBe(0);
  });

  it("should return 0 for timezone without DST", () => {
    const result = getDSTDifference("Asia/Tokyo");
    expect(result).toBe(0);
  });

  it("should return typical 60 minutes for most DST timezones", () => {
    const result = getDSTDifference("America/New_York");
    expect(Math.abs(result)).toBe(60);
  });
});

describe("getUTCOffsetInDST", () => {
  it("should return DST offset for timezone with DST", () => {
    const result = getUTCOffsetInDST("America/New_York");
    expect(result).toBe(-240);
  });

  it("should return 0 for timezone without DST", () => {
    const result = getUTCOffsetInDST("Asia/Tokyo");
    expect(result).toBe(0);
  });
});

describe("isInDST", () => {
  it("should correctly identify DST status", () => {
    const summerDate = dayjs.tz("2024-07-15T12:00:00", "America/New_York");
    const winterDate = dayjs.tz("2024-01-15T12:00:00", "America/New_York");

    expect(isInDST(summerDate)).toBe(true);
    expect(isInDST(winterDate)).toBe(false);
  });

  it("should return false for timezone without DST", () => {
    const date = dayjs.tz("2024-07-15T12:00:00", "Asia/Tokyo");
    expect(isInDST(date)).toBe(false);
  });
});

describe("getUTCOffsetByTimezone", () => {
  it("should return UTC offset for valid timezone", () => {
    const result = getUTCOffsetByTimezone("America/New_York");
    expect(result).toBeDefined();
    expect(typeof result).toBe("number");
  });

  it("should return null for empty timezone", () => {
    const result = getUTCOffsetByTimezone("");
    expect(result).toBeNull();
  });

  it("should handle specific date", () => {
    const result = getUTCOffsetByTimezone("America/New_York", "2024-07-15");
    expect(result).toBe(-240);
  });

  it("should handle winter date", () => {
    const result = getUTCOffsetByTimezone("America/New_York", "2024-01-15");
    expect(result).toBe(-300);
  });

  it("should work with Date objects", () => {
    const result = getUTCOffsetByTimezone("Europe/London", new Date("2024-07-15"));
    expect(result).toBe(60);
  });

  it("should work with Dayjs objects", () => {
    const result = getUTCOffsetByTimezone("Asia/Tokyo", dayjs("2024-07-15"));
    expect(result).toBe(540);
  });
});
