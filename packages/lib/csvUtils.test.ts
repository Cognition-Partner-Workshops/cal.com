import { describe, expect, it } from "vitest";

import { objectsToCsv, sanitizeValue } from "./csvUtils";

describe("sanitizeValue", () => {
  it("should return the value unchanged if no special characters", () => {
    expect(sanitizeValue("hello")).toBe("hello");
    expect(sanitizeValue("simple text")).toBe("simple text");
  });

  it("should wrap value in quotes and escape existing quotes", () => {
    expect(sanitizeValue('hello "world"')).toBe('"hello ""world"""');
    expect(sanitizeValue('"quoted"')).toBe('"""quoted"""');
  });

  it("should wrap value in quotes if it contains a comma", () => {
    expect(sanitizeValue("hello, world")).toBe('"hello, world"');
  });

  it("should wrap value in quotes if it contains a newline", () => {
    expect(sanitizeValue("hello\nworld")).toBe('"hello\nworld"');
  });

  it("should handle empty string", () => {
    expect(sanitizeValue("")).toBe("");
  });

  it("should prioritize quote escaping over comma/newline wrapping", () => {
    expect(sanitizeValue('hello, "world"')).toBe('"hello, ""world"""');
  });
});

describe("objectsToCsv", () => {
  it("should return empty string for empty array", () => {
    expect(objectsToCsv([])).toBe("");
  });

  it("should convert a single object to CSV", () => {
    const data = [{ name: "John", age: "30" }];
    expect(objectsToCsv(data)).toBe("name,age\nJohn,30");
  });

  it("should convert multiple objects to CSV", () => {
    const data = [
      { name: "John", age: "30" },
      { name: "Jane", age: "25" },
    ];
    expect(objectsToCsv(data)).toBe("name,age\nJohn,30\nJane,25");
  });

  it("should handle values with commas", () => {
    const data = [{ name: "Doe, John", city: "New York" }];
    expect(objectsToCsv(data)).toBe('name,city\n"Doe, John",New York');
  });

  it("should handle values with quotes", () => {
    const data = [{ name: 'John "Johnny" Doe', city: "LA" }];
    expect(objectsToCsv(data)).toBe('name,city\n"John ""Johnny"" Doe",LA');
  });

  it("should handle null and undefined values", () => {
    const data = [{ name: null, city: undefined }] as unknown as Record<string, string>[];
    expect(objectsToCsv(data)).toBe("name,city\n,");
  });

  it("should handle numeric values", () => {
    const data = [{ id: 1, score: 95.5 }] as unknown as Record<string, string>[];
    expect(objectsToCsv(data)).toBe("id,score\n1,95.5");
  });

  it("should handle headers with special characters", () => {
    const data = [{ "First Name": "John", "Last, Name": "Doe" }];
    expect(objectsToCsv(data)).toBe('First Name,"Last, Name"\nJohn,Doe');
  });

  it("should handle values with newlines", () => {
    const data = [{ description: "Line 1\nLine 2", name: "Test" }];
    expect(objectsToCsv(data)).toBe('description,name\n"Line 1\nLine 2",Test');
  });
});
