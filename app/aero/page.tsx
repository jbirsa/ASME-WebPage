import Navigation from "@/components/aero/Navigation";
import Hero from "@/components/aero/Hero";
import AeroIntro from "@/components/aero/AeroIntro";
import Stats from "@/components/aero/Stats";
import ProductShowcase from "@/components/aero/ProductShowcase";
import PlaneBlueprint from "@/components/aero/PlaneBlueprint";
import SponsorsCarousel from "@/components/aero/SponsorsCarousel";
import Features from "@/components/aero/Features";
import CaseStudy from "@/components/aero/CaseStudy";
import CTA from "@/components/aero/CTA";
import Footer from "@/components/aero/Footer";

export default function AeroPage() {
  return (
    <main>
      <Navigation />
      <Hero />
      <AeroIntro />
      <Stats />
      <ProductShowcase />
      <PlaneBlueprint />
      <SponsorsCarousel />
      <Features />
      <CaseStudy />
      <CTA />
      <Footer />
    </main>
  );
}
