import { hash } from "bcryptjs";
import { describe, it, expect } from "vitest";

import { verifyPassword } from "./verifyPassword";

describe("verifyPassword", () => {
  const testPassword = "MySecureP@ssw0rd";

  it("returns true when password matches the hash", async () => {
    const hashedPassword = await hash(testPassword, 10);
    const result = await verifyPassword(testPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it("returns false when password does not match the hash", async () => {
    const hashedPassword = await hash(testPassword, 10);
    const result = await verifyPassword("WrongPassword123", hashedPassword);
    expect(result).toBe(false);
  });

  it("returns false for empty password against valid hash", async () => {
    const hashedPassword = await hash(testPassword, 10);
    const result = await verifyPassword("", hashedPassword);
    expect(result).toBe(false);
  });

  it("handles passwords with special characters", async () => {
    const specialPassword = "P@ss!#$%^&*()_+";
    const hashedPassword = await hash(specialPassword, 10);
    const result = await verifyPassword(specialPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it("handles unicode passwords", async () => {
    const unicodePassword = "Pässwörd123";
    const hashedPassword = await hash(unicodePassword, 10);
    const result = await verifyPassword(unicodePassword, hashedPassword);
    expect(result).toBe(true);
  });

  it("is case sensitive", async () => {
    const hashedPassword = await hash("Password123", 10);
    const result = await verifyPassword("password123", hashedPassword);
    expect(result).toBe(false);
  });
});
