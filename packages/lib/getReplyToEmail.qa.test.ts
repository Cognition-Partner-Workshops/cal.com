import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";

import { getReplyToEmail } from "./getReplyToEmail";

describe("getReplyToEmail - extended tests", () => {
  const mockOrganizer = {
    name: "Organizer",
    email: "organizer@example.com",
    timeZone: "UTC",
    language: {
      locale: "en",
      translate: ((key: string) => key) as TFunction,
    },
  };

  it("should return customReplyToEmail when set", () => {
    const calEvent = {
      customReplyToEmail: "custom@example.com",
      organizer: mockOrganizer,
    };
    expect(getReplyToEmail(calEvent)).toBe("custom@example.com");
  });

  it("should return organizer email when customReplyToEmail is null", () => {
    const calEvent = {
      customReplyToEmail: null,
      organizer: mockOrganizer,
    };
    expect(getReplyToEmail(calEvent)).toBe("organizer@example.com");
  });

  it("should return organizer email when customReplyToEmail is undefined", () => {
    const calEvent = {
      customReplyToEmail: undefined,
      organizer: mockOrganizer,
    };
    expect(getReplyToEmail(calEvent)).toBe("organizer@example.com");
  });

  it("should return organizer email when customReplyToEmail is empty string", () => {
    const calEvent = {
      customReplyToEmail: "",
      organizer: mockOrganizer,
    };
    expect(getReplyToEmail(calEvent)).toBe("organizer@example.com");
  });

  it("should return null when excludeOrganizerEmail is true and no custom reply", () => {
    const calEvent = {
      customReplyToEmail: null,
      organizer: mockOrganizer,
    };
    expect(getReplyToEmail(calEvent, true)).toBeNull();
  });

  it("should return customReplyToEmail even when excludeOrganizerEmail is true", () => {
    const calEvent = {
      customReplyToEmail: "custom@example.com",
      organizer: mockOrganizer,
    };
    expect(getReplyToEmail(calEvent, true)).toBe("custom@example.com");
  });
});
