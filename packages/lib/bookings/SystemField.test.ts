import { describe, it, expect } from "vitest";

import {
  SystemField,
  SMS_REMINDER_NUMBER_FIELD,
  TITLE_FIELD,
  ATTENDEE_PHONE_NUMBER_FIELD,
  CAL_AI_AGENT_PHONE_NUMBER_FIELD,
  SYSTEM_PHONE_FIELDS,
  shouldShowFieldInCustomResponses,
} from "./SystemField";

describe("SystemField", () => {
  it("validates known system fields", () => {
    expect(SystemField.safeParse("name").success).toBe(true);
    expect(SystemField.safeParse("email").success).toBe(true);
    expect(SystemField.safeParse("location").success).toBe(true);
    expect(SystemField.safeParse("title").success).toBe(true);
    expect(SystemField.safeParse("notes").success).toBe(true);
    expect(SystemField.safeParse("guests").success).toBe(true);
    expect(SystemField.safeParse("rescheduleReason").success).toBe(true);
    expect(SystemField.safeParse("smsReminderNumber").success).toBe(true);
    expect(SystemField.safeParse("attendeePhoneNumber").success).toBe(true);
    expect(SystemField.safeParse("aiAgentCallPhoneNumber").success).toBe(true);
  });

  it("rejects unknown fields", () => {
    expect(SystemField.safeParse("customField").success).toBe(false);
    expect(SystemField.safeParse("").success).toBe(false);
  });
});

describe("constants", () => {
  it("has correct constant values", () => {
    expect(SMS_REMINDER_NUMBER_FIELD).toBe("smsReminderNumber");
    expect(TITLE_FIELD).toBe("title");
    expect(ATTENDEE_PHONE_NUMBER_FIELD).toBe("attendeePhoneNumber");
    expect(CAL_AI_AGENT_PHONE_NUMBER_FIELD).toBe("aiAgentCallPhoneNumber");
  });

  it("SYSTEM_PHONE_FIELDS contains expected fields", () => {
    expect(SYSTEM_PHONE_FIELDS.has(ATTENDEE_PHONE_NUMBER_FIELD)).toBe(true);
    expect(SYSTEM_PHONE_FIELDS.has(SMS_REMINDER_NUMBER_FIELD)).toBe(true);
    expect(SYSTEM_PHONE_FIELDS.has(CAL_AI_AGENT_PHONE_NUMBER_FIELD)).toBe(true);
    expect(SYSTEM_PHONE_FIELDS.size).toBe(3);
  });
});

describe("shouldShowFieldInCustomResponses", () => {
  it("returns false for system field 'name'", () => {
    expect(shouldShowFieldInCustomResponses("name")).toBe(false);
  });

  it("returns false for system field 'email'", () => {
    expect(shouldShowFieldInCustomResponses("email")).toBe(false);
  });

  it("returns false for system field 'location'", () => {
    expect(shouldShowFieldInCustomResponses("location")).toBe(false);
  });

  it("returns true for smsReminderNumber (exception)", () => {
    expect(shouldShowFieldInCustomResponses("smsReminderNumber")).toBe(true);
  });

  it("returns true for title (exception)", () => {
    expect(shouldShowFieldInCustomResponses("title")).toBe(true);
  });

  it("returns true for custom fields", () => {
    expect(shouldShowFieldInCustomResponses("customField")).toBe(true);
    expect(shouldShowFieldInCustomResponses("mySpecialField")).toBe(true);
  });

  it("returns false for system field 'notes'", () => {
    expect(shouldShowFieldInCustomResponses("notes")).toBe(false);
  });

  it("returns false for system field 'guests'", () => {
    expect(shouldShowFieldInCustomResponses("guests")).toBe(false);
  });
});
