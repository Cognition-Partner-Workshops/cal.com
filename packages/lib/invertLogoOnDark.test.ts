import { describe, expect, it } from "vitest";

import invertLogoOnDark from "./invertLogoOnDark";

describe("invertLogoOnDark", () => {
  describe("when url contains -dark", () => {
    it("should return 'dark:invert' when opposite is false/undefined", () => {
      expect(invertLogoOnDark("/app-store/logo-dark.png")).toBe("dark:invert");
      expect(invertLogoOnDark("/app-store/logo-dark.png", false)).toBe("dark:invert");
    });

    it("should return 'invert dark:invert-0' when opposite is true", () => {
      expect(invertLogoOnDark("/app-store/logo-dark.png", true)).toBe("invert dark:invert-0");
    });
  });

  describe("when url does not start with /app-store", () => {
    it("should return 'dark:invert' when opposite is false/undefined", () => {
      expect(invertLogoOnDark("/other/logo.png")).toBe("dark:invert");
      expect(invertLogoOnDark("/images/logo.png", false)).toBe("dark:invert");
    });

    it("should return 'invert dark:invert-0' when opposite is true", () => {
      expect(invertLogoOnDark("/other/logo.png", true)).toBe("invert dark:invert-0");
    });
  });

  describe("when url starts with /app-store and does not contain -dark", () => {
    it("should return empty string", () => {
      expect(invertLogoOnDark("/app-store/logo.png")).toBe("");
      expect(invertLogoOnDark("/app-store/logo.png", false)).toBe("");
      expect(invertLogoOnDark("/app-store/logo.png", true)).toBe("");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined url", () => {
      expect(invertLogoOnDark(undefined)).toBe("dark:invert");
      expect(invertLogoOnDark(undefined, true)).toBe("invert dark:invert-0");
    });

    it("should handle empty string url", () => {
      expect(invertLogoOnDark("")).toBe("dark:invert");
    });
  });
});
