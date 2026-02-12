import { describe, it, expect } from "vitest";

import {
  textFilter,
  isTextFilterValue,
  multiSelectFilter,
  isMultiSelectFilterValue,
  singleSelectFilter,
  isSingleSelectFilterValue,
  numberFilter,
  dateRangeFilter,
  isNumberFilterValue,
  isDateRangeFilterValue,
  dataTableFilter,
  convertFacetedValuesToMap,
  convertMapToFacetedValues,
} from "./utils";

describe("textFilter", () => {
  it("returns true for equals match", () => {
    expect(textFilter("Hello", { type: "t", data: { operator: "equals", operand: "hello" } })).toBe(true);
  });

  it("returns false for equals mismatch", () => {
    expect(textFilter("Hello", { type: "t", data: { operator: "equals", operand: "world" } })).toBe(false);
  });

  it("returns true for notEquals mismatch", () => {
    expect(textFilter("Hello", { type: "t", data: { operator: "notEquals", operand: "world" } })).toBe(true);
  });

  it("returns false for notEquals match", () => {
    expect(textFilter("Hello", { type: "t", data: { operator: "notEquals", operand: "hello" } })).toBe(
      false
    );
  });

  it("returns true for contains match", () => {
    expect(textFilter("Hello World", { type: "t", data: { operator: "contains", operand: "world" } })).toBe(
      true
    );
  });

  it("returns false for contains mismatch", () => {
    expect(textFilter("Hello World", { type: "t", data: { operator: "contains", operand: "foo" } })).toBe(
      false
    );
  });

  it("returns true for notContains mismatch", () => {
    expect(
      textFilter("Hello World", { type: "t", data: { operator: "notContains", operand: "foo" } })
    ).toBe(true);
  });

  it("returns false for notContains match", () => {
    expect(
      textFilter("Hello World", { type: "t", data: { operator: "notContains", operand: "world" } })
    ).toBe(false);
  });

  it("returns true for startsWith match", () => {
    expect(
      textFilter("Hello World", { type: "t", data: { operator: "startsWith", operand: "hello" } })
    ).toBe(true);
  });

  it("returns false for startsWith mismatch", () => {
    expect(
      textFilter("Hello World", { type: "t", data: { operator: "startsWith", operand: "world" } })
    ).toBe(false);
  });

  it("returns true for endsWith match", () => {
    expect(
      textFilter("Hello World", { type: "t", data: { operator: "endsWith", operand: "world" } })
    ).toBe(true);
  });

  it("returns false for endsWith mismatch", () => {
    expect(
      textFilter("Hello World", { type: "t", data: { operator: "endsWith", operand: "hello" } })
    ).toBe(false);
  });

  it("returns true for isEmpty with empty string", () => {
    expect(textFilter("", { type: "t", data: { operator: "isEmpty", operand: "" } })).toBe(true);
  });

  it("returns true for isEmpty with whitespace-only string", () => {
    expect(textFilter("   ", { type: "t", data: { operator: "isEmpty", operand: "" } })).toBe(true);
  });

  it("returns true for isEmpty with null/undefined cellValue", () => {
    expect(textFilter(null, { type: "t", data: { operator: "isEmpty", operand: "" } })).toBe(true);
    expect(textFilter(undefined, { type: "t", data: { operator: "isEmpty", operand: "" } })).toBe(true);
  });

  it("returns false for isEmpty with non-empty string", () => {
    expect(textFilter("Hello", { type: "t", data: { operator: "isEmpty", operand: "" } })).toBe(false);
  });

  it("returns true for isNotEmpty with non-empty string", () => {
    expect(textFilter("Hello", { type: "t", data: { operator: "isNotEmpty", operand: "" } })).toBe(true);
  });

  it("returns false for isNotEmpty with empty string", () => {
    expect(textFilter("", { type: "t", data: { operator: "isNotEmpty", operand: "" } })).toBe(false);
  });

  it("returns false for non-string cellValue", () => {
    expect(textFilter(42, { type: "t", data: { operator: "equals", operand: "42" } })).toBe(false);
  });

  it("returns false for unknown operator", () => {
    expect(
      textFilter("Hello", { type: "t", data: { operator: "unknown" as "equals", operand: "Hello" } })
    ).toBe(false);
  });
});

