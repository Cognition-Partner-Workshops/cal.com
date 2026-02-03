import { describe, expect, it } from "vitest";

import { randomString } from "./random";

describe("Random util tests", () => {
  describe("fn: randomString", () => {
    it("should return a random string of a given length", () => {
      const length = 10;

      const result = randomString(length);

      expect(result).toHaveLength(length);
    });

    it("should return a random string of a default length", () => {
      const length = 12;

      const result = randomString();

      expect(result).toHaveLength(length);
    });

    it("should return a random string of a given length using alphanumeric characters", () => {
      const length = 10;

      const result = randomString(length);

      expect(result).toMatch(/^[a-zA-Z0-9]+$/);
      expect(result).toHaveLength(length);
    });

    it("should return different strings on consecutive calls", () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        results.add(randomString(20));
      }
      expect(results.size).toBeGreaterThan(95);
    });

    it("should handle length of 0", () => {
      const result = randomString(0);
      expect(result).toEqual("");
      expect(result).toHaveLength(0);
    });

    it("should handle length of 1", () => {
      const result = randomString(1);
      expect(result).toHaveLength(1);
      expect(result).toMatch(/^[a-zA-Z0-9]$/);
    });

    it("should handle very large length", () => {
      const length = 10000;
      const result = randomString(length);
      expect(result).toHaveLength(length);
      expect(result).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it("should not contain special characters", () => {
      const result = randomString(1000);
      expect(result).not.toMatch(/[^a-zA-Z0-9]/);
    });
  });
});
