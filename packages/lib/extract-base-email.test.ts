import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  it("should return the base email without plus addressing", () => {
    expect(extractBaseEmail("user+tag@example.com")).toBe("user@example.com");
    expect(extractBaseEmail("john+newsletter@gmail.com")).toBe("john@gmail.com");
  });

  it("should return the same email if no plus addressing is used", () => {
    expect(extractBaseEmail("user@example.com")).toBe("user@example.com");
    expect(extractBaseEmail("admin@cal.com")).toBe("admin@cal.com");
  });

  it("should handle multiple plus signs by removing everything after the first", () => {
    expect(extractBaseEmail("user+tag1+tag2@example.com")).toBe("user@example.com");
  });

  it("should handle empty local part before plus", () => {
    expect(extractBaseEmail("+tag@example.com")).toBe("@example.com");
  });

  it("should handle emails with subdomains", () => {
    expect(extractBaseEmail("user+tag@mail.example.com")).toBe("user@mail.example.com");
  });
});
