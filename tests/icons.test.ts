import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ICON_FILES } from "@/components/ui/icon-names";
import { ICON_DATA } from "@/components/ui/icon-data";

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

describe("icons", () => {
  it("has path data for every icon name, in all three rendered weights", () => {
    for (const [name, file] of Object.entries(ICON_FILES)) {
      const d = ICON_DATA[file];
      expect(d, `${name} → ${file}`).toBeDefined();
      expect(d.every((w) => w.length > 0 && w.every((p) => /^M[\d.,\sA-Za-z-]+$/.test(p))), `${name} paths`).toBe(true);
    }
  });

  it("covers every literal icon name used in the source", () => {
    const used = new Set<string>();
    for (const f of walk("src").filter((p) => /\.tsx?$/.test(p))) {
      for (const m of readFileSync(f, "utf8").matchAll(/<Icon\s+name="([^"]+)"/g)) used.add(m[1]);
    }
    const missing = [...used].filter((n) => !(n in ICON_FILES));
    expect(missing, "add these to icon-names.ts").toEqual([]);
  });
});
