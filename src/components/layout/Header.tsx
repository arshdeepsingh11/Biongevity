"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { useAI } from "@/components/ai/AIProvider";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { NAV } from "@/data/site";

/** Top bar: brand, Ask Xevyo, theme switcher, Sign in (→ member app) and Book. Primary navigation stays in the bottom Sparkle Navbar;
 *  the Aurora theme also shows the same links inside its floating glass bar on large screens. */
export function Header() {
  const { openCmd } = useAI();
  const path = usePathname() ?? "/";
  const isOn = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-ink/[0.06] pt-[var(--safe-top)] backdrop-blur-[22px] backdrop-saturate-[1.6]" style={{ background: "rgb(var(--c-pearl) / var(--header-alpha))" }}>
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <Link href="/" aria-label="Biongevity home" className="shrink-0"><Logo size={24} /></Link>
        <nav aria-label="Main" className="aurora-nav ml-6 items-center gap-0.5">
          {NAV.filter((n) => n.href).map((n) => (
            <Link key={n.id} href={n.href!} aria-current={isOn(n.href!) ? "page" : undefined}
              className={`relative flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors ${isOn(n.href!) ? "text-accent" : "text-muted hover:text-ink"}`}>
              <Icon name={n.icon} size={15} />{n.label}
              {isOn(n.href!) && <span aria-hidden className="absolute inset-x-3 -bottom-[7px] h-[2px] rounded-full bg-ai-grad" />}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => openCmd()} aria-label="Search or ask Xevyo (Ctrl X)"
            className="group flex h-9 items-center gap-2 rounded-full bg-white/80 pl-1 pr-1 text-[13px] text-muted ring-1 ring-ai/20 transition hover:text-ai hover:ring-ai/40 md:w-[250px] md:pr-2.5">
            <XevyoOrb size={28} />
            <span className="hidden flex-1 text-left md:inline">Ask Xevyo or search</span>
            <kbd className="hidden rounded-md bg-canvas px-1.5 py-0.5 font-mono text-[10.5px] text-faint md:inline">Ctrl X</kbd>
          </button>
          <ThemeSwitcher />
          <Link href="/login/" aria-label="Sign in" className="flex h-9 items-center gap-1.5 rounded-full bg-white/80 px-2.5 text-[13px] font-semibold ring-1 ring-ink/[0.08] hover:text-accent sm:px-3.5"><Icon name="user" size={15} /><span className="hidden sm:inline">Sign in</span></Link>
          <Link href="/contact/" className="flex h-9 items-center rounded-full bg-accent bg-btn-grad px-3 text-[13px] font-semibold text-on-accent shadow-[0_6px_18px_rgb(var(--c-accent)/.26)] hover:brightness-110 sm:px-3.5">Book<span className="hidden sm:inline">&nbsp;consult</span></Link>
        </div>
      </div>
    </header>
  );
}
