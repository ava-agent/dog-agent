import Hero from "@/components/landing/Hero";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import StatsBoard from "@/components/landing/StatsBoard";
import AIEntry from "@/components/landing/AIEntry";
import TechStack from "@/components/landing/TechStack";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeatureShowcase />
      <AIEntry />
      <StatsBoard />
      <TechStack />
      <Footer />
    </main>
  );
}
