import { describe, expect, it } from "vitest";

import { contructEmailFromPhoneNumber } from "./contructEmailFromPhoneNumber";

describe("contructEmailFromPhoneNumber", () => {
  it("should construct email from phone number with plus sign", () => {
    expect(contructEmailFromPhoneNumber("+1234567890")).toBe("1234567890@sms.cal.com");
  });

  it("should construct email from phone number without plus sign", () => {
    expect(contructEmailFromPhoneNumber("1234567890")).toBe("1234567890@sms.cal.com");
  });

  it("should handle phone number with country code", () => {
    expect(contructEmailFromPhoneNumber("+14155551234")).toBe("14155551234@sms.cal.com");
  });

  it("should remove multiple plus signs if present", () => {
    expect(contructEmailFromPhoneNumber("++1234567890")).toBe("1234567890@sms.cal.com");
  });

  it("should handle empty string", () => {
    expect(contructEmailFromPhoneNumber("")).toBe("@sms.cal.com");
  });

  it("should handle international format phone numbers", () => {
    expect(contructEmailFromPhoneNumber("+442071234567")).toBe("442071234567@sms.cal.com");
  });
});
