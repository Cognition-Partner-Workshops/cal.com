import { describe, expect, it } from "vitest";

import { fromEntriesWithDuplicateKeys } from "./fromEntriesWithDuplicateKeys";

describe("fromEntriesWithDuplicateKeys", () => {
  it("returns empty object for null input", () => {
    const result = fromEntriesWithDuplicateKeys(null);
    expect(result).toEqual({});
  });

  it("returns object with single values for unique keys", () => {
    const entries = new Map([
      ["key1", "value1"],
      ["key2", "value2"],
      ["key3", "value3"],
    ]).entries();

    const result = fromEntriesWithDuplicateKeys(entries);

    expect(result).toEqual({
      key1: "value1",
      key2: "value2",
      key3: "value3",
    });
  });

  it("converts duplicate keys to arrays", () => {
    const entries = [
      ["color", "red"],
      ["color", "blue"],
      ["color", "green"],
    ] as [string, string][];

    const result = fromEntriesWithDuplicateKeys(entries[Symbol.iterator]());

    expect(result).toEqual({
      color: ["red", "blue", "green"],
    });
  });

  it("handles mix of unique and duplicate keys", () => {
    const entries = [
      ["name", "John"],
      ["hobby", "reading"],
      ["hobby", "gaming"],
      ["age", "30"],
    ] as [string, string][];

    const result = fromEntriesWithDuplicateKeys(entries[Symbol.iterator]());

    expect(result).toEqual({
      name: "John",
      hobby: ["reading", "gaming"],
      age: "30",
    });
  });

  it("handles empty iterator", () => {
    const entries: [string, string][] = [];
    const result = fromEntriesWithDuplicateKeys(entries[Symbol.iterator]());
    expect(result).toEqual({});
  });

  it("handles single entry", () => {
    const entries = [["key", "value"]] as [string, string][];
    const result = fromEntriesWithDuplicateKeys(entries[Symbol.iterator]());
    expect(result).toEqual({ key: "value" });
  });

  it("handles URLSearchParams entries with duplicates", () => {
    const params = new URLSearchParams("color=red&color=blue&size=large");
    const result = fromEntriesWithDuplicateKeys(params.entries());

    expect(result).toEqual({
      color: ["red", "blue"],
      size: "large",
    });
  });

  it("handles three or more duplicate values", () => {
    const entries = [
      ["item", "a"],
      ["item", "b"],
      ["item", "c"],
      ["item", "d"],
    ] as [string, string][];

    const result = fromEntriesWithDuplicateKeys(entries[Symbol.iterator]());

    expect(result).toEqual({
      item: ["a", "b", "c", "d"],
    });
  });
});
