import { describe, expect, it } from "vitest";

import { objectsToCsv, sanitizeValue } from "./csvUtils";

describe("csvUtils", () => {
  describe("sanitizeValue", () => {
    it("should return value as-is if no special characters", () => {
      expect(sanitizeValue("hello")).toEqual("hello");
      expect(sanitizeValue("hello world")).toEqual("hello world");
    });

    it("should wrap value in quotes if it contains a comma", () => {
      expect(sanitizeValue("hello,world")).toEqual('"hello,world"');
    });

    it("should wrap value in quotes if it contains a newline", () => {
      expect(sanitizeValue("hello\nworld")).toEqual('"hello\nworld"');
    });

    it("should double quotes and wrap in quotes if value contains quotes", () => {
      expect(sanitizeValue('hello"world')).toEqual('"hello""world"');
      expect(sanitizeValue('"hello"')).toEqual('"""hello"""');
    });

    it("should handle empty string", () => {
      expect(sanitizeValue("")).toEqual("");
    });

    it("should handle value with multiple special characters", () => {
      expect(sanitizeValue('hello"world,test')).toEqual('"hello""world,test"');
    });
  });

  describe("objectsToCsv", () => {
    it("should return empty string for empty array", () => {
      expect(objectsToCsv([])).toEqual("");
    });

    it("should convert single object to CSV", () => {
      const data = [{ name: "John", age: "30" }];
      expect(objectsToCsv(data)).toEqual("name,age\nJohn,30");
    });

    it("should convert multiple objects to CSV", () => {
      const data = [
        { name: "John", age: "30" },
        { name: "Jane", age: "25" },
      ];
      expect(objectsToCsv(data)).toEqual("name,age\nJohn,30\nJane,25");
    });

    it("should handle values with commas", () => {
      const data = [{ name: "Doe, John", city: "New York" }];
      expect(objectsToCsv(data)).toEqual('name,city\n"Doe, John",New York');
    });

    it("should handle values with quotes", () => {
      const data = [{ name: 'John "Johnny" Doe', city: "Boston" }];
      expect(objectsToCsv(data)).toEqual('name,city\n"John ""Johnny"" Doe",Boston');
    });

    it("should handle null and undefined values", () => {
      const data = [{ name: null, city: undefined }];
      expect(objectsToCsv(data)).toEqual("name,city\n,");
    });

    it("should handle headers with special characters", () => {
      const data = [{ "user,name": "John", "user\"id": "123" }];
      expect(objectsToCsv(data)).toEqual('"user,name","user""id"\nJohn,123');
    });
  });
});
