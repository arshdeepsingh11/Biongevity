import { pageKey } from "./aiPrompts";

/**
 * On-device interest profile — counts which kinds of pages you open, so "Your next step" can suggest a sensible next page.
 * Stored only in this browser (localStorage). Clear it from the strip at any time.
 */
const KEY = "biongevity.interest.v1";
export type Interest = Record<string, number>;

export function readInterest(): Interest {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Interest; } catch { return {}; }
}
export function recordVisit(path: string) {
  try { const k = pageKey(path), m = readInterest(); m[k] = (m[k] ?? 0) + 1; localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* storage blocked */ }
}
export function clearInterest() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
