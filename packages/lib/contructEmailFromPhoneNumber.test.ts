import { describe, expect, it } from "vitest";

import { contructEmailFromPhoneNumber } from "./contructEmailFromPhoneNumber";

describe("contructEmailFromPhoneNumber", () => {
  it("should construct email from phone number with + prefix", () => {
    expect(contructEmailFromPhoneNumber("+1234567890")).toEqual("1234567890@sms.cal.com");
  });

  it("should construct email from phone number without + prefix", () => {
    expect(contructEmailFromPhoneNumber("1234567890")).toEqual("1234567890@sms.cal.com");
  });

  it("should handle phone number with multiple + signs", () => {
    expect(contructEmailFromPhoneNumber("+1+234+567890")).toEqual("1234567890@sms.cal.com");
  });

  it("should handle international phone numbers", () => {
    expect(contructEmailFromPhoneNumber("+442071234567")).toEqual("442071234567@sms.cal.com");
    expect(contructEmailFromPhoneNumber("+919876543210")).toEqual("919876543210@sms.cal.com");
  });

  it("should handle empty string", () => {
    expect(contructEmailFromPhoneNumber("")).toEqual("@sms.cal.com");
  });
});
