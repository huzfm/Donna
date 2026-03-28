"use client";

import dynamic from "next/dynamic";
import { Navbar, HeroSection, Footer } from "@/components/home";

const FeatureStack = dynamic(() => import("@/components/home/FeatureStack"), { ssr: false });
const UseCasesSection = dynamic(() => import("@/components/home/UseCasesSection"), { ssr: false });
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection"), { ssr: false });
const TechStackSection = dynamic(() => import("@/components/home/TechStackSection"), { ssr: false });
const TeamSection = dynamic(() => import("@/components/home/TeamSection"), { ssr: false });
const FaqSection = dynamic(() => import("@/components/home/FaqSection"), { ssr: false });
const CtaSection = dynamic(() => import("@/components/home/CtaSection"), { ssr: false });

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      <Navbar />
      <HeroSection />

      {/* Features */}
      <section id="features" className="relative overflow-hidden bg-white px-6 py-28">
        <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-slate-300/40 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-mono text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything you need in <span className="font-mono">one workspace</span>
            </h2>
            <p className="mx-auto max-w-lg font-mono text-[15px] text-slate-500">
              Donna brings together document intelligence, email management, and AI chat into a
              seamless experience.
            </p>
          </div>
          <FeatureStack />
        </div>
      </section>

      <UseCasesSection />
      <HowItWorksSection />
      <TechStackSection />
      <TeamSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
