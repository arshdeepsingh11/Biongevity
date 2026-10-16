import type { Passage } from "./siteIndex";

/**
 * On-device retrieval (BM25) over /site-index.json — picks the passages from our own pages
 * that best match a question. Runs in the browser; the index is fetched once, on the first question.
 */
const STOP = new Set("a an and are as at be but by can do does for from has have how i if in is it its me my of on or our should so than that the their them then there these this to was we what when where which who why will with you your about into more most".split(" "));
const tok = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)).map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));

interface Index { docs: Passage[]; tf: Map<string, number>[]; len: number[]; df: Map<string, number>; avg: number }
let ready: Promise<Index | null> | null = null;

function build(docs: Passage[]): Index {
  const tf: Map<string, number>[] = [], len: number[] = [], df = new Map<string, number>();
  for (const d of docs) {
    const words = tok(`${d.title} ${d.title} ${d.text}`), m = new Map<string, number>();
    for (const w of words) m.set(w, (m.get(w) ?? 0) + 1);
    for (const w of m.keys()) df.set(w, (df.get(w) ?? 0) + 1);
    tf.push(m); len.push(words.length);
  }
  return { docs, tf, len, df, avg: len.reduce((a, b) => a + b, 0) / Math.max(1, len.length) };
}

function load() {
  if (!ready) ready = fetch("/site-index.json").then((r) => (r.ok ? r.json() : [])).then((d: Passage[]) => build(d)).catch(() => { ready = null; return null; });
  return ready;
}

export async function retrieve(q: string, k = 3): Promise<Passage[]> {
  const ix = await load();
  if (!ix) return [];
  const terms = [...new Set(tok(q))];
  if (!terms.length) return [];
  const N = ix.docs.length, k1 = 1.4, b = 0.75;
  const scored = ix.docs.map((d, i) => {
    let s = 0;
    for (const t of terms) {
      const f = ix.tf[i].get(t); if (!f) continue;
      const n = ix.df.get(t) ?? 0, idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * ix.len[i]) / ix.avg)));
    }
    return { d, s };
  }).filter((x) => x.s > 1.2).sort((a, b2) => b2.s - a.s);
  // One passage per URL keeps the sources varied.
  const seen = new Set<string>(), out: Passage[] = [];
  for (const { d } of scored) { if (seen.has(d.url)) continue; seen.add(d.url); out.push(d); if (out.length === k) break; }
  return out;
}

/** Grounding block for the system prompt: numbered passages Biongevity SI can cite as [1]…[3]. */
export const groundingText = (ps: Passage[]) =>
  ps.length ? `Biongevity information:\n${ps.map((p, i) => `[${i + 1}] ${p.title} (${p.url}): ${p.text}`).join("\n")}` : "";
