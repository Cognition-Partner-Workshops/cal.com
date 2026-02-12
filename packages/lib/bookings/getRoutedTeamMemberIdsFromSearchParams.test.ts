import { describe, it, expect } from "vitest";

import { getRoutedTeamMemberIdsFromSearchParams } from "./getRoutedTeamMemberIdsFromSearchParams";

describe("getRoutedTeamMemberIdsFromSearchParams", () => {
  it("returns parsed team member IDs from search params", () => {
    const params = new URLSearchParams();
    params.set("cal.routedTeamMemberIds", "1,2,3");
    const result = getRoutedTeamMemberIdsFromSearchParams(params);
    expect(result).toEqual([1, 2, 3]);
  });

  it("returns null when parameter is not set", () => {
    const params = new URLSearchParams();
    const result = getRoutedTeamMemberIdsFromSearchParams(params);
    expect(result).toBe(null);
  });

  it("handles single member ID", () => {
    const params = new URLSearchParams();
    params.set("cal.routedTeamMemberIds", "42");
    const result = getRoutedTeamMemberIdsFromSearchParams(params);
    expect(result).toEqual([42]);
  });

  it("filters out empty strings", () => {
    const params = new URLSearchParams();
    params.set("cal.routedTeamMemberIds", "1,,3");
    const result = getRoutedTeamMemberIdsFromSearchParams(params);
    expect(result).toEqual([1, 3]);
  });
});
