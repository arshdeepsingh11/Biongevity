import { describe, expect, it } from "vitest";
import { linePrice, parseLines } from "@/lib/bag";
import type { ShopItem } from "@/lib/catalog";

describe("bag storage", () => {
  it("restores valid saved lines", () => {
    expect(parseLines(JSON.stringify([{ id: "a" }, { id: "core", term: 6 }]))).toEqual([{ id: "a" }, { id: "core", term: 6 }]);
  });

  it.each([
    ["nothing saved", null],
    ["corrupted JSON", "{not json"],
    ["an object instead of a list", '{"id":"a"}'],
    ["a string", '"hello"'],
  ])("returns an empty bag for %s instead of crashing", (_n, saved) => {
    expect(parseLines(saved)).toEqual([]);
  });

  it("drops tampered lines (bad id or impossible term)", () => {
    expect(parseLines(JSON.stringify([{ id: 1 }, null, { id: "x", term: 99 }, { id: "ok", term: 12 }]))).toEqual([{ id: "ok", term: 12 }]);
  });
});

describe("line prices", () => {
  const test = { kind: "test", handle: "gut", price: 299 } as ShopItem;
  const program = { kind: "program", handle: "core", price: 2400 } as ShopItem;

  it("uses the published price for non-programs and 12-month programs", () => {
    expect(linePrice(test)).toBe(299);
    expect(linePrice(program, 12)).toBe(2400);
  });

  it("returns null (care-team quote) for unpriced shorter terms", () => {
    expect(linePrice(program, 3)).toBeNull();
  });
});
