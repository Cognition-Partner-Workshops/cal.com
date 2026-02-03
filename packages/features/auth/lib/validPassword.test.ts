import { describe, it, expect } from "vitest";

import { validPassword } from "./validPassword";

describe("validPassword", () => {
  describe("password length validation", () => {
    it("returns false for passwords shorter than 7 characters", () => {
      expect(validPassword("Abc1")).toBe(false);
      expect(validPassword("Ab1")).toBe(false);
      expect(validPassword("A1")).toBe(false);
      expect(validPassword("")).toBe(false);
    });

    it("returns true for passwords with exactly 7 characters meeting all criteria", () => {
      expect(validPassword("Abcde1f")).toBe(true);
    });

    it("returns true for passwords longer than 7 characters meeting all criteria", () => {
      expect(validPassword("Abcdefg1")).toBe(true);
      expect(validPassword("MySecurePassword123")).toBe(true);
    });
  });

  describe("uppercase letter validation", () => {
    it("returns false when password has no uppercase letters", () => {
      expect(validPassword("abcdefg1")).toBe(false);
      expect(validPassword("password123")).toBe(false);
    });

    it("returns true when password has at least one uppercase letter", () => {
      expect(validPassword("Abcdefg1")).toBe(true);
      expect(validPassword("abcDefg1")).toBe(true);
      expect(validPassword("abcdefG1")).toBe(true);
    });
  });

  describe("lowercase letter validation", () => {
    it("returns false when password has no lowercase letters", () => {
      expect(validPassword("ABCDEFG1")).toBe(false);
      expect(validPassword("PASSWORD123")).toBe(false);
    });

    it("returns true when password has at least one lowercase letter", () => {
      expect(validPassword("ABCDEFg1")).toBe(true);
      expect(validPassword("AbCDEFG1")).toBe(true);
    });
  });

  describe("digit validation", () => {
    it("returns false when password has no digits", () => {
      expect(validPassword("Abcdefgh")).toBe(false);
      expect(validPassword("MyPassword")).toBe(false);
    });

    it("returns true when password has at least one digit", () => {
      expect(validPassword("Abcdefg1")).toBe(true);
      expect(validPassword("Abcdefg123")).toBe(true);
      expect(validPassword("1Abcdefg")).toBe(true);
    });
  });

  describe("combined validation", () => {
    it("returns false when multiple criteria are not met", () => {
      expect(validPassword("abc")).toBe(false);
      expect(validPassword("123456789")).toBe(false);
      expect(validPassword("abcdefghij")).toBe(false);
    });

    it("returns true for valid passwords with special characters", () => {
      expect(validPassword("Abcdef1!")).toBe(true);
      expect(validPassword("P@ssw0rd")).toBe(true);
      expect(validPassword("MyP@ss1#")).toBe(true);
    });

    it("returns true for complex valid passwords", () => {
      expect(validPassword("MySecureP@ssw0rd!")).toBe(true);
      expect(validPassword("C0mpl3xP@ss")).toBe(true);
    });
  });
});
