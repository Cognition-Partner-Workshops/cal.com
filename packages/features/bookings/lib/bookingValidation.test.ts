import { describe, expect, it } from "vitest";

describe("Booking Validation Tests", () => {
  describe("Booking Time Slot Validation", () => {
    const isValidTimeSlot = (startTime: Date, endTime: Date, duration: number): boolean => {
      const diffMs = endTime.getTime() - startTime.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      return diffMinutes === duration && startTime < endTime;
    };

    it("should validate correct time slot duration", () => {
      const startTime = new Date("2024-01-15T10:00:00Z");
      const endTime = new Date("2024-01-15T10:30:00Z");
      expect(isValidTimeSlot(startTime, endTime, 30)).toBe(true);
    });

    it("should reject incorrect time slot duration", () => {
      const startTime = new Date("2024-01-15T10:00:00Z");
      const endTime = new Date("2024-01-15T10:45:00Z");
      expect(isValidTimeSlot(startTime, endTime, 30)).toBe(false);
    });

    it("should reject end time before start time", () => {
      const startTime = new Date("2024-01-15T11:00:00Z");
      const endTime = new Date("2024-01-15T10:00:00Z");
      expect(isValidTimeSlot(startTime, endTime, 30)).toBe(false);
    });

    it("should validate 15-minute slots", () => {
      const startTime = new Date("2024-01-15T09:00:00Z");
      const endTime = new Date("2024-01-15T09:15:00Z");
      expect(isValidTimeSlot(startTime, endTime, 15)).toBe(true);
    });

    it("should validate 60-minute slots", () => {
      const startTime = new Date("2024-01-15T14:00:00Z");
      const endTime = new Date("2024-01-15T15:00:00Z");
      expect(isValidTimeSlot(startTime, endTime, 60)).toBe(true);
    });

    it("should validate 90-minute slots", () => {
      const startTime = new Date("2024-01-15T10:00:00Z");
      const endTime = new Date("2024-01-15T11:30:00Z");
      expect(isValidTimeSlot(startTime, endTime, 90)).toBe(true);
    });
  });

  describe("Booking Conflict Detection", () => {
    interface TimeSlot {
      startTime: Date;
      endTime: Date;
    }

    const hasConflict = (newBooking: TimeSlot, existingBookings: TimeSlot[]): boolean => {
      return existingBookings.some((existing) => {
        return (
          (newBooking.startTime >= existing.startTime && newBooking.startTime < existing.endTime) ||
          (newBooking.endTime > existing.startTime && newBooking.endTime <= existing.endTime) ||
          (newBooking.startTime <= existing.startTime && newBooking.endTime >= existing.endTime)
        );
      });
    };

    it("should detect overlapping bookings", () => {
      const existingBookings: TimeSlot[] = [
        {
          startTime: new Date("2024-01-15T10:00:00Z"),
          endTime: new Date("2024-01-15T11:00:00Z"),
        },
      ];

      const newBooking: TimeSlot = {
        startTime: new Date("2024-01-15T10:30:00Z"),
        endTime: new Date("2024-01-15T11:30:00Z"),
      };

      expect(hasConflict(newBooking, existingBookings)).toBe(true);
    });

    it("should allow non-overlapping bookings", () => {
      const existingBookings: TimeSlot[] = [
        {
          startTime: new Date("2024-01-15T10:00:00Z"),
          endTime: new Date("2024-01-15T11:00:00Z"),
        },
      ];

      const newBooking: TimeSlot = {
        startTime: new Date("2024-01-15T11:00:00Z"),
        endTime: new Date("2024-01-15T12:00:00Z"),
      };

      expect(hasConflict(newBooking, existingBookings)).toBe(false);
    });

    it("should detect booking completely inside existing booking", () => {
      const existingBookings: TimeSlot[] = [
        {
          startTime: new Date("2024-01-15T09:00:00Z"),
          endTime: new Date("2024-01-15T12:00:00Z"),
        },
      ];

      const newBooking: TimeSlot = {
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      expect(hasConflict(newBooking, existingBookings)).toBe(true);
    });

    it("should detect booking that encompasses existing booking", () => {
      const existingBookings: TimeSlot[] = [
        {
          startTime: new Date("2024-01-15T10:00:00Z"),
          endTime: new Date("2024-01-15T11:00:00Z"),
        },
      ];

      const newBooking: TimeSlot = {
        startTime: new Date("2024-01-15T09:00:00Z"),
        endTime: new Date("2024-01-15T12:00:00Z"),
      };

      expect(hasConflict(newBooking, existingBookings)).toBe(true);
    });

    it("should handle multiple existing bookings", () => {
      const existingBookings: TimeSlot[] = [
        {
          startTime: new Date("2024-01-15T09:00:00Z"),
          endTime: new Date("2024-01-15T10:00:00Z"),
        },
        {
          startTime: new Date("2024-01-15T11:00:00Z"),
          endTime: new Date("2024-01-15T12:00:00Z"),
        },
        {
          startTime: new Date("2024-01-15T14:00:00Z"),
          endTime: new Date("2024-01-15T15:00:00Z"),
        },
      ];

      const validBooking: TimeSlot = {
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const conflictingBooking: TimeSlot = {
        startTime: new Date("2024-01-15T11:30:00Z"),
        endTime: new Date("2024-01-15T12:30:00Z"),
      };

      expect(hasConflict(validBooking, existingBookings)).toBe(false);
      expect(hasConflict(conflictingBooking, existingBookings)).toBe(true);
    });

    it("should handle empty existing bookings", () => {
      const existingBookings: TimeSlot[] = [];

      const newBooking: TimeSlot = {
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      expect(hasConflict(newBooking, existingBookings)).toBe(false);
    });
  });

  describe("Attendee Validation", () => {
    interface Attendee {
      email: string;
      name: string;
      timeZone?: string;
    }

    const isValidAttendee = (attendee: Attendee): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return (
        emailRegex.test(attendee.email) && attendee.name.trim().length > 0 && attendee.name.length <= 100
      );
    };

    it("should validate correct attendee data", () => {
      const attendee: Attendee = {
        email: "test@example.com",
        name: "John Doe",
        timeZone: "America/New_York",
      };
      expect(isValidAttendee(attendee)).toBe(true);
    });

    it("should reject invalid email", () => {
      const attendee: Attendee = {
        email: "invalid-email",
        name: "John Doe",
      };
      expect(isValidAttendee(attendee)).toBe(false);
    });

    it("should reject empty name", () => {
      const attendee: Attendee = {
        email: "test@example.com",
        name: "",
      };
      expect(isValidAttendee(attendee)).toBe(false);
    });

    it("should reject whitespace-only name", () => {
      const attendee: Attendee = {
        email: "test@example.com",
        name: "   ",
      };
      expect(isValidAttendee(attendee)).toBe(false);
    });

    it("should reject name exceeding max length", () => {
      const attendee: Attendee = {
        email: "test@example.com",
        name: "A".repeat(101),
      };
      expect(isValidAttendee(attendee)).toBe(false);
    });

    it("should accept name at max length", () => {
      const attendee: Attendee = {
        email: "test@example.com",
        name: "A".repeat(100),
      };
      expect(isValidAttendee(attendee)).toBe(true);
    });
  });

  describe("Booking Status Transitions", () => {
    type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "AWAITING_HOST";

    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
      AWAITING_HOST: ["ACCEPTED", "REJECTED", "CANCELLED"],
      ACCEPTED: ["CANCELLED"],
      REJECTED: [],
      CANCELLED: [],
    };

    const canTransition = (from: BookingStatus, to: BookingStatus): boolean => {
      return validTransitions[from].includes(to);
    };

    it("should allow PENDING to ACCEPTED transition", () => {
      expect(canTransition("PENDING", "ACCEPTED")).toBe(true);
    });

    it("should allow PENDING to REJECTED transition", () => {
      expect(canTransition("PENDING", "REJECTED")).toBe(true);
    });

    it("should allow PENDING to CANCELLED transition", () => {
      expect(canTransition("PENDING", "CANCELLED")).toBe(true);
    });

    it("should allow ACCEPTED to CANCELLED transition", () => {
      expect(canTransition("ACCEPTED", "CANCELLED")).toBe(true);
    });

    it("should not allow REJECTED to any transition", () => {
      expect(canTransition("REJECTED", "ACCEPTED")).toBe(false);
      expect(canTransition("REJECTED", "CANCELLED")).toBe(false);
      expect(canTransition("REJECTED", "PENDING")).toBe(false);
    });

    it("should not allow CANCELLED to any transition", () => {
      expect(canTransition("CANCELLED", "ACCEPTED")).toBe(false);
      expect(canTransition("CANCELLED", "PENDING")).toBe(false);
    });

    it("should not allow ACCEPTED to PENDING transition", () => {
      expect(canTransition("ACCEPTED", "PENDING")).toBe(false);
    });
  });

  describe("Booking Limits Validation", () => {
    interface BookingLimits {
      PER_DAY?: number;
      PER_WEEK?: number;
      PER_MONTH?: number;
      PER_YEAR?: number;
    }

    const isWithinLimits = (currentCount: number, limit: number | undefined): boolean => {
      if (limit === undefined) return true;
      return currentCount < limit;
    };

    const checkAllLimits = (
      counts: { daily: number; weekly: number; monthly: number; yearly: number },
      limits: BookingLimits
    ): boolean => {
      return (
        isWithinLimits(counts.daily, limits.PER_DAY) &&
        isWithinLimits(counts.weekly, limits.PER_WEEK) &&
        isWithinLimits(counts.monthly, limits.PER_MONTH) &&
        isWithinLimits(counts.yearly, limits.PER_YEAR)
      );
    };

    it("should allow booking when no limits are set", () => {
      const counts = { daily: 5, weekly: 20, monthly: 50, yearly: 200 };
      const limits: BookingLimits = {};
      expect(checkAllLimits(counts, limits)).toBe(true);
    });

    it("should allow booking within daily limit", () => {
      const counts = { daily: 2, weekly: 5, monthly: 10, yearly: 50 };
      const limits: BookingLimits = { PER_DAY: 5 };
      expect(checkAllLimits(counts, limits)).toBe(true);
    });

    it("should reject booking exceeding daily limit", () => {
      const counts = { daily: 5, weekly: 5, monthly: 10, yearly: 50 };
      const limits: BookingLimits = { PER_DAY: 5 };
      expect(checkAllLimits(counts, limits)).toBe(false);
    });

    it("should check multiple limits simultaneously", () => {
      const counts = { daily: 2, weekly: 10, monthly: 30, yearly: 100 };
      const limits: BookingLimits = {
        PER_DAY: 5,
        PER_WEEK: 15,
        PER_MONTH: 50,
        PER_YEAR: 200,
      };
      expect(checkAllLimits(counts, limits)).toBe(true);
    });

    it("should reject when any limit is exceeded", () => {
      const counts = { daily: 2, weekly: 15, monthly: 30, yearly: 100 };
      const limits: BookingLimits = {
        PER_DAY: 5,
        PER_WEEK: 15,
        PER_MONTH: 50,
        PER_YEAR: 200,
      };
      expect(checkAllLimits(counts, limits)).toBe(false);
    });
  });

  describe("Buffer Time Validation", () => {
    const hasBufferConflict = (
      bookingStart: Date,
      _bookingEnd: Date,
      existingEnd: Date,
      bufferBefore: number,
      bufferAfter: number
    ): boolean => {
      const bufferBeforeMs = bufferBefore * 60 * 1000;
      const bufferAfterMs = bufferAfter * 60 * 1000;

      const adjustedStart = new Date(bookingStart.getTime() - bufferBeforeMs);
      const existingEndWithBuffer = new Date(existingEnd.getTime() + bufferAfterMs);

      return adjustedStart < existingEndWithBuffer;
    };

    it("should detect conflict with buffer time", () => {
      const bookingStart = new Date("2024-01-15T11:00:00Z");
      const bookingEnd = new Date("2024-01-15T12:00:00Z");
      const existingEnd = new Date("2024-01-15T10:45:00Z");

      expect(hasBufferConflict(bookingStart, bookingEnd, existingEnd, 15, 15)).toBe(true);
    });

    it("should allow booking with sufficient buffer", () => {
      const bookingStart = new Date("2024-01-15T11:30:00Z");
      const bookingEnd = new Date("2024-01-15T12:30:00Z");
      const existingEnd = new Date("2024-01-15T11:00:00Z");

      expect(hasBufferConflict(bookingStart, bookingEnd, existingEnd, 15, 15)).toBe(false);
    });

    it("should handle zero buffer times", () => {
      const bookingStart = new Date("2024-01-15T11:00:00Z");
      const bookingEnd = new Date("2024-01-15T12:00:00Z");
      const existingEnd = new Date("2024-01-15T11:00:00Z");

      expect(hasBufferConflict(bookingStart, bookingEnd, existingEnd, 0, 0)).toBe(false);
    });
  });

  describe("Recurring Booking Validation", () => {
    interface RecurringConfig {
      frequency: "DAILY" | "WEEKLY" | "MONTHLY";
      interval: number;
      count: number;
    }

    const isValidRecurringConfig = (config: RecurringConfig): boolean => {
      const maxCounts: Record<string, number> = {
        DAILY: 365,
        WEEKLY: 52,
        MONTHLY: 12,
      };

      return (
        config.interval > 0 &&
        config.interval <= 12 &&
        config.count > 0 &&
        config.count <= maxCounts[config.frequency]
      );
    };

    it("should validate correct weekly recurring config", () => {
      const config: RecurringConfig = {
        frequency: "WEEKLY",
        interval: 1,
        count: 10,
      };
      expect(isValidRecurringConfig(config)).toBe(true);
    });

    it("should validate correct monthly recurring config", () => {
      const config: RecurringConfig = {
        frequency: "MONTHLY",
        interval: 1,
        count: 6,
      };
      expect(isValidRecurringConfig(config)).toBe(true);
    });

    it("should reject zero interval", () => {
      const config: RecurringConfig = {
        frequency: "WEEKLY",
        interval: 0,
        count: 10,
      };
      expect(isValidRecurringConfig(config)).toBe(false);
    });

    it("should reject excessive count for weekly", () => {
      const config: RecurringConfig = {
        frequency: "WEEKLY",
        interval: 1,
        count: 100,
      };
      expect(isValidRecurringConfig(config)).toBe(false);
    });

    it("should reject excessive count for monthly", () => {
      const config: RecurringConfig = {
        frequency: "MONTHLY",
        interval: 1,
        count: 24,
      };
      expect(isValidRecurringConfig(config)).toBe(false);
    });

    it("should accept max valid count for daily", () => {
      const config: RecurringConfig = {
        frequency: "DAILY",
        interval: 1,
        count: 365,
      };
      expect(isValidRecurringConfig(config)).toBe(true);
    });
  });
});

describe("Guest Management", () => {
  const MAX_GUESTS = 10;

  const isValidGuestList = (guests: string[]): { valid: boolean; error?: string } => {
    if (guests.length > MAX_GUESTS) {
      return { valid: false, error: `Maximum ${MAX_GUESTS} guests allowed` };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = guests.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      return { valid: false, error: `Invalid email(s): ${invalidEmails.join(", ")}` };
    }

    const uniqueGuests = new Set(guests.map((e) => e.toLowerCase()));
    if (uniqueGuests.size !== guests.length) {
      return { valid: false, error: "Duplicate emails found" };
    }

    return { valid: true };
  };

  it("should validate correct guest list", () => {
    const guests = ["guest1@example.com", "guest2@example.com"];
    expect(isValidGuestList(guests).valid).toBe(true);
  });

  it("should reject too many guests", () => {
    const guests = Array.from({ length: 15 }, (_, i) => `guest${i}@example.com`);
    const result = isValidGuestList(guests);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Maximum");
  });

  it("should reject invalid email in guest list", () => {
    const guests = ["valid@example.com", "invalid-email"];
    const result = isValidGuestList(guests);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid email");
  });

  it("should reject duplicate emails", () => {
    const guests = ["guest@example.com", "GUEST@example.com"];
    const result = isValidGuestList(guests);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Duplicate");
  });

  it("should accept empty guest list", () => {
    expect(isValidGuestList([]).valid).toBe(true);
  });

  it("should accept max allowed guests", () => {
    const guests = Array.from({ length: MAX_GUESTS }, (_, i) => `guest${i}@example.com`);
    expect(isValidGuestList(guests).valid).toBe(true);
  });
});
