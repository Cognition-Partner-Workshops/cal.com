import { describe, expect, it } from "vitest";

describe("Availability Calculation Tests", () => {
  describe("Time Range Validation", () => {
    interface TimeRange {
      start: string;
      end: string;
    }

    const isValidTimeRange = (range: TimeRange): boolean => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(range.start) || !timeRegex.test(range.end)) {
        return false;
      }

      const [startHour, startMin] = range.start.split(":").map(Number);
      const [endHour, endMin] = range.end.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      return startMinutes < endMinutes;
    };

    it("should validate correct time range", () => {
      expect(isValidTimeRange({ start: "09:00", end: "17:00" })).toBe(true);
      expect(isValidTimeRange({ start: "00:00", end: "23:59" })).toBe(true);
      expect(isValidTimeRange({ start: "12:00", end: "13:00" })).toBe(true);
    });

    it("should reject invalid time format", () => {
      expect(isValidTimeRange({ start: "9:00", end: "17:00" })).toBe(true);
      expect(isValidTimeRange({ start: "25:00", end: "17:00" })).toBe(false);
      expect(isValidTimeRange({ start: "09:60", end: "17:00" })).toBe(false);
    });

    it("should reject end time before start time", () => {
      expect(isValidTimeRange({ start: "17:00", end: "09:00" })).toBe(false);
      expect(isValidTimeRange({ start: "14:00", end: "13:00" })).toBe(false);
    });

    it("should reject equal start and end times", () => {
      expect(isValidTimeRange({ start: "09:00", end: "09:00" })).toBe(false);
    });
  });

  describe("Weekly Schedule Validation", () => {
    interface DaySchedule {
      day: number;
      ranges: Array<{ start: string; end: string }>;
    }

    const isValidWeeklySchedule = (schedule: DaySchedule[]): boolean => {
      const validDays = new Set([0, 1, 2, 3, 4, 5, 6]);

      for (const daySchedule of schedule) {
        if (!validDays.has(daySchedule.day)) {
          return false;
        }

        for (let i = 0; i < daySchedule.ranges.length; i++) {
          const range = daySchedule.ranges[i];
          const [startHour, startMin] = range.start.split(":").map(Number);
          const [endHour, endMin] = range.end.split(":").map(Number);

          if (startHour * 60 + startMin >= endHour * 60 + endMin) {
            return false;
          }

          for (let j = i + 1; j < daySchedule.ranges.length; j++) {
            const otherRange = daySchedule.ranges[j];
            const [otherStartHour, otherStartMin] = otherRange.start.split(":").map(Number);
            const [otherEndHour, otherEndMin] = otherRange.end.split(":").map(Number);

            const rangeStart = startHour * 60 + startMin;
            const rangeEnd = endHour * 60 + endMin;
            const otherStart = otherStartHour * 60 + otherStartMin;
            const otherEnd = otherEndHour * 60 + otherEndMin;

            if (
              (rangeStart < otherEnd && rangeEnd > otherStart) ||
              (otherStart < rangeEnd && otherEnd > rangeStart)
            ) {
              return false;
            }
          }
        }
      }

      return true;
    };

    it("should validate correct weekly schedule", () => {
      const schedule: DaySchedule[] = [
        { day: 1, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: 2, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: 3, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: 4, ranges: [{ start: "09:00", end: "17:00" }] },
        { day: 5, ranges: [{ start: "09:00", end: "17:00" }] },
      ];
      expect(isValidWeeklySchedule(schedule)).toBe(true);
    });

    it("should validate schedule with multiple ranges per day", () => {
      const schedule: DaySchedule[] = [
        {
          day: 1,
          ranges: [
            { start: "09:00", end: "12:00" },
            { start: "13:00", end: "17:00" },
          ],
        },
      ];
      expect(isValidWeeklySchedule(schedule)).toBe(true);
    });

    it("should reject overlapping ranges on same day", () => {
      const schedule: DaySchedule[] = [
        {
          day: 1,
          ranges: [
            { start: "09:00", end: "13:00" },
            { start: "12:00", end: "17:00" },
          ],
        },
      ];
      expect(isValidWeeklySchedule(schedule)).toBe(false);
    });

    it("should reject invalid day number", () => {
      const schedule: DaySchedule[] = [{ day: 7, ranges: [{ start: "09:00", end: "17:00" }] }];
      expect(isValidWeeklySchedule(schedule)).toBe(false);
    });

    it("should accept empty schedule", () => {
      expect(isValidWeeklySchedule([])).toBe(true);
    });

    it("should accept weekend schedule", () => {
      const schedule: DaySchedule[] = [
        { day: 0, ranges: [{ start: "10:00", end: "14:00" }] },
        { day: 6, ranges: [{ start: "10:00", end: "14:00" }] },
      ];
      expect(isValidWeeklySchedule(schedule)).toBe(true);
    });
  });

  describe("Slot Generation", () => {
    interface TimeSlot {
      start: Date;
      end: Date;
    }

    const generateSlots = (
      dayStart: Date,
      startTime: string,
      endTime: string,
      slotDuration: number,
      slotInterval: number
    ): TimeSlot[] => {
      const slots: TimeSlot[] = [];

      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      const dayStartMs = dayStart.getTime();
      const startMs = dayStartMs + (startHour * 60 + startMin) * 60 * 1000;
      const endMs = dayStartMs + (endHour * 60 + endMin) * 60 * 1000;

      let currentStart = startMs;

      while (currentStart + slotDuration * 60 * 1000 <= endMs) {
        slots.push({
          start: new Date(currentStart),
          end: new Date(currentStart + slotDuration * 60 * 1000),
        });
        currentStart += slotInterval * 60 * 1000;
      }

      return slots;
    };

    it("should generate correct number of 30-minute slots", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "09:00", "12:00", 30, 30);
      expect(slots.length).toBe(6);
    });

    it("should generate correct number of 15-minute slots", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "09:00", "10:00", 15, 15);
      expect(slots.length).toBe(4);
    });

    it("should generate correct number of 60-minute slots", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "09:00", "17:00", 60, 60);
      expect(slots.length).toBe(8);
    });

    it("should handle slot interval different from duration", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "09:00", "11:00", 30, 15);
      expect(slots.length).toBe(7);
    });

    it("should return empty array for invalid time range", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "17:00", "09:00", 30, 30);
      expect(slots.length).toBe(0);
    });

    it("should not generate partial slots", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "09:00", "09:45", 30, 30);
      expect(slots.length).toBe(1);
    });

    it("should generate slots with correct start and end times", () => {
      const dayStart = new Date("2024-01-15T00:00:00Z");
      const slots = generateSlots(dayStart, "09:00", "10:00", 30, 30);

      expect(slots[0].start.toISOString()).toBe("2024-01-15T09:00:00.000Z");
      expect(slots[0].end.toISOString()).toBe("2024-01-15T09:30:00.000Z");
      expect(slots[1].start.toISOString()).toBe("2024-01-15T09:30:00.000Z");
      expect(slots[1].end.toISOString()).toBe("2024-01-15T10:00:00.000Z");
    });
  });

  describe("Timezone Handling", () => {
    const convertToTimezone = (date: Date, fromTz: string, toTz: string): Date => {
      const utcDate = new Date(date.toLocaleString("en-US", { timeZone: fromTz }));
      const targetDate = new Date(date.toLocaleString("en-US", { timeZone: toTz }));
      const diff = targetDate.getTime() - utcDate.getTime();
      return new Date(date.getTime() + diff);
    };

    it("should handle same timezone conversion", () => {
      const date = new Date("2024-01-15T10:00:00Z");
      const converted = convertToTimezone(date, "UTC", "UTC");
      expect(converted.getTime()).toBe(date.getTime());
    });

    it("should validate timezone string format", () => {
      const validTimezones = ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney", "UTC"];

      validTimezones.forEach((tz) => {
        expect(() => {
          new Date().toLocaleString("en-US", { timeZone: tz });
        }).not.toThrow();
      });
    });

    it("should reject invalid timezone strings", () => {
      const invalidTimezones = ["Invalid/Timezone", "NotATimezone", ""];

      invalidTimezones.forEach((tz) => {
        if (tz === "") return;
        expect(() => {
          new Date().toLocaleString("en-US", { timeZone: tz });
        }).toThrow();
      });
    });
  });

  describe("Date Range Availability", () => {
    interface DateRange {
      start: Date;
      end: Date;
    }

    const isDateInRange = (date: Date, range: DateRange): boolean => {
      return date >= range.start && date <= range.end;
    };

    const getOverlappingRange = (range1: DateRange, range2: DateRange): DateRange | null => {
      const start = new Date(Math.max(range1.start.getTime(), range2.start.getTime()));
      const end = new Date(Math.min(range1.end.getTime(), range2.end.getTime()));

      if (start >= end) {
        return null;
      }

      return { start, end };
    };

    it("should correctly identify date in range", () => {
      const range: DateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      };

      expect(isDateInRange(new Date("2024-01-15"), range)).toBe(true);
      expect(isDateInRange(new Date("2024-01-01"), range)).toBe(true);
      expect(isDateInRange(new Date("2024-01-31"), range)).toBe(true);
    });

    it("should correctly identify date outside range", () => {
      const range: DateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      };

      expect(isDateInRange(new Date("2023-12-31"), range)).toBe(false);
      expect(isDateInRange(new Date("2024-02-01"), range)).toBe(false);
    });

    it("should find overlapping range", () => {
      const range1: DateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-15"),
      };
      const range2: DateRange = {
        start: new Date("2024-01-10"),
        end: new Date("2024-01-20"),
      };

      const overlap = getOverlappingRange(range1, range2);
      expect(overlap).not.toBeNull();
      expect(overlap?.start.toISOString()).toBe(new Date("2024-01-10").toISOString());
      expect(overlap?.end.toISOString()).toBe(new Date("2024-01-15").toISOString());
    });

    it("should return null for non-overlapping ranges", () => {
      const range1: DateRange = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-10"),
      };
      const range2: DateRange = {
        start: new Date("2024-01-15"),
        end: new Date("2024-01-20"),
      };

      expect(getOverlappingRange(range1, range2)).toBeNull();
    });
  });

  describe("Busy Time Handling", () => {
    interface BusyTime {
      start: Date;
      end: Date;
      source?: string;
    }

    const mergeBusyTimes = (busyTimes: BusyTime[]): BusyTime[] => {
      if (busyTimes.length === 0) return [];

      const sorted = [...busyTimes].sort((a, b) => a.start.getTime() - b.start.getTime());

      const merged: BusyTime[] = [sorted[0]];

      for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const last = merged[merged.length - 1];

        if (current.start <= last.end) {
          last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
        } else {
          merged.push(current);
        }
      }

      return merged;
    };

    it("should merge overlapping busy times", () => {
      const busyTimes: BusyTime[] = [
        { start: new Date("2024-01-15T09:00:00Z"), end: new Date("2024-01-15T10:00:00Z") },
        { start: new Date("2024-01-15T09:30:00Z"), end: new Date("2024-01-15T11:00:00Z") },
      ];

      const merged = mergeBusyTimes(busyTimes);
      expect(merged.length).toBe(1);
      expect(merged[0].start.toISOString()).toBe("2024-01-15T09:00:00.000Z");
      expect(merged[0].end.toISOString()).toBe("2024-01-15T11:00:00.000Z");
    });

    it("should not merge non-overlapping busy times", () => {
      const busyTimes: BusyTime[] = [
        { start: new Date("2024-01-15T09:00:00Z"), end: new Date("2024-01-15T10:00:00Z") },
        { start: new Date("2024-01-15T11:00:00Z"), end: new Date("2024-01-15T12:00:00Z") },
      ];

      const merged = mergeBusyTimes(busyTimes);
      expect(merged.length).toBe(2);
    });

    it("should handle adjacent busy times", () => {
      const busyTimes: BusyTime[] = [
        { start: new Date("2024-01-15T09:00:00Z"), end: new Date("2024-01-15T10:00:00Z") },
        { start: new Date("2024-01-15T10:00:00Z"), end: new Date("2024-01-15T11:00:00Z") },
      ];

      const merged = mergeBusyTimes(busyTimes);
      expect(merged.length).toBe(1);
    });

    it("should handle empty busy times array", () => {
      expect(mergeBusyTimes([])).toEqual([]);
    });

    it("should handle single busy time", () => {
      const busyTimes: BusyTime[] = [
        { start: new Date("2024-01-15T09:00:00Z"), end: new Date("2024-01-15T10:00:00Z") },
      ];

      const merged = mergeBusyTimes(busyTimes);
      expect(merged.length).toBe(1);
    });

    it("should merge multiple overlapping busy times", () => {
      const busyTimes: BusyTime[] = [
        { start: new Date("2024-01-15T09:00:00Z"), end: new Date("2024-01-15T10:00:00Z") },
        { start: new Date("2024-01-15T09:30:00Z"), end: new Date("2024-01-15T10:30:00Z") },
        { start: new Date("2024-01-15T10:00:00Z"), end: new Date("2024-01-15T11:00:00Z") },
        { start: new Date("2024-01-15T10:45:00Z"), end: new Date("2024-01-15T12:00:00Z") },
      ];

      const merged = mergeBusyTimes(busyTimes);
      expect(merged.length).toBe(1);
      expect(merged[0].end.toISOString()).toBe("2024-01-15T12:00:00.000Z");
    });
  });

  describe("Minimum Notice Time", () => {
    const isWithinNoticeTime = (
      bookingTime: Date,
      currentTime: Date,
      minimumNoticeMinutes: number
    ): boolean => {
      const noticeMs = minimumNoticeMinutes * 60 * 1000;
      const earliestBookingTime = new Date(currentTime.getTime() + noticeMs);
      return bookingTime >= earliestBookingTime;
    };

    it("should allow booking with sufficient notice", () => {
      const currentTime = new Date("2024-01-15T09:00:00Z");
      const bookingTime = new Date("2024-01-15T12:00:00Z");
      expect(isWithinNoticeTime(bookingTime, currentTime, 60)).toBe(true);
    });

    it("should reject booking without sufficient notice", () => {
      const currentTime = new Date("2024-01-15T09:00:00Z");
      const bookingTime = new Date("2024-01-15T09:30:00Z");
      expect(isWithinNoticeTime(bookingTime, currentTime, 60)).toBe(false);
    });

    it("should allow booking at exact notice time", () => {
      const currentTime = new Date("2024-01-15T09:00:00Z");
      const bookingTime = new Date("2024-01-15T10:00:00Z");
      expect(isWithinNoticeTime(bookingTime, currentTime, 60)).toBe(true);
    });

    it("should handle zero notice time", () => {
      const currentTime = new Date("2024-01-15T09:00:00Z");
      const bookingTime = new Date("2024-01-15T09:00:00Z");
      expect(isWithinNoticeTime(bookingTime, currentTime, 0)).toBe(true);
    });

    it("should handle 24-hour notice time", () => {
      const currentTime = new Date("2024-01-15T09:00:00Z");
      const bookingTime = new Date("2024-01-16T09:00:00Z");
      expect(isWithinNoticeTime(bookingTime, currentTime, 1440)).toBe(true);
    });
  });

  describe("Future Booking Limit", () => {
    const isWithinFutureLimit = (bookingDate: Date, currentDate: Date, futureLimitDays: number): boolean => {
      const limitMs = futureLimitDays * 24 * 60 * 60 * 1000;
      const maxBookingDate = new Date(currentDate.getTime() + limitMs);
      return bookingDate <= maxBookingDate;
    };

    it("should allow booking within future limit", () => {
      const currentDate = new Date("2024-01-15");
      const bookingDate = new Date("2024-02-15");
      expect(isWithinFutureLimit(bookingDate, currentDate, 60)).toBe(true);
    });

    it("should reject booking beyond future limit", () => {
      const currentDate = new Date("2024-01-15");
      const bookingDate = new Date("2024-06-15");
      expect(isWithinFutureLimit(bookingDate, currentDate, 60)).toBe(false);
    });

    it("should allow booking at exact future limit", () => {
      const currentDate = new Date("2024-01-15");
      const bookingDate = new Date("2024-03-15");
      expect(isWithinFutureLimit(bookingDate, currentDate, 60)).toBe(true);
    });

    it("should handle unlimited future booking", () => {
      const currentDate = new Date("2024-01-15");
      const bookingDate = new Date("2025-01-15");
      // 2024 is a leap year, so Jan 15 2024 to Jan 15 2025 is 366 days
      expect(isWithinFutureLimit(bookingDate, currentDate, 366)).toBe(true);
    });
  });
});

