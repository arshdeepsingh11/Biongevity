"use client";
import { useInView } from "@/hooks/useInView";
import { NumberTicker } from "./NumberTicker";

/** Animated Circular Progress Bar. */
export function ProgressRing({ value, size = 120, stroke = 10, label, dark }: { value: number; size?: number; stroke?: number; label?: string; dark?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - (inView ? value : 0) / 100);
  const id = `ring-${size}-${stroke}`;
  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs><linearGradient id={id} x1="0" x2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset=".35" stopColor="#FF4D8D" /><stop offset=".7" stopColor="#9B6BFF" /><stop offset="1" stopColor="#3D8BFF" /></linearGradient></defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.07)"} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)" }} />
      </svg>
      <div className="absolute text-center">
        <div className={`font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`} style={{ fontSize: size * 0.24 }}>
          <NumberTicker value={value} suffix="%" />
        </div>
        {label && <div className={`text-[11px] ${dark ? "text-white/60" : "text-faint"}`}>{label}</div>}
      </div>
    </div>
  );
}
