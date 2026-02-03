import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { getBrowserInfo, isSafariBrowser, scrollIntoViewSmooth } from "./browser.utils";

vi.mock("@calcom/embed-core/embed-iframe", () => ({
  sdkActionManager: {
    fire: vi.fn(),
  },
}));

describe("getBrowserInfo", () => {
  const originalWindow = global.window;

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should return empty object when window is undefined", () => {
    // @ts-expect-error - Testing undefined window
    global.window = undefined;
    const result = getBrowserInfo();
    expect(result).toEqual({});
  });

  it("should return browser info when window is defined", () => {
    const mockLocation = {
      href: "https://example.com/path?query=1",
      pathname: "/path",
      search: "?query=1",
      origin: "https://example.com",
    };

    global.window = {
      document: {
        location: mockLocation,
        referrer: "https://referrer.com",
        title: "Test Page",
      },
    } as unknown as Window & typeof globalThis;

    const result = getBrowserInfo();

    expect(result).toEqual({
      url: "https://example.com/path?query=1",
      path: "/path",
      referrer: "https://referrer.com",
      title: "Test Page",
      query: "?query=1",
      origin: "https://example.com",
    });
  });

  it("should handle missing location properties gracefully", () => {
    global.window = {
      document: {
        location: {},
        referrer: "",
        title: "",
      },
    } as unknown as Window & typeof globalThis;

    const result = getBrowserInfo();

    expect(result).toBeDefined();
    expect(result.url).toBeUndefined();
    expect(result.path).toBeUndefined();
  });
});

describe("isSafariBrowser", () => {
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  afterEach(() => {
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  it("should return false when window is undefined", () => {
    // @ts-expect-error - Testing undefined window
    global.window = undefined;
    const result = isSafariBrowser();
    expect(result).toBe(false);
  });

  it("should return true for Safari browser", () => {
    global.window = {} as Window & typeof globalThis;
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
      },
      writable: true,
    });

    const result = isSafariBrowser();
    expect(result).toBe(true);
  });

  it("should return false for Chrome browser", () => {
    global.window = {} as Window & typeof globalThis;
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      writable: true,
    });

    const result = isSafariBrowser();
    expect(result).toBe(false);
  });

  it("should return false for Firefox browser", () => {
    global.window = {} as Window & typeof globalThis;
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
      },
      writable: true,
    });

    const result = isSafariBrowser();
    expect(result).toBe(false);
  });

  it("should return false for Edge browser", () => {
    global.window = {} as Window & typeof globalThis;
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
      },
      writable: true,
    });

    const result = isSafariBrowser();
    expect(result).toBe(false);
  });
});

describe("scrollIntoViewSmooth", () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = {
      getBoundingClientRect: vi.fn().mockReturnValue({ top: 100 }),
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement;

    global.requestAnimationFrame = vi.fn((callback) => {
      callback(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call scrollIntoView with smooth behavior", () => {
    scrollIntoViewSmooth(mockElement, false);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("should return early when not in embed mode", () => {
    scrollIntoViewSmooth(mockElement, false);

    expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("should handle embed mode", () => {
    global.window = {} as Window & typeof globalThis;
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      writable: true,
    });

    scrollIntoViewSmooth(mockElement, true);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("should handle Safari in embed mode", () => {
    global.window = {} as Window & typeof globalThis;
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
      },
      writable: true,
    });

    scrollIntoViewSmooth(mockElement, true);

    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });
});
