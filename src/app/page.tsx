import { ProductHub } from "@/components/products/ProductHub";
import { Hero, Streams, BrandFilm, ThreeSixty, Disciplines, StoriesSection, AILayer, GlobalClinic, ProgramsTeaser, FinalCTA } from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Streams />
      <BrandFilm />
      <ThreeSixty />
      <Disciplines />
      <ProductHub />
      <StoriesSection />
      <AILayer />
      <GlobalClinic />
      <ProgramsTeaser />
      <FinalCTA />
    </>
  );
}
