import FeaturedProducts from "../components/main/FeaturedProducts";
import HeroCarousel from "../components/main/HeroCarousel";
import ProfessionStrip from "../components/main/SubNav";

export default function Home() {
  return (
    <div className="flex h-[calc(100dvh-var(--main-header-height))] flex-col">
      <ProfessionStrip />
      <div className="relative min-h-0 flex-1">
        <HeroCarousel />
      </div>
      {/* <FeaturedProducts /> */}
    </div>
  );
}
