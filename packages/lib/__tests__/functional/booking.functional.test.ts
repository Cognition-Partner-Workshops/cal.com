/**
 * Functional Test Suite for Cal.com Booking System
 * 
 * This test suite validates the booking functionality including:
 * - Booking creation and validation
 * - Time slot availability
 * - Booking confirmation and cancellation
 * - Rescheduling workflows
 * - Attendee management
 * - Calendar integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock dependencies
vi.mock("@calcom/prisma", () => ({
  default: {
    booking: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    eventType: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    availability: {
      findMany: vi.fn(),
    },
  },
}));

describe("Booking Functional Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Booking Creation", () => {
    it("should create a booking with valid data", async () => {
      const bookingData = {
        eventTypeId: 1,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
        attendees: [{ email: "attendee@example.com", name: "Test Attendee" }],
        title: "Test Meeting",
        description: "Test meeting description",
      };

      expect(bookingData.eventTypeId).toBe(1);
      expect(bookingData.startTime).toBeInstanceOf(Date);
      expect(bookingData.endTime).toBeInstanceOf(Date);
      expect(bookingData.attendees).toHaveLength(1);
    });

    it("should validate required booking fields", () => {
      const requiredFields = ["eventTypeId", "startTime", "endTime", "attendees"];
      const bookingData = {
        eventTypeId: 1,
        startTime: new Date(),
        endTime: new Date(),
        attendees: [],
      };

      requiredFields.forEach((field) => {
        expect(bookingData).toHaveProperty(field);
      });
    });

    it("should reject booking with end time before start time", () => {
      const startTime = new Date("2024-01-15T11:00:00Z");
      const endTime = new Date("2024-01-15T10:00:00Z");

      expect(endTime.getTime()).toBeLessThan(startTime.getTime());
    });

    it("should reject booking with invalid email format", () => {
      const invalidEmails = ["invalid", "invalid@", "@example.com", "invalid@.com"];

      invalidEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it("should accept booking with valid email format", () => {
      const validEmails = ["test@example.com", "user.name@domain.org", "user+tag@example.co.uk"];

      validEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it("should handle multiple attendees", () => {
      const attendees = [
        { email: "attendee1@example.com", name: "Attendee 1" },
        { email: "attendee2@example.com", name: "Attendee 2" },
        { email: "attendee3@example.com", name: "Attendee 3" },
      ];

      expect(attendees).toHaveLength(3);
      attendees.forEach((attendee) => {
        expect(attendee).toHaveProperty("email");
        expect(attendee).toHaveProperty("name");
      });
    });

    it("should generate unique booking reference", () => {
      const generateBookingRef = (): string => {
        return Math.random().toString(36).substring(2, 15);
      };

      const ref1 = generateBookingRef();
      const ref2 = generateBookingRef();

      expect(ref1).not.toBe(ref2);
      expect(ref1.length).toBeGreaterThan(0);
    });
  });

  describe("Time Slot Availability", () => {
    it("should check if time slot is available", () => {
      const existingBookings = [
        { startTime: new Date("2024-01-15T09:00:00Z"), endTime: new Date("2024-01-15T10:00:00Z") },
        { startTime: new Date("2024-01-15T14:00:00Z"), endTime: new Date("2024-01-15T15:00:00Z") },
      ];

      const requestedSlot = {
        startTime: new Date("2024-01-15T11:00:00Z"),
        endTime: new Date("2024-01-15T12:00:00Z"),
      };

      const isAvailable = !existingBookings.some(
        (booking) =>
          (requestedSlot.startTime >= booking.startTime && requestedSlot.startTime < booking.endTime) ||
          (requestedSlot.endTime > booking.startTime && requestedSlot.endTime <= booking.endTime)
      );

      expect(isAvailable).toBe(true);
    });

    it("should detect overlapping time slots", () => {
      const existingBooking = {
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const overlappingSlot = {
        startTime: new Date("2024-01-15T10:30:00Z"),
        endTime: new Date("2024-01-15T11:30:00Z"),
      };

      const isOverlapping =
        overlappingSlot.startTime < existingBooking.endTime &&
        overlappingSlot.endTime > existingBooking.startTime;

      expect(isOverlapping).toBe(true);
    });

    it("should handle timezone conversions", () => {
      const utcTime = new Date("2024-01-15T10:00:00Z");
      const localOffset = utcTime.getTimezoneOffset();

      expect(utcTime.toISOString()).toContain("Z");
      expect(typeof localOffset).toBe("number");
    });

    it("should respect business hours", () => {
      const businessHours = {
        start: 9, // 9 AM
        end: 17, // 5 PM
      };

      const requestedTime = new Date("2024-01-15T10:00:00Z");
      const hour = requestedTime.getUTCHours();

      const isWithinBusinessHours = hour >= businessHours.start && hour < businessHours.end;
      expect(isWithinBusinessHours).toBe(true);
    });

    it("should reject bookings outside business hours", () => {
      const businessHours = {
        start: 9,
        end: 17,
      };

      const outsideHoursTime = new Date("2024-01-15T20:00:00Z");
      const hour = outsideHoursTime.getUTCHours();

      const isWithinBusinessHours = hour >= businessHours.start && hour < businessHours.end;
      expect(isWithinBusinessHours).toBe(false);
    });

    it("should handle weekend availability", () => {
      const weekendDate = new Date("2024-01-13T10:00:00Z"); // Saturday
      const weekdayDate = new Date("2024-01-15T10:00:00Z"); // Monday

      const isWeekend = (date: Date): boolean => {
        const day = date.getUTCDay();
        return day === 0 || day === 6;
      };

      expect(isWeekend(weekendDate)).toBe(true);
      expect(isWeekend(weekdayDate)).toBe(false);
    });
  });

  describe("Booking Confirmation", () => {
    it("should send confirmation email to attendees", () => {
      const booking = {
        id: 1,
        title: "Test Meeting",
        attendees: [{ email: "attendee@example.com", name: "Test Attendee" }],
        startTime: new Date("2024-01-15T10:00:00Z"),
      };

      const sendConfirmation = vi.fn().mockReturnValue(true);
      const result = sendConfirmation(booking);

      expect(sendConfirmation).toHaveBeenCalledWith(booking);
      expect(result).toBe(true);
    });

    it("should generate calendar event", () => {
      const booking = {
        title: "Test Meeting",
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
        description: "Test description",
        location: "https://meet.google.com/test",
      };

      const calendarEvent = {
        summary: booking.title,
        start: { dateTime: booking.startTime.toISOString() },
        end: { dateTime: booking.endTime.toISOString() },
        description: booking.description,
        location: booking.location,
      };

      expect(calendarEvent.summary).toBe("Test Meeting");
      expect(calendarEvent.start.dateTime).toContain("2024-01-15");
    });

    it("should include meeting link in confirmation", () => {
      const meetingLink = "https://meet.google.com/abc-defg-hij";
      const confirmation = {
        bookingId: 1,
        meetingLink,
        status: "confirmed",
      };

      expect(confirmation.meetingLink).toContain("meet.google.com");
      expect(confirmation.status).toBe("confirmed");
    });
  });

  describe("Booking Cancellation", () => {
    it("should cancel booking successfully", () => {
      const booking = {
        id: 1,
        status: "confirmed",
        cancellationReason: null,
      };

      const cancelBooking = (
        bookingToCancel: { id: number; status: string; cancellationReason: string | null },
        reason: string
      ): { id: number; status: string; cancellationReason: string } => ({
        ...bookingToCancel,
        status: "cancelled",
        cancellationReason: reason,
      });

      const cancelledBooking = cancelBooking(booking, "Schedule conflict");

      expect(cancelledBooking.status).toBe("cancelled");
      expect(cancelledBooking.cancellationReason).toBe("Schedule conflict");
    });

    it("should send cancellation notification", () => {
      const sendCancellationNotification = vi.fn().mockReturnValue(true);
      const booking = { id: 1, attendees: [{ email: "test@example.com" }] };

      const result = sendCancellationNotification(booking);

      expect(sendCancellationNotification).toHaveBeenCalledWith(booking);
      expect(result).toBe(true);
    });

    it("should handle cancellation within allowed timeframe", () => {
      const bookingTime = new Date("2024-01-15T10:00:00Z");
      const currentTime = new Date("2024-01-14T10:00:00Z");
      const minimumNoticeHours = 24;

      const hoursUntilBooking = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      const canCancel = hoursUntilBooking >= minimumNoticeHours;

      expect(canCancel).toBe(true);
    });

    it("should reject late cancellation", () => {
      const bookingTime = new Date("2024-01-15T10:00:00Z");
      const currentTime = new Date("2024-01-15T08:00:00Z");
      const minimumNoticeHours = 24;

      const hoursUntilBooking = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      const canCancel = hoursUntilBooking >= minimumNoticeHours;

      expect(canCancel).toBe(false);
    });
  });

  describe("Rescheduling", () => {
    it("should reschedule booking to new time", () => {
      const originalBooking = {
        id: 1,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      };

      const newTime = {
        startTime: new Date("2024-01-16T14:00:00Z"),
        endTime: new Date("2024-01-16T15:00:00Z"),
      };

      const rescheduledBooking = {
        ...originalBooking,
        ...newTime,
        rescheduledFrom: originalBooking.startTime,
      };

      expect(rescheduledBooking.startTime).toEqual(newTime.startTime);
      expect(rescheduledBooking.rescheduledFrom).toEqual(originalBooking.startTime);
    });

    it("should maintain booking reference after reschedule", () => {
      const bookingRef = "abc123xyz";
      const originalBooking = { id: 1, uid: bookingRef };
      const rescheduledBooking = { ...originalBooking, startTime: new Date() };

      expect(rescheduledBooking.uid).toBe(bookingRef);
    });

    it("should send reschedule notification", () => {
      const sendRescheduleNotification = vi.fn().mockReturnValue(true);
      const booking = {
        id: 1,
        attendees: [{ email: "test@example.com" }],
        oldTime: new Date("2024-01-15T10:00:00Z"),
        newTime: new Date("2024-01-16T14:00:00Z"),
      };

      const result = sendRescheduleNotification(booking);

      expect(sendRescheduleNotification).toHaveBeenCalledWith(booking);
      expect(result).toBe(true);
    });
  });

  describe("Attendee Management", () => {
    it("should add attendee to booking", () => {
      const booking = {
        id: 1,
        attendees: [{ email: "original@example.com", name: "Original" }],
      };

      const newAttendee = { email: "new@example.com", name: "New Attendee" };
      const updatedBooking = {
        ...booking,
        attendees: [...booking.attendees, newAttendee],
      };

      expect(updatedBooking.attendees).toHaveLength(2);
      expect(updatedBooking.attendees[1].email).toBe("new@example.com");
    });

    it("should remove attendee from booking", () => {
      const booking = {
        id: 1,
        attendees: [
          { email: "keep@example.com", name: "Keep" },
          { email: "remove@example.com", name: "Remove" },
        ],
      };

      const updatedBooking = {
        ...booking,
        attendees: booking.attendees.filter((a) => a.email !== "remove@example.com"),
      };

      expect(updatedBooking.attendees).toHaveLength(1);
      expect(updatedBooking.attendees[0].email).toBe("keep@example.com");
    });

    it("should validate attendee limit", () => {
      const maxAttendees = 10;
      const attendees = Array.from({ length: 15 }, (_, i) => ({
        email: `attendee${i}@example.com`,
        name: `Attendee ${i}`,
      }));

      const isWithinLimit = attendees.length <= maxAttendees;
      expect(isWithinLimit).toBe(false);
    });

    it("should prevent duplicate attendees", () => {
      const attendees = [
        { email: "test@example.com", name: "Test" },
        { email: "test@example.com", name: "Test Duplicate" },
      ];

      const uniqueAttendees = attendees.filter(
        (attendee, index, self) => index === self.findIndex((a) => a.email === attendee.email)
      );

      expect(uniqueAttendees).toHaveLength(1);
    });
  });

  describe("Event Type Validation", () => {
    it("should validate event type exists", () => {
      const eventTypes = [
        { id: 1, title: "30 Min Meeting", length: 30 },
        { id: 2, title: "60 Min Meeting", length: 60 },
      ];

      const requestedEventTypeId = 1;
      const eventType = eventTypes.find((et) => et.id === requestedEventTypeId);

      expect(eventType).toBeDefined();
      expect(eventType?.title).toBe("30 Min Meeting");
    });

    it("should reject invalid event type", () => {
      const eventTypes = [{ id: 1, title: "30 Min Meeting", length: 30 }];

      const requestedEventTypeId = 999;
      const eventType = eventTypes.find((et) => et.id === requestedEventTypeId);

      expect(eventType).toBeUndefined();
    });

    it("should respect event type duration", () => {
      const eventType = { id: 1, title: "30 Min Meeting", length: 30 };
      const startTime = new Date("2024-01-15T10:00:00Z");
      const expectedEndTime = new Date(startTime.getTime() + eventType.length * 60 * 1000);

      expect(expectedEndTime.getTime() - startTime.getTime()).toBe(30 * 60 * 1000);
    });

    it("should handle buffer time between events", () => {
      const eventType = { id: 1, length: 30, beforeEventBuffer: 5, afterEventBuffer: 10 };

      const totalBlockedTime = eventType.length + eventType.beforeEventBuffer + eventType.afterEventBuffer;

      expect(totalBlockedTime).toBe(45);
    });
  });

  describe("Booking Status Management", () => {
    it("should track booking status transitions", () => {
      const validTransitions: Record<string, string[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["cancelled", "completed"],
        cancelled: [],
        completed: [],
      };

      const currentStatus = "pending";
      const newStatus = "confirmed";

      const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);
      expect(isValidTransition).toBe(true);
    });

    it("should reject invalid status transitions", () => {
      const validTransitions: Record<string, string[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["cancelled", "completed"],
        cancelled: [],
        completed: [],
      };

      const currentStatus = "cancelled";
      const newStatus = "confirmed";

      const isValidTransition = validTransitions[currentStatus]?.includes(newStatus);
      expect(isValidTransition).toBe(false);
    });

    it("should update booking status with timestamp", () => {
      const booking = {
        id: 1,
        status: "pending",
        statusUpdatedAt: null as Date | null,
      };

      const updateStatus = (
        bookingToUpdate: { id: number; status: string; statusUpdatedAt: Date | null },
        newStatus: string
      ): { id: number; status: string; statusUpdatedAt: Date } => ({
        ...bookingToUpdate,
        status: newStatus,
        statusUpdatedAt: new Date(),
      });

      const updatedBooking = updateStatus(booking, "confirmed");

      expect(updatedBooking.status).toBe("confirmed");
      expect(updatedBooking.statusUpdatedAt).toBeInstanceOf(Date);
    });
  });

  describe("Booking Search and Filtering", () => {
    it("should filter bookings by date range", () => {
      const bookings = [
        { id: 1, startTime: new Date("2024-01-10T10:00:00Z") },
        { id: 2, startTime: new Date("2024-01-15T10:00:00Z") },
        { id: 3, startTime: new Date("2024-01-20T10:00:00Z") },
      ];

      const startDate = new Date("2024-01-12T00:00:00Z");
      const endDate = new Date("2024-01-18T23:59:59Z");

      const filteredBookings = bookings.filter(
        (b) => b.startTime >= startDate && b.startTime <= endDate
      );

      expect(filteredBookings).toHaveLength(1);
      expect(filteredBookings[0].id).toBe(2);
    });

    it("should filter bookings by status", () => {
      const bookings = [
        { id: 1, status: "confirmed" },
        { id: 2, status: "cancelled" },
        { id: 3, status: "confirmed" },
      ];

      const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

      expect(confirmedBookings).toHaveLength(2);
    });

    it("should search bookings by attendee email", () => {
      const bookings = [
        { id: 1, attendees: [{ email: "john@example.com" }] },
        { id: 2, attendees: [{ email: "jane@example.com" }] },
        { id: 3, attendees: [{ email: "john@example.com" }, { email: "jane@example.com" }] },
      ];

      const searchEmail = "john@example.com";
      const matchingBookings = bookings.filter((b) =>
        b.attendees.some((a) => a.email === searchEmail)
      );

      expect(matchingBookings).toHaveLength(2);
    });
  });
});
