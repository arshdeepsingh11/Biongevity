"use client";
import { useId, type ReactNode } from "react";

/**
 * Electric Border (Lightswind / React Bits pattern) — an animated, turbulent SVG stroke around a card.
 * Used to flag recommended tests and top matches.
 */
export function ElectricBorder({ children, color = "#2563EB", radius = 24, className, active = true }: { children: ReactNode; color?: string; radius?: number; className?: string; active?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative ${className ?? ""}`} style={{ borderRadius: radius }}>
      {active && (
        <>
          <svg aria-hidden className="pointer-events-none absolute -inset-[6px] z-[3] h-[calc(100%+12px)] w-[calc(100%+12px)] overflow-visible">
            <defs>
              <filter id={`e${id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="2" seed="3" result="n">
                  <animate attributeName="seed" values="1;2;3;4;5;6;7;8" dur="0.8s" repeatCount="indefinite" calcMode="discrete" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="B" />
              </filter>
            </defs>
            <rect x="6" y="6" width="calc(100% - 12px)" height="calc(100% - 12px)" rx={radius} fill="none" stroke={color} strokeWidth="2" filter={`url(#e${id})`} style={{ width: "calc(100% - 12px)", height: "calc(100% - 12px)" }} />
          </svg>
          <span aria-hidden className="pointer-events-none absolute -inset-[2px] z-[2] rounded-[inherit] border" style={{ borderColor: `${color}55`, boxShadow: `0 0 22px ${color}40, inset 0 0 18px ${color}18` }} />
        </>
      )}
      {children}
    </div>
  );
}
