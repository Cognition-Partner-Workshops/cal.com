/**
 * Error Code Validation Tests for API Endpoints
 * These tests verify that API endpoints return correct HTTP status codes and error codes
 */

import dayjs from "@calcom/dayjs";
import { getEventTypesFromDB } from "@calcom/features/bookings/lib/handleNewBooking/getEventTypesFromDB";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { prisma } from "@calcom/prisma";
import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { beforeEach, describe, expect, test, vi } from "vitest";

import bookingsPostHandler from "../../pages/api/bookings/_post";

vi.mock("@calcom/features/bookings/lib/handleNewBooking/getEventTypesFromDB", () => ({
  getEventTypesFromDB: vi.fn(),
}));

vi.mock("@calcom/features/webhooks/lib/sendOrSchedulePayload", () => ({
  default: vi.fn().mockResolvedValue({}),
}));

const mockFindOriginalRescheduledBooking: ReturnType<typeof vi.fn> = vi.fn();
vi.mock("@calcom/features/bookings/repositories/BookingRepository", () => ({
  BookingRepository: vi.fn().mockImplementation(function () {
    return {
      findOriginalRescheduledBooking: mockFindOriginalRescheduledBooking,
    };
  }),
}));

vi.mock("@calcom/features/watchlist/operations/check-if-users-are-blocked.controller", () => ({
  checkIfUsersAreBlocked: vi.fn().mockResolvedValue(false),
}));

vi.mock("@calcom/features/di/containers/QualifiedHosts", () => ({
  getQualifiedHostsService: vi.fn().mockReturnValue({
    findQualifiedHostsWithDelegationCredentials: vi.fn().mockResolvedValue({
      qualifiedRRHosts: [],
      allFallbackRRHosts: [],
      fixedHosts: [],
    }),
  }),
}));

vi.mock("@calcom/features/bookings/lib/EventManager", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      reschedule: vi.fn().mockResolvedValue({
        results: [],
        referencesToCreate: [],
      }),
      create: vi.fn().mockResolvedValue({
        results: [],
        referencesToCreate: [],
      }),
      update: vi.fn().mockResolvedValue({
        results: [],
        referencesToCreate: [],
      }),
      createAllCalendarEvents: vi.fn().mockResolvedValue([]),
      updateAllCalendarEvents: vi.fn().mockResolvedValue([]),
      deleteEventsAndMeetings: vi.fn().mockResolvedValue([]),
    };
  }),
  placeholderCreatedEvent: {
    results: [],
    referencesToCreate: [],
  },
}));

vi.mock("@calcom/lib/availability", () => ({
  getUserAvailability: vi.fn().mockResolvedValue([
    {
      start: new Date("1970-01-01T09:00:00.000Z"),
      end: new Date("1970-01-01T17:00:00.000Z"),
    },
  ]),
  getAvailableSlots: vi.fn().mockResolvedValue([
    {
      time: new Date().toISOString(),
      attendees: 1,
      bookingUid: null,
      users: [2],
    },
  ]),
}));

vi.mock("@calcom/features/bookings/lib/handleNewBooking/ensureAvailableUsers", () => ({
  ensureAvailableUsers: vi.fn().mockImplementation(async (eventType) => {
    return eventType.users || [{ id: 2, email: "test@example.com", name: "Test User", isFixed: false }];
  }),
}));

vi.mock("@calcom/features/profile/repositories/ProfileRepository", () => ({
  ProfileRepository: {
    findManyForUser: vi.fn().mockResolvedValue([]),
    buildPersonalProfileFromUser: vi.fn().mockReturnValue({
      id: null,
      upId: "usr-2",
      username: "test-user",
      organizationId: null,
      organization: null,
    }),
  },
}));

vi.mock("@calcom/features/flags/features.repository", () => ({
  FeaturesRepository: vi.fn().mockImplementation(function () {
    return {
      checkIfFeatureIsEnabledGlobally: vi.fn().mockResolvedValue(false),
      checkIfTeamHasFeature: vi.fn().mockResolvedValue(false),
    };
  }),
}));

vi.mock("@calcom/features/webhooks/lib/getWebhooks", () => ({
  default: vi.fn().mockResolvedValue([]),
}));

vi.mock("@calcom/features/ee/workflows/lib/getAllWorkflows", () => ({
  getAllWorkflows: vi.fn().mockResolvedValue([]),
  workflowSelect: {},
}));

vi.mock("@calcom/features/ee/workflows/lib/getAllWorkflowsFromEventType", () => ({
  getAllWorkflowsFromEventType: vi.fn().mockResolvedValue([]),
}));

vi.mock("@calcom/lib/server/i18n", () => {
  const mockT = (key: string, options?: Record<string, unknown>): string => {
    if (key === "event_between_users") {
      return `${options?.eventName} between ${options?.host} and ${options?.attendeeName}`;
    }
    if (key === "scheduler") {
      return "Scheduler";
    }
    if (key === "google_meet_warning") {
      return "Google Meet warning";
    }
    return key;
  };

  return {
    getTranslation: vi.fn().mockResolvedValue(mockT),
    t: mockT,
  };
});

type CustomNextApiRequest = NextApiRequest & Request;
type CustomNextApiResponse = NextApiResponse & Response;

