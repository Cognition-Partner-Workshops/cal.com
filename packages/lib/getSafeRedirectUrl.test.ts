import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { getSafeRedirectUrl, isSafeUrlToLoadResourceFrom } from "./getSafeRedirectUrl";

vi.mock("./constants", () => ({
  WEBAPP_URL: "https://app.cal.com",
  WEBSITE_URL: "https://cal.com",
  CONSOLE_URL: "https://console.cal.com",
  EMBED_LIB_URL: "https://embed.com",
}));

describe("isSafeUrlToLoadResourceFrom", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("should return true for URLs with same TLD+1 as WEBAPP_URL", () => {
    expect(isSafeUrlToLoadResourceFrom("https://acme.cal.com/path")).toBe(true);
    expect(isSafeUrlToLoadResourceFrom("http://dunder.cal.com?query=1")).toBe(true);
    expect(isSafeUrlToLoadResourceFrom("https://cal.com/path")).toBe(true);
  });

  it("should return true for URLs with same TLD+1 as EMBED_LIB_URL", () => {
    expect(isSafeUrlToLoadResourceFrom("https://test.embed.com/path")).toBe(true);
    expect(isSafeUrlToLoadResourceFrom("http://embed.com/script.js")).toBe(true);
  });

  it("should return true for localhost URLs", () => {
    expect(isSafeUrlToLoadResourceFrom("http://localhost:3000")).toBe(true);
    expect(isSafeUrlToLoadResourceFrom("http://127.0.0.1:3000")).toBe(true);
  });

  it("should return false for different TLD+1", () => {
    expect(isSafeUrlToLoadResourceFrom("https://malicious1.com")).toBe(false);
    expect(isSafeUrlToLoadResourceFrom("https://malicious2.com")).toBe(false);
  });

  it("should return false for non-http/https protocols", () => {
    expect(isSafeUrlToLoadResourceFrom("ftp://example.com")).toBe(false);
    expect(isSafeUrlToLoadResourceFrom("javascript:alert(1)")).toBe(false);
    expect(isSafeUrlToLoadResourceFrom("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("should return false for invalid URLs", () => {
    expect(isSafeUrlToLoadResourceFrom("not-a-url")).toBe(false);
    expect(isSafeUrlToLoadResourceFrom("http://")).toBe(false);
  });
});

describe("getSafeRedirectUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("should return null for empty string", () => {
    expect(getSafeRedirectUrl("")).toBe(null);
  });

  it("should return null for undefined", () => {
    expect(getSafeRedirectUrl()).toBe(null);
  });

  it("should throw error for non-absolute URLs", () => {
    expect(() => getSafeRedirectUrl("/path/to/page")).toThrow("Pass an absolute URL");
    expect(() => getSafeRedirectUrl("path/to/page")).toThrow("Pass an absolute URL");
    expect(() => getSafeRedirectUrl("example.com")).toThrow("Pass an absolute URL");
  });

  it("should return the URL for allowed origins (WEBAPP_URL)", () => {
    expect(getSafeRedirectUrl("https://app.cal.com/dashboard")).toBe("https://app.cal.com/dashboard");
    expect(getSafeRedirectUrl("https://app.cal.com/")).toBe("https://app.cal.com/");
  });

  it("should return the URL for allowed origins (WEBSITE_URL)", () => {
    expect(getSafeRedirectUrl("https://cal.com/about")).toBe("https://cal.com/about");
  });

  it("should return the URL for allowed origins (CONSOLE_URL)", () => {
    expect(getSafeRedirectUrl("https://console.cal.com/admin")).toBe("https://console.cal.com/admin");
  });

  it("should redirect to WEBAPP_URL for disallowed origins", () => {
    expect(getSafeRedirectUrl("https://malicious.com/phishing")).toBe("https://app.cal.com/");
    expect(getSafeRedirectUrl("https://evil.org/hack")).toBe("https://app.cal.com/");
  });

  it("should handle URLs with query parameters", () => {
    expect(getSafeRedirectUrl("https://app.cal.com/page?param=value")).toBe(
      "https://app.cal.com/page?param=value"
    );
  });

  it("should handle URLs with hash fragments", () => {
    expect(getSafeRedirectUrl("https://app.cal.com/page#section")).toBe("https://app.cal.com/page#section");
  });

  it("should handle URLs with ports", () => {
    expect(getSafeRedirectUrl("https://malicious.com:8080/path")).toBe("https://app.cal.com/");
  });

  it("should redirect http protocol to WEBAPP_URL due to origin mismatch", () => {
    expect(getSafeRedirectUrl("http://app.cal.com/page")).toBe("https://app.cal.com/");
  });

  it("should reject URLs with different subdomains of disallowed domains", () => {
    expect(getSafeRedirectUrl("https://sub.malicious.com/path")).toBe("https://app.cal.com/");
  });
});
