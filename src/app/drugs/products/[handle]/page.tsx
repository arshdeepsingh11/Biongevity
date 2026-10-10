import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/commerce/ProductDetail";
import { DRUG_PRODUCTS } from "@/data/drugs";

type P = { params: Promise<{ handle: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return DRUG_PRODUCTS.map((t) => ({ handle: t.handle })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = (await params).handle;
  const t = DRUG_PRODUCTS.find((x) => x.handle === k);
  return { title: t?.title, description: t?.summary };
}

export default async function DrugProductPage({ params }: P) {
  const { handle } = await params;
  const p = DRUG_PRODUCTS.find((x) => x.handle === handle);
  if (!p) notFound();
  const related = DRUG_PRODUCTS.filter((x) => x.handle !== p.handle && x.goals?.some((g) => p.goals?.includes(g))).slice(0, 3);
  return <ProductDetail initial={p} related={related} back={{ href: "/drugs/shop/", label: "All formulas" }} />;
}
