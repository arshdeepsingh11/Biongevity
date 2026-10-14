#!/usr/bin/env node
/**
 * Guard rail for the theme system: fails if a hard-coded hex colour appears in src/ outside the allow-list.
 * All colours belong in src/styles/themes.css (4 themes). Run: npm run check:colors
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ALLOW_FILES = ["src/styles/themes.css", "src/lib/theme.ts", "src/app/icon.svg", "src/app/layout.tsx", "src/app/globals.css"];
const ALLOW_VALUES = ["#000", "#fff", "#ffffff", "#FF5F57", "#FEBC2E", "#28C840"]; // masks, print, terminal dots
const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
let bad = 0;
for (const file of walk(join(ROOT, "src"))) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (!/\.(tsx?|css)$/.test(rel) || ALLOW_FILES.includes(rel)) continue;
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    for (const m of line.match(HEX) ?? []) {
      if (ALLOW_VALUES.some((v) => v.toLowerCase() === m.toLowerCase())) continue;
      if (/&#|href=|#[a-z-]+["'`]/.test(line) && !/color|fill|stroke|bg-\[|text-\[|background/i.test(line)) continue; // anchors like "#catalog"
      console.log(`${rel}:${i + 1}  ${m}`); bad++;
    }
  });
}
if (bad) { console.error(`\n✖ ${bad} hard-coded colour(s). Use theme tokens (bg-accent, text-ai, rgb(var(--c-…))) instead.`); process.exit(1); }
console.log("✓ No hard-coded colours outside the theme files.");
