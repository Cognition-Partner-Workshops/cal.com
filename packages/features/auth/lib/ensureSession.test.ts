import type { NextApiRequest } from "next";
import type { RequestMethod } from "node-mocks-http";
import { createMocks } from "node-mocks-http";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { HttpError } from "@calcom/lib/http-error";

vi.mock("./getSession", () => ({
  getSession: vi.fn(),
}));

import { getSession } from "./getSession";
import { ensureSession } from "./ensureSession";

type MockNextApiRequest = ReturnType<typeof createMocks<NextApiRequest>>["req"];

function createMockRequest(method: RequestMethod = "GET"): MockNextApiRequest {
  const { req } = createMocks<NextApiRequest>({ method });
  return req;
}

describe("ensureSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("with req parameter", () => {
    it("returns session when user is authenticated", async () => {
      const mockSession = {
        user: { id: 123, email: "test@example.com" },
        expires: "2025-01-01",
      };
      vi.mocked(getSession).mockResolvedValue(mockSession);

      const req = createMockRequest();
      const result = await ensureSession({ req });

      expect(result).toEqual(mockSession);
      expect(getSession).toHaveBeenCalledWith({ req });
    });

    it("throws HttpError with 401 when session is null", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const req = createMockRequest();

      await expect(ensureSession({ req })).rejects.toThrow(HttpError);
      await expect(ensureSession({ req })).rejects.toMatchObject({
        statusCode: 401,
        message: "Unauthorized",
      });
    });

    it("throws HttpError with 401 when session has no user id", async () => {
      const mockSession = {
        user: { email: "test@example.com" },
        expires: "2025-01-01",
      };
      vi.mocked(getSession).mockResolvedValue(mockSession as Awaited<ReturnType<typeof getSession>>);

      const req = createMockRequest();

      await expect(ensureSession({ req })).rejects.toThrow(HttpError);
      await expect(ensureSession({ req })).rejects.toMatchObject({
        statusCode: 401,
        message: "Unauthorized",
      });
    });
  });

  describe("with ctx parameter", () => {
    it("returns session when user is authenticated via ctx", async () => {
      const mockSession = {
        user: { id: 456, email: "ctx-user@example.com" },
        expires: "2025-01-01",
      };
      vi.mocked(getSession).mockResolvedValue(mockSession);

      const req = createMockRequest();
      const result = await ensureSession({ ctx: { req } });

      expect(result).toEqual(mockSession);
      expect(getSession).toHaveBeenCalledWith({ ctx: { req } });
    });

    it("throws HttpError with 401 when session is null via ctx", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const req = createMockRequest();

      await expect(ensureSession({ ctx: { req } })).rejects.toThrow(HttpError);
      await expect(ensureSession({ ctx: { req } })).rejects.toMatchObject({
        statusCode: 401,
        message: "Unauthorized",
      });
    });
  });
});
