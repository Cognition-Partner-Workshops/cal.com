import { describe, expect, it } from "vitest";

import { deriveAppDictKeyFromType } from "./deriveAppDictKeyFromType";

describe("deriveAppDictKeyFromType", () => {
  it("should return the exact appType if it exists in the dict", () => {
    const dict = { zoom: "handler", google: "handler" };
    expect(deriveAppDictKeyFromType("zoom", dict)).toBe("zoom");
  });

  it("should transform zoom_video to zoom (variant 1)", () => {
    const dict = { zoom: "handler" };
    expect(deriveAppDictKeyFromType("zoom_video", dict)).toBe("zoom");
  });

  it("should transform google_calendar to google (variant 1)", () => {
    const dict = { google: "handler" };
    expect(deriveAppDictKeyFromType("google_calendar", dict)).toBe("google");
  });

  it("should transform zoom_video to zoomvideo (variant 2) if variant 1 not found", () => {
    const dict = { zoomvideo: "handler" };
    expect(deriveAppDictKeyFromType("zoom_video", dict)).toBe("zoomvideo");
  });

  it("should transform hubspot_other_calendar to hubspotothercalendar (variant 3)", () => {
    const dict = { hubspotothercalendar: "handler" };
    expect(deriveAppDictKeyFromType("hubspot_other_calendar", dict)).toBe("hubspotothercalendar");
  });

  it("should transform closecom_other_calendar to closecomothercalendar (variant 3)", () => {
    const dict = { closecomothercalendar: "handler" };
    expect(deriveAppDictKeyFromType("closecom_other_calendar", dict)).toBe("closecomothercalendar");
  });

  it("should return original appType if no variant matches", () => {
    const dict = { other: "handler" };
    expect(deriveAppDictKeyFromType("nonexistent_app", dict)).toBe("nonexistent_app");
  });

  it("should handle empty dict", () => {
    const dict = {};
    expect(deriveAppDictKeyFromType("zoom_video", dict)).toBe("zoom_video");
  });

  it("should handle appType without underscore", () => {
    const dict = { zoom: "handler" };
    expect(deriveAppDictKeyFromType("zoom", dict)).toBe("zoom");
  });

  it("should prioritize exact match over variants", () => {
    const dict = { zoom_video: "exact", zoom: "variant1", zoomvideo: "variant2" };
    expect(deriveAppDictKeyFromType("zoom_video", dict)).toBe("zoom_video");
  });

  it("should prioritize variant 1 over variant 2", () => {
    const dict = { zoom: "variant1", zoomvideo: "variant2" };
    expect(deriveAppDictKeyFromType("zoom_video", dict)).toBe("zoom");
  });

  it("should find variant 3 when only variant 3 exists", () => {
    const dict = { hubspotothercalendar: "variant3" };
    expect(deriveAppDictKeyFromType("hubspot_other_calendar", dict)).toBe("hubspotothercalendar");
  });
});
