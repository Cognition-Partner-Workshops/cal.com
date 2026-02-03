import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  describe("emails without plus addressing", () => {
    it("should return the same email when no plus sign", () => {
      expect(extractBaseEmail("user@example.com")).toBe("user@example.com");
    });

    it("should handle simple email addresses", () => {
      expect(extractBaseEmail("john@gmail.com")).toBe("john@gmail.com");
      expect(extractBaseEmail("jane.doe@company.org")).toBe("jane.doe@company.org");
    });
  });

  describe("emails with plus addressing", () => {
    it("should remove plus addressing suffix", () => {
      expect(extractBaseEmail("user+tag@example.com")).toBe("user@example.com");
    });

    it("should handle multiple plus signs by taking first part", () => {
      expect(extractBaseEmail("user+tag1+tag2@example.com")).toBe("user@example.com");
    });

    it("should handle various plus addressing patterns", () => {
      expect(extractBaseEmail("john+newsletter@gmail.com")).toBe("john@gmail.com");
      expect(extractBaseEmail("jane+work@company.org")).toBe("jane@company.org");
      expect(extractBaseEmail("test+123@domain.co.uk")).toBe("test@domain.co.uk");
    });
  });

  describe("edge cases", () => {
    it("should handle email with empty plus suffix", () => {
      expect(extractBaseEmail("user+@example.com")).toBe("user@example.com");
    });

    it("should handle subdomains", () => {
      expect(extractBaseEmail("user+tag@mail.example.com")).toBe("user@mail.example.com");
    });

    it("should handle dots in local part", () => {
      expect(extractBaseEmail("first.last+tag@example.com")).toBe("first.last@example.com");
    });
  });
});
