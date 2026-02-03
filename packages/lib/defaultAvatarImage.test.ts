import { describe, expect, it } from "vitest";

import { getPlaceholderAvatar, getOrgOrTeamAvatar } from "./defaultAvatarImage";

describe("defaultAvatarImage", () => {
  describe("getPlaceholderAvatar", () => {
    it("should return the avatar URL if provided", () => {
      const avatar = "https://example.com/avatar.png";
      expect(getPlaceholderAvatar(avatar, "John Doe")).toEqual(avatar);
    });

    it("should return placeholder URL when avatar is null", () => {
      const result = getPlaceholderAvatar(null, "John Doe");
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=John%20Doe");
    });

    it("should return placeholder URL when avatar is undefined", () => {
      const result = getPlaceholderAvatar(undefined, "Jane Smith");
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=Jane%20Smith");
    });

    it("should handle empty name", () => {
      const result = getPlaceholderAvatar(null, "");
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=");
    });

    it("should handle null name", () => {
      const result = getPlaceholderAvatar(null, null);
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=");
    });

    it("should encode special characters in name", () => {
      const result = getPlaceholderAvatar(null, "John & Jane");
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=John%20%26%20Jane");
    });
  });

  describe("getOrgOrTeamAvatar", () => {
    it("should return team logoUrl if available", () => {
      const team = {
        logoUrl: "https://example.com/team-logo.png",
        name: "Test Team",
        parent: null,
      };
      expect(getOrgOrTeamAvatar(team)).toEqual("https://example.com/team-logo.png");
    });

    it("should return parent logoUrl if team logoUrl is not available", () => {
      const team = {
        logoUrl: null,
        name: "Test Team",
        parent: {
          logoUrl: "https://example.com/parent-logo.png",
        },
      };
      expect(getOrgOrTeamAvatar(team)).toEqual("https://example.com/parent-logo.png");
    });

    it("should return placeholder when neither team nor parent has logoUrl", () => {
      const team = {
        logoUrl: null,
        name: "Test Team",
        parent: {
          logoUrl: null,
        },
      };
      const result = getOrgOrTeamAvatar(team);
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=Test%20Team");
    });

    it("should return placeholder when parent is null and team has no logoUrl", () => {
      const team = {
        logoUrl: null,
        name: "Solo Team",
        parent: null,
      };
      const result = getOrgOrTeamAvatar(team);
      expect(result).toContain("ui-avatars.com");
      expect(result).toContain("name=Solo%20Team");
    });
  });
});
