"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

/** Top bar: frosted glass with brand and quick actions. Primary navigation lives in the bottom Sparkle Navbar. */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-ink/[0.06] bg-white/70 pt-[var(--safe-top)] backdrop-blur-[22px] backdrop-saturate-[1.6]">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="Biongevity home" className="shrink-0"><Logo size={26} /></Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/" className="hidden h-9 items-center gap-1.5 rounded-full bg-white/80 px-3.5 text-[13px] font-semibold ring-1 ring-ink/[0.08] hover:text-accent md:flex"><Icon name="user" size={15} />Dashboard</Link>
          <Link href="/contact/" className="flex h-9 items-center rounded-full bg-accent px-3.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(151,112,63,.28)] hover:bg-[#7E5C31]">Book consult</Link>
        </div>
      </div>
    </header>
  );
}
