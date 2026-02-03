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

  it("should work with different value types", () => {
    const obj = {
      string: "hello",
      number: 42,
      boolean: true,
      null: null,
      undefined: undefined,
    };
    expect(isKeyInObject("string", obj)).toBe(true);
    expect(isKeyInObject("number", obj)).toBe(true);
    expect(isKeyInObject("boolean", obj)).toBe(true);
    expect(isKeyInObject("null", obj)).toBe(true);
    expect(isKeyInObject("undefined", obj)).toBe(true);
  });

  it("should return false for empty object", () => {
    const obj = {};
    expect(isKeyInObject("any", obj)).toBe(false);
  });

  it("should work with symbol keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value" };
    expect(isKeyInObject(sym, obj)).toBe(true);
  });

  it("should work with number keys", () => {
    const obj = { 0: "zero", 1: "one" };
    expect(isKeyInObject(0, obj)).toBe(true);
    expect(isKeyInObject(1, obj)).toBe(true);
    expect(isKeyInObject(2, obj)).toBe(false);
  });
});
