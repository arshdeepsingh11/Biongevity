"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { REGIONS, type Region, type RegionInfo, detectRegion, formatPrice, readRegion, saveRegion } from "@/lib/region";
import { track } from "@/lib/track";

interface Ctx extends RegionInfo {
  region: Region;
  setRegion: (r: Region) => void;
  /** True once the saved/guessed region has been applied in the browser. */
  ready: boolean;
  isUAE: boolean;
  /** CAD list price shown in the region's currency. */
  price: (cad: number) => string;
  /** Pre-filled WhatsApp opener for this region. */
  whatsappText: (subject?: string) => string;
}

const RegionContext = createContext<Ctx | null>(null);

/** Remembers whether the visitor is browsing as International (CAD, Calgary) or UAE (AED, Dubai). Server renders International. */
export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, set] = useState<Region>("intl");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const r = readRegion() ?? detectRegion();
    set(r); setReady(true);
  }, []);
  useEffect(() => { document.documentElement.dataset.region = region; }, [region]);

  const setRegion = useCallback((r: Region) => { set(r); saveRegion(r); track("region_change", { to: r }); }, []);

  const value = useMemo<Ctx>(() => ({
    ...REGIONS[region], region, setRegion, ready, isUAE: region === "uae",
    price: (cad) => formatPrice(cad, region),
    whatsappText: (subject) => `Hi Biongevity${region === "uae" ? " Dubai" : ""}, I'd like to ${subject ?? "book a consultation"}.`,
  }), [region, ready, setRegion]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): Ctx {
  const c = useContext(RegionContext);
  if (!c) throw new Error("useRegion must be used inside RegionProvider");
  return c;
}
