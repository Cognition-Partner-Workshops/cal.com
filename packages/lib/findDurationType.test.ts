import { describe, expect, it } from "vitest";

import findDurationType from "./findDurationType";

describe("findDurationType", () => {
  it("should return 'days' when value is divisible by MINUTES_IN_DAY (1440)", () => {
    expect(findDurationType(1440)).toBe("days"); // 1 day
    expect(findDurationType(2880)).toBe("days"); // 2 days
    expect(findDurationType(4320)).toBe("days"); // 3 days
    expect(findDurationType(0)).toBe("days"); // 0 is divisible by anything
  });

  it("should return 'hours' when value is divisible by MINUTES_IN_HOUR (60) but not by MINUTES_IN_DAY", () => {
    expect(findDurationType(60)).toBe("hours"); // 1 hour
    expect(findDurationType(120)).toBe("hours"); // 2 hours
    expect(findDurationType(180)).toBe("hours"); // 3 hours
    expect(findDurationType(1380)).toBe("hours"); // 23 hours
  });

  it("should return 'minutes' when value is not divisible by 60", () => {
    expect(findDurationType(30)).toBe("minutes");
    expect(findDurationType(45)).toBe("minutes");
    expect(findDurationType(15)).toBe("minutes");
    expect(findDurationType(91)).toBe("minutes"); // 91 is not divisible by 60
    expect(findDurationType(90)).toBe("minutes"); // 90 is divisible by 60 but not 1440, returns minutes based on actual implementation
  });

  it("should handle edge cases", () => {
    expect(findDurationType(1)).toBe("minutes");
    expect(findDurationType(59)).toBe("minutes");
    expect(findDurationType(61)).toBe("minutes");
  });
});
