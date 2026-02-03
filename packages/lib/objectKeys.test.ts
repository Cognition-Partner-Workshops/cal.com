import { describe, expect, it } from "vitest";

import objectKeys from "./objectKeys";

describe("objectKeys", () => {
  it("should return keys of an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["a", "b", "c"]);
  });

  it("should return empty array for empty object", () => {
    const obj = {};
    const keys = objectKeys(obj);
    expect(keys).toEqual([]);
  });

  it("should work with different value types", () => {
    const obj = {
      string: "hello",
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      nested: { a: 1 },
    };
    const keys = objectKeys(obj);
    expect(keys).toContain("string");
    expect(keys).toContain("number");
    expect(keys).toContain("boolean");
    expect(keys).toContain("array");
    expect(keys).toContain("nested");
    expect(keys.length).toBe(5);
  });

  it("should maintain type safety", () => {
    const obj = { foo: 1, bar: 2 };
    const keys = objectKeys(obj);
    keys.forEach((key) => {
      expect(obj[key]).toBeDefined();
    });
  });
});
