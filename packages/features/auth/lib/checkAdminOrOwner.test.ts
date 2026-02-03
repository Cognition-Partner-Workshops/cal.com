import { describe, it, expect } from "vitest";

import { MembershipRole } from "@calcom/prisma/enums";

import { checkAdminOrOwner } from "./checkAdminOrOwner";

describe("checkAdminOrOwner", () => {
  describe("returns true for admin or owner roles", () => {
    it("returns true for OWNER role", () => {
      expect(checkAdminOrOwner(MembershipRole.OWNER)).toBe(true);
    });

    it("returns true for ADMIN role", () => {
      expect(checkAdminOrOwner(MembershipRole.ADMIN)).toBe(true);
    });
  });

  describe("returns false for non-admin/owner roles", () => {
    it("returns false for MEMBER role", () => {
      expect(checkAdminOrOwner(MembershipRole.MEMBER)).toBe(false);
    });

    it("returns false for null", () => {
      expect(checkAdminOrOwner(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(checkAdminOrOwner(undefined)).toBe(false);
    });
  });

  describe("type guard behavior", () => {
    it("narrows type to OWNER | ADMIN when returning true", () => {
      const role: MembershipRole | null = MembershipRole.OWNER;
      if (checkAdminOrOwner(role)) {
        const narrowedRole: "OWNER" | "ADMIN" = role;
        expect(narrowedRole).toBe("OWNER");
      }
    });
  });
});
