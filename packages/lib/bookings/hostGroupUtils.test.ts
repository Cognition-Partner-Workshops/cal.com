import { describe, it, expect } from "vitest";

import { groupHostsByGroupId, getHostsFromOtherGroups } from "./hostGroupUtils";

describe("groupHostsByGroupId", () => {
  it("groups hosts by their groupId when hostGroups are provided", () => {
    const hosts = [
      { id: 1, groupId: "group-1" },
      { id: 2, groupId: "group-2" },
      { id: 3, groupId: "group-1" },
    ];
    const hostGroups = [{ id: "group-1" }, { id: "group-2" }];
    const result = groupHostsByGroupId({ hosts, hostGroups });
    expect(result["group-1"]).toHaveLength(2);
    expect(result["group-2"]).toHaveLength(1);
  });

  it("puts all hosts in default group when no hostGroups are provided", () => {
    const hosts = [
      { id: 1, groupId: null },
      { id: 2, groupId: null },
    ];
    const result = groupHostsByGroupId({ hosts });
    expect(Object.keys(result)).toHaveLength(1);
    expect(Object.values(result)[0]).toHaveLength(2);
  });

  it("puts hosts without groupId into default group even when hostGroups exist", () => {
    const hosts = [
      { id: 1, groupId: null },
      { id: 2, groupId: "group-1" },
    ];
    const hostGroups = [{ id: "group-1" }];
    const result = groupHostsByGroupId({ hosts, hostGroups });
    expect(result["group-1"]).toHaveLength(1);
  });

  it("handles empty hosts array", () => {
    const result = groupHostsByGroupId({ hosts: [] });
    expect(Object.values(result)[0]).toHaveLength(0);
  });

  it("handles empty hostGroups array", () => {
    const hosts = [{ id: 1, groupId: null }];
    const result = groupHostsByGroupId({ hosts, hostGroups: [] });
    expect(Object.values(result)[0]).toHaveLength(1);
  });
});

describe("getHostsFromOtherGroups", () => {
  it("returns hosts from different groups", () => {
    const hosts = [
      { id: 1, groupId: "group-1" },
      { id: 2, groupId: "group-2" },
      { id: 3, groupId: "group-1" },
    ];
    const result = getHostsFromOtherGroups(hosts, "group-1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("returns hosts with groupId when given null groupId", () => {
    const hosts = [
      { id: 1, groupId: "group-1" },
      { id: 2, groupId: null },
    ];
    const result = getHostsFromOtherGroups(hosts, null);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("returns empty array when all hosts are in the same group", () => {
    const hosts = [
      { id: 1, groupId: "group-1" },
      { id: 2, groupId: "group-1" },
    ];
    const result = getHostsFromOtherGroups(hosts, "group-1");
    expect(result).toHaveLength(0);
  });

  it("returns hosts without groupId for a specific group filter", () => {
    const hosts = [
      { id: 1, groupId: "group-1" },
      { id: 2, groupId: null },
    ];
    const result = getHostsFromOtherGroups(hosts, "group-1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });
});
