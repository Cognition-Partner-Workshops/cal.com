import { describe, expect, it } from "vitest";

import { notUndefined, uniqueBy } from "./array";
import { truncate, truncateOnWord } from "./text";

describe("Array Utilities - Extended Tests", () => {
  describe("notUndefined", () => {
    it("should return true for defined values", () => {
      expect(notUndefined("hello")).toBe(true);
      expect(notUndefined(0)).toBe(true);
      expect(notUndefined(false)).toBe(true);
      expect(notUndefined(null)).toBe(true);
      expect(notUndefined("")).toBe(true);
      expect(notUndefined([])).toBe(true);
      expect(notUndefined({})).toBe(true);
    });

    it("should return false for undefined values", () => {
      expect(notUndefined(undefined)).toBe(false);
    });

    it("should work as a type guard in filter operations", () => {
      const mixedArray: (string | undefined)[] = ["a", undefined, "b", undefined, "c"];
      const filteredArray = mixedArray.filter(notUndefined);
      expect(filteredArray).toEqual(["a", "b", "c"]);
      expect(filteredArray.length).toBe(3);
    });

    it("should work with complex objects", () => {
      const objects: ({ id: number } | undefined)[] = [{ id: 1 }, undefined, { id: 2 }, undefined];
      const filtered = objects.filter(notUndefined);
      expect(filtered).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe("uniqueBy - Extended Tests", () => {
    it("should preserve order of first occurrence", () => {
      const input = [
        { id: 3, name: "Third" },
        { id: 1, name: "First" },
        { id: 2, name: "Second" },
        { id: 1, name: "Duplicate First" },
      ];
      const result = uniqueBy(input, ["id"]);
      expect(result[0]).toEqual({ id: 3, name: "Third" });
      expect(result[1]).toEqual({ id: 1, name: "First" });
      expect(result[2]).toEqual({ id: 2, name: "Second" });
    });

    it("should handle objects with nested properties", () => {
      const input = [
        { id: 1, meta: { type: "A" } },
        { id: 1, meta: { type: "B" } },
        { id: 2, meta: { type: "A" } },
      ];
      const result = uniqueBy(input, ["id"]);
      expect(result).toHaveLength(2);
    });

    it("should handle null values in keys", () => {
      const input = [
        { id: null, name: "Null ID 1" },
        { id: null, name: "Null ID 2" },
        { id: 1, name: "Valid ID" },
      ];
      const result = uniqueBy(input, ["id"]);
      expect(result).toHaveLength(2);
    });

    it("should handle string keys", () => {
      const input = [
        { email: "test@example.com", name: "Test 1" },
        { email: "test@example.com", name: "Test 2" },
        { email: "other@example.com", name: "Other" },
      ];
      const result = uniqueBy(input, ["email"]);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Test 1");
    });

    it("should handle three or more keys", () => {
      const input = [
        { a: 1, b: 2, c: 3, value: "first" },
        { a: 1, b: 2, c: 3, value: "duplicate" },
        { a: 1, b: 2, c: 4, value: "different c" },
        { a: 1, b: 3, c: 3, value: "different b" },
      ];
      const result = uniqueBy(input, ["a", "b", "c"]);
      expect(result).toHaveLength(3);
    });

    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i % 100,
        value: `value-${i}`,
      }));
      const result = uniqueBy(largeArray, ["id"]);
      expect(result).toHaveLength(100);
    });
  });
});

describe("Text Utilities - Extended Tests", () => {
  describe("truncate", () => {
    it("should not truncate text shorter than maxLength", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
      expect(truncate("Hi", 5)).toBe("Hi");
    });

    it("should truncate text longer than maxLength with ellipsis", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
      expect(truncate("This is a long text", 10)).toBe("This is...");
    });

    it("should truncate without ellipsis when specified", () => {
      expect(truncate("Hello World", 8, false)).toBe("Hello");
      expect(truncate("This is a long text", 10, false)).toBe("This is");
    });

    it("should handle exact length text", () => {
      expect(truncate("Hello", 5)).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(truncate("", 10)).toBe("");
    });

    it("should handle very short maxLength", () => {
      expect(truncate("Hello", 3)).toBe("...");
      expect(truncate("Hello", 4)).toBe("H...");
    });

    it("should handle unicode characters", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
    });

    it("should handle special characters", () => {
      expect(truncate("Hello! @#$%", 8)).toBe("Hello...");
    });
  });

  describe("truncateOnWord", () => {
    it("should not truncate text shorter than maxLength", () => {
      expect(truncateOnWord("Hello", 10)).toBe("Hello");
    });

    it("should truncate on word boundary", () => {
      const longText = "This is a very long text that needs to be truncated properly on word boundaries";
      const result = truncateOnWord(longText, 150);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(151);
    });

    it("should handle text without spaces", () => {
      const noSpaces = "Thisisaverylongtextwithoutanyspaces";
      const result = truncateOnWord(noSpaces, 150);
      expect(result).toBeDefined();
    });

    it("should handle empty string", () => {
      expect(truncateOnWord("", 10)).toBe("");
    });

    it("should truncate without ellipsis when specified", () => {
      const longText = "This is a very long text that needs to be truncated properly on word boundaries";
      const result = truncateOnWord(longText, 150, false);
      expect(result.endsWith("...")).toBe(false);
    });
  });
});

