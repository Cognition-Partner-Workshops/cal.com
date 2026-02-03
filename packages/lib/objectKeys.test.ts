import { describe, expect, it } from "vitest";

import objectKeys from "./objectKeys";

describe("objectKeys", () => {
  it("should return keys of a simple object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["a", "b", "c"]);
  });

  it("should return empty array for empty object", () => {
    const obj = {};
    const keys = objectKeys(obj);
    expect(keys).toEqual([]);
  });

  it("should work with objects containing different value types", () => {
    const obj = {
      string: "hello",
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      nested: { inner: "value" },
    };
    const keys = objectKeys(obj);
    expect(keys).toContain("string");
    expect(keys).toContain("number");
    expect(keys).toContain("boolean");
    expect(keys).toContain("array");
    expect(keys).toContain("nested");
    expect(keys.length).toBe(5);
  });

  it("should work with objects having numeric-like string keys", () => {
    const obj = { "1": "one", "2": "two", "3": "three" };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["1", "2", "3"]);
  });

  it("should preserve key order", () => {
    const obj = { z: 1, a: 2, m: 3 };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["z", "a", "m"]);
  });

  it("should work with objects containing null and undefined values", () => {
    const obj = { a: null, b: undefined, c: "value" };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["a", "b", "c"]);
  });
});
