import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/commerce/ProductDetail";
import { LAB_TESTS } from "@/data/labs";

type P = { params: Promise<{ handle: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return LAB_TESTS.map((t) => ({ handle: t.handle })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = (await params).handle;
  const t = LAB_TESTS.find((x) => x.handle === k);
  return { title: t?.title, description: t?.bestFor };
}

export default async function LabTestPage({ params }: P) {
  const { handle } = await params;
  const t = LAB_TESTS.find((x) => x.handle === handle);
  if (!t) notFound();
  const related = LAB_TESTS.filter((x) => x.category === t.category && x.handle !== t.handle).slice(0, 3);
  return <ProductDetail initial={t} related={related} back={{ href: "/labs/tests/", label: "All lab tests" }} />;
}
