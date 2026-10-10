import Link from "next/link";
export default function NotFound() {
  return (
    <section className="relative z-[1] grid min-h-[70vh] place-items-center px-4 text-center">
      <div><div className="text-[96px] font-semibold leading-none tracking-tighter text-iri">404</div><div className="mt-3 text-[22px] font-semibold">This page isn&apos;t in the record.</div>
        <Link href="/" className="btn-dark mt-6">Back home</Link></div>
    </section>
  );
}
