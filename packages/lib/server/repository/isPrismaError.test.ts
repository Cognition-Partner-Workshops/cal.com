import { Prisma } from "@calcom/prisma/client";
import { describe, expect, it } from "vitest";

import { isPrismaError } from "../getServerErrorFromUnknown";

describe("isPrismaError", () => {
  it("returns true for a real Prisma.PrismaClientKnownRequestError instance", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "5.0.0",
    });
    expect(isPrismaError(err)).toBe(true);
  });

  it("returns true for a duck-typed Prisma error (cross-instance fallback)", () => {
    const err = new Error("Some Prisma error") as Error & { code: string };
    err.code = "P2002";
    expect(isPrismaError(err)).toBe(true);
  });

  it("returns true for P2025 error code", () => {
    const err = new Error("Record not found") as Error & { code: string };
    err.code = "P2025";
    expect(isPrismaError(err)).toBe(true);
  });

  it("returns false for a regular Error without code", () => {
    const err = new Error("Not a Prisma error");
    expect(isPrismaError(err)).toBe(false);
  });

  it("returns false for non-Prisma error code", () => {
    const err = new Error("Some error") as Error & { code: string };
    err.code = "ENOENT";
    expect(isPrismaError(err)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPrismaError(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPrismaError(undefined)).toBe(false);
  });

  it("returns false for a plain object", () => {
    expect(isPrismaError({ code: "P2002" })).toBe(false);
  });
});