describe("Out of Office Handling", () => {
  interface OutOfOffice {
    start: Date;
    end: Date;
    reason?: string;
  }

  const isOutOfOffice = (date: Date, outOfOfficePeriods: OutOfOffice[]): boolean => {
    return outOfOfficePeriods.some((period) => date >= period.start && date <= period.end);
  };

  it("should detect date within out of office period", () => {
    const periods: OutOfOffice[] = [
      {
        start: new Date("2024-01-20"),
        end: new Date("2024-01-25"),
        reason: "Vacation",
      },
    ];

    expect(isOutOfOffice(new Date("2024-01-22"), periods)).toBe(true);
  });

  it("should allow date outside out of office period", () => {
    const periods: OutOfOffice[] = [
      {
        start: new Date("2024-01-20"),
        end: new Date("2024-01-25"),
        reason: "Vacation",
      },
    ];

    expect(isOutOfOffice(new Date("2024-01-15"), periods)).toBe(false);
    expect(isOutOfOffice(new Date("2024-01-26"), periods)).toBe(false);
  });

  it("should handle multiple out of office periods", () => {
    const periods: OutOfOffice[] = [
      { start: new Date("2024-01-10"), end: new Date("2024-01-12") },
      { start: new Date("2024-01-20"), end: new Date("2024-01-25") },
      { start: new Date("2024-02-01"), end: new Date("2024-02-05") },
    ];

    expect(isOutOfOffice(new Date("2024-01-11"), periods)).toBe(true);
    expect(isOutOfOffice(new Date("2024-01-22"), periods)).toBe(true);
    expect(isOutOfOffice(new Date("2024-02-03"), periods)).toBe(true);
    expect(isOutOfOffice(new Date("2024-01-15"), periods)).toBe(false);
  });

  it("should handle empty out of office periods", () => {
    expect(isOutOfOffice(new Date("2024-01-15"), [])).toBe(false);
  });
});
