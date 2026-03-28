"use client";

import {
  Navbar,
  HeroSection,
  FeatureStack,
  UseCasesSection,
  HowItWorksSection,
  TechStackSection,
  TeamSection,
  FaqSection,
  CtaSection,
  Footer,
} from "@/components/home";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <TerminalField />

      {/* Full-page grid overlay   sits above content, below navbar */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-size-[240px_240px]" />
      </div>

      <Navbar />
      <HeroSection />

      {/* Features */}
      <section id="features" className="relative overflow-hidden bg-white px-6 py-28">
        <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className=" font-mono mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything you need in <span className="font-mono">one workspace</span>
            </h2>
            <p className="mx-auto max-w-lg text-[15px] font-mono text-slate-500">
              Donna brings together document intelligence, email management, and AI chat into a
              seamless experience.
            </p>
          </motion.div>

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
