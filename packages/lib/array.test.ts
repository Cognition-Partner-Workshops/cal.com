import { describe, it, expect } from "vitest";

import { notUndefined, uniqueBy } from "./array";

describe("uniqueBy", () => {
  it("should remove duplicates based on single key", () => {
    const input = [
      { id: 1, name: "John" },
      { id: 1, name: "Jane" },
      { id: 2, name: "Doe" },
    ];

    const result = uniqueBy(input, ["id"]);
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id: 1, name: "John" },
      { id: 2, name: "Doe" },
    ]);
  });

  it("should remove duplicates based on multiple keys", () => {
    const input = [
      { id: 1, type: "A", value: "first" },
      { id: 1, type: "A", value: "second" },
      { id: 1, type: "B", value: "third" },
      { id: 2, type: "A", value: "fourth" },
    ];

    const result = uniqueBy(input, ["id", "type"]);
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { id: 1, type: "A", value: "first" },
      { id: 1, type: "B", value: "third" },
      { id: 2, type: "A", value: "fourth" },
    ]);
  });

  it("should handle empty array", () => {
    const input: Array<{ id: number }> = [];
    const result = uniqueBy(input, ["id"]);
    expect(result).toEqual([]);
  });

  it("should handle array with single item", () => {
    const input = [{ id: 1, name: "John" }];
    const result = uniqueBy(input, ["id"]);
    expect(result).toEqual(input);
  });
});

describe("notUndefined", () => {
  it("should return true for truthy values", () => {
    expect(notUndefined("hello")).toBe(true);
    expect(notUndefined(1)).toBe(true);
    expect(notUndefined(true)).toBe(true);
    expect(notUndefined({})).toBe(true);
    expect(notUndefined([])).toBe(true);
    expect(notUndefined(-1)).toBe(true);
    expect(notUndefined(" ")).toBe(true);
  });

  it("should return false for falsy values (uses Boolean coercion)", () => {
    expect(notUndefined(undefined)).toBe(false);
    expect(notUndefined(null)).toBe(false);
    expect(notUndefined(0)).toBe(false);
    expect(notUndefined("")).toBe(false);
    expect(notUndefined(false)).toBe(false);
    expect(notUndefined(NaN)).toBe(false);
  });

  it("should work as a type guard in filter operations", () => {
    const mixedArray: (string | undefined)[] = ["a", undefined, "b", undefined, "c"];
    const filtered = mixedArray.filter(notUndefined);

    expect(filtered).toEqual(["a", "b", "c"]);
    expect(filtered).toHaveLength(3);
  });

  it("should filter out undefined from number arrays with truthy values", () => {
    const mixedArray: (number | undefined)[] = [1, undefined, 2, undefined, 3];
    const filtered = mixedArray.filter(notUndefined);

    expect(filtered).toEqual([1, 2, 3]);
  });

  it("should filter out all falsy values including null and zero", () => {
    const mixedArray: (string | null | undefined)[] = ["a", null, undefined, "b"];
    const filtered = mixedArray.filter(notUndefined);

    expect(filtered).toEqual(["a", "b"]);
    expect(filtered).toHaveLength(2);
  });

  it("should only keep truthy values when filtering mixed arrays", () => {
    const mixedArray: (number | string | boolean | null | undefined)[] = [
      0,
      "",
      false,
      null,
      undefined,
      1,
      "hello",
      true,
    ];
    const filtered = mixedArray.filter(notUndefined);

    expect(filtered).toEqual([1, "hello", true]);
    expect(filtered).toHaveLength(3);
  });

  it("should work with object arrays", () => {
    const mixedArray: ({ id: number } | undefined)[] = [{ id: 1 }, undefined, { id: 2 }];
    const filtered = mixedArray.filter(notUndefined);

    expect(filtered).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
