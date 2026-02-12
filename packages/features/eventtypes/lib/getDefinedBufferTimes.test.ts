import { describe, expect, it } from "vitest";

import { getDefinedBufferTimes } from "./getDefinedBufferTimes";

describe("getDefinedBufferTimes", () => {
  it("should return an array of predefined buffer times", () => {
    const bufferTimes = getDefinedBufferTimes();
    expect(Array.isArray(bufferTimes)).toBe(true);
    expect(bufferTimes.length).toBeGreaterThan(0);
  });

  it("should contain all expected buffer time values", () => {
    const bufferTimes = getDefinedBufferTimes();
    expect(bufferTimes).toEqual([5, 10, 15, 20, 30, 45, 60, 90, 120]);
  });

  it("should return buffer times in ascending order", () => {
    const bufferTimes = getDefinedBufferTimes();
    for (let i = 1; i < bufferTimes.length; i++) {
      expect(bufferTimes[i]).toBeGreaterThan(bufferTimes[i - 1]);
    }
  });

  it("should include common meeting buffer durations (5, 10, 15, 30 mins)", () => {
    const bufferTimes = getDefinedBufferTimes();
    expect(bufferTimes).toContain(5);
    expect(bufferTimes).toContain(10);
    expect(bufferTimes).toContain(15);
    expect(bufferTimes).toContain(30);
  });

  it("should have maximum buffer time of 120 minutes", () => {
    const bufferTimes = getDefinedBufferTimes();
    expect(bufferTimes[bufferTimes.length - 1]).toBe(120);
  });

  it("should have minimum buffer time of 5 minutes", () => {
    const bufferTimes = getDefinedBufferTimes();
    expect(bufferTimes[0]).toBe(5);
  });

  it("should return all positive numbers", () => {
    const bufferTimes = getDefinedBufferTimes();
    bufferTimes.forEach((time) => {
      expect(time).toBeGreaterThan(0);
    });
  });
});
