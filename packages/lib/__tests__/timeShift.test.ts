import dayjs from "@calcom/dayjs";
import { describe, expect, it } from "vitest";

import { getFirstShiftFlags, getTimeShiftFlags } from "../timeShift";

describe("getTimeShiftFlags", () => {
  it("returns empty array for no dates", () => {
    expect(getTimeShiftFlags({ dates: [], timezone: "Europe/Berlin" })).toEqual([]);
  });

  it("marks only shifting occurrences as true for a DST forward change", () => {
    const tz = "Europe/Berlin";

    const first = dayjs.tz("2026-03-17T01:00:00", tz);
    const second = dayjs.tz("2026-03-24T01:00:00", tz);
    const third = dayjs.tz("2026-03-31T02:00:00", tz);

    const dates = [first.toISOString(), second.toISOString(), third.toISOString()];

    const flags = getTimeShiftFlags({ dates, timezone: tz });

    expect(flags).toEqual([false, false, true]);
  });

  it("marks only shifting occurrences as true for a DST backward change", () => {
    const tz = "Europe/Berlin";

    const first = dayjs.tz("2026-10-18T02:00:00", tz);
    const second = dayjs.tz("2026-10-25T02:00:00", tz);
    const third = dayjs.tz("2026-11-01T01:00:00", tz);

    const dates = [first.toISOString(), second.toISOString(), third.toISOString()];

    const flags = getTimeShiftFlags({ dates, timezone: tz });

    expect(flags).toEqual([false, false, true]);
  });

  it("handles non shifting occurrences", () => {
    const tz = "America/New_York";

    const first = dayjs.tz("2026-04-01T09:00:00", tz);
    const second = dayjs.tz("2026-04-08T09:00:00", tz);
    const third = dayjs.tz("2026-04-15T09:00:00", tz);

    const dates = [first.toISOString(), second.toISOString(), third.toISOString()];

    const flags = getTimeShiftFlags({ dates, timezone: tz });

    expect(flags).toEqual([false, false, false]);
  });
});

describe("getFirstShiftFlags", () => {
  it("returns empty array for empty input", () => {
    expect(getFirstShiftFlags([])).toEqual([]);
  });

  it("returns all false for no shifts", () => {
    expect(getFirstShiftFlags([false, false, false])).toEqual([false, false, false]);
  });

  it("marks only the first shift as true", () => {
    expect(getFirstShiftFlags([false, false, true, true, true])).toEqual([false, false, true, false, false]);
  });

  it("handles single element array with no shift", () => {
    expect(getFirstShiftFlags([false])).toEqual([false]);
  });

  it("handles single element array with shift", () => {
    expect(getFirstShiftFlags([true])).toEqual([true]);
  });

  it("handles shift at the beginning", () => {
    expect(getFirstShiftFlags([true, true, false])).toEqual([true, false, false]);
  });

  it("handles alternating shifts", () => {
    expect(getFirstShiftFlags([false, true, false, true])).toEqual([false, true, false, false]);
  });
});
