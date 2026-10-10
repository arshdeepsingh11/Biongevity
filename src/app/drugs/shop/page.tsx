import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Section";
import { CatalogBrowser } from "@/components/commerce/CatalogBrowser";
import { DRUG_PRODUCTS, DRUG_COLLECTIONS } from "@/data/drugs";

export const metadata: Metadata = { title: "Shop · BioAro Drugs" };

export default function DrugsShopPage() {
  return (
    <>
      <PageHero eyebrow="BioAro Drugs · Shop" title="Every formula. Every amount." lede="Longevity, daily foundations, sleep, focus, energy and performance." />
      <section data-ai="All products" className="relative z-[1] pb-24"><div className="container-x">
        <Suspense><CatalogBrowser products={DRUG_PRODUCTS} collections={DRUG_COLLECTIONS} vendor="BioAro Drugs" aiPrompt="Which BioAro Drugs formula fits my goals?" /></Suspense>
      </div></section>
    </>
  );
}
