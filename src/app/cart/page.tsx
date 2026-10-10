import type { Metadata } from "next";
import { CartView } from "@/components/pages/CartView";

export const metadata: Metadata = { title: "Bag" };
export default function CartPage() {
  return (
    <section data-ai="Bag" className="relative z-[1] pb-24 pt-[calc(100px+var(--safe-top))] sm:pt-[130px]">
      <div className="container-x"><h1 className="mb-8 text-[40px] font-semibold tracking-tight">Your bag</h1><CartView /></div>
    </section>
  );
}
