import { describe, expect, it } from "vitest";

import { fromEntriesWithDuplicateKeys } from "./fromEntriesWithDuplicateKeys";

describe("fromEntriesWithDuplicateKeys", () => {
  it("should return empty object for null input", () => {
    const result = fromEntriesWithDuplicateKeys(null);
    expect(result).toEqual({});
  });

  it("should handle entries with unique keys", () => {
    const entries = new Map([
      ["a", "1"],
      ["b", "2"],
      ["c", "3"],
    ]).entries();
    const result = fromEntriesWithDuplicateKeys(entries);
    expect(result).toEqual({ a: "1", b: "2", c: "3" });
  });

  it("should convert duplicate keys to arrays", () => {
    const entriesArray: [string, string][] = [
      ["a", "1"],
      ["a", "2"],
      ["b", "3"],
    ];
    const entries = entriesArray[Symbol.iterator]();
    const result = fromEntriesWithDuplicateKeys(entries);
    expect(result).toEqual({ a: ["1", "2"], b: "3" });
  });

  it("should handle multiple duplicates", () => {
    const entriesArray: [string, string][] = [
      ["a", "1"],
      ["a", "2"],
      ["a", "3"],
    ];
    const entries = entriesArray[Symbol.iterator]();
    const result = fromEntriesWithDuplicateKeys(entries);
    expect(result).toEqual({ a: ["1", "2", "3"] });
  });

  it("should handle empty iterator", () => {
    const entries = new Map<string, string>().entries();
    const result = fromEntriesWithDuplicateKeys(entries);
    expect(result).toEqual({});
  });

  it("should handle URLSearchParams entries", () => {
    const params = new URLSearchParams("a=1&a=2&b=3");
    const result = fromEntriesWithDuplicateKeys(params.entries());
    expect(result).toEqual({ a: ["1", "2"], b: "3" });
  });
});
