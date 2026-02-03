import { describe, expect, it } from "vitest";

import { extractBaseEmail } from "./extract-base-email";

describe("extractBaseEmail", () => {
  it("should return the same email if no + suffix exists", () => {
    expect(extractBaseEmail("user@example.com")).toEqual("user@example.com");
  });

  it("should remove the + suffix from email", () => {
    expect(extractBaseEmail("user+tag@example.com")).toEqual("user@example.com");
  });

  it("should handle multiple + signs by removing everything after the first +", () => {
    expect(extractBaseEmail("user+tag+another@example.com")).toEqual("user@example.com");
  });

  it("should handle emails with subdomains", () => {
    expect(extractBaseEmail("user+tag@mail.example.com")).toEqual("user@mail.example.com");
  });

  it("should handle emails with dots in local part", () => {
    expect(extractBaseEmail("first.last+tag@example.com")).toEqual("first.last@example.com");
  });

  it("should handle empty + suffix", () => {
    expect(extractBaseEmail("user+@example.com")).toEqual("user@example.com");
  });
});
