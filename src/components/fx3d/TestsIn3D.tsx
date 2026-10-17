"use client";
import { useMemo } from "react";
import { LAB_COLLECTIONS, LAB_TESTS, SHOP_META, shopIcon, shopSlug } from "@/data/labs";
import { TEST_INTEL, RETEST_LABEL } from "@/lib/testIntel";
import { CatalogBook, type BookItem } from "./CatalogBook";

/**
 * BioAro Labs as a book — category tabs, then one spread per test: the real product photo, its icon, what it
 * measures, tags, CAD price and a link to buy on bioarolabs.com. Biongevity SI explains any page.
 */
export function TestsIn3D() {
  const items: BookItem[] = useMemo(() => LAB_TESTS.map((t) => {
    const slug = shopSlug(t.title), meta = SHOP_META[slug ?? ""], intel = TEST_INTEL.find((x) => x.t.handle === t.handle);
    return {
      id: t.handle, category: t.category, title: t.title, kicker: meta?.badge, image: t.image, iconUrl: shopIcon(slug), icon: t.icon,
      summary: [t.bestFor, intel?.reveals].filter(Boolean).join(" "), tags: meta?.tags, price: t.price,
      meta: intel ? RETEST_LABEL(intel.retest) : undefined, url: t.url, store: "bioarolabs.com",
    };
  }), []);
  const cats = LAB_COLLECTIONS.map((c) => ({ id: c.handle, title: c.title.replace(/ &.*$/, "").replace(/ Panels$/, ""), icon: c.icon, line: c.description }));
  return <CatalogBook brand="BioAro Labs" categories={cats} items={items} />;
}
