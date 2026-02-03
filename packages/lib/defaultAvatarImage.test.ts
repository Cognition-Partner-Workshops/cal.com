import { describe, expect, it } from "vitest";

import { getOrgOrTeamAvatar, getPlaceholderAvatar } from "./defaultAvatarImage";

describe("getPlaceholderAvatar", () => {
  it("should return the avatar URL if provided", () => {
    const avatarUrl = "https://example.com/avatar.png";
    expect(getPlaceholderAvatar(avatarUrl, "John Doe")).toBe(avatarUrl);
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

  it("should return placeholder URL when avatar is empty string", () => {
    const result = getPlaceholderAvatar("", "Test User");
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("name=Test%20User");
  });

  it("should handle null name", () => {
    const result = getPlaceholderAvatar(null, null);
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("name=");
  });

  it("should handle undefined name", () => {
    const result = getPlaceholderAvatar(null, undefined);
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("name=");
  });

  it("should encode special characters in name", () => {
    const result = getPlaceholderAvatar(null, "John & Jane");
    expect(result).toContain("name=John%20%26%20Jane");
  });
});

describe("getOrgOrTeamAvatar", () => {
  it("should return team logoUrl if available", () => {
    const team = {
      logoUrl: "https://example.com/team-logo.png",
      name: "Team Name",
      parent: null,
    };
    expect(getOrgOrTeamAvatar(team)).toBe("https://example.com/team-logo.png");
  });

  it("should return parent logoUrl if team logoUrl is not available", () => {
    const team = {
      logoUrl: null,
      name: "Team Name",
      parent: { logoUrl: "https://example.com/parent-logo.png" },
    };
    expect(getOrgOrTeamAvatar(team)).toBe("https://example.com/parent-logo.png");
  });

  it("should return placeholder if neither team nor parent has logoUrl", () => {
    const team = {
      logoUrl: null,
      name: "Team Name",
      parent: { logoUrl: null },
    };
    const result = getOrgOrTeamAvatar(team);
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("name=Team%20Name");
  });

  it("should return placeholder if parent is null", () => {
    const team = {
      logoUrl: null,
      name: "Solo Team",
      parent: null,
    };
    const result = getOrgOrTeamAvatar(team);
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("name=Solo%20Team");
  });

  it("should prefer team logoUrl over parent logoUrl", () => {
    const team = {
      logoUrl: "https://example.com/team-logo.png",
      name: "Team Name",
      parent: { logoUrl: "https://example.com/parent-logo.png" },
    };
    expect(getOrgOrTeamAvatar(team)).toBe("https://example.com/team-logo.png");
  });
});
