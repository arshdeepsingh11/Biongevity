import Link from "next/link";

/** The 404 page body (used by app/global-not-found.tsx). */
export function NotFoundBody() {
  return (
    <section className="relative isolate grid min-h-[78vh] place-items-center px-5 pt-24 text-center">
      <div className="hero-glow" />
      <div>
        <div className="font-display text-[96px] leading-none text-gold-deep">404</div>
        <h1 className="t-h2 mt-4">This page has moved.</h1>
        <p className="t-lede mx-auto mt-4 max-w-[46ch]">Our website has a new home for the Dubai clinic and for Biongevity International.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/uae/" className="btn6 btn6-primary">Biongevity Dubai</Link>
          <Link href="/" className="btn6 btn6-ghost">Biongevity International</Link>
        </div>
      </div>
    </section>
  );
}
