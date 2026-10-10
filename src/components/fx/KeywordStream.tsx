/** Infinite keyword marquee (AI data stream). */
export function KeywordStream({ words, reverse, duration = 50 }: { words: string[]; reverse?: boolean; duration?: number }) {
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-3" style={{ ["--dur" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/[0.06] bg-surface/80 px-4 py-2 text-[14px] font-medium text-ink/80 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-iri" />{w}
          </span>
        ))}
      </div>
    </div>
  );
}
