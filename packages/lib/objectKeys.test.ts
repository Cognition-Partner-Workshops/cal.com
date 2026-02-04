import { describe, expect, it } from "vitest";

import objectKeys from "./objectKeys";

describe("objectKeys", () => {
  it("should return keys of a simple object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = objectKeys(obj);

    expect(keys).toEqual(["a", "b", "c"]);
    expect(keys).toHaveLength(3);
  });

  it("should return an empty array for an empty object", () => {
    const obj = {};
    const keys = objectKeys(obj);

    expect(keys).toEqual([]);
    expect(keys).toHaveLength(0);
  });

  it("should return keys with different value types", () => {
    const obj = {
      stringKey: "value",
      numberKey: 42,
      booleanKey: true,
      nullKey: null,
      objectKey: { nested: true },
      arrayKey: [1, 2, 3],
    };
    const keys = objectKeys(obj);

    expect(keys).toContain("stringKey");
    expect(keys).toContain("numberKey");
    expect(keys).toContain("booleanKey");
    expect(keys).toContain("nullKey");
    expect(keys).toContain("objectKey");
    expect(keys).toContain("arrayKey");
    expect(keys).toHaveLength(6);
  });

  it("should work with objects having string keys", () => {
    const obj = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    };
    const keys = objectKeys(obj);

    expect(keys).toEqual(["firstName", "lastName", "email"]);
  });

  it("should work with objects having numeric-like string keys", () => {
    const obj = {
      "1": "one",
      "2": "two",
      "3": "three",
    };
    const keys = objectKeys(obj);

    expect(keys).toEqual(["1", "2", "3"]);
  });

  it("should preserve key order as defined", () => {
    const obj = { z: 1, a: 2, m: 3 };
    const keys = objectKeys(obj);

    expect(keys).toEqual(["z", "a", "m"]);
  });

  it("should work with nested objects (only returns top-level keys)", () => {
    const obj = {
      level1: {
        level2: {
          level3: "deep",
        },
      },
      another: "value",
    };
    const keys = objectKeys(obj);

    expect(keys).toEqual(["level1", "another"]);
    expect(keys).not.toContain("level2");
    expect(keys).not.toContain("level3");
  });

  it("should be usable in iteration", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const values: number[] = [];

    for (const key of objectKeys(obj)) {
      values.push(obj[key]);
    }

    expect(values).toEqual([1, 2, 3]);
  });

  it("should work with typed objects", () => {
    interface User {
      id: number;
      name: string;
      active: boolean;
    }

    const user: User = {
      id: 1,
      name: "John",
      active: true,
    };

    const keys = objectKeys(user);

    expect(keys).toContain("id");
    expect(keys).toContain("name");
    expect(keys).toContain("active");
    expect(keys).toHaveLength(3);
  });
});
