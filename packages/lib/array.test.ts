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

  it("should handle array with all unique items", () => {
    const input = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Doe" },
    ];
    const result = uniqueBy(input, ["id"]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(input);
  });

  it("should handle array with all duplicate items", () => {
    const input = [
      { id: 1, name: "John" },
      { id: 1, name: "Jane" },
      { id: 1, name: "Doe" },
    ];
    const result = uniqueBy(input, ["id"]);
    expect(result).toHaveLength(1);
    expect(result).toEqual([{ id: 1, name: "John" }]);
  });

  it("should handle objects with null values", () => {
    const input = [
      { id: null, name: "John" },
      { id: null, name: "Jane" },
      { id: 1, name: "Doe" },
    ];
    const result = uniqueBy(input, ["id"]);
    expect(result).toHaveLength(2);
  });

  it("should handle objects with undefined values", () => {
    const input = [
      { id: undefined, name: "John" },
      { id: undefined, name: "Jane" },
      { id: 1, name: "Doe" },
    ];
    const result = uniqueBy(input, ["id"]);
    expect(result).toHaveLength(2);
  });
});

describe("notUndefined", () => {
  it("should return true for truthy values", () => {
    expect(notUndefined("hello")).toBe(true);
    expect(notUndefined(1)).toBe(true);
    expect(notUndefined(true)).toBe(true);
    expect(notUndefined([])).toBe(true);
    expect(notUndefined({})).toBe(true);
    expect(notUndefined(" ")).toBe(true);
  });

  it("should return false for falsy values including undefined", () => {
    expect(notUndefined(undefined)).toBe(false);
    expect(notUndefined(0)).toBe(false);
    expect(notUndefined(false)).toBe(false);
    expect(notUndefined(null)).toBe(false);
    expect(notUndefined("")).toBe(false);
  });

  it("should work as a type guard in filter operations for truthy values", () => {
    const input: (string | undefined)[] = ["a", undefined, "b", undefined, "c"];
    const result = input.filter(notUndefined);
    expect(result).toEqual(["a", "b", "c"]);
    expect(result).toHaveLength(3);
  });

  it("should work with objects", () => {
    const input: ({ id: number } | undefined)[] = [{ id: 1 }, undefined, { id: 2 }];
    const result = input.filter(notUndefined);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("should filter out falsy numbers when used with filter", () => {
    const input: (number | undefined)[] = [0, undefined, 1, undefined, 2];
    const result = input.filter(notUndefined);
    expect(result).toEqual([1, 2]);
  });

  it("should filter out false boolean when used with filter", () => {
    const input: (boolean | undefined)[] = [true, undefined, false, undefined];
    const result = input.filter(notUndefined);
    expect(result).toEqual([true]);
  });

  it("should work with nested objects", () => {
    const input: ({ data: { value: number } } | undefined)[] = [
      { data: { value: 1 } },
      undefined,
      { data: { value: 2 } },
    ];
    const result = input.filter(notUndefined);
    expect(result).toHaveLength(2);
  });
});
