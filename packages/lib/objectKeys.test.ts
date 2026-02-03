import { describe, expect, it } from "vitest";

import { objectKeys } from "./objectKeys";

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

  it("should handle objects with different value types", () => {
    const obj = { str: "hello", num: 42, bool: true, arr: [1, 2], nested: { x: 1 } };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["str", "num", "bool", "arr", "nested"]);
  });

  it("should return correctly typed keys", () => {
    const obj = { firstName: "John", lastName: "Doe", age: 30 } as const;
    const keys = objectKeys(obj);
    expect(keys).toContain("firstName");
    expect(keys).toContain("lastName");
    expect(keys).toContain("age");
    expect(keys.length).toBe(3);
  });

  it("should handle objects with numeric-like string keys", () => {
    const obj = { "1": "one", "2": "two", "3": "three" };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["1", "2", "3"]);
  });
});
