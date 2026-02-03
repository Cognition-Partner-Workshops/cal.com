import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  describe("emails without plus addressing", () => {
    it("should return the same email when no plus sign is present", () => {
      expect(extractBaseEmail("user@example.com")).toBe("user@example.com");
    });

    it("should handle simple email addresses", () => {
      expect(extractBaseEmail("john@gmail.com")).toBe("john@gmail.com");
      expect(extractBaseEmail("jane.doe@company.org")).toBe("jane.doe@company.org");
    });
  });

  describe("emails with plus addressing", () => {
    it("should remove plus suffix from email", () => {
      expect(extractBaseEmail("user+tag@example.com")).toBe("user@example.com");
    });

    it("should handle various plus suffixes", () => {
      expect(extractBaseEmail("john+newsletter@gmail.com")).toBe("john@gmail.com");
      expect(extractBaseEmail("jane+work@company.org")).toBe("jane@company.org");
      expect(extractBaseEmail("test+123@domain.com")).toBe("test@domain.com");
    });

    it("should handle multiple plus signs (only first one matters)", () => {
      expect(extractBaseEmail("user+tag+extra@example.com")).toBe("user@example.com");
    });

    it("should handle plus sign with empty suffix", () => {
      expect(extractBaseEmail("user+@example.com")).toBe("user@example.com");
    });
  });

  describe("edge cases", () => {
    it("should handle emails with dots in local part", () => {
      expect(extractBaseEmail("first.last+tag@example.com")).toBe("first.last@example.com");
    });

    it("should handle emails with numbers", () => {
      expect(extractBaseEmail("user123+tag@example.com")).toBe("user123@example.com");
    });

    it("should handle emails with subdomains", () => {
      expect(extractBaseEmail("user+tag@mail.example.com")).toBe("user@mail.example.com");
    });

    it("should handle emails with hyphens in domain", () => {
      expect(extractBaseEmail("user+tag@my-company.com")).toBe("user@my-company.com");
    });
  });
});
