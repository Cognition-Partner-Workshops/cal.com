import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  it("should return the same email if no plus sign is present", () => {
    expect(extractBaseEmail("user@example.com")).toBe("user@example.com");
    expect(extractBaseEmail("john.doe@gmail.com")).toBe("john.doe@gmail.com");
  });

  it("should remove the plus alias from email", () => {
    expect(extractBaseEmail("user+alias@example.com")).toBe("user@example.com");
    expect(extractBaseEmail("john.doe+newsletter@gmail.com")).toBe("john.doe@gmail.com");
  });

  it("should handle multiple plus signs by only removing after the first", () => {
    expect(extractBaseEmail("user+alias+extra@example.com")).toBe("user@example.com");
  });

  it("should handle emails with subdomains", () => {
    expect(extractBaseEmail("user+test@mail.example.com")).toBe("user@mail.example.com");
  });

  it("should handle emails with dots in local part", () => {
    expect(extractBaseEmail("first.last+alias@example.com")).toBe("first.last@example.com");
  });

  it("should handle emails with numbers", () => {
    expect(extractBaseEmail("user123+test@example.com")).toBe("user123@example.com");
  });

  it("should handle emails with hyphens in domain", () => {
    expect(extractBaseEmail("user+alias@my-domain.com")).toBe("user@my-domain.com");
  });
});