describe("API Error Code Validation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindOriginalRescheduledBooking.mockResolvedValue(null);
  });

  describe("ErrorCode.RequestBodyInvalid validation", () => {
    test("should return 400 status with RequestBodyInvalid error code for missing required data", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.RequestBodyInvalid)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: 2,
        },
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.RequestBodyInvalid,
        })
      );
    });

    test("should return 400 status for empty request body", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.RequestBodyInvalid)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {},
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe("ErrorCode.EventTypeNotFound validation", () => {
    test("should return 400 status with EventTypeNotFound error code for invalid event type", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.EventTypeNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 999999,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.EventTypeNotFound,
        })
      );
    });

    test("should return 400 status for zero event type ID", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.EventTypeNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 0,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });

    test("should return 400 status for negative event type ID", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.EventTypeNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: -1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe("ErrorCode.BookingNotFound validation", () => {
    test("should return 404 status with BookingNotFound error code for invalid reschedule UID", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookingNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
          rescheduleUid: "non-existent-uid",
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.BookingNotFound,
        })
      );
    });
  });

  describe("ErrorCode.NoAvailableUsersFound validation", () => {
    test("should return 400 status with NoAvailableUsersFound error code", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.NoAvailableUsersFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.NoAvailableUsersFound,
        })
      );
    });
  });

  describe("ErrorCode.BookerLimitExceeded validation", () => {
    test("should return 400 status with BookerLimitExceeded error code", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookerLimitExceeded)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
          email: "booker@example.com",
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.BookerLimitExceeded,
        })
      );
    });
  });

  describe("ErrorCode.BookingTimeOutOfBounds validation", () => {
    test("should return 400 status with BookingTimeOutOfBounds error code", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookingTimeOutOfBounds)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().subtract(1, "day").toDate(),
          endTime: dayjs().subtract(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.BookingTimeOutOfBounds,
        })
      );
    });
  });

  describe("ErrorCode.BookingConflict validation", () => {
    test("should return 409 status with BookingConflict error code", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookingConflict)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(409);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.BookingConflict,
        })
      );
    });
  });

  describe("ErrorCode.CancelledBookingsCannotBeRescheduled validation", () => {
    test("should return 400 status with CancelledBookingsCannotBeRescheduled error code", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.CancelledBookingsCannotBeRescheduled)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
          rescheduleUid: "cancelled-booking-uid",
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: ErrorCode.CancelledBookingsCannotBeRescheduled,
        })
      );
    });
  });

  describe("ErrorCode.BookerEmailBlocked validation", () => {
    test("should return 500 status with BookerEmailBlocked error code (unhandled error)", async () => {
      // Note: BookerEmailBlocked is not explicitly handled in the API error handler,
      // so it returns 500 as an internal server error
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookerEmailBlocked)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
          email: "blocked@example.com",
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
    });
  });

  describe("ErrorCode.InvalidVerificationCode validation", () => {
    test("should return 500 status with InvalidVerificationCode error code (unhandled error)", async () => {
      // Note: InvalidVerificationCode is not explicitly handled in the API error handler,
      // so it returns 500 as an internal server error
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.InvalidVerificationCode)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
          verificationCode: "invalid-code",
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
    });
  });

  describe("Event Type ID Type Validation", () => {
    test("should return 400 status for string eventTypeId", async () => {
      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: "invalid-string",
        },
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(
        expect.objectContaining({
          message: "Bad request, eventTypeId must be a number",
        })
      );
    });

    test("should return 400 status for null eventTypeId", async () => {
      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: null,
        },
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });

    test("should return 400 status for undefined eventTypeId", async () => {
      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          title: "test",
        },
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });

    test("should return 400 status for float eventTypeId", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.EventTypeNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: 1.5,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe("HTTP Status Code Consistency", () => {
    test("should consistently return 400 for validation errors", async () => {
      // These error codes consistently return 400 status
      const validationErrors = [
        ErrorCode.RequestBodyInvalid,
        ErrorCode.EventTypeNotFound,
        ErrorCode.NoAvailableUsersFound,
        ErrorCode.BookerLimitExceeded,
        ErrorCode.BookingTimeOutOfBounds,
        ErrorCode.CancelledBookingsCannotBeRescheduled,
      ];

      for (const errorCode of validationErrors) {
        (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(new Error(errorCode));

        const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
          method: "POST",
          body: {
            eventTypeId: 1,
            startTime: dayjs().add(1, "day").toDate(),
            endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
          },
          prisma,
        });

        await bookingsPostHandler(req, res);

        expect(res._getStatusCode()).toBe(400);
      }
    });

    test("should return 404 for not found errors", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookingNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
    });

    test("should return 409 for conflict errors", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.BookingConflict)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: 1,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      expect(res._getStatusCode()).toBe(409);
    });
  });

  describe("Error Response Format Validation", () => {
    test("should return error response with message property", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.EventTypeNotFound)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {
          eventTypeId: 999,
          startTime: dayjs().add(1, "day").toDate(),
          endTime: dayjs().add(1, "day").add(15, "minutes").toDate(),
        },
        prisma,
      });

      await bookingsPostHandler(req, res);

      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty("message");
      expect(typeof responseData.message).toBe("string");
    });

    test("should return valid JSON response for errors", async () => {
      (getEventTypesFromDB as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(ErrorCode.RequestBodyInvalid)
      );

      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "POST",
        body: {},
      });

      await bookingsPostHandler(req, res);

      expect(() => JSON.parse(res._getData())).not.toThrow();
    });
  });
});
