import { describe, expect, it } from "vitest";

import { formatPhoneNumber } from "./formatPhoneNumber";

describe("formatPhoneNumber", () => {
  it("should format valid US phone numbers", () => {
    expect(formatPhoneNumber("+14155552671")).toBe("+1 415 555 2671");
  });

  it("should format valid UK phone numbers", () => {
    expect(formatPhoneNumber("+442071234567")).toBe("+44 20 7123 4567");
  });

  it("should format valid German phone numbers", () => {
    expect(formatPhoneNumber("+4930123456")).toBe("+49 30 123456");
  });

  it("should throw for invalid phone numbers", () => {
    // parsePhoneNumberWithError throws for invalid numbers
    expect(() => formatPhoneNumber("invalid")).toThrow();
  });

  it("should handle phone numbers with different formats", () => {
    expect(formatPhoneNumber("+33123456789")).toBe("+33 1 23 45 67 89");
  });
});
