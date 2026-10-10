import Link from "next/link";
import type { ReactNode } from "react";
/** Shimmer Button (Magic UI) — navy pill with a travelling light sweep. */
export function ShimmerButton({ href, children, className, external, light }: { href: string; children: ReactNode; className?: string; external?: boolean; light?: boolean }) {
  const cls = `group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[15px] font-semibold shadow-[0_10px_30px_rgba(11,21,48,.25)] ${light ? "bg-white text-navy" : "bg-navy text-white"} transition-transform hover:-translate-y-0.5 ${className ?? ""}`;
  const inner = <><span aria-hidden className={`absolute inset-0 -translate-x-full animate-[sweep_2.8s_ease-in-out_infinite] ${light ? "bg-[linear-gradient(110deg,transparent_30%,rgba(37,99,235,.18)_50%,transparent_70%)]" : "bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,.35)_50%,transparent_70%)]"}`} /><span className="relative flex items-center gap-2">{children}</span></>;
  return external ? <a href={href} target="_blank" rel="noopener" className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}
