import type { KnowledgeDoc } from "./knowledge";

/* Runs in the browser on /ai/knowledge-<lang>.json (no site content is bundled into pages). */

/** Lower-case, strip Arabic diacritics/tatweel, unify alef/ya/ta marbuta forms, drop punctuation. */
export function normalize(s: string) {
  return s.toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}
const STOP = new Set("a an the and or of to for in on at is are be my me i you your it this that what which how do does can with about من في على عن الى إلى ما ماذا هل كيف هو هي انا أنا لي".split(" "));
/** Arabic words often carry a prefix (ال، لل، بال، وال…); strip it so "للبشرة" matches "بشرة". */
const stem = (w: string) => (/[\u0600-\u06FF]/.test(w) && w.length > 4 ? w.replace(/^(وال|بال|كال|فال|لل|ال)/, "") : w);
const tokens = (s: string) => normalize(s).split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

/** Simple keyword ranking (title hits count most). Not AI: used for links and grounding only. */
export function search(query: string, docs: KnowledgeDoc[], n = 3): KnowledgeDoc[] {
  const q = tokens(query);
  if (!q.length) return [];
  const scored = docs.map((d) => {
    const title = tokens(d.title).join(" "), text = tokens(d.text).join(" ");
    let score = 0;
    for (const w of q) {
      if (title.includes(w)) score += 6;
      else if (w.length > 3 && title.includes(w.slice(0, -1))) score += 3;
      if (text.includes(w)) score += 1;
    }
    if (normalize(query).includes(title)) score += 10;
    if (d.kind === "service") score += 0.5;
    return { d, score };
  }).filter((x) => x.score >= 2).sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((x) => x.d);
}

/** Numbered passages for the AI prompt, e.g. "[1] HydraFacial (/uae/…): …". */
export function grounding(query: string, docs: KnowledgeDoc[], pageUrl?: string) {
  const hits = search(query, docs, 4);
  const page = pageUrl ? docs.find((d) => d.url === pageUrl) : undefined;
  const list = page && !hits.includes(page) ? [page, ...hits].slice(0, 4) : hits;
  return { docs: list, text: list.map((d, i) => `[${i + 1}] ${d.title} (${d.url}): ${d.text.slice(0, 900)}`).join("\n") };
}

/** A "what would you like to improve" concern from the treatment finder (chosen by the clinic). */
export interface KnowledgeConcern { label: string; en: string; urls: string[] }

/**
 * Pages related to a question: first the clinic's own picks when the question matches a concern
 * (e.g. "dull skin" → HydraFacial, Skin Boosters, Skin Glow IV Drip), then keyword matches.
 */
export function related(query: string, docs: KnowledgeDoc[], concerns: KnowledgeConcern[] = [], n = 3): KnowledgeDoc[] {
  const q = new Set(tokens(query));
  let best: KnowledgeConcern | undefined, bestHits = 0;
  for (const c of concerns) {
    const words = [...new Set([...tokens(c.label), ...tokens(c.en)])].filter((w) => w.length > 2);
    const hits = words.filter((w) => q.has(w) || [...q].some((x) => x.length > 3 && (x.startsWith(w) || w.startsWith(x)))).length;
    if (hits > bestHits) { best = c; bestHits = hits; }
  }
  const picks = best && bestHits >= 2 ? best.urls.map((u) => docs.find((d) => d.url === u)).filter((d): d is KnowledgeDoc => Boolean(d)) : [];
  const rest = search(query, docs, n + picks.length).filter((d) => !picks.includes(d));
  return [...picks, ...rest].slice(0, n);
}
