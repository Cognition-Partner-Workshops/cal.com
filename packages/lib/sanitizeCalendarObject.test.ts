import { describe, expect, it } from "vitest";

import { sanitizeCalendarObject } from "./sanitizeCalendarObject";

describe("sanitizeCalendarObject", () => {
  it("normalizes CRLF line endings", () => {
    const obj = { data: "LINE1\r\nLINE2\r\nLINE3" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("LINE1\r\nLINE2\r\nLINE3");
  });

  it("normalizes CR line endings to CRLF", () => {
    const obj = { data: "LINE1\rLINE2\rLINE3" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("LINE1\r\nLINE2\r\nLINE3");
  });

  it("normalizes LF line endings to CRLF", () => {
    const obj = { data: "LINE1\nLINE2\nLINE3" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("LINE1\r\nLINE2\r\nLINE3");
  });

  it("removes line folding with space continuation", () => {
    const obj = { data: "DESCRIPTION:This is a long\n description" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("DESCRIPTION:This is a longdescription");
  });

  it("removes line folding with tab continuation", () => {
    const obj = { data: "SUMMARY:Meeting\n\twith team" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("SUMMARY:Meetingwith team");
  });

  it("removes line folding and collapses duplicate colons", () => {
    const obj = { data: "KEY: \r\n :VALUE" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("KEY: :VALUE");
  });

  it("removes line folding and collapses duplicate semicolons", () => {
    const obj = { data: "PARAM; \r\n ;VALUE" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("PARAM; ;VALUE");
  });

  it("removes line folding and collapses duplicate equals signs", () => {
    const obj = { data: "ATTR= \r\n =VALUE" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("ATTR= =VALUE");
  });

  it("handles complex iCalendar data", () => {
    const obj = {
      data: "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:Test\r\nEND:VEVENT\r\nEND:VCALENDAR",
    };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe(
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:Test\r\nEND:VEVENT\r\nEND:VCALENDAR"
    );
  });

  it("handles empty data", () => {
    const obj = { data: "" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("");
  });

  it("handles data with only whitespace", () => {
    const obj = { data: "   " };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("   ");
  });

  it("handles mixed line endings", () => {
    const obj = { data: "LINE1\r\nLINE2\nLINE3\rLINE4" };
    const result = sanitizeCalendarObject(obj as never);
    expect(result).toBe("LINE1\r\nLINE2\r\nLINE3\r\nLINE4");
  });
});
