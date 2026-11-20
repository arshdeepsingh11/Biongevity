"use client";
import { useEffect } from "react";
import type { Region } from "@/lib/region";
import { useRegion } from "./RegionProvider";

/** Pins the region for a regional landing page (e.g. /uae/ → UAE) and remembers it for the rest of the visit. */
export function RegionPin({ region }: { region: Region }) {
  const { region: current, setRegion, ready } = useRegion();
  useEffect(() => { if (ready && current !== region) setRegion(region); }, [ready, current, region, setRegion]);
  return null;
}
