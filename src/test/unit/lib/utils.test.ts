import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind classes (last one wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    const hidden = false;
    expect(cn("a", hidden && "b", undefined, null, "c")).toBe("a c");
  });
});
