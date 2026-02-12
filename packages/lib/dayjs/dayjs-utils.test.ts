import { describe, it, expect } from "vitest";

import dayjs from "@calcom/dayjs";

import {
  yyyymmdd,
  daysInMonth,
  formatTime,
  isSupportedTimeZone,
  formatLocalizedDateTime,
  formatToLocalizedDate,
  sortByTimezone,
  weekdayToWeekIndex,
  timeZoneWithDST,
  getDSTDifference,
  getUTCOffsetByTimezone,
  stringToDayjs,
} from "./index";

describe("yyyymmdd", () => {
  it("formats a Date object", () => {
    expect(yyyymmdd(new Date("2024-04-25T00:00:00Z"))).toBe("2024-04-25");
  });

  it("formats a Dayjs object", () => {
    expect(yyyymmdd(dayjs("2024-04-25"))).toBe("2024-04-25");
  });
});

describe("daysInMonth", () => {
  it("returns correct days for a 31-day month", () => {
    expect(daysInMonth(new Date("2024-01-15"))).toBe(31);
  });

  it("returns correct days for February in a leap year", () => {
    expect(daysInMonth(new Date("2024-02-15"))).toBe(29);
  });

  it("returns correct days for February in a non-leap year", () => {
    expect(daysInMonth(new Date("2023-02-15"))).toBe(28);
  });

  it("returns correct days for a 30-day month", () => {
    expect(daysInMonth(new Date("2024-04-15"))).toBe(30);
  });

  it("works with Dayjs objects", () => {
    expect(daysInMonth(dayjs("2024-01-15"))).toBe(31);
  });
});

describe("formatTime", () => {
  it("formats in 24-hour notation by default", () => {
    const result = formatTime("2024-01-15T14:30:00Z", 24);
    expect(result).toBe("14:30");
  });

  it("formats in 12-hour notation", () => {
    const result = formatTime("2024-01-15T14:30:00Z", 12);
    expect(result).toMatch(/2:30pm/);
  });

  it("formats with timezone", () => {
    const result = formatTime("2024-01-15T14:30:00Z", 24, "America/New_York");
    expect(result).toBe("09:30");
  });

  it("uses 24-hour format when timeFormat is null", () => {
    const result = formatTime("2024-01-15T14:30:00Z", null);
    expect(result).toBe("14:30");
  });
});

describe("isSupportedTimeZone", () => {
  it("returns true for a valid timezone", () => {
    expect(isSupportedTimeZone("America/New_York")).toBe(true);
  });

  it("returns true for UTC", () => {
    expect(isSupportedTimeZone("UTC")).toBe(true);
  });

  it("returns false for an invalid timezone", () => {
    expect(isSupportedTimeZone("Invalid/Timezone")).toBe(false);
  });
});

describe("formatLocalizedDateTime", () => {
  it("formats a Date object with options", () => {
    const date = new Date("2024-01-15T14:30:00Z");
    const result = formatLocalizedDateTime(date, { dateStyle: "short" }, "en-US");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats a Dayjs object", () => {
    const date = dayjs("2024-01-15T14:30:00Z");
    const result = formatLocalizedDateTime(date, { dateStyle: "short" }, "en-US");
    expect(typeof result).toBe("string");
  });
});

describe("formatToLocalizedDate", () => {
  it("formats a date with default style", () => {
    const result = formatToLocalizedDate(new Date("2024-01-15"), "en-US");
    expect(typeof result).toBe("string");
    expect(result).toContain("January");
  });

  it("formats with short style", () => {
    const result = formatToLocalizedDate(new Date("2024-01-15"), "en-US", "short");
    expect(typeof result).toBe("string");
  });
});

describe("sortByTimezone", () => {
  it("returns 0 for same timezone", () => {
    expect(sortByTimezone("UTC", "UTC")).toBe(0);
  });

  it("returns -1 when A has smaller offset", () => {
    expect(sortByTimezone("America/New_York", "Europe/London")).toBe(-1);
  });

  it("returns 1 when A has larger offset", () => {
    expect(sortByTimezone("Europe/London", "America/New_York")).toBe(1);
  });
});

describe("weekdayToWeekIndex", () => {
  it("converts weekday string to index", () => {
    expect(weekdayToWeekIndex("Monday")).toBe(1);
    expect(weekdayToWeekIndex("Sunday")).toBe(0);
    expect(weekdayToWeekIndex("Friday")).toBe(5);
    expect(weekdayToWeekIndex("Saturday")).toBe(6);
  });

  it("returns 0 for numbers less than 6", () => {
    expect(weekdayToWeekIndex(3)).toBe(0);
  });

  it("returns number for values >= 6", () => {
    expect(weekdayToWeekIndex(6)).toBe(6);
  });

  it("returns 0 for undefined", () => {
    expect(weekdayToWeekIndex(undefined)).toBe(0);
  });

  it("returns -1 for unknown string", () => {
    expect(weekdayToWeekIndex("InvalidDay")).toBe(-1);
  });
});

describe("timeZoneWithDST", () => {
  it("returns true for a DST timezone", () => {
    expect(timeZoneWithDST("America/New_York")).toBe(true);
  });

  it("returns false for a non-DST timezone", () => {
    expect(timeZoneWithDST("UTC")).toBe(false);
  });
});

describe("getDSTDifference", () => {
  it("returns non-zero for DST timezones", () => {
    const diff = getDSTDifference("America/New_York");
    expect(diff).not.toBe(0);
  });

  it("returns 0 for non-DST timezones", () => {
    expect(getDSTDifference("UTC")).toBe(0);
  });
});

describe("getUTCOffsetByTimezone", () => {
  it("returns offset for valid timezone", () => {
    const offset = getUTCOffsetByTimezone("UTC");
    expect(offset).toBe(0);
  });

  it("returns null for empty timezone", () => {
    expect(getUTCOffsetByTimezone("")).toBe(null);
  });

  it("accepts a date parameter", () => {
    const offset = getUTCOffsetByTimezone("America/New_York", "2024-01-15");
    expect(typeof offset).toBe("number");
  });
});

describe("stringToDayjs", () => {
  it("converts string with timezone offset", () => {
    const result = stringToDayjs("2024-01-15T14:30:00+05:30");
    expect(result.isValid()).toBe(true);
    expect(result.utcOffset()).toBe(330);
  });

  it("defaults to +00:00 when no offset", () => {
    const result = stringToDayjs("2024-01-15T14:30:00");
    expect(result.isValid()).toBe(true);
    expect(result.utcOffset()).toBe(0);
  });

  it("handles negative timezone offset", () => {
    const result = stringToDayjs("2024-01-15T14:30:00-05:00");
    expect(result.isValid()).toBe(true);
    expect(result.utcOffset()).toBe(-300);
  });
});
