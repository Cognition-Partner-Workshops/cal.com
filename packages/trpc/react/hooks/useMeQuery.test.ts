import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../trpc", () => ({
  trpc: {
    viewer: {
      me: {
        get: {
          useQuery: vi.fn(),
        },
      },
    },
  },
}));

import { trpc } from "../trpc";
import { useMeQuery } from "./useMeQuery";

describe("useMeQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("query configuration", () => {
    it("calls trpc.viewer.me.get.useQuery with undefined and retry config", () => {
      const mockUseQuery = vi.mocked(trpc.viewer.me.get.useQuery);
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as ReturnType<typeof trpc.viewer.me.get.useQuery>);

      useMeQuery();

      expect(mockUseQuery).toHaveBeenCalledWith(undefined, {
        retry: expect.any(Function),
      });
    });

    it("retry function returns true when failureCount > 3", () => {
      const mockUseQuery = vi.mocked(trpc.viewer.me.get.useQuery);
      let capturedRetryFn: ((failureCount: number) => boolean) | undefined;

      mockUseQuery.mockImplementation((_, options) => {
        capturedRetryFn = options?.retry as (failureCount: number) => boolean;
        return {
          data: undefined,
          isLoading: true,
          error: null,
        } as ReturnType<typeof trpc.viewer.me.get.useQuery>;
      });

      useMeQuery();

      expect(capturedRetryFn).toBeDefined();
      if (capturedRetryFn) {
        expect(capturedRetryFn(4)).toBe(true);
        expect(capturedRetryFn(5)).toBe(true);
      }
    });

    it("retry function returns false when failureCount <= 3", () => {
      const mockUseQuery = vi.mocked(trpc.viewer.me.get.useQuery);
      let capturedRetryFn: ((failureCount: number) => boolean) | undefined;

      mockUseQuery.mockImplementation((_, options) => {
        capturedRetryFn = options?.retry as (failureCount: number) => boolean;
        return {
          data: undefined,
          isLoading: true,
          error: null,
        } as ReturnType<typeof trpc.viewer.me.get.useQuery>;
      });

      useMeQuery();

      expect(capturedRetryFn).toBeDefined();
      if (capturedRetryFn) {
        expect(capturedRetryFn(0)).toBe(false);
        expect(capturedRetryFn(1)).toBe(false);
        expect(capturedRetryFn(2)).toBe(false);
        expect(capturedRetryFn(3)).toBe(false);
      }
    });
  });

  describe("return value", () => {
    it("returns the query result from useQuery", () => {
      const mockQueryResult = {
        data: { id: 1, email: "test@example.com" },
        isLoading: false,
        error: null,
        isSuccess: true,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.get.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.get.useQuery>);

      const result = useMeQuery();

      expect(result).toEqual(mockQueryResult);
    });

    it("returns loading state initially", () => {
      const mockQueryResult = {
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.get.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.get.useQuery>);

      const result = useMeQuery();

      expect(result.isLoading).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it("returns error state when query fails", () => {
      const mockError = new Error("Failed to fetch user");
      const mockQueryResult = {
        data: undefined,
        isLoading: false,
        error: mockError,
        isSuccess: false,
        isError: true,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.get.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.get.useQuery>);

      const result = useMeQuery();

      expect(result.error).toBe(mockError);
      expect(result.isError).toBe(true);
    });
  });
});
