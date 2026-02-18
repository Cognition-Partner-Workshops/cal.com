import { describe, expect, it } from "vitest";

import { getOptInFeatureConfig, isOptInFeature, OPT_IN_FEATURES } from "./config";

describe("feature-opt-in config", () => {
  describe("OPT_IN_FEATURES", () => {
    it("is an array", () => {
      expect(Array.isArray(OPT_IN_FEATURES)).toBe(true);
    });

    it("each entry has required fields", () => {
      for (const feature of OPT_IN_FEATURES) {
        expect(typeof feature.slug).toBe("string");
        expect(typeof feature.titleI18nKey).toBe("string");
        expect(typeof feature.descriptionI18nKey).toBe("string");
      }
    });
  });

  describe("getOptInFeatureConfig", () => {
    it("returns undefined for a non-existent slug", () => {
      expect(getOptInFeatureConfig("non-existent-feature")).toBeUndefined();
    });
  });

  describe("isOptInFeature", () => {
    it("returns false for a slug not in the allowlist", () => {
      expect(isOptInFeature("non-existent-feature")).toBe(false);
    });
  });
});
