import { ProductHub } from "@/components/products/ProductHub";
import { Hero, Streams, ThreeSixty, Disciplines, AILayer, Ecosystem, CareModel, FilmBand, FinalCTA } from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Streams />
      <ThreeSixty />
      <ProductHub />
      <Disciplines />
      <AILayer />
      <Ecosystem />
      <CareModel />
      <FilmBand />
      <FinalCTA />
    </>
  );
}
