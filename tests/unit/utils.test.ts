import { describe, it, expect } from "vitest";
import { cn, formatRelativeTime, generateSlug, truncate, getPriorityColor } from "@/lib/utils";

describe("cn (className merge)", () => {
  it("merges classes correctly", () => {
    expect(cn("px-4 py-2", "text-sm")).toBe("px-4 py-2 text-sm");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "skip", "include")).toBe("base include");
  });

  it("deduplicates Tailwind classes", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });
});

describe("generateSlug", () => {
  it("converts name to slug", () => {
    expect(generateSlug("My Project Name")).toBe("my-project-name");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello, World!")).toBe("hello-world");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("  test  ")).toBe("test");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
  });

  it("does not truncate short strings", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });
});

describe("getPriorityColor", () => {
  it("returns correct color for URGENT", () => {
    expect(getPriorityColor("URGENT")).toBe("text-red-500");
  });

  it("returns muted color for NONE", () => {
    expect(getPriorityColor("NONE")).toBe("text-muted-foreground");
  });

  it("returns muted color for unknown priority", () => {
    expect(getPriorityColor("UNKNOWN")).toBe("text-muted-foreground");
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for recent dates", () => {
    expect(formatRelativeTime(new Date())).toBe("just now");
  });

  it("returns minutes ago for dates within an hour", () => {
    const d = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(d)).toBe("5m ago");
  });
});
