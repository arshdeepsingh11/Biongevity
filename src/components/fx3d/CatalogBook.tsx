"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { XevyoOrb } from "@/components/ai/XevyoOrb";
import { useAI } from "@/components/ai/AIProvider";
import { cn, formatMoney } from "@/lib/utils";

export interface BookCategory { id: string; title: string; icon: string; line?: string }
export interface BookItem {
  id: string; category: string; title: string; kicker?: string; image?: string; iconUrl?: string; icon: string;
  summary: string; tags?: string[]; price: number; meta?: string; url: string; store: string;
  /** optional richer page: a one-line tagline, "what it measures", who it suits and quick facts */
  tagline?: string; measure?: string; measureTitle?: string; who?: string[]; facts?: { icon: string; label: string; value: string }[];
  /** e.g. active ingredients and amounts */
  table?: { title: string; rows: [string, string][] };
}

/** A photo that quietly falls back to a soft gradient with the item's icon if it cannot load. */
function Photo({ src, icon, alt, className }: { src?: string; icon: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (src && !bad) return <img src={src} alt={alt} onError={() => setBad(true)} draggable={false} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  return <div className={cn("grid h-full w-full place-items-center", className)} style={{ background: "radial-gradient(120% 90% at 30% 20%, rgb(var(--c-surface)), rgb(var(--c-ai-soft)))" }}><Icon name={icon} size={64} className="text-ai/50" /></div>;
}

function ItemIcon({ it, size = 44 }: { it: BookItem; size?: number }) {
  const [bad, setBad] = useState(false);
  return (
    <span className="icon-tile shrink-0 overflow-hidden bg-white" style={{ width: size, height: size }}>
      {it.iconUrl && !bad ? <img src={it.iconUrl} alt="" onError={() => setBad(true)} className="h-[78%] w-[78%] object-contain" /> : <Icon name={it.icon} size={size * 0.46} />}
    </span>
  );
}

/**
 * Catalogue book — one constant-size book. Pick a category; the cover and contents open first, then each product
 * is a spread: its real photo on the left, everything you need to decide on the right (icon, what it is, tags,
 * price) with a link to buy on the real store and Ask SI. Turn pages by clicking, swiping, arrows or the keyboard.
 */
export function CatalogBook({ brand, categories, items, buyLabel = "Buy", compact = false }: { brand: string; categories: BookCategory[]; items: BookItem[]; buyLabel?: string; /** smaller book (home page) */ compact?: boolean }) {
  const { ask } = useAI();
  const [cat, setCat] = useState(categories[0].id);
  const [idx, setIdx] = useState(0);
  const [turn, setTurn] = useState<null | { dir: 1 | -1; go: boolean }>(null);
  const x0 = useRef<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const c = categories.find((x) => x.id === cat)!;
  const list = useMemo(() => items.filter((i) => i.category === cat), [items, cat]);
  const spreads = list.length + 1; // cover/contents + one spread per item

  useEffect(() => { setIdx(0); setTurn(null); }, [cat]);

  const flip = (dir: 1 | -1, to?: number) => {
    if (turn) return;
    const target = to ?? idx + dir;
    if (target < 0 || target >= spreads || target === idx) return;
    // phones show one page with its own entrance; the 3D sheet only turns on the desktop spread
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(min-width: 640px)").matches || Math.abs(target - idx) > 1) { setIdx(target); return; }
    setTurn({ dir, go: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setTurn({ dir, go: true })));
    window.setTimeout(() => { setIdx(target); setTurn(null); }, 820);
  };

  useEffect(() => {
    const el = box.current; if (!el) return;
    const key = (e: KeyboardEvent) => { if (e.key === "ArrowRight") flip(1); if (e.key === "ArrowLeft") flip(-1); };
    el.addEventListener("keydown", key);
    return () => el.removeEventListener("keydown", key);
  });

  /* ── page faces ── */
  const cover = () => (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-6 text-on-ai sm:p-8" style={{ background: "linear-gradient(150deg, rgb(var(--c-ai-2)), rgb(var(--c-ai)) 60%, rgb(var(--c-ai-hi)))" }}>
      <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
      <div className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-on-ai/85">{brand}</div>
      <div className="relative">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur"><Icon name={c.icon} size={26} /></span>
        <div className="mt-4 text-[26px] font-semibold leading-tight tracking-tight sm:text-[32px]">{c.title}</div>
        {c.line && <p className="mt-1 text-[13.5px] text-on-ai/85">{c.line}</p>}
        <div className="mt-3 text-[12px] font-semibold text-on-ai/80">{list.length} {list.length === 1 ? "item" : "items"} · turn the page →</div>
      </div>
    </div>
  );
  const contents = () => (
    <div className="flex h-full flex-col p-5 sm:p-7" style={{ background: "rgb(var(--c-surface))" }}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ai">Contents</div>
      <div className="mt-3 grid min-h-0 flex-1 auto-rows-min gap-1.5 overflow-hidden" style={{ gridTemplateColumns: list.length > 6 ? "1fr 1fr" : "1fr" }}>
        {list.map((it, k) => (
          <button key={it.id} onClick={(e) => { e.stopPropagation(); flip(1, k + 1); }} className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-ai-soft">
            <ItemIcon it={it} size={30} />
            <span className="min-w-0 flex-1"><span className="block truncate text-[12.5px] font-semibold">{it.title}</span><span className="block text-[11px] text-muted">{formatMoney(it.price)}</span></span>
          </button>
        ))}
      </div>
      <div className="mt-2 text-right text-[10.5px] text-faint">1</div>
    </div>
  );
  const photo = (it: BookItem) => (
    <div className="relative h-full overflow-hidden">
      <Photo src={it.image} icon={it.icon} alt={`${it.title} — ${it.store}`} />
      <span className="absolute left-4 top-4"><ItemIcon it={it} size={44} /></span>
    </div>
  );
  const who = (it: BookItem) => it.who?.length ? (
    <div><div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">Who it's for</div>
      <ul className="mt-1 space-y-0.5">{it.who.map((w) => <li key={w} className="flex gap-1.5 text-[12.5px] leading-snug text-muted"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-ai" />{w}</li>)}</ul></div>
  ) : null;
  const facts = (it: BookItem) => it.facts?.length ? (
    <div className="grid grid-cols-2 gap-1.5">
      {it.facts.map((f) => <div key={f.label} className="flex min-w-0 items-center gap-2 rounded-xl bg-canvas px-2.5 py-1.5"><Icon name={f.icon} size={14} className="shrink-0 text-ai" /><span className="min-w-0"><span className="block text-[9.5px] font-semibold uppercase tracking-[0.12em] text-faint">{f.label}</span><span className="block truncate text-[12px] font-semibold" title={f.value}>{f.value}</span></span></div>)}
    </div>
  ) : null;
  const table = (it: BookItem) => it.table?.rows.length ? (
    <div><div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{it.table.title}</div>
      <dl className="mt-1 divide-y divide-ink/[0.06]">{it.table.rows.map(([k, v]) => <div key={k} className="flex items-baseline justify-between gap-3 py-1 text-[12.5px]"><dt className="min-w-0 truncate text-ink/80" title={k}>{k}</dt><dd className="shrink-0 font-semibold tabular-nums">{v}</dd></div>)}</dl></div>
  ) : null;
  /** desktop left page: the photo, and under it the quick facts and who it suits */
  const photoPage = (it: BookItem) => {
    const info = !!(it.facts?.length || it.who?.length), light = !it.who?.length;
    return (
      <div className="flex h-full flex-col" style={{ background: "rgb(var(--c-surface))" }}>
        <div className={info ? (light ? "h-[64%]" : compact ? "h-[46%]" : "h-[50%]") : "h-full"}>{photo(it)}</div>
        {info && <div className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-hidden", compact ? "p-4" : "p-5 sm:p-6")}>{facts(it)}{who(it)}</div>}
      </div>
    );
  };
  const details = (it: BookItem, n: number, full = false) => (
    <div className={cn("flex h-full flex-col overflow-hidden", compact ? "p-4 sm:p-5" : "p-5 sm:p-7")} style={{ background: "rgb(var(--c-surface))" }}>
      <div className="flex items-center gap-2.5"><ItemIcon it={it} size={compact ? 30 : 36} /><span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">{c.title}</span>{it.kicker && <span className="ml-auto shrink-0 rounded-full bg-canvas px-2 py-0.5 text-[10.5px] font-semibold text-muted">{it.kicker}</span>}</div>
      <div className={cn("mt-2.5 font-semibold leading-tight tracking-tight", compact ? "text-[18px] sm:text-[20px]" : "text-[20px] sm:text-[24px]")}>{it.title}</div>
      {it.tagline && <div className="mt-1 text-[13px] font-medium text-ai">{it.tagline}</div>}
      {it.tags?.length ? <div className="mt-2 flex flex-wrap gap-1">{it.tags.slice(0, 3).map((g) => <span key={g} className="rounded-full bg-ai-soft px-2 py-0.5 text-[11px] font-semibold text-ai">{g}</span>)}</div> : null}
      <div className="no-scrollbar mt-3 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 text-[13px] leading-relaxed">
        <p className="text-ink/80">{it.summary}</p>
        {it.measure && <div><div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{it.measureTitle ?? "What it measures"}</div><p className="mt-0.5 text-muted">{it.measure}</p></div>}
        {full && who(it)}
        {table(it)}
      </div>
      {full && it.facts?.length ? <div className="mt-3">{facts(it)}</div> : null}
      <div className="mt-3">
        <div className="flex items-end justify-between gap-2">
          <div><div className={cn("font-semibold tracking-tight", compact ? "text-[22px]" : "text-[26px]")}>{formatMoney(it.price)}</div><div className="text-[11px] text-faint">CAD{it.meta ? ` · ${it.meta}` : ""}</div></div>
          <span className="text-[10.5px] text-faint">{n}</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          <a href={it.url} target="_blank" rel="noopener" className="btn-dark h-10 flex-1 justify-center whitespace-nowrap px-4 text-[13.5px]"><Icon name="bag" size={15} />{buyLabel}<span className="max-[400px]:hidden">&nbsp;on {it.store}</span><Icon name="arrow-up-right" size={13} /></a>
          <button onClick={() => ask(`Explain ${it.title} (${it.store}, ${formatMoney(it.price)} CAD) in plain words: what it is, who it suits, and what to check first. ${it.summary}`, { label: `✦ ${it.title}` })} className="btn-ai h-10 px-4 text-[13px]"><XevyoOrb size={18} />Ask SI</button>
        </div>
      </div>
    </div>
  );
  const left = (s: number): ReactNode => (s === 0 ? cover() : photoPage(list[s - 1]));
  const right = (s: number): ReactNode => (s === 0 ? contents() : details(list[s - 1], s * 2 + 1));
  const nextS = turn ? idx + turn.dir : idx;

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className={cn("no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0", compact && "sm:justify-center")} role="tablist" aria-label="Categories">
        {categories.map((x) => {
          const n = items.filter((i) => i.category === x.id).length;
          return (
            <button key={x.id} role="tab" aria-selected={cat === x.id} onClick={() => setCat(x.id)}
              className={cn("flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold ring-1 transition", cat === x.id ? "bg-ai text-on-ai ring-ai shadow-lift" : "bg-white text-ink ring-ink/[0.08] hover:ring-ai/40")}>
              <span className={cn("grid h-7 w-7 place-items-center rounded-full", cat === x.id ? "bg-white/20" : "icon-tile")}><Icon name={x.icon} size={14} /></span>
              {x.title}<span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <div ref={box} tabIndex={0} aria-label={`${brand} book: ${c.title}. Use the arrow keys to turn pages.`} className={cn("mx-auto w-full outline-none", compact ? "max-w-[880px]" : "max-w-[1040px]")}
        onPointerDown={(e) => (x0.current = e.clientX)} onPointerUp={(e) => { if (x0.current !== null) { const d = e.clientX - x0.current; if (d < -40) flip(1); if (d > 40) flip(-1); } x0.current = null; }}>
        {/* desktop: a two-page spread with a real turning sheet */}
        <div className={cn("relative hidden w-full sm:block", compact ? "aspect-[16/10.2]" : "aspect-[16/9.6]")} style={{ perspective: "2600px" }}>
          <div className="absolute inset-0 rounded-[28px] shadow-lift ring-1 ring-ink/[0.06]" style={{ background: "rgb(var(--c-surface))" }} />
          {/* static halves */}
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-[28px]">{turn?.dir === -1 ? left(nextS) : left(idx)}</div>
          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-[28px]">{turn?.dir === 1 ? right(nextS) : right(idx)}</div>
          {/* the sheet that turns */}
          {turn && (
            <div className={cn("absolute inset-y-0 w-1/2", turn.dir === 1 ? "right-0" : "left-0")}
              style={{ transformStyle: "preserve-3d", transformOrigin: turn.dir === 1 ? "left center" : "right center", transition: "transform .8s cubic-bezier(.3,.7,.2,1)", transform: `rotateY(${turn.go ? (turn.dir === 1 ? -180 : 180) : 0}deg)`, zIndex: 5 }}>
              <div className={cn("absolute inset-0 overflow-hidden", turn.dir === 1 ? "rounded-r-[28px]" : "rounded-l-[28px]")} style={{ backfaceVisibility: "hidden" }}>{turn.dir === 1 ? right(idx) : left(idx)}</div>
              <div className={cn("absolute inset-0 overflow-hidden", turn.dir === 1 ? "rounded-l-[28px]" : "rounded-r-[28px]")} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{turn.dir === 1 ? left(nextS) : right(nextS)}</div>
            </div>
          )}
          {/* spine and page-edge shading */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-[6] w-16 -translate-x-1/2" style={{ background: "linear-gradient(90deg, transparent, rgb(0 0 0 / .10) 45%, rgb(0 0 0 / .16) 50%, rgb(0 0 0 / .10) 55%, transparent)" }} />
          <button aria-label="Previous page" onClick={() => flip(-1)} disabled={idx === 0} className="absolute inset-y-0 left-0 z-[7] w-[8%] cursor-w-resize disabled:cursor-default" />
          <button aria-label="Next page" onClick={() => flip(1)} disabled={idx >= spreads - 1} className="absolute inset-y-0 right-0 z-[7] w-[8%] cursor-e-resize disabled:cursor-default" />
        </div>

        {/* phones: one constant-size page, photo above details */}
        <div className="relative aspect-[3/4.6] w-full overflow-hidden rounded-[26px] shadow-lift ring-1 ring-ink/[0.06] sm:hidden" style={{ perspective: "1600px", background: "rgb(var(--c-surface))" }}>
          <div key={`${cat}-${idx}`} className="book-page-in absolute inset-0 flex flex-col">
            {idx === 0 ? <><div className="h-[46%]">{cover()}</div><div className="min-h-0 flex-1">{contents()}</div></>
              : <><div className="h-[40%]">{photoPage(list[idx - 1])}</div><div className="min-h-0 flex-1">{details(list[idx - 1], idx + 1)}</div></>}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-muted">
          <button onClick={() => flip(-1)} disabled={idx === 0 || !!turn} className="btn-light h-10 px-4 disabled:opacity-40"><Icon name="chevron-left" size={16} />Back</button>
          {spreads > 12 ? <span className="min-w-[64px] text-center font-semibold tabular-nums text-ink">{idx + 1} / {spreads}</span> : <div className="flex items-center gap-1">{Array.from({ length: spreads }, (_, k) => <button key={k} aria-label={`Go to page ${k + 1}`} onClick={() => flip(k > idx ? 1 : -1, k)} className={cn("h-1.5 rounded-full transition-all", k === idx ? "w-6 bg-ai" : "w-1.5 bg-ink/15 hover:bg-ink/30")} />)}</div>}
          <button onClick={() => flip(1)} disabled={idx >= spreads - 1 || !!turn} className="btn-light h-10 px-4 disabled:opacity-40">Turn<Icon name="chevron-right" size={16} /></button>
        </div>
      </div>
    </div>
  );
}
