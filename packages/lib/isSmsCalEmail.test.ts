import { describe, it, expect } from "vitest";

import isSmsCalEmail from "./isSmsCalEmail";

describe("isSmsCalEmail", () => {
  it("returns true for an SMS cal email", () => {
    expect(isSmsCalEmail("1234567890@sms.cal.com")).toBe(true);
  });

  it("returns false for a regular email", () => {
    expect(isSmsCalEmail("user@example.com")).toBe(false);
  });

  it("returns false for a partial match", () => {
    expect(isSmsCalEmail("user@notsms.cal.com")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isSmsCalEmail("")).toBe(false);
  });

  it("returns false for email ending with sms.cal.com but different domain", () => {
    expect(isSmsCalEmail("user@fakesms.cal.com")).toBe(false);
  });
});
