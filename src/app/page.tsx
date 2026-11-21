import { HeroSection } from "@/components/Hero";
import { FeaturedServices } from "@/components/FeaturedServices";
import { HowItWorks } from "@/components/HowItWorks";
import { CategoriesAndWhyUs } from "@/components/CategoriesAndWhyUs";
import { featuredService } from "@/library/demoServices";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero / Banner Section */}
      <HeroSection />

      {/* 2. Dynamic Featured Services Section (shows 6 latest approved & available services) */}
      <FeaturedServices initialServices={featuredService} />

      {/* 3. Extra Section 1: How FixMate Works */}
      <HowItWorks />

      {/* 4. Extra Section 2: Popular Categories & Why Choose Us */}
      <CategoriesAndWhyUs />
    </div>
  );
}
