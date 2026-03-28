"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-32 pb-20">
      <div className="lightning-grid pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="lightning-grid-lines" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-1.5 text-xs font-semibold text-emerald-800"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          About Donna
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <BrandLogo size="hero" animate href={null} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-(family-name:--font-doto) mb-6 text-4xl font-black tracking-tight text-slate-950 md:text-5xl lg:text-6xl"
        >
          Your AI workspace,{" "}
          <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            reimagined
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500"
        >
          Donna is an AI-powered workspace assistant that helps you manage documents, email, and
          calendar — all through natural conversation. Built for speed, privacy, and simplicity.
        </motion.p>
      </div>
    </section>
  );
}
