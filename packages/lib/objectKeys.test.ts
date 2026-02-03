import { describe, expect, it } from "vitest";

import objectKeys from "./objectKeys";

describe("objectKeys", () => {
  it("should return keys of a simple object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["a", "b", "c"]);
  });

  it("should return an empty array for an empty object", () => {
    const obj = {};
    const keys = objectKeys(obj);
    expect(keys).toEqual([]);
  });

  it("should work with objects having different value types", () => {
    const obj = {
      name: "John",
      age: 30,
      active: true,
      data: null,
    };
    const keys = objectKeys(obj);
    expect(keys).toContain("name");
    expect(keys).toContain("age");
    expect(keys).toContain("active");
    expect(keys).toContain("data");
    expect(keys.length).toBe(4);
  });

  it("should work with nested objects", () => {
    const obj = {
      level1: {
        level2: "value",
      },
      other: "data",
    };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["level1", "other"]);
  });

  it("should work with objects having array values", () => {
    const obj = {
      items: [1, 2, 3],
      names: ["a", "b"],
    };
    const keys = objectKeys(obj);
    expect(keys).toEqual(["items", "names"]);
  });

  it("should only return own enumerable properties", () => {
    const parent = { inherited: true };
    const child = Object.create(parent);
    child.own = "value";
    const keys = objectKeys(child);
    expect(keys).toEqual(["own"]);
    expect(keys).not.toContain("inherited");
  });

  it("should work with symbol-free objects", () => {
    const obj = { foo: "bar", baz: 123 };
    const keys = objectKeys(obj);
    expect(keys.every((key) => typeof key === "string")).toBe(true);
  });
});
