"use client";

import { Navbar, Footer } from "@/components/home";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import MissionSection from "@/components/about/MissionSection";
import Timeline from "@/components/about/Timeline";
import AboutTeam from "@/components/about/AboutTeam";
import AboutTechStack from "@/components/about/AboutTechStack";
import AboutCta from "@/components/about/AboutCta";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      <Navbar />
      <AboutHero />
      <AboutStats />
      <MissionSection />
      <Timeline />
      <AboutTeam />
      <AboutTechStack />
      <AboutCta />
      <Footer />
    </div>
  );
}
