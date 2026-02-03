import process from "node:process";
import { afterEach, describe, expect, it } from "vitest";
import {
  getPiiFreeBooking,
  getPiiFreeCalendarEvent,
  getPiiFreeCredential,
  getPiiFreeDestinationCalendar,
  getPiiFreeEventType,
  getPiiFreeSelectedCalendar,
  getPiiFreeUser,
} from "./piiFreeData";

describe("piiFreeData", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe("getPiiFreeCalendarEvent", () => {
    it("returns event with safe fields and masked title in production", () => {
      process.env.NODE_ENV = "production";
      const calEvent = {
        eventTypeId: 1,
        type: "meeting",
        startTime: "2024-01-01T10:00:00Z",
        endTime: "2024-01-01T11:00:00Z",
        schedulingType: "ROUND_ROBIN" as const,
        seatsPerTimeSlot: null,
        appsStatus: [],
        recurringEvent: null,
        recurrence: null,
        requiresConfirmation: false,
        uid: "test-uid-123",
        conferenceCredentialId: 1,
        iCalUID: "ical-uid-123",
        title: "Meeting with John Doe",
      };

      const result = getPiiFreeCalendarEvent(calEvent as never);

      expect(result.eventTypeId).toBe(1);
      expect(result.type).toBe("meeting");
      expect(result.uid).toBe("test-uid-123");
      expect(result.title).toBe("PiiFree:true");
    });

    it("returns actual title in non-production environment", () => {
      process.env.NODE_ENV = "development";
      const calEvent = {
        eventTypeId: 1,
        type: "meeting",
        startTime: "2024-01-01T10:00:00Z",
        endTime: "2024-01-01T11:00:00Z",
        title: "Meeting with John Doe",
      };

      const result = getPiiFreeCalendarEvent(calEvent as never);

      expect(result.title).toBe("Meeting with John Doe");
    });
  });

  describe("getPiiFreeBooking", () => {
    it("returns booking with safe fields and masked title in production", () => {
      process.env.NODE_ENV = "production";
      const booking = {
        id: 123,
        uid: "booking-uid-456",
        userId: 1,
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T11:00:00Z"),
        title: "Booking with Jane Smith",
      };

      const result = getPiiFreeBooking(booking);

      expect(result.id).toBe(123);
      expect(result.uid).toBe("booking-uid-456");
      expect(result.userId).toBe(1);
      expect(result.title).toBe("PiiFree:true");
    });

    it("returns actual title in non-production environment", () => {
      process.env.NODE_ENV = "development";
      const booking = {
        id: 123,
        uid: "booking-uid-456",
        userId: 1,
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T11:00:00Z"),
        title: "Booking with Jane Smith",
      };

      const result = getPiiFreeBooking(booking);

      expect(result.title).toBe("Booking with Jane Smith");
    });

    it("handles null userId", () => {
      const booking = {
        id: 123,
        uid: "booking-uid-456",
        userId: null,
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T11:00:00Z"),
        title: "Booking",
      };

      const result = getPiiFreeBooking(booking);

      expect(result.userId).toBeNull();
    });
  });

  describe("getPiiFreeCredential", () => {
    it("masks key field in production", () => {
      process.env.NODE_ENV = "production";
      const credential = {
        id: 1,
        type: "google_calendar",
        key: { access_token: "secret-token" },
        delegatedTo: { id: 2 },
      };

      const result = getPiiFreeCredential(credential as never);

      expect(result.id).toBe(1);
      expect(result.type).toBe("google_calendar");
      expect(result.key).toBe("PiiFree:true");
      expect(result.delegatedTo).toBe(true);
    });

    it("returns actual key in non-production environment", () => {
      process.env.NODE_ENV = "development";
      const credential = {
        id: 1,
        type: "google_calendar",
        key: { access_token: "secret-token" },
      };

      const result = getPiiFreeCredential(credential as never);

      expect(result.key).toEqual({ access_token: "secret-token" });
    });

    it("handles missing delegatedTo", () => {
      const credential = {
        id: 1,
        type: "google_calendar",
        key: null,
      };

      const result = getPiiFreeCredential(credential as never);

      expect(result.delegatedTo).toBe(false);
    });
  });

  describe("getPiiFreeSelectedCalendar", () => {
    it("returns truncated externalId", () => {
      const selectedCalendar = {
        integration: "google_calendar",
        userId: 1,
        externalId: "user@example.com",
        credentialId: 123,
      };

      const result = getPiiFreeSelectedCalendar(selectedCalendar);

      expect(result.integration).toBe("google_calendar");
      expect(result.userId).toBe(1);
      expect(result.externalId).toBe("use");
      expect(result.credentialId).toBe(true);
    });

    it("handles undefined externalId", () => {
      const selectedCalendar = {
        integration: "google_calendar",
        userId: 1,
      };

      const result = getPiiFreeSelectedCalendar(selectedCalendar);

      expect(result.externalId).toBeUndefined();
    });

    it("handles short externalId", () => {
      const selectedCalendar = {
        integration: "google_calendar",
        userId: 1,
        externalId: "ab",
      };

      const result = getPiiFreeSelectedCalendar(selectedCalendar);

      expect(result.externalId).toBe("ab");
    });
  });

  describe("getPiiFreeDestinationCalendar", () => {
    it("masks externalId in production", () => {
      process.env.NODE_ENV = "production";
      const destinationCalendar = {
        integration: "google_calendar",
        userId: 1,
        credentialId: 123,
        externalId: "calendar@example.com",
      };

      const result = getPiiFreeDestinationCalendar(destinationCalendar);

      expect(result.integration).toBe("google_calendar");
      expect(result.userId).toBe(1);
      expect(result.credentialId).toBe(123);
      expect(result.externalId).toBe("PiiFree:true");
    });

    it("returns actual externalId in non-production environment", () => {
      process.env.NODE_ENV = "development";
      const destinationCalendar = {
        integration: "google_calendar",
        userId: 1,
        credentialId: 123,
        externalId: "calendar@example.com",
      };

      const result = getPiiFreeDestinationCalendar(destinationCalendar);

      expect(result.externalId).toBe("calendar@example.com");
    });
  });

  describe("getPiiFreeEventType", () => {
    it("returns only safe event type fields", () => {
      const eventType = {
        id: 1,
        schedulingType: "ROUND_ROBIN" as const,
        seatsPerTimeSlot: 5,
      };

      const result = getPiiFreeEventType(eventType);

      expect(result).toEqual({
        id: 1,
        schedulingType: "ROUND_ROBIN",
        seatsPerTimeSlot: 5,
      });
    });

    it("handles null seatsPerTimeSlot", () => {
      const eventType = {
        id: 1,
        schedulingType: null,
        seatsPerTimeSlot: null,
      };

      const result = getPiiFreeEventType(eventType);

      expect(result.seatsPerTimeSlot).toBeNull();
    });
  });

  describe("getPiiFreeUser", () => {
    it("returns user with safe fields", () => {
      process.env.NODE_ENV = "development";
      const user = {
        id: 1,
        username: "testuser",
        isFixed: true,
        timeZone: "America/New_York",
        allowDynamicBooking: true,
        defaultScheduleId: 1,
        organizationId: null,
      };

      const result = getPiiFreeUser(user);

      expect(result.id).toBe(1);
      expect(result.username).toBe("testuser");
      expect(result.isFixed).toBe(true);
      expect(result.timeZone).toBe("America/New_York");
      expect(result.allowDynamicBooking).toBe(true);
      expect(result.defaultScheduleId).toBe(1);
      expect(result.organizationId).toBeNull();
    });

    it("processes credentials array", () => {
      process.env.NODE_ENV = "production";
      const user = {
        id: 1,
        credentials: [
          { id: 1, type: "google_calendar", key: { token: "secret" } },
          { id: 2, type: "zoom", key: { token: "secret2" } },
        ],
      };

      const result = getPiiFreeUser(user as never);

      expect(result.credentials).toHaveLength(2);
      expect(result.credentials?.[0].key).toBe("PiiFree:true");
      expect(result.credentials?.[1].key).toBe("PiiFree:true");
    });

    it("processes destinationCalendar", () => {
      process.env.NODE_ENV = "production";
      const user = {
        id: 1,
        destinationCalendar: {
          integration: "google_calendar",
          userId: 1,
          credentialId: 123,
          externalId: "calendar@example.com",
        },
      };

      const result = getPiiFreeUser(user as never);

      expect(result.destinationCalendar?.externalId).toBe("PiiFree:true");
    });

    it("handles null destinationCalendar", () => {
      const user = {
        id: 1,
        destinationCalendar: null,
      };

      const result = getPiiFreeUser(user);

      expect(result.destinationCalendar).toBeNull();
    });

    it("handles undefined credentials", () => {
      const user = {
        id: 1,
      };

      const result = getPiiFreeUser(user);

      expect(result.credentials).toBeUndefined();
    });
  });
});
