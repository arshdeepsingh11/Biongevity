import { describe, expect, it } from "vitest";
import { ARABIC, DEPARTMENTS, departments, finderData, servicesOf } from "@/content/uae";
import { t } from "@/i18n";
import { switchLocalePath, localeFromPath, isUaePath } from "@/i18n";
import { knowledge } from "@/lib/ai/knowledge";
import { related, search } from "@/lib/ai/search";
import { finderData as fd } from "@/content/uae";
import { systemPrompt } from "@/lib/ai/prompt";

const AR_LETTERS = /[؀-ۿ]/;

describe("Arabic content mirrors English exactly", () => {
  it("every department, group and service has Arabic text", () => {
    for (const d of DEPARTMENTS) {
      const a = ARABIC[d.id];
      expect(a, d.id).toBeTruthy();
      expect(a.why.length, `${d.id} why`).toBe(d.why.length);
      expect(a.steps.length, `${d.id} steps`).toBe(d.steps.length);
      expect(a.faqs.length, `${d.id} faqs`).toBe(d.faqs.length);
      expect(Object.keys(a.groups).sort()).toEqual(d.groups.map((g) => g.id).sort());
      expect(Object.keys(a.services).sort()).toEqual(servicesOf(d).map((s) => s.slug).sort());
      for (const s of servicesOf(d)) {
        const x = a.services[s.slug];
        expect(AR_LETTERS.test(x.name), `${s.slug} name`).toBe(true);
        expect(x.forWho.length, `${s.slug} forWho`).toBe(s.forWho.length);
        expect(x.includes.length, `${s.slug} includes`).toBe(s.includes.length);
        expect(Object.keys(x.facts ?? {}).sort(), `${s.slug} facts`).toEqual(Object.keys(s.facts ?? {}).sort());
        expect((x.faqs ?? []).length, `${s.slug} faqs`).toBe((s.faqs ?? []).length);
      }
    }
  });

  it("the Arabic site has the same 83 services and slugs", () => {
    const en = departments("en").flatMap((d) => servicesOf(d).map((s) => `${d.id}/${s.slug}`));
    const ar = departments("ar").flatMap((d) => servicesOf(d).map((s) => `${d.id}/${s.slug}`));
    expect(ar).toEqual(en);
    expect(ar.length).toBe(83);
  });

  it("the Arabic dictionary has every English key", () => {
    const en = t("en"), ar = t("ar");
    for (const k of Object.keys(en) as (keyof typeof en)[]) {
      expect(ar[k], String(k)).toBeDefined();
      expect(typeof ar[k], String(k)).toBe(typeof en[k]);
    }
    for (const k of Object.keys(en.wa) as (keyof typeof en.wa)[]) expect(typeof ar.wa[k]).toBe(typeof en.wa[k]);
  });

  it("never lists Glutara or SleepO, Calgary or CAD in Arabic content", () => {
    const all = JSON.stringify(ARABIC);
    for (const bad of ["Glutara", "SleepO", "Calgary", "كالجاري", "CAD", "غلوتارا"]) expect(all.includes(bad), bad).toBe(false);
  });
});

describe("language paths", () => {
  it("switches between /uae and /ar/uae on the same page", () => {
    expect(switchLocalePath("/uae/dental-care/scaling-polishing/", "ar")).toBe("/ar/uae/dental-care/scaling-polishing/");
    expect(switchLocalePath("/ar/uae/dental-care/", "en")).toBe("/uae/dental-care/");
    expect(switchLocalePath("/", "ar")).toBe("/ar/uae/");
    expect(localeFromPath("/ar/uae/")).toBe("ar");
    expect(isUaePath("/ar/uae/about/")).toBe(true);
    expect(isUaePath("/contact/")).toBe(false);
  });
});

describe("treatment finder", () => {
  it("every concern points to 2–3 real service pages in both languages", () => {
    for (const l of ["en", "ar"] as const) {
      for (const c of finderData(l)) {
        expect(c.picks.length, c.id).toBeGreaterThanOrEqual(2);
        for (const p of c.picks) expect(p.href.startsWith(l === "ar" ? "/ar/uae/" : "/uae/")).toBe(true);
      }
    }
  });
});

describe("AI infrastructure", () => {
  it("knowledge covers every service page in both languages", () => {
    for (const l of ["en", "ar"] as const) expect(knowledge(l).filter((d) => d.kind === "service").length).toBe(83);
  });
  it("site search finds pages (English and Arabic)", () => {
    expect(search("hydrafacial", knowledge("en"))[0].title).toBe("HydraFacial");
    expect(search("botox for lines", knowledge("en")).some((d) => d.title === "Botox")).toBe(true);
    expect(search("تنظيف الأسنان", knowledge("ar")).some((d) => d.id.startsWith("dental-care"))).toBe(true);
  });
  it("concern questions return the clinic's own picks first", () => {
    for (const l of ["en", "ar"] as const) {
      const concerns = fd(l).map((c) => ({ label: c.label, en: c.en, urls: c.picks.map((p) => p.href) }));
      const q = l === "en" ? "What is the best treatment for dull skin?" : "ما أفضل علاج للبشرة الباهتة؟";
      const r = related(q, knowledge(l), concerns, 3);
      expect(r[0].url, l).toContain("hydrafacial");
    }
  });
  it("the system prompt keeps the clinic's rules", () => {
    const p = systemPrompt({ locale: "ar", page: "Test" });
    expect(p).toMatch(/Never state or guess a price/);
    expect(p).toMatch(/5% VAT/);
    expect(p).toMatch(/Never mention or recommend Glutara or SleepO/);
    expect(p).toMatch(/Reply in Arabic/);
  });
});
