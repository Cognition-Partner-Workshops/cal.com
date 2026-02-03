import { describe, expect, it } from "vitest";

import { isKeyInObject } from "./isKeyInObject";

describe("isKeyInObject", () => {
  it("should return true when key exists in object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(isKeyInObject("a", obj)).toBe(true);
    expect(isKeyInObject("b", obj)).toBe(true);
    expect(isKeyInObject("c", obj)).toBe(true);
  });

  it("should return false when key does not exist in object", () => {
    const obj = { a: 1, b: 2 };
    expect(isKeyInObject("c", obj)).toBe(false);
    expect(isKeyInObject("d", obj)).toBe(false);
  });

  it("should work with symbol keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value" };
    expect(isKeyInObject(sym, obj)).toBe(true);
  });

  it("should work with numeric keys", () => {
    const obj = { 1: "one", 2: "two" };
    expect(isKeyInObject(1, obj)).toBe(true);
    expect(isKeyInObject(2, obj)).toBe(true);
    expect(isKeyInObject(3, obj)).toBe(false);
  });

  it("should return true for inherited properties", () => {
    const parent = { inherited: true };
    const child = Object.create(parent);
    child.own = true;
    expect(isKeyInObject("own", child)).toBe(true);
    expect(isKeyInObject("inherited", child)).toBe(true);
  });

  it("should work with empty object", () => {
    const obj = {};
    expect(isKeyInObject("any", obj)).toBe(false);
  });

  it("should work with objects containing null and undefined values", () => {
    const obj = { nullKey: null, undefinedKey: undefined };
    expect(isKeyInObject("nullKey", obj)).toBe(true);
    expect(isKeyInObject("undefinedKey", obj)).toBe(true);
    expect(isKeyInObject("nonExistent", obj)).toBe(false);
  });
});
