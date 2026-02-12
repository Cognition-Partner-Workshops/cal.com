import { describe, expect, it } from "vitest";

import convertToNewDurationType from "./convertToNewDurationType";

describe("convertToNewDurationType", () => {
  describe("minutes conversions", () => {
    it("should return same value for minutes to minutes", () => {
      expect(convertToNewDurationType("minutes", "minutes", 30)).toBe(30);
      expect(convertToNewDurationType("minutes", "minutes", 60)).toBe(60);
    });

    it("should convert minutes to hours", () => {
      expect(convertToNewDurationType("minutes", "hours", 60)).toBe(1);
      expect(convertToNewDurationType("minutes", "hours", 120)).toBe(2);
      expect(convertToNewDurationType("minutes", "hours", 90)).toBe(2);
    });

    it("should convert minutes to days", () => {
      expect(convertToNewDurationType("minutes", "days", 1440)).toBe(1);
      expect(convertToNewDurationType("minutes", "days", 2880)).toBe(2);
      expect(convertToNewDurationType("minutes", "days", 1500)).toBe(2);
    });
  });

  describe("hours conversions", () => {
    it("should convert hours to minutes", () => {
      expect(convertToNewDurationType("hours", "minutes", 1)).toBe(60);
      expect(convertToNewDurationType("hours", "minutes", 2)).toBe(120);
    });

    it("should return same value for hours to hours", () => {
      expect(convertToNewDurationType("hours", "hours", 5)).toBe(5);
    });

    it("should convert hours to days (multiplies by HOURS_IN_DAY)", () => {
      expect(convertToNewDurationType("hours", "days", 1)).toBe(24);
      expect(convertToNewDurationType("hours", "days", 2)).toBe(48);
    });
  });

  describe("days conversions", () => {
    it("should convert days to minutes", () => {
      expect(convertToNewDurationType("days", "minutes", 1)).toBe(1440);
      expect(convertToNewDurationType("days", "minutes", 2)).toBe(2880);
    });

    it("should convert days to hours", () => {
      expect(convertToNewDurationType("days", "hours", 1)).toBe(24);
      expect(convertToNewDurationType("days", "hours", 2)).toBe(48);
    });

    it("should return same value for days to days", () => {
      expect(convertToNewDurationType("days", "days", 3)).toBe(3);
    });
  });

  describe("ceiling behavior", () => {
    it("should ceil fractional results", () => {
      expect(convertToNewDurationType("minutes", "hours", 45)).toBe(1);
      expect(convertToNewDurationType("minutes", "hours", 61)).toBe(2);
      expect(convertToNewDurationType("minutes", "days", 1)).toBe(1);
    });
  });
});
