import { describe, expect, it } from "vitest";

import { domainRegex, emailRegex, emailSchema } from "./emailSchema";

describe("emailSchema", () => {
  describe("emailRegex", () => {
    it("should match valid email addresses", () => {
      expect(emailRegex.test("user@example.com")).toBe(true);
      expect(emailRegex.test("user.name@example.com")).toBe(true);
      expect(emailRegex.test("user+tag@example.com")).toBe(true);
      expect(emailRegex.test("user@subdomain.example.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(emailRegex.test("")).toBe(false);
      expect(emailRegex.test("notanemail")).toBe(false);
      expect(emailRegex.test("@example.com")).toBe(false);
      expect(emailRegex.test("user@")).toBe(false);
      expect(emailRegex.test("user@.com")).toBe(false);
    });

    it("should reject emails starting with a dot", () => {
      expect(emailRegex.test(".user@example.com")).toBe(false);
    });

    it("should reject emails with consecutive dots", () => {
      expect(emailRegex.test("user..name@example.com")).toBe(false);
    });
  });

  describe("domainRegex", () => {
    it("should match valid domains", () => {
      expect(domainRegex.test("example.com")).toBe(true);
      expect(domainRegex.test("sub.example.com")).toBe(true);
      expect(domainRegex.test("example.co.uk")).toBe(true);
    });

    it("should reject invalid domains", () => {
      expect(domainRegex.test("")).toBe(false);
      expect(domainRegex.test("-example.com")).toBe(false);
    });
  });

  describe("emailSchema (zod)", () => {
    it("should accept valid emails", () => {
      expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(emailSchema.safeParse("notanemail").success).toBe(false);
      expect(emailSchema.safeParse("").success).toBe(false);
    });

    it("should reject emails exceeding max length", () => {
      const longEmail = `${"a".repeat(250)}@b.com`;
      expect(emailSchema.safeParse(longEmail).success).toBe(false);
    });
  });
});
