"use client";
import dynamic from "next/dynamic";

/** Loads the Three.js twin core on the client only, after hydration, so the 3D code never blocks the first paint. */
const TwinCore = dynamic(() => import("./TwinCore"), { ssr: false });

export function HeroScene({ className = "" }: { className?: string }) {
  return <TwinCore className={className} />;
}