describe("isTextFilterValue", () => {
  it("returns true for valid text filter", () => {
    expect(isTextFilterValue({ type: "t", data: { operator: "equals", operand: "test" } })).toBe(true);
  });

  it("returns false for invalid filter", () => {
    expect(isTextFilterValue({ type: "ss", data: "test" })).toBe(false);
  });
});

describe("multiSelectFilter", () => {
  it("returns true when cellValue matches one of filter values (strings)", () => {
    expect(multiSelectFilter("a", { type: "ms", data: ["a", "b", "c"] })).toBe(true);
  });

  it("returns false when cellValue does not match any filter values", () => {
    expect(multiSelectFilter("d", { type: "ms", data: ["a", "b", "c"] })).toBe(false);
  });

  it("returns true for empty filter data", () => {
    expect(multiSelectFilter("a", { type: "ms", data: [] })).toBe(true);
  });

  it("returns true when cellValue array overlaps with filter values", () => {
    expect(multiSelectFilter(["a", "d"], { type: "ms", data: ["a", "b"] })).toBe(true);
  });

  it("handles number arrays", () => {
    expect(multiSelectFilter(1, { type: "ms", data: [1, 2, 3] })).toBe(true);
    expect(multiSelectFilter(4, { type: "ms", data: [1, 2, 3] })).toBe(false);
  });

  it("returns false for mixed types", () => {
    expect(multiSelectFilter("1", { type: "ms", data: [1, 2, 3] })).toBe(false);
  });
});

describe("isMultiSelectFilterValue", () => {
  it("returns true for valid multi-select filter", () => {
    expect(isMultiSelectFilterValue({ type: "ms", data: ["a", "b"] })).toBe(true);
  });

  it("returns false for invalid filter", () => {
    expect(isMultiSelectFilterValue({ type: "t", data: { operator: "equals", operand: "test" } })).toBe(
      false
    );
  });
});

describe("singleSelectFilter", () => {
  it("returns true when values match", () => {
    expect(singleSelectFilter("a", { type: "ss", data: "a" })).toBe(true);
  });

  it("returns false when values don't match", () => {
    expect(singleSelectFilter("a", { type: "ss", data: "b" })).toBe(false);
  });

  it("handles number values", () => {
    expect(singleSelectFilter(1, { type: "ss", data: 1 })).toBe(true);
    expect(singleSelectFilter(1, { type: "ss", data: 2 })).toBe(false);
  });
});

describe("isSingleSelectFilterValue", () => {
  it("returns true for valid single-select filter", () => {
    expect(isSingleSelectFilterValue({ type: "ss", data: "a" })).toBe(true);
  });

  it("returns false for invalid filter", () => {
    expect(isSingleSelectFilterValue({ type: "ms", data: ["a"] })).toBe(false);
  });
});

describe("numberFilter", () => {
  it("returns true for eq match", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "eq", operand: 5 } })).toBe(true);
  });

  it("returns false for eq mismatch", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "eq", operand: 6 } })).toBe(false);
  });

  it("returns true for neq mismatch", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "neq", operand: 6 } })).toBe(true);
  });

  it("returns false for neq match", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "neq", operand: 5 } })).toBe(false);
  });

  it("returns true for gt when greater", () => {
    expect(numberFilter(10, { type: "n", data: { operator: "gt", operand: 5 } })).toBe(true);
  });

  it("returns false for gt when equal", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "gt", operand: 5 } })).toBe(false);
  });

  it("returns true for gte when equal", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "gte", operand: 5 } })).toBe(true);
  });

  it("returns true for lt when less", () => {
    expect(numberFilter(3, { type: "n", data: { operator: "lt", operand: 5 } })).toBe(true);
  });

  it("returns false for lt when equal", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "lt", operand: 5 } })).toBe(false);
  });

  it("returns true for lte when equal", () => {
    expect(numberFilter(5, { type: "n", data: { operator: "lte", operand: 5 } })).toBe(true);
  });

  it("returns false for non-number cellValue", () => {
    expect(numberFilter("5", { type: "n", data: { operator: "eq", operand: 5 } })).toBe(false);
  });
});

describe("isNumberFilterValue", () => {
  it("returns true for valid number filter", () => {
    expect(isNumberFilterValue({ type: "n", data: { operator: "eq", operand: 5 } })).toBe(true);
  });

  it("returns false for invalid filter", () => {
    expect(isNumberFilterValue({ type: "ss", data: "a" })).toBe(false);
  });
});

