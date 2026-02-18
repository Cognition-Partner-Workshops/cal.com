import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BookingAuditViewerService } from "../BookingAuditViewerService";
import { BookingHistoryViewerService } from "../BookingHistoryViewerService";

type MockBookingAuditViewerService = {
  [K in keyof Pick<BookingAuditViewerService, "getAuditLogsForBooking">]: ReturnType<typeof vi.fn>;
};

type MockRoutingFormResponseRepository = {
  findByBookingUidIncludeForm: ReturnType<typeof vi.fn>;
};

const mockBookingAuditViewerService: MockBookingAuditViewerService = {
  getAuditLogsForBooking: vi.fn(),
};

const mockRoutingFormResponseRepository: MockRoutingFormResponseRepository = {
  findByBookingUidIncludeForm: vi.fn(),
};

function createService(): BookingHistoryViewerService {
  return new BookingHistoryViewerService({
    bookingAuditViewerService: mockBookingAuditViewerService as unknown as BookingAuditViewerService,
    routingFormResponseRepository: mockRoutingFormResponseRepository,
  });
}

describe("BookingHistoryViewerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getHistoryForBooking", () => {
    const params = {
      bookingUid: "booking-123",
      userId: 1,
      userEmail: "user@example.com",
      userTimeZone: "UTC",
      organizationId: 100,
    };

    it("returns booking audit logs when no form response exists", async () => {
      const mockAuditLog = {
        id: "log-1",
        bookingUid: "booking-123",
        type: "RECORD_CREATED",
        action: "CREATED",
        timestamp: "2025-06-01T10:00:00.000Z",
        createdAt: "2025-06-01T10:00:00.000Z",
        source: "WEBAPP",
        operationId: "op-1",
        displayJson: null,
        actionDisplayTitle: { key: "booking_created" },
        displayFields: null,
        actor: {
          id: "actor-1",
          type: "USER",
          userUuid: "user-uuid",
          attendeeId: null,
          name: "Test User",
          createdAt: new Date("2025-06-01T10:00:00.000Z"),
          displayName: "Test User",
          displayEmail: "user@example.com",
          displayAvatar: null,
        },
        impersonatedBy: null,
      };

      mockBookingAuditViewerService.getAuditLogsForBooking.mockResolvedValue({
        auditLogs: [mockAuditLog],
      });
      mockRoutingFormResponseRepository.findByBookingUidIncludeForm.mockResolvedValue(null);

      const service = createService();
      const result = await service.getHistoryForBooking(params);

      expect(result.bookingUid).toBe("booking-123");
      expect(result.auditLogs).toHaveLength(1);
      expect(result.auditLogs[0].action).toBe("CREATED");
    });

    it("combines audit logs with form submission entries and sorts reverse chronologically", async () => {
      const olderAuditLog = {
        id: "log-1",
        bookingUid: "booking-123",
        type: "RECORD_CREATED",
        action: "CREATED",
        timestamp: "2025-06-01T10:00:00.000Z",
        createdAt: "2025-06-01T10:00:00.000Z",
        source: "WEBAPP",
        operationId: "op-1",
        displayJson: null,
        actionDisplayTitle: { key: "booking_created" },
        displayFields: null,
        actor: {
          id: "actor-1",
          type: "USER",
          userUuid: "user-uuid",
          attendeeId: null,
          name: "Test User",
          createdAt: new Date("2025-06-01T10:00:00.000Z"),
          displayName: "Test User",
          displayEmail: "user@example.com",
          displayAvatar: null,
        },
        impersonatedBy: null,
      };

      mockBookingAuditViewerService.getAuditLogsForBooking.mockResolvedValue({
        auditLogs: [olderAuditLog],
      });

      mockRoutingFormResponseRepository.findByBookingUidIncludeForm.mockResolvedValue({
        id: 42,
        createdAt: new Date("2025-06-01T09:55:00.000Z"),
        response: {},
        form: { fields: [] },
      });

      const service = createService();
      const result = await service.getHistoryForBooking(params);

      expect(result.auditLogs).toHaveLength(2);
      expect(result.auditLogs[0].timestamp).toBe("2025-06-01T10:00:00.000Z");
      expect(result.auditLogs[1].id).toBe("form-submission-42");
    });

    it("returns empty audit logs when both sources are empty", async () => {
      mockBookingAuditViewerService.getAuditLogsForBooking.mockResolvedValue({ auditLogs: [] });
      mockRoutingFormResponseRepository.findByBookingUidIncludeForm.mockResolvedValue(null);

      const service = createService();
      const result = await service.getHistoryForBooking(params);

      expect(result.auditLogs).toHaveLength(0);
      expect(result.bookingUid).toBe("booking-123");
    });
  });
});
