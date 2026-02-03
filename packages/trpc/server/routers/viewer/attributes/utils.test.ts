import { describe, expect, it } from "vitest";

import { getOptionsWithValidContains } from "./utils";

type Option = {
  id?: string;
  value: string;
  contains?: string[];
  isGroup?: boolean;
};

describe("getOptionsWithValidContains", () => {
  it("should remove duplicate options based on value", () => {
    const options: Option[] = [
      { id: "1", value: "option1" },
      { id: "2", value: "option1" }, // Duplicate value
      { id: "3", value: "option2" },
    ];

    const result = getOptionsWithValidContains(options);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("option1");
    expect(result[1].value).toBe("option2");
  });

  it("should initialize empty contains array if not provided", () => {
    const options: Option[] = [
      { id: "1", value: "option1" },
      { id: "2", value: "option2" },
    ];

    const result = getOptionsWithValidContains(options);
    expect(result[0].contains).toEqual([]);
    expect(result[1].contains).toEqual([]);
  });

  it("should filter out non-existent sub-options from contains array", () => {
    const options: Option[] = [
      { id: "1", value: "option1", contains: ["2", "3", "nonexistent"] },
      { id: "2", value: "option2" },
      { id: "3", value: "option3" },
    ];

    const result = getOptionsWithValidContains(options);
    expect(result[0].contains).toEqual(["2", "3"]);
    expect(result[1].contains).toEqual([]);
    expect(result[2].contains).toEqual([]);
  });

  it("should handle empty options array", () => {
    const options: Option[] = [];
    const result = getOptionsWithValidContains(options);
    expect(result).toEqual([]);
  });

  it("should prefer option with ID over option without ID when deduplicating", () => {
    const options: Option[] = [
      { value: "option1" },
      { id: "1", value: "option1" },
      { id: "2", value: "option2" },
    ];

    const result = getOptionsWithValidContains(options);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[0].value).toBe("option1");
    expect(result[1].id).toBe("2");
    expect(result[1].value).toBe("option2");
  });

  it("should keep first option when both duplicates have IDs", () => {
    const options: Option[] = [
      { id: "1", value: "option1" },
      { id: "2", value: "option1" },
      { id: "3", value: "option2" },
    ];

    const result = getOptionsWithValidContains(options);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("1");
    expect(result[0].value).toBe("option1");
  });

  it("should keep first option when neither duplicate has an ID", () => {
    const options: Option[] = [{ value: "option1" }, { value: "option1" }, { id: "2", value: "option2" }];

    const result = getOptionsWithValidContains(options);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBeUndefined();
    expect(result[0].value).toBe("option1");
  });
});
