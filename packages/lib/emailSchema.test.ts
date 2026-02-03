import { describe, expect, it } from "vitest";

import { emailRegex, domainRegex, emailSchema } from "./emailSchema";

describe("emailSchema", () => {
  describe("emailRegex", () => {
    it("should match valid email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.com",
        "user+tag@example.com",
        "user123@example.com",
        "user@subdomain.example.com",
        "user@example.co.uk",
        "USER@EXAMPLE.COM",
        "user_name@example.com",
        "user-name@example.com",
        "user'name@example.com",
      ];

      for (const email of validEmails) {
        expect(emailRegex.test(email)).toBe(true);
      }
    });

    it("should not match invalid email addresses", () => {
      const invalidEmails = [
        "invalid",
        "@example.com",
        "user@",
        "user@.com",
        ".user@example.com",
        "user..name@example.com",
        "user@example",
      ];

      for (const email of invalidEmails) {
        expect(emailRegex.test(email)).toBe(false);
      }
    });
  });

  describe("domainRegex", () => {
    it("should match valid domains", () => {
      const validDomains = [
        "example.com",
        "subdomain.example.com",
        "example.co.uk",
        "my-domain.com",
        "123.com",
        "a.io",
      ];

      for (const domain of validDomains) {
        expect(domainRegex.test(domain)).toBe(true);
      }
    });

    it("should not match invalid domains", () => {
      const invalidDomains = [
        "-example.com",
        "example-.com",
        ".example.com",
        "example..com",
      ];

      for (const domain of invalidDomains) {
        expect(domainRegex.test(domain)).toBe(false);
      }
    });
  });

  describe("emailSchema (zod)", () => {
    it("should validate correct email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.com",
        "user+tag@example.com",
      ];

      for (const email of validEmails) {
        expect(() => emailSchema.parse(email)).not.toThrow();
      }
    });

    it("should reject invalid email addresses", () => {
      const invalidEmails = ["invalid", "@example.com", "user@"];

      for (const email of invalidEmails) {
        expect(() => emailSchema.parse(email)).toThrow();
      }
    });

    it("should reject emails that are too long", () => {
      const longEmail = `${"a".repeat(250)}@example.com`;
      expect(() => emailSchema.parse(longEmail)).toThrow();
    });
  });
});
