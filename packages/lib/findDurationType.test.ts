import { describe, expect, it } from "vitest";

import findDurationType from "./findDurationType";

describe("findDurationType", () => {
  it("should return 'days' for values divisible by 1440", () => {
    expect(findDurationType(1440)).toBe("days");
    expect(findDurationType(2880)).toBe("days");
    expect(findDurationType(4320)).toBe("days");
  });

  it("should return 'hours' for values divisible by 60 but not 1440", () => {
    expect(findDurationType(60)).toBe("hours");
    expect(findDurationType(120)).toBe("hours");
    expect(findDurationType(180)).toBe("hours");
    expect(findDurationType(360)).toBe("hours");
  });

  it("should return 'minutes' for values not divisible by 60", () => {
    expect(findDurationType(15)).toBe("minutes");
    expect(findDurationType(30)).toBe("minutes");
    expect(findDurationType(45)).toBe("minutes");
    expect(findDurationType(90)).toBe("minutes");
    expect(findDurationType(1)).toBe("minutes");
  });

  it("should return 'days' for zero (divisible by all)", () => {
    expect(findDurationType(0)).toBe("days");
  });
});
