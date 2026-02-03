import { describe, it, expect, vi, beforeEach } from "vitest";

import { BookingActionMap } from "@calcom/features/bookings/lib/BookingEmailSmsHandler";

import { BookingEmailAndSmsTasker } from "./BookingEmailAndSmsTasker";

vi.mock("@calcom/lib/constants", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@calcom/lib/constants")>();
  return {
    ...actual,
    ENABLE_ASYNC_TASKER: false,
  };
});

describe("BookingEmailAndSmsTasker", () => {
  const mockSyncTasker = {
    request: vi.fn().mockResolvedValue({ runId: "sync-run-123" }),
    confirm: vi.fn().mockResolvedValue({ runId: "sync-run-456" }),
    reschedule: vi.fn().mockResolvedValue({ runId: "sync-run-789" }),
    rrReschedule: vi.fn().mockResolvedValue({ runId: "sync-run-rr" }),
  };

  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  };

  let tasker: BookingEmailAndSmsTasker;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSyncTasker.request.mockResolvedValue({ runId: "sync-run-123" });
    mockSyncTasker.confirm.mockResolvedValue({ runId: "sync-run-456" });
    mockSyncTasker.reschedule.mockResolvedValue({ runId: "sync-run-789" });
    mockSyncTasker.rrReschedule.mockResolvedValue({ runId: "sync-run-rr" });

    tasker = new BookingEmailAndSmsTasker({
      asyncTasker: mockSyncTasker as unknown as Parameters<typeof BookingEmailAndSmsTasker>[0]["asyncTasker"],
      syncTasker: mockSyncTasker as unknown as Parameters<typeof BookingEmailAndSmsTasker>[0]["syncTasker"],
      logger: mockLogger,
    });
  });

  describe("send method", () => {
    const basePayload = {
      bookingId: 123,
      conferenceCredentialId: 456,
    };

    describe("booking requested action", () => {
      it("dispatches request task for requested action", async () => {
        const result = await tasker.send({
          action: BookingActionMap.requested,
          schedulingType: null,
          payload: basePayload,
        });

        expect(result.runId).toBe("sync-run-123");
        expect(mockSyncTasker.request).toHaveBeenCalledWith(basePayload);
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BOOKING_REQUESTED"),
          expect.any(Object),
          expect.objectContaining({ bookingId: 123 })
        );
      });
    });

    describe("booking confirmed action", () => {
      it("dispatches confirm task for confirmed action", async () => {
        const result = await tasker.send({
          action: BookingActionMap.confirmed,
          schedulingType: null,
          payload: basePayload,
        });

        expect(result.runId).toBe("sync-run-456");
        expect(mockSyncTasker.confirm).toHaveBeenCalledWith(basePayload);
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BOOKING_CONFIRMED"),
          expect.any(Object),
          expect.objectContaining({ bookingId: 123 })
        );
      });
    });

    describe("booking rescheduled action", () => {
      it("dispatches reschedule task for non-round-robin rescheduled action", async () => {
        const result = await tasker.send({
          action: BookingActionMap.rescheduled,
          schedulingType: "COLLECTIVE",
          payload: basePayload,
        });

        expect(result.runId).toBe("sync-run-789");
        expect(mockSyncTasker.reschedule).toHaveBeenCalledWith(basePayload);
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BOOKING_RESCHEDULED"),
          expect.any(Object),
          expect.objectContaining({ bookingId: 123 })
        );
      });

      it("dispatches rrReschedule task for round-robin rescheduled action", async () => {
        const result = await tasker.send({
          action: BookingActionMap.rescheduled,
          schedulingType: "ROUND_ROBIN",
          payload: basePayload,
        });

        expect(result.runId).toBe("sync-run-rr");
        expect(mockSyncTasker.rrReschedule).toHaveBeenCalledWith(basePayload);
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BOOKING_RESCHEDULED"),
          expect.any(Object),
          expect.objectContaining({ bookingId: 123 })
        );
      });

      it("dispatches reschedule task when schedulingType is null", async () => {
        const result = await tasker.send({
          action: BookingActionMap.rescheduled,
          schedulingType: null,
          payload: basePayload,
        });

        expect(result.runId).toBe("sync-run-789");
        expect(mockSyncTasker.reschedule).toHaveBeenCalledWith(basePayload);
      });
    });

    describe("error handling", () => {
      it("returns task-failed runId when dispatch throws", async () => {
        mockSyncTasker.request.mockRejectedValue(new Error("Task dispatch failed"));

        const result = await tasker.send({
          action: BookingActionMap.requested,
          schedulingType: null,
          payload: basePayload,
        });

        expect(result.runId).toBe("task-failed");
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining("failed"),
          expect.any(Object),
          expect.objectContaining({ bookingId: 123 })
        );
      });

      it("returns task-not-found for unknown action", async () => {
        const result = await tasker.send({
          action: "unknown_action" as unknown as Parameters<typeof tasker.send>[0]["action"],
          schedulingType: null,
          payload: basePayload,
        });

        expect(result.runId).toBe("task-not-found");
      });
    });
  });
});
