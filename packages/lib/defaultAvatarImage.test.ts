import { describe, expect, it } from "vitest";

import { getPlaceholderAvatar } from "./defaultAvatarImage";

describe("getPlaceholderAvatar", () => {
  it("should return the avatar URL if provided", () => {
    const avatar = "https://example.com/avatar.png";
    expect(getPlaceholderAvatar(avatar, "John Doe")).toBe(avatar);
  });

  it("should return placeholder URL when avatar is null", () => {
    const result = getPlaceholderAvatar(null, "John Doe");
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("John%20Doe");
  });

  it("should return placeholder URL when avatar is undefined", () => {
    const result = getPlaceholderAvatar(undefined, "Jane");
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("Jane");
  });

  it("should handle null name with placeholder", () => {
    const result = getPlaceholderAvatar(null, null);
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain("name=");
  });

  it("should handle undefined name with placeholder", () => {
    const result = getPlaceholderAvatar(null, undefined);
    expect(result).toContain("ui-avatars.com");
  });

  it("should encode special characters in name", () => {
    const result = getPlaceholderAvatar(null, "John & Jane");
    expect(result).toContain("ui-avatars.com");
    expect(result).toContain(encodeURIComponent("John & Jane"));
  });

  it("should return avatar URL even if it is an empty string", () => {
    expect(getPlaceholderAvatar("", "John")).toContain("ui-avatars.com");
  });
});
