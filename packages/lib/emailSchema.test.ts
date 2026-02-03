import { describe, expect, it } from "vitest";

import { emailRegex, domainRegex, emailSchema } from "./emailSchema";

describe("emailRegex", () => {
  describe("valid emails", () => {
    it("should match simple email addresses", () => {
      expect(emailRegex.test("user@example.com")).toBe(true);
      expect(emailRegex.test("john@gmail.com")).toBe(true);
    });

    it("should match emails with dots in local part", () => {
      expect(emailRegex.test("first.last@example.com")).toBe(true);
      expect(emailRegex.test("a.b.c@example.com")).toBe(true);
    });

    it("should match emails with plus addressing", () => {
      expect(emailRegex.test("user+tag@example.com")).toBe(true);
      expect(emailRegex.test("john+newsletter@gmail.com")).toBe(true);
    });

    it("should match emails with numbers", () => {
      expect(emailRegex.test("user123@example.com")).toBe(true);
      expect(emailRegex.test("123user@example.com")).toBe(true);
    });

    it("should match emails with hyphens", () => {
      expect(emailRegex.test("user-name@example.com")).toBe(true);
    });

    it("should match emails with underscores", () => {
      expect(emailRegex.test("user_name@example.com")).toBe(true);
    });

    it("should match emails with subdomains", () => {
      expect(emailRegex.test("user@mail.example.com")).toBe(true);
      expect(emailRegex.test("user@sub.domain.example.com")).toBe(true);
    });

    it("should match emails with various TLDs", () => {
      expect(emailRegex.test("user@example.org")).toBe(true);
      expect(emailRegex.test("user@example.co.uk")).toBe(true);
      expect(emailRegex.test("user@example.io")).toBe(true);
    });
  });

  describe("invalid emails", () => {
    it("should not match emails starting with a dot", () => {
      expect(emailRegex.test(".user@example.com")).toBe(false);
    });

    it("should not match emails with consecutive dots", () => {
      expect(emailRegex.test("user..name@example.com")).toBe(false);
    });

    it("should not match emails without @ symbol", () => {
      expect(emailRegex.test("userexample.com")).toBe(false);
    });

    it("should not match emails without domain", () => {
      expect(emailRegex.test("user@")).toBe(false);
    });

    it("should not match emails without local part", () => {
      expect(emailRegex.test("@example.com")).toBe(false);
    });

    it("should not match emails with spaces", () => {
      expect(emailRegex.test("user name@example.com")).toBe(false);
    });
  });
});

describe("domainRegex", () => {
  describe("valid domains", () => {
    it("should match simple domains", () => {
      expect(domainRegex.test("example.com")).toBe(true);
      expect(domainRegex.test("google.com")).toBe(true);
    });

    it("should match domains with subdomains", () => {
      expect(domainRegex.test("mail.example.com")).toBe(true);
      expect(domainRegex.test("sub.domain.example.com")).toBe(true);
    });

    it("should match domains with hyphens", () => {
      expect(domainRegex.test("my-company.com")).toBe(true);
      expect(domainRegex.test("test-domain.org")).toBe(true);
    });

    it("should match domains with numbers", () => {
      expect(domainRegex.test("example123.com")).toBe(true);
      expect(domainRegex.test("123example.com")).toBe(true);
    });

    it("should match international domains", () => {
      expect(domainRegex.test("münchen.de")).toBe(true);
    });
  });

  describe("invalid domains", () => {
    it("should not match domains starting with hyphen", () => {
      expect(domainRegex.test("-example.com")).toBe(false);
    });

    it("should not match domains ending with hyphen", () => {
      expect(domainRegex.test("example-.com")).toBe(false);
    });
  });
});

describe("emailSchema", () => {
  describe("valid emails", () => {
    it("should parse valid email addresses", () => {
      expect(emailSchema.safeParse("user@example.com").success).toBe(true);
      expect(emailSchema.safeParse("john.doe@company.org").success).toBe(true);
    });
  });

  describe("invalid emails", () => {
    it("should reject invalid email addresses", () => {
      expect(emailSchema.safeParse("invalid-email").success).toBe(false);
      expect(emailSchema.safeParse("@example.com").success).toBe(false);
    });

    it("should reject emails that are too long", () => {
      const longLocalPart = "a".repeat(250);
      const longEmail = `${longLocalPart}@example.com`;
      expect(emailSchema.safeParse(longEmail).success).toBe(false);
    });
  });
});
