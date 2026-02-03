import { describe, expect, it } from "vitest";

import { stripMarkdown } from "./stripMarkdown";

describe("stripMarkdown", () => {
  it("should remove bold markdown", () => {
    expect(stripMarkdown("**bold text**")).toBe("bold text");
    expect(stripMarkdown("__bold text__")).toBe("bold text");
  });

  it("should remove italic markdown", () => {
    expect(stripMarkdown("*italic text*")).toBe("italic text");
    expect(stripMarkdown("_italic text_")).toBe("italic text");
  });

  it("should remove headers", () => {
    expect(stripMarkdown("# Header 1")).toBe("Header 1");
    expect(stripMarkdown("## Header 2")).toBe("Header 2");
    expect(stripMarkdown("### Header 3")).toBe("Header 3");
  });

  it("should remove links", () => {
    expect(stripMarkdown("[link text](https://example.com)")).toBe("link text");
  });

  it("should remove inline code", () => {
    expect(stripMarkdown("`code`")).toBe("code");
  });

  it("should handle plain text", () => {
    expect(stripMarkdown("plain text")).toBe("plain text");
  });

  it("should handle empty string", () => {
    expect(stripMarkdown("")).toBe("");
  });

  it("should handle mixed markdown", () => {
    const input = "# Title\n\nThis is **bold** and *italic* with a [link](url).";
    const result = stripMarkdown(input);
    expect(result).not.toContain("**");
    expect(result).not.toContain("*");
    expect(result).not.toContain("[");
    expect(result).not.toContain("]");
  });
});
