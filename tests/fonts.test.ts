import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

describe("font theme", () => {
  it("maps the sans font token to the Geist variable registered by the layout", () => {
    expect(css).toContain("--font-sans: var(--font-geist-sans);");
    expect(css).not.toContain("--font-sans: var(--font-sans);");
  });
});
