"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { ShineBorder } from "@/components/fx/ShineBorder";
import { useAI } from "@/components/ai/AIProvider";

/** Top bar: frosted glass with brand + AI. Primary navigation lives in the bottom Sparkle Navbar. */
export function Header() {
  const { setOpen } = useAI();
  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-ink/[0.06] bg-white/70 pt-[var(--safe-top)] backdrop-blur-[22px] backdrop-saturate-[1.6]">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="Biongevity home" className="shrink-0"><Logo size={26} /></Link>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="relative flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-white/80 px-3.5 text-[13px] font-semibold ring-1 ring-ink/[0.08]" aria-label="Open Biongevity AI">
            <ShineBorder radius={999} width={1} /><Icon name="sparkle" size={15} className="text-accent" /><span className="hidden sm:inline">Ask AI</span>
            <kbd className="ml-1 hidden rounded bg-canvas px-1.5 text-[10px] text-faint lg:inline">⌘K</kbd>
          </button>
          <Link href="/dashboard/" className="hidden h-9 items-center gap-1.5 rounded-full bg-white/80 px-3.5 text-[13px] font-semibold ring-1 ring-ink/[0.08] hover:text-accent md:flex"><Icon name="user" size={15} />Dashboard</Link>
          <Link href="/contact/" className="flex h-9 items-center rounded-full bg-accent px-3.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(37,99,235,.28)] hover:bg-[#1D4ED8]">Book consult</Link>
        </div>
      </div>
      <div className="h-[2px] w-full overflow-hidden"><div id="scroll-progress" className="h-full origin-left bg-iri-x shadow-[0_0_10px_rgba(37,99,235,.6)]" style={{ transform: "scaleX(0)" }} /></div>
    </header>
  );
}
