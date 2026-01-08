/**
 * Negative and Edge Test Cases for Core Booking & Scheduling
 * These tests verify error handling and edge cases in the booking creation flow
 */

import { BookingStatus } from "@calcom/prisma/enums";
import { test } from "@calcom/web/test/fixtures/fixtures";
import {
  createBookingScenario,
  getBooker,
  getGoogleCalendarCredential,
  getOrganizer,
  getScenarioData,
  mockCalendarToHaveNoBusySlots,
  TestData,
} from "@calcom/web/test/utils/bookingScenario/bookingScenario";
import { getMockRequestDataForBooking } from "@calcom/web/test/utils/bookingScenario/getMockRequestDataForBooking";
import { setupAndTeardown } from "@calcom/web/test/utils/bookingScenario/setupAndTeardown";
import { afterEach, beforeEach, describe, expect, vi } from "vitest";

import { getNewBookingHandler } from "./getNewBookingHandler";

vi.mock("@calcom/features/auth/lib/verifyCodeUnAuthenticated", () => ({
  verifyCodeUnAuthenticated: vi.fn(),
}));

const { mockFindManyByEmailsWithEmailVerificationSettings }: { mockFindManyByEmailsWithEmailVerificationSettings: ReturnType<typeof vi.fn> } = vi.hoisted(() => ({
  mockFindManyByEmailsWithEmailVerificationSettings: vi.fn(),
}));

vi.mock("@calcom/features/users/repositories/UserRepository", async (importOriginal) => {
  const actual = await importOriginal();
  const OriginalUserRepository = (actual as Record<string, unknown>).UserRepository as new (
    prisma: unknown
  ) => unknown;

  return {
    ...actual,
    UserRepository: vi.fn(function (prisma) {
      const realInstance = new OriginalUserRepository(prisma);
      (realInstance as Record<string, unknown>).findManyByEmailsWithEmailVerificationSettings =
        mockFindManyByEmailsWithEmailVerificationSettings;
      return realInstance;
    }),
  };
});

beforeEach(() => {
  mockFindManyByEmailsWithEmailVerificationSettings.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Booking Negative and Edge Case Specifications", () => {
  setupAndTeardown();

  describe("Invalid Event Type Scenarios", () => {
    test("should reject booking with non-existent event type ID", async () => {
      const handleNewBooking = getNewBookingHandler();

      const booker = getBooker({
        email: "booker@example.com",
        name: "Booker",
      });

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 99999,
          responses: {
            email: booker.email,
            name: booker.name,
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });

    test("should reject booking with zero event type ID", async () => {
      const handleNewBooking = getNewBookingHandler();

      const booker = getBooker({
        email: "booker@example.com",
        name: "Booker",
      });

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 0,
          responses: {
            email: booker.email,
            name: booker.name,
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });

    test("should reject booking with negative event type ID", async () => {
      const handleNewBooking = getNewBookingHandler();

      const booker = getBooker({
        email: "booker@example.com",
        name: "Booker",
      });

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: -1,
          responses: {
            email: booker.email,
            name: booker.name,
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });
  });

  describe("Missing Required Fields Scenarios", () => {
    test("should reject booking with missing booker email", async () => {
      const handleNewBooking = getNewBookingHandler();

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 1,
          responses: {
            email: "",
            name: "Booker",
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });

    test("should reject booking with missing booker name", async () => {
      const handleNewBooking = getNewBookingHandler();

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 1,
          responses: {
            email: "booker@example.com",
            name: "",
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });
  });

  describe("Booking Limit Edge Cases", () => {
    test("should reject booking when booker has reached maximum active bookings limit", async () => {
      vi.setSystemTime(new Date("2025-01-01"));
      const plus1DateString = "2025-01-02";

      const handleNewBooking = getNewBookingHandler();

      const booker = getBooker({
        email: "booker@example.com",
        name: "Booker",
      });

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              maxActiveBookingsPerBooker: 1,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
          bookings: [
            {
              uid: "existing-booking-1",
              eventTypeId: 1,
              userId: organizer.id,
              startTime: `${plus1DateString}T10:00:00.000Z`,
              endTime: `${plus1DateString}T10:30:00.000Z`,
              title: "Existing Booking",
              status: BookingStatus.ACCEPTED,
              attendees: [{ email: booker.email }],
            },
          ],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 1,
          responses: {
            email: booker.email,
            name: booker.name,
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow("booker_limit_exceeded_error");
    });
  });

  describe("Email Validation Edge Cases", () => {
    test("should reject booking with invalid email format", async () => {
      const handleNewBooking = getNewBookingHandler();

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 1,
          responses: {
            email: "invalid-email-format",
            name: "Booker",
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });

    test("should reject booking with email containing only spaces", async () => {
      const handleNewBooking = getNewBookingHandler();

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 1,
          responses: {
            email: "   ",
            name: "Booker",
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });
  });

  describe("Cancelled Booking Reschedule Scenarios", () => {
    test("should handle reschedule attempt of cancelled booking appropriately", async () => {
      vi.setSystemTime(new Date("2025-01-01"));
      const plus1DateString = "2025-01-02";

      const handleNewBooking = getNewBookingHandler();

      const booker = getBooker({
        email: "booker@example.com",
        name: "Booker",
      });

      const organizer = getOrganizer({
        name: "Organizer",
        email: "organizer@example.com",
        id: 101,
        schedules: [TestData.schedules.IstWorkHours],
        credentials: [getGoogleCalendarCredential()],
        selectedCalendars: [TestData.selectedCalendars.google],
      });

      await createBookingScenario(
        getScenarioData({
          eventTypes: [
            {
              id: 1,
              slotInterval: 30,
              length: 30,
              users: [{ id: 101 }],
            },
          ],
          organizer,
          apps: [TestData.apps["google-calendar"]],
          bookings: [
            {
              uid: "cancelled-booking-uid",
              eventTypeId: 1,
              userId: organizer.id,
              startTime: `${plus1DateString}T10:00:00.000Z`,
              endTime: `${plus1DateString}T10:30:00.000Z`,
              title: "Cancelled Booking",
              status: BookingStatus.CANCELLED,
              attendees: [{ email: booker.email }],
            },
          ],
        })
      );

      await mockCalendarToHaveNoBusySlots("googlecalendar", {});

      const mockBookingData = getMockRequestDataForBooking({
        data: {
          eventTypeId: 1,
          rescheduleUid: "cancelled-booking-uid",
          responses: {
            email: booker.email,
            name: booker.name,
            location: { optionValue: "", value: "New York" },
          },
        },
      });

      await expect(
        handleNewBooking({
          bookingData: mockBookingData,
        })
      ).rejects.toThrow();
    });
  });

});
