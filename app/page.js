import BestsellerSection from "@/components/BestSellerSection";
import CategorySection from "@/components/sections/CategoriesSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HeroSection from "@/components/sections/HeroSection";
import StreamlinedShopping from "@/components/sections/Streamlinedshopping ";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 px-4 sm:px-6 py-8 sm:py-16">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-15">
        <HeroSection />
        <BestsellerSection />
        <CategorySection />
        <FeaturedProducts />
        <StreamlinedShopping />
      </div>
    </main>
  );
}
