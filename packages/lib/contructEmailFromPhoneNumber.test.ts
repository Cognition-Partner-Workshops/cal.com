import { describe, expect, it } from "vitest";

import { contructEmailFromPhoneNumber } from "./contructEmailFromPhoneNumber";

describe("contructEmailFromPhoneNumber", () => {
  it("should construct email from phone number with country code", () => {
    expect(contructEmailFromPhoneNumber("+1234567890")).toBe("1234567890@sms.cal.com");
  });

  it("should construct email from phone number without plus sign", () => {
    expect(contructEmailFromPhoneNumber("1234567890")).toBe("1234567890@sms.cal.com");
  });

  it("should remove multiple plus signs", () => {
    expect(contructEmailFromPhoneNumber("++1234567890")).toBe("1234567890@sms.cal.com");
  });

  it("should handle international phone numbers", () => {
    expect(contructEmailFromPhoneNumber("+44123456789")).toBe("44123456789@sms.cal.com");
    expect(contructEmailFromPhoneNumber("+919876543210")).toBe("919876543210@sms.cal.com");
  });
});
