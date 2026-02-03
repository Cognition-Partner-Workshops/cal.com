import { describe, expect, it, vi } from "vitest";

import {
  convertFromSmallestToPresentableCurrencyUnit,
  convertToSmallestCurrencyUnit,
  formatPrice,
  getCurrencySymbol,
} from "./currencyConversions";

describe("convertToSmallestCurrencyUnit", () => {
  it("converts USD amount to cents", () => {
    expect(convertToSmallestCurrencyUnit(10, "USD")).toBe(1000);
    expect(convertToSmallestCurrencyUnit(10.5, "USD")).toBe(1050);
    expect(convertToSmallestCurrencyUnit(0.99, "USD")).toBe(99);
  });

  it("converts EUR amount to cents", () => {
    expect(convertToSmallestCurrencyUnit(25, "EUR")).toBe(2500);
  });

  it("returns same amount for zero-decimal currencies", () => {
    expect(convertToSmallestCurrencyUnit(1000, "JPY")).toBe(1000);
    expect(convertToSmallestCurrencyUnit(500, "KRW")).toBe(500);
    expect(convertToSmallestCurrencyUnit(100, "VND")).toBe(100);
  });

  it("handles case-insensitive currency codes", () => {
    expect(convertToSmallestCurrencyUnit(1000, "jpy")).toBe(1000);
    expect(convertToSmallestCurrencyUnit(10, "usd")).toBe(1000);
  });

  it("rounds to nearest integer for decimal results", () => {
    expect(convertToSmallestCurrencyUnit(10.555, "USD")).toBe(1056);
    expect(convertToSmallestCurrencyUnit(10.554, "USD")).toBe(1055);
  });
});

describe("convertFromSmallestToPresentableCurrencyUnit", () => {
  it("converts cents to USD amount", () => {
    expect(convertFromSmallestToPresentableCurrencyUnit(1000, "USD")).toBe(10);
    expect(convertFromSmallestToPresentableCurrencyUnit(1050, "USD")).toBe(10.5);
    expect(convertFromSmallestToPresentableCurrencyUnit(99, "USD")).toBe(0.99);
  });

  it("converts cents to EUR amount", () => {
    expect(convertFromSmallestToPresentableCurrencyUnit(2500, "EUR")).toBe(25);
  });

  it("returns same amount for zero-decimal currencies", () => {
    expect(convertFromSmallestToPresentableCurrencyUnit(1000, "JPY")).toBe(1000);
    expect(convertFromSmallestToPresentableCurrencyUnit(500, "KRW")).toBe(500);
    expect(convertFromSmallestToPresentableCurrencyUnit(100, "VND")).toBe(100);
  });

  it("handles case-insensitive currency codes", () => {
    expect(convertFromSmallestToPresentableCurrencyUnit(1000, "jpy")).toBe(1000);
    expect(convertFromSmallestToPresentableCurrencyUnit(1000, "usd")).toBe(10);
  });
});

describe("getCurrencySymbol", () => {
  it("returns $ for USD", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("returns correct symbol for EUR", () => {
    const symbol = getCurrencySymbol("EUR");
    expect(symbol).toBe("€");
  });

  it("returns correct symbol for GBP", () => {
    expect(getCurrencySymbol("GBP")).toBe("£");
  });

  it("returns correct symbol for JPY", () => {
    const symbol = getCurrencySymbol("JPY");
    expect(symbol).toBe("¥");
  });

  it("returns $ as fallback for invalid currency code", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const symbol = getCurrencySymbol("INVALID");
    expect(symbol).toBe("$");
    expect(consoleSpy).toHaveBeenCalledWith("Failed to get currency symbol for INVALID, falling back to $");
    consoleSpy.mockRestore();
  });
});

describe("formatPrice", () => {
  it("formats USD price correctly", () => {
    const result = formatPrice(1000, "USD", "en");
    expect(result).toBe("$10.00");
  });

  it("formats EUR price correctly", () => {
    const result = formatPrice(2500, "EUR", "en");
    expect(result).toBe("€25.00");
  });

  it("formats BTC as sats", () => {
    const result = formatPrice(100000, "BTC");
    expect(result).toBe("100000 sats");
  });

  it("handles undefined currency by defaulting to USD", () => {
    const result = formatPrice(1000, undefined, "en");
    expect(result).toBe("$10.00");
  });

  it("handles lowercase currency codes", () => {
    const result = formatPrice(1000, "usd", "en");
    expect(result).toBe("$10.00");
  });

  it("formats zero-decimal currency correctly", () => {
    const result = formatPrice(1000, "JPY", "en");
    expect(result).toBe("¥1,000");
  });
});
