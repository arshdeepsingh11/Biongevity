import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Section";
import { CatalogBrowser } from "@/components/commerce/CatalogBrowser";
import { LAB_TESTS, LAB_COLLECTIONS } from "@/data/labs";

export const metadata: Metadata = { title: "Shop All Lab Tests · BioAro Labs" };

export default function LabTestsPage() {
  return (
    <>
      <PageHero eyebrow="BioAro Labs · Shop" title="Shop all lab tests." lede="Genomics, microbiome, hormones, inflammation, vitamins, brain health and more. Not sure which test? Ask the AI." />
      <section data-ai="All tests" className="relative z-[1] pb-24">
        <div className="container-x">
          <Suspense><CatalogBrowser products={LAB_TESTS} collections={LAB_COLLECTIONS} vendor="BioAro Labs" aiPrompt="Which BioAro Labs test fits my goals?" /></Suspense>
        </div>
      </section>
    </>
  );
}
