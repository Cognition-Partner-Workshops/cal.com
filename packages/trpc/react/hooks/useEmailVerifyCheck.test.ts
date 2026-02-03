import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../trpc", () => ({
  trpc: {
    viewer: {
      me: {
        shouldVerifyEmail: {
          useQuery: vi.fn(),
        },
      },
    },
  },
}));

import { trpc } from "../trpc";
import { useEmailVerifyCheck } from "./useEmailVerifyCheck";

describe("useEmailVerifyCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("query configuration", () => {
    it("calls trpc.viewer.me.shouldVerifyEmail.useQuery with undefined and retry config", () => {
      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>);

      useEmailVerifyCheck();

      expect(mockUseQuery).toHaveBeenCalledWith(undefined, {
        retry: expect.any(Function),
      });
    });

    it("retry function returns true when failureCount > 3", () => {
      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      let capturedRetryFn: ((failureCount: number) => boolean) | undefined;

      mockUseQuery.mockImplementation((_, options) => {
        capturedRetryFn = options?.retry as (failureCount: number) => boolean;
        return {
          data: undefined,
          isLoading: true,
          error: null,
        } as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>;
      });

      useEmailVerifyCheck();

      expect(capturedRetryFn).toBeDefined();
      if (capturedRetryFn) {
        expect(capturedRetryFn(4)).toBe(true);
        expect(capturedRetryFn(5)).toBe(true);
      }
    });

    it("retry function returns false when failureCount <= 3", () => {
      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      let capturedRetryFn: ((failureCount: number) => boolean) | undefined;

      mockUseQuery.mockImplementation((_, options) => {
        capturedRetryFn = options?.retry as (failureCount: number) => boolean;
        return {
          data: undefined,
          isLoading: true,
          error: null,
        } as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>;
      });

      useEmailVerifyCheck();

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
        data: { shouldVerifyEmail: true },
        isLoading: false,
        error: null,
        isSuccess: true,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>);

      const result = useEmailVerifyCheck();

      expect(result).toEqual(mockQueryResult);
    });

    it("returns loading state initially", () => {
      const mockQueryResult = {
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>);

      const result = useEmailVerifyCheck();

      expect(result.isLoading).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it("returns shouldVerifyEmail as false when email is verified", () => {
      const mockQueryResult = {
        data: { shouldVerifyEmail: false },
        isLoading: false,
        error: null,
        isSuccess: true,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>);

      const result = useEmailVerifyCheck();

      expect(result.data?.shouldVerifyEmail).toBe(false);
    });

    it("returns error state when query fails", () => {
      const mockError = new Error("Failed to check email verification");
      const mockQueryResult = {
        data: undefined,
        isLoading: false,
        error: mockError,
        isSuccess: false,
        isError: true,
      };

      const mockUseQuery = vi.mocked(trpc.viewer.me.shouldVerifyEmail.useQuery);
      mockUseQuery.mockReturnValue(mockQueryResult as ReturnType<typeof trpc.viewer.me.shouldVerifyEmail.useQuery>);

      const result = useEmailVerifyCheck();

      expect(result.error).toBe(mockError);
      expect(result.isError).toBe(true);
    });
  });
});
