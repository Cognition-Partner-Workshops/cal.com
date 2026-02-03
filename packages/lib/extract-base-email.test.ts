import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  it("should return the same email if no plus sign is present", () => {
    expect(extractBaseEmail("user@example.com")).toBe("user@example.com");
  });

  it("should remove the plus alias from email", () => {
    expect(extractBaseEmail("user+alias@example.com")).toBe("user@example.com");
    expect(extractBaseEmail("user+test123@example.com")).toBe("user@example.com");
  });

  it("should handle multiple plus signs by keeping only the base", () => {
    expect(extractBaseEmail("user+alias+another@example.com")).toBe("user@example.com");
  });

  it("should handle different domains", () => {
    expect(extractBaseEmail("user+alias@gmail.com")).toBe("user@gmail.com");
    expect(extractBaseEmail("user+alias@company.co.uk")).toBe("user@company.co.uk");
  });

  it("should handle emails with dots in local part", () => {
    expect(extractBaseEmail("first.last+alias@example.com")).toBe("first.last@example.com");
  });

  it("should handle emails with numbers", () => {
    expect(extractBaseEmail("user123+alias@example.com")).toBe("user123@example.com");
  });
});
