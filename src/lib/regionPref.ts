/**
 * The visitor's site choice (Dubai clinic or International), remembered in localStorage.
 * Kept separate from the legacy src/lib/region.ts so the v6 pages ship no old office or currency data.
 */
export type SiteRegion = "intl" | "uae";
export const REGION_KEY = "biongevity.region";
export function saveRegion(r: SiteRegion) {
  try { localStorage.setItem(REGION_KEY, r); } catch { /* private mode */ }
}
