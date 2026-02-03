import { describe, expect, it } from "vitest";

import convertToNewDurationType, {
  MINUTES_IN_HOUR,
  MINUTES_IN_DAY,
  HOURS_IN_DAY,
} from "./convertToNewDurationType";

describe("convertToNewDurationType", () => {
  describe("constants", () => {
    it("should have correct constant values", () => {
      expect(MINUTES_IN_HOUR).toBe(60);
      expect(MINUTES_IN_DAY).toBe(1440);
      expect(HOURS_IN_DAY).toBe(24);
    });
  });

  describe("minutes to other types", () => {
    it("should convert minutes to minutes (no change)", () => {
      expect(convertToNewDurationType("minutes", "minutes", 30)).toBe(30);
      expect(convertToNewDurationType("minutes", "minutes", 60)).toBe(60);
    });

    it("should convert minutes to hours", () => {
      expect(convertToNewDurationType("minutes", "hours", 60)).toBe(1);
      expect(convertToNewDurationType("minutes", "hours", 120)).toBe(2);
      expect(convertToNewDurationType("minutes", "hours", 90)).toBe(2); // Ceiling
    });

    it("should convert minutes to days", () => {
      expect(convertToNewDurationType("minutes", "days", 1440)).toBe(1);
      expect(convertToNewDurationType("minutes", "days", 2880)).toBe(2);
      expect(convertToNewDurationType("minutes", "days", 1500)).toBe(2); // Ceiling
    });
  });

  describe("hours to other types", () => {
    it("should convert hours to minutes", () => {
      expect(convertToNewDurationType("hours", "minutes", 1)).toBe(60);
      expect(convertToNewDurationType("hours", "minutes", 2)).toBe(120);
    });

    it("should convert hours to hours (no change)", () => {
      expect(convertToNewDurationType("hours", "hours", 5)).toBe(5);
    });

    it("should convert hours to days", () => {
      expect(convertToNewDurationType("hours", "days", 24)).toBe(576); // 24 * 24 = 576
      expect(convertToNewDurationType("hours", "days", 1)).toBe(24);
    });
  });

  describe("days to other types", () => {
    it("should convert days to minutes", () => {
      expect(convertToNewDurationType("days", "minutes", 1)).toBe(1440);
      expect(convertToNewDurationType("days", "minutes", 2)).toBe(2880);
    });

    it("should convert days to hours", () => {
      expect(convertToNewDurationType("days", "hours", 1)).toBe(24);
      expect(convertToNewDurationType("days", "hours", 2)).toBe(48);
    });

    it("should convert days to days (no change)", () => {
      expect(convertToNewDurationType("days", "days", 7)).toBe(7);
    });
  });

  describe("ceiling behavior", () => {
    it("should always round up (ceiling)", () => {
      expect(convertToNewDurationType("minutes", "hours", 61)).toBe(2); // 61/60 = 1.016... -> 2
      expect(convertToNewDurationType("minutes", "days", 1441)).toBe(2); // 1441/1440 = 1.0006... -> 2
    });
  });
});