describe("dateRangeFilter", () => {
  it("returns true when date is within range", () => {
    const date = new Date("2024-06-15");
    expect(
      dateRangeFilter(date, {
        type: "dr",
        data: { startDate: "2024-06-01", endDate: "2024-06-30", preset: "custom" },
      })
    ).toBe(true);
  });

  it("returns false when date is outside range", () => {
    const date = new Date("2024-07-15");
    expect(
      dateRangeFilter(date, {
        type: "dr",
        data: { startDate: "2024-06-01", endDate: "2024-06-30", preset: "custom" },
      })
    ).toBe(false);
  });

  it("returns true when no start/end date is set", () => {
    const date = new Date("2024-06-15");
    expect(
      dateRangeFilter(date, { type: "dr", data: { startDate: null, endDate: null, preset: "custom" } })
    ).toBe(true);
  });

  it("returns false for non-Date cellValue", () => {
    expect(
      dateRangeFilter("2024-06-15", {
        type: "dr",
        data: { startDate: "2024-06-01", endDate: "2024-06-30", preset: "custom" },
      })
    ).toBe(false);
  });
});

describe("isDateRangeFilterValue", () => {
  it("returns true for valid date range filter", () => {
    expect(
      isDateRangeFilterValue({
        type: "dr",
        data: { startDate: "2024-06-01", endDate: "2024-06-30", preset: "custom" },
      })
    ).toBe(true);
  });

  it("returns false for invalid filter", () => {
    expect(isDateRangeFilterValue({ type: "ss", data: "a" })).toBe(false);
  });
});

describe("dataTableFilter", () => {
  it("delegates to singleSelectFilter", () => {
    expect(dataTableFilter("a", { type: "ss", data: "a" })).toBe(true);
  });

  it("delegates to multiSelectFilter", () => {
    expect(dataTableFilter("a", { type: "ms", data: ["a", "b"] })).toBe(true);
  });

  it("delegates to textFilter", () => {
    expect(dataTableFilter("Hello", { type: "t", data: { operator: "equals", operand: "hello" } })).toBe(
      true
    );
  });

  it("delegates to numberFilter", () => {
    expect(dataTableFilter(5, { type: "n", data: { operator: "eq", operand: 5 } })).toBe(true);
  });

  it("delegates to dateRangeFilter", () => {
    const date = new Date("2024-06-15");
    expect(
      dataTableFilter(date, {
        type: "dr",
        data: { startDate: "2024-06-01", endDate: "2024-06-30", preset: "custom" },
      })
    ).toBe(true);
  });

  it("returns false for unknown filter type", () => {
    expect(dataTableFilter("a", { type: "unknown" } as never)).toBe(false);
  });
});

describe("convertFacetedValuesToMap", () => {
  it("converts an array of faceted values to a map", () => {
    const values = [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ];
    const result = convertFacetedValuesToMap(values);
    expect(result.size).toBe(2);
  });

  it("handles empty array", () => {
    const result = convertFacetedValuesToMap([]);
    expect(result.size).toBe(0);
  });

  it("includes section in map keys", () => {
    const values = [{ label: "A", value: "a", section: "sec1" }];
    const result = convertFacetedValuesToMap(values);
    const keys = Array.from(result.keys());
    expect(keys[0]).toEqual({ label: "A", value: "a", section: "sec1" });
  });
});

describe("convertMapToFacetedValues", () => {
  it("converts a map back to faceted values", () => {
    const map = new Map<{ label: string; value: string | number; section?: string }, number>([
      [{ label: "A", value: "a", section: undefined }, 1],
      [{ label: "B", value: "b", section: "sec1" }, 1],
    ]);
    const result = convertMapToFacetedValues(map);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ label: "A", value: "a", section: undefined });
    expect(result[1]).toEqual({ label: "B", value: "b", section: "sec1" });
  });

  it("returns empty array for undefined map", () => {
    expect(convertMapToFacetedValues(undefined)).toEqual([]);
  });

  it("returns empty array for non-Map value", () => {
    expect(convertMapToFacetedValues({} as never)).toEqual([]);
  });

  it("handles string keys in map", () => {
    const map = new Map<string, number>([["test", 1]]);
    const result = convertMapToFacetedValues(map as never);
    expect(result[0]).toEqual({ label: "test", value: "test", section: undefined });
  });
});
