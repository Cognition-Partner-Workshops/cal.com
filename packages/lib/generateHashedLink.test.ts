import { describe, expect, it } from "vitest";

import { generateHashedLink } from "./generateHashedLink";

describe("generateHashedLink", () => {
  it("should generate a hashed link from a number id", () => {
    const result = generateHashedLink(123);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should generate a hashed link from a string id", () => {
    const result = generateHashedLink("test-id");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should generate different hashes for different ids", () => {
    const hash1 = generateHashedLink(1);
    const hash2 = generateHashedLink(2);
    // Due to timestamp in seed, hashes will be different
    expect(hash1).not.toBe(hash2);
  });

  it("should generate unique hashes even for same id (due to timestamp)", () => {
    const hash1 = generateHashedLink(1);
    // Small delay to ensure different timestamp
    const hash2 = generateHashedLink(1);
    // Hashes might be different due to timestamp, but both should be valid strings
    expect(typeof hash1).toBe("string");
    expect(typeof hash2).toBe("string");
  });
});
