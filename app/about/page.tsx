"use client";

import dynamic from "next/dynamic";
import { Navbar, Footer } from "@/components/home";
import AboutHero from "@/components/about/AboutHero";

const AboutStats = dynamic(() => import("@/components/about/AboutStats"), { ssr: false });
const MissionSection = dynamic(() => import("@/components/about/MissionSection"), { ssr: false });
const Timeline = dynamic(() => import("@/components/about/Timeline"), { ssr: false });
const AboutTeam = dynamic(() => import("@/components/about/AboutTeam"), { ssr: false });
const AboutTechStack = dynamic(() => import("@/components/about/AboutTechStack"), { ssr: false });
const AboutCta = dynamic(() => import("@/components/about/AboutCta"), { ssr: false });

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