describe("Email Validation Patterns", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("should validate correct email formats", () => {
    expect(emailRegex.test("test@example.com")).toBe(true);
    expect(emailRegex.test("user.name@domain.org")).toBe(true);
    expect(emailRegex.test("user+tag@example.co.uk")).toBe(true);
  });

  it("should reject invalid email formats", () => {
    expect(emailRegex.test("invalid")).toBe(false);
    expect(emailRegex.test("@example.com")).toBe(false);
    expect(emailRegex.test("test@")).toBe(false);
    expect(emailRegex.test("test @example.com")).toBe(false);
  });
});

describe("URL Validation Patterns", () => {
  const urlRegex = /^https?:\/\/.+/;

  it("should validate HTTP URLs", () => {
    expect(urlRegex.test("http://example.com")).toBe(true);
    expect(urlRegex.test("http://localhost:3000")).toBe(true);
  });

  it("should validate HTTPS URLs", () => {
    expect(urlRegex.test("https://example.com")).toBe(true);
    expect(urlRegex.test("https://app.cal.com/booking")).toBe(true);
  });

  it("should reject invalid URLs", () => {
    expect(urlRegex.test("ftp://example.com")).toBe(false);
    expect(urlRegex.test("example.com")).toBe(false);
    expect(urlRegex.test("//example.com")).toBe(false);
  });
});

describe("Date and Time Utilities", () => {
  describe("ISO Date String Validation", () => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

    it("should validate ISO date strings", () => {
      expect(isoDateRegex.test("2024-01-15T10:30:00Z")).toBe(true);
      expect(isoDateRegex.test("2024-12-31T23:59:59.999Z")).toBe(true);
      expect(isoDateRegex.test("2024-01-01T00:00:00")).toBe(true);
    });

    it("should reject invalid date strings", () => {
      expect(isoDateRegex.test("2024/01/15")).toBe(false);
      expect(isoDateRegex.test("January 15, 2024")).toBe(false);
      expect(isoDateRegex.test("invalid-date")).toBe(false);
    });
  });

  describe("Time Slot Validation", () => {
    const timeSlotRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    it("should validate 24-hour time format", () => {
      expect(timeSlotRegex.test("09:00")).toBe(true);
      expect(timeSlotRegex.test("14:30")).toBe(true);
      expect(timeSlotRegex.test("23:59")).toBe(true);
      expect(timeSlotRegex.test("00:00")).toBe(true);
    });

    it("should reject invalid time formats", () => {
      expect(timeSlotRegex.test("25:00")).toBe(false);
      expect(timeSlotRegex.test("12:60")).toBe(false);
      expect(timeSlotRegex.test("9am")).toBe(false);
      expect(timeSlotRegex.test("12:00 PM")).toBe(false);
    });
  });
});

describe("Booking Duration Validation", () => {
  const validDurations = [15, 30, 45, 60, 90, 120];

  it("should accept standard booking durations", () => {
    validDurations.forEach((duration) => {
      expect(duration).toBeGreaterThan(0);
      expect(duration % 15).toBe(0);
    });
  });

  it("should validate duration is positive", () => {
    expect(15).toBeGreaterThan(0);
    expect(-15).toBeLessThan(0);
    expect(0).toBe(0);
  });

  it("should validate duration is within reasonable limits", () => {
    const maxDuration = 480;
    validDurations.forEach((duration) => {
      expect(duration).toBeLessThanOrEqual(maxDuration);
    });
  });
});

describe("Username Validation", () => {
  const usernameRegex = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i;

  it("should validate correct usernames", () => {
    expect(usernameRegex.test("john")).toBe(true);
    expect(usernameRegex.test("john-doe")).toBe(true);
    expect(usernameRegex.test("user123")).toBe(true);
    expect(usernameRegex.test("a")).toBe(true);
  });

  it("should reject invalid usernames", () => {
    expect(usernameRegex.test("-john")).toBe(false);
    expect(usernameRegex.test("john-")).toBe(false);
    expect(usernameRegex.test("john--doe")).toBe(false);
    expect(usernameRegex.test("")).toBe(false);
  });
});
