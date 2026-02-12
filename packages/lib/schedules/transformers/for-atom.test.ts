import { describe, it, expect } from "vitest";

import {
  transformAvailabilityForAtom,
  transformDateOverridesForAtom,
  transformScheduleToAvailabilityForAtom,
} from "./for-atom";

describe("transformScheduleToAvailabilityForAtom", () => {
  it("transforms availability into 7-day schedule", () => {
    const schedule = {
      availability: [
        {
          days: [1, 2, 3, 4, 5],
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
      ],
    };
    const result = transformScheduleToAvailabilityForAtom(schedule);
    expect(result).toHaveLength(7);
    expect(result[0]).toHaveLength(0);
    expect(result[1]).toHaveLength(1);
    expect(result[6]).toHaveLength(0);
  });

  it("handles multiple availability ranges per day", () => {
    const schedule = {
      availability: [
        {
          days: [1],
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T12:00:00Z"),
        },
        {
          days: [1],
          startTime: new Date("2024-01-01T13:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
      ],
    };
    const result = transformScheduleToAvailabilityForAtom(schedule);
    expect(result[1]).toHaveLength(2);
  });

  it("handles empty availability", () => {
    const schedule = { availability: [] };
    const result = transformScheduleToAvailabilityForAtom(schedule);
    expect(result).toHaveLength(7);
    for (const day of result) {
      expect(day).toHaveLength(0);
    }
  });

  it("sorts slots by start time", () => {
    const schedule = {
      availability: [
        {
          days: [1],
          startTime: new Date("2024-01-01T14:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
        {
          days: [1],
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T12:00:00Z"),
        },
      ],
    };
    const result = transformScheduleToAvailabilityForAtom(schedule);
    expect(result[1][0].start.getTime()).toBeLessThan(result[1][1].start.getTime());
  });
});

describe("transformAvailabilityForAtom", () => {
  it("transforms availability and adjusts end time", () => {
    const schedule = {
      availability: [
        {
          days: [1],
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T23:59:00Z"),
        },
      ],
    };
    const result = transformAvailabilityForAtom(schedule);
    expect(result).toHaveLength(7);
    expect(result[1]).toHaveLength(1);
  });

  it("handles empty availability", () => {
    const schedule = { availability: [] };
    const result = transformAvailabilityForAtom(schedule);
    expect(result).toHaveLength(7);
  });
});

describe("transformDateOverridesForAtom", () => {
  it("transforms date overrides for future dates", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const schedule = {
      availability: [
        {
          date: futureDate,
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
      ],
    };
    const result = transformDateOverridesForAtom(schedule, "UTC");
    expect(result).toHaveLength(1);
    expect(result[0].ranges).toHaveLength(1);
  });

  it("filters out past date overrides", () => {
    const pastDate = new Date("2020-01-01");
    const schedule = {
      availability: [
        {
          date: pastDate,
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
      ],
    };
    const result = transformDateOverridesForAtom(schedule, "UTC");
    expect(result).toHaveLength(0);
  });

  it("groups multiple overrides for the same date", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const schedule = {
      availability: [
        {
          date: futureDate,
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T12:00:00Z"),
        },
        {
          date: futureDate,
          startTime: new Date("2024-01-01T13:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
      ],
    };
    const result = transformDateOverridesForAtom(schedule, "UTC");
    expect(result).toHaveLength(1);
    expect(result[0].ranges).toHaveLength(2);
  });

  it("handles empty availability", () => {
    const result = transformDateOverridesForAtom({ availability: [] }, "UTC");
    expect(result).toHaveLength(0);
  });

  it("handles null date in override", () => {
    const schedule = {
      availability: [
        {
          date: null,
          startTime: new Date("2024-01-01T09:00:00Z"),
          endTime: new Date("2024-01-01T17:00:00Z"),
        },
      ],
    };
    const result = transformDateOverridesForAtom(schedule as unknown as Parameters<typeof transformDateOverridesForAtom>[0], "UTC");
    expect(result).toHaveLength(0);
  });
});
