import UrlShortener from "../components/UrlShortener";
import HeroSection from "../components/HeroSection";
import FeaturesGrid from "../components/FeaturesGrid";
import StatsBanner from "../components/StatsBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <UrlShortener />
      <StatsBanner />
      <FeaturesGrid />
    </main>
  );
}