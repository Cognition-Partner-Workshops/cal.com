import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCHEDULE,
  getAvailabilityFromSchedule,
  MINUTES_DAY_END,
  MINUTES_DAY_START,
  MINUTES_IN_DAY,
} from "./availability";

describe("availability", () => {
  describe("DEFAULT_SCHEDULE", () => {
    it("should have 7 days (Sunday-Saturday)", () => {
      expect(DEFAULT_SCHEDULE).toHaveLength(7);
    });

    it("should have empty arrays for Sunday (index 0) and Saturday (index 6)", () => {
      expect(DEFAULT_SCHEDULE[0]).toEqual([]);
      expect(DEFAULT_SCHEDULE[6]).toEqual([]);
    });

    it("should have working hours for Monday-Friday", () => {
      for (let i = 1; i <= 5; i++) {
        expect(DEFAULT_SCHEDULE[i]).toHaveLength(1);
        expect(DEFAULT_SCHEDULE[i][0]).toHaveProperty("start");
        expect(DEFAULT_SCHEDULE[i][0]).toHaveProperty("end");
      }
    });
  });

  describe("constants", () => {
    it("should define MINUTES_IN_DAY as 1440", () => {
      expect(MINUTES_IN_DAY).toBe(1440);
    });

    it("should define MINUTES_DAY_END as 1439", () => {
      expect(MINUTES_DAY_END).toBe(1439);
    });

    it("should define MINUTES_DAY_START as 0", () => {
      expect(MINUTES_DAY_START).toBe(0);
    });
  });

  describe("getAvailabilityFromSchedule", () => {
    it("should return empty array for empty schedule", () => {
      const schedule = [[], [], [], [], [], [], []];
      const result = getAvailabilityFromSchedule(schedule);
      expect(result).toEqual([]);
    });

    it("should merge days with same time ranges", () => {
      const timeRange = {
        start: new Date("2024-01-01T09:00:00Z"),
        end: new Date("2024-01-01T17:00:00Z"),
      };
      const schedule = [[], [timeRange], [timeRange], [timeRange], [timeRange], [timeRange], []];
      const result = getAvailabilityFromSchedule(schedule);
      expect(result).toHaveLength(1);
      expect(result[0].days).toEqual([1, 2, 3, 4, 5]);
    });

    it("should keep separate entries for different time ranges", () => {
      const morningRange = {
        start: new Date("2024-01-01T08:00:00Z"),
        end: new Date("2024-01-01T12:00:00Z"),
      };
      const afternoonRange = {
        start: new Date("2024-01-01T13:00:00Z"),
        end: new Date("2024-01-01T17:00:00Z"),
      };
      const schedule = [[], [morningRange, afternoonRange], [], [], [], [], []];
      const result = getAvailabilityFromSchedule(schedule);
      expect(result).toHaveLength(2);
    });

    it("should handle schedule with only weekend availability", () => {
      const timeRange = {
        start: new Date("2024-01-01T10:00:00Z"),
        end: new Date("2024-01-01T14:00:00Z"),
      };
      const schedule = [[timeRange], [], [], [], [], [], [timeRange]];
      const result = getAvailabilityFromSchedule(schedule);
      expect(result).toHaveLength(1);
      expect(result[0].days).toEqual([0, 6]);
    });

    it("should handle single day availability", () => {
      const timeRange = {
        start: new Date("2024-01-01T09:00:00Z"),
        end: new Date("2024-01-01T17:00:00Z"),
      };
      const schedule = [[], [timeRange], [], [], [], [], []];
      const result = getAvailabilityFromSchedule(schedule);
      expect(result).toHaveLength(1);
      expect(result[0].days).toEqual([1]);
    });
  });
});
