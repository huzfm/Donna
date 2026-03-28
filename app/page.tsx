"use client";

import {
  Navbar,
  HeroSection,
  FeatureStack,
  StatsSection,
  UseCasesSection,
  HowItWorksSection,
  TechStackSection,
  TeamSection,
  FaqSection,
  CtaSection,
  Footer,
  TerminalField,
} from "@/components/home";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      <TerminalField />

      {/* Full-page grid overlay — sits above content, below navbar */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-size-[240px_240px]" />
      </div>

      <Navbar />
      <HeroSection />

      {/* Features */}
      <section id="features" className="py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900">
              Everything you need in{" "}
              <span className="text-emerald-600">one workspace</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[15px]">
              Donna brings together document intelligence, email management, and AI chat
              into a seamless experience.
            </p>
          </motion.div>

          <FeatureStack />
        </div>
      </section>

      <StatsSection />
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
