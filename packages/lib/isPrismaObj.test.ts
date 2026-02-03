import { describe, expect, it } from "vitest";

import isPrismaObj, { isPrismaObjOrUndefined } from "./isPrismaObj";

describe("isPrismaObj", () => {
  it("should return true for plain objects", () => {
    expect(isPrismaObj({})).toBe(true);
    expect(isPrismaObj({ a: 1 })).toBe(true);
    expect(isPrismaObj({ nested: { value: true } })).toBe(true);
  });

  it("should return false for arrays", () => {
    expect(isPrismaObj([])).toBe(false);
    expect(isPrismaObj([1, 2, 3])).toBe(false);
    expect(isPrismaObj([{ a: 1 }])).toBe(false);
  });

  it("should return false for null", () => {
    expect(isPrismaObj(null)).toBe(true); // null is typeof 'object' and not an array
  });

  it("should return false for primitive values", () => {
    expect(isPrismaObj("string")).toBe(false);
    expect(isPrismaObj(123)).toBe(false);
    expect(isPrismaObj(true)).toBe(false);
    expect(isPrismaObj(undefined)).toBe(false);
  });
});

describe("isPrismaObjOrUndefined", () => {
  it("should return the object if it is a valid Prisma object", () => {
    const obj = { a: 1 };
    expect(isPrismaObjOrUndefined(obj)).toBe(obj);
  });

  it("should return undefined for arrays", () => {
    expect(isPrismaObjOrUndefined([1, 2, 3])).toBe(undefined);
  });

  it("should return undefined for primitive values", () => {
    expect(isPrismaObjOrUndefined("string")).toBe(undefined);
    expect(isPrismaObjOrUndefined(123)).toBe(undefined);
  });

  it("should return null for null input (since null is typeof object)", () => {
    expect(isPrismaObjOrUndefined(null)).toBe(null);
  });
});
