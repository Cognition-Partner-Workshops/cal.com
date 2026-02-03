import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  it("should return the same email if no plus sign is present", () => {
    expect(extractBaseEmail("user@example.com")).toBe("user@example.com");
  });

  it("should remove the plus alias from the email", () => {
    expect(extractBaseEmail("user+alias@example.com")).toBe("user@example.com");
  });

  it("should handle multiple plus signs by removing everything after the first one", () => {
    expect(extractBaseEmail("user+alias+another@example.com")).toBe("user@example.com");
  });

  it("should handle emails with subdomains", () => {
    expect(extractBaseEmail("user+test@mail.example.com")).toBe("user@mail.example.com");
  });

  it("should handle empty local part before plus", () => {
    expect(extractBaseEmail("+alias@example.com")).toBe("@example.com");
  });

  it("should handle complex domain names", () => {
    expect(extractBaseEmail("user+tag@sub.domain.example.co.uk")).toBe("user@sub.domain.example.co.uk");
  });

  it("should handle numeric local parts", () => {
    expect(extractBaseEmail("12345+test@example.com")).toBe("12345@example.com");
  });

  it("should handle special characters in local part before plus", () => {
    expect(extractBaseEmail("user.name+alias@example.com")).toBe("user.name@example.com");
  });
});
