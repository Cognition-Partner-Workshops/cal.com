import { describe, expect, it } from "vitest";

import {
  extractHostTimezone,
  isUsageBasedExpired,
  isLinkExpired,
  filterActiveLinks,
} from "./hashedLinksUtils";

describe("hashedLinksUtils", () => {
  describe("extractHostTimezone", () => {
    it("should return owner timezone for personal event type", () => {
      const eventType = {
        userId: 1,
        owner: { timeZone: "America/New_York" },
      };
      expect(extractHostTimezone(eventType)).toBe("America/New_York");
    });

    it("should return host timezone for team event type with hosts", () => {
      const eventType = {
        teamId: 1,
        hosts: [{ user: { timeZone: "Europe/London" } }],
      };
      expect(extractHostTimezone(eventType)).toBe("Europe/London");
    });

    it("should return team member timezone for team event type without hosts", () => {
      const eventType = {
        teamId: 1,
        team: {
          members: [{ user: { timeZone: "Asia/Tokyo" } }],
        },
      };
      expect(extractHostTimezone(eventType)).toBe("Asia/Tokyo");
    });

    it("should return guessed timezone when no timezone info available", () => {
      const eventType = {};
      const result = extractHostTimezone(eventType);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("isUsageBasedExpired", () => {
    it("should return false when maxUsageCount is null", () => {
      expect(isUsageBasedExpired(5, null)).toBe(false);
    });

    it("should return false when maxUsageCount is 0", () => {
      expect(isUsageBasedExpired(5, 0)).toBe(false);
    });

    it("should return false when maxUsageCount is negative", () => {
      expect(isUsageBasedExpired(5, -1)).toBe(false);
    });

    it("should return false when usageCount is less than maxUsageCount", () => {
      expect(isUsageBasedExpired(3, 5)).toBe(false);
    });

    it("should return true when usageCount equals maxUsageCount", () => {
      expect(isUsageBasedExpired(5, 5)).toBe(true);
    });

    it("should return true when usageCount exceeds maxUsageCount", () => {
      expect(isUsageBasedExpired(10, 5)).toBe(true);
    });
  });

  describe("isLinkExpired", () => {
    it("should return false for link with no expiration", () => {
      const link = {};
      expect(isLinkExpired(link)).toBe(false);
    });

    it("should return true when usage count exceeds max", () => {
      const link = { usageCount: 5, maxUsageCount: 3 };
      expect(isLinkExpired(link)).toBe(true);
    });

    it("should return false when usage count is below max", () => {
      const link = { usageCount: 2, maxUsageCount: 5 };
      expect(isLinkExpired(link)).toBe(false);
    });
  });

  describe("filterActiveLinks", () => {
    it("should filter out expired links based on usage", () => {
      const links = [
        { id: 1, usageCount: 5, maxUsageCount: 3 }, // expired
        { id: 2, usageCount: 1, maxUsageCount: 5 }, // active
        { id: 3, usageCount: 10, maxUsageCount: 10 }, // expired
      ];
      const result = filterActiveLinks(links);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("should return all links when none are expired", () => {
      const links = [
        { id: 1, usageCount: 1, maxUsageCount: 5 },
        { id: 2, usageCount: 2, maxUsageCount: 5 },
      ];
      const result = filterActiveLinks(links);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when all links are expired", () => {
      const links = [
        { id: 1, usageCount: 5, maxUsageCount: 3 },
        { id: 2, usageCount: 10, maxUsageCount: 5 },
      ];
      const result = filterActiveLinks(links);
      expect(result).toHaveLength(0);
    });

    it("should handle empty array", () => {
      const result = filterActiveLinks([]);
      expect(result).toEqual([]);
    });
  });
});
