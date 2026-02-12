import { describe, it, expect } from "vitest";

import getLabelValueMapFromResponses from "./getLabelValueMapFromResponses";

type CalEvent = Parameters<typeof getLabelValueMapFromResponses>[0];

describe("getLabelValueMapFromResponses", () => {
  it("returns customInputs when no userFieldsResponses", () => {
    const calEvent = {
      customInputs: { "Custom Question": "Answer" },
      userFieldsResponses: null,
      responses: null,
      eventTypeId: 1,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent);
    expect(result).toEqual({ "Custom Question": "Answer" });
  });

  it("maps userFieldsResponses to label-value pairs", () => {
    const calEvent = {
      customInputs: {},
      userFieldsResponses: {
        field1: { label: "Company", value: "Acme Inc", isHidden: false },
        field2: { label: "Notes", value: "Some notes", isHidden: false },
      },
      responses: {},
      eventTypeId: 1,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent);
    expect(result).toEqual({ Company: "Acme Inc", Notes: "Some notes" });
  });

  it("skips fields without labels", () => {
    const calEvent = {
      customInputs: {},
      userFieldsResponses: {
        field1: { label: "", value: "Hidden", isHidden: false },
        field2: { label: "Visible", value: "Shown", isHidden: false },
      },
      responses: {},
      eventTypeId: 1,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent);
    expect(result).toEqual({ Visible: "Shown" });
  });

  it("skips hidden fields for non-organizer", () => {
    const calEvent = {
      customInputs: {},
      userFieldsResponses: {
        field1: { label: "Hidden", value: "Secret", isHidden: true },
        field2: { label: "Visible", value: "Public", isHidden: false },
      },
      responses: {},
      eventTypeId: 1,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent, false);
    expect(result).toEqual({ Visible: "Public" });
  });

  it("shows hidden fields for organizer", () => {
    const calEvent = {
      customInputs: {},
      userFieldsResponses: {
        field1: { label: "Hidden", value: "Secret", isHidden: true },
      },
      responses: {},
      eventTypeId: 1,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent, true);
    expect(result).toEqual({ Hidden: "Secret" });
  });

  it("includes title from responses when not dynamic event", () => {
    const calEvent = {
      customInputs: {},
      userFieldsResponses: {
        someField: { label: "Field", value: "Val", isHidden: false },
      },
      responses: {
        title: { label: "Title", value: "Custom Title" },
      },
      eventTypeId: 1,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent);
    expect(result).toHaveProperty("Field");
  });

  it("treats event as dynamic when eventTypeId is falsy", () => {
    const calEvent = {
      customInputs: {},
      userFieldsResponses: {
        someField: { label: "Field", value: "Val", isHidden: false },
      },
      responses: {
        title: { label: "Title", value: "Custom Title" },
      },
      eventTypeId: null,
    } as unknown as CalEvent;
    const result = getLabelValueMapFromResponses(calEvent);
    expect(result).toHaveProperty("Field");
  });
});
