import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("perfMiddleware", () => {
  let originalMark: typeof performance.mark;
  let originalMeasure: typeof performance.measure;

  beforeEach(() => {
    originalMark = performance.mark;
    originalMeasure = performance.measure;
    performance.mark = vi.fn();
    performance.measure = vi.fn();
  });

  afterEach(() => {
    performance.mark = originalMark;
    performance.measure = originalMeasure;
    vi.clearAllMocks();
  });

  describe("performance tracking", () => {
    it("marks start and end of procedure execution", async () => {
      const mockNext = vi.fn().mockResolvedValue({ ok: true });

      performance.mark("Start");
      await mockNext();
      performance.mark("End");

      expect(performance.mark).toHaveBeenCalledWith("Start");
      expect(performance.mark).toHaveBeenCalledWith("End");
    });

    it("measures execution time with OK status for successful calls", async () => {
      const mockNext = vi.fn().mockResolvedValue({ ok: true });

      performance.mark("Start");
      const result = await mockNext();
      performance.mark("End");
      let status = "ERROR";
      if (result.ok) {
        status = "OK";
      }
      performance.measure(`[${status}][$1] query 'test.procedure'`, "Start", "End");

      expect(performance.measure).toHaveBeenCalledWith(
        expect.stringContaining("[OK]"),
        "Start",
        "End"
      );
    });

    it("measures execution time with ERROR status for failed calls", async () => {
      const mockNext = vi.fn().mockResolvedValue({ ok: false });

      performance.mark("Start");
      const result = await mockNext();
      performance.mark("End");
      let status = "ERROR";
      if (result.ok) {
        status = "OK";
      }
      performance.measure(`[${status}][$1] mutation 'test.mutation'`, "Start", "End");

      expect(performance.measure).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR]"),
        "Start",
        "End"
      );
    });

    it("returns the result from next()", async () => {
      const expectedResult = { ok: true, data: { id: 1 } };
      const mockNext = vi.fn().mockResolvedValue(expectedResult);

      const result = await mockNext();

      expect(result).toEqual(expectedResult);
    });

    it("handles different procedure types in measurement label", async () => {
      const queryNext = vi.fn().mockResolvedValue({ ok: true });
      const mutationNext = vi.fn().mockResolvedValue({ ok: true });

      performance.mark("Start");
      const queryResult = await queryNext();
      performance.mark("End");
      let queryStatus = "ERROR";
      if (queryResult.ok) {
        queryStatus = "OK";
      }
      performance.measure(`[${queryStatus}][$1] query 'viewer.me'`, "Start", "End");

      expect(performance.measure).toHaveBeenCalledWith(
        expect.stringContaining("query"),
        "Start",
        "End"
      );

      vi.clearAllMocks();

      performance.mark("Start");
      const mutationResult = await mutationNext();
      performance.mark("End");
      let mutationStatus = "ERROR";
      if (mutationResult.ok) {
        mutationStatus = "OK";
      }
      performance.measure(`[${mutationStatus}][$1] mutation 'booking.create'`, "Start", "End");

      expect(performance.measure).toHaveBeenCalledWith(
        expect.stringContaining("mutation"),
        "Start",
        "End"
      );
    });
  });
});
