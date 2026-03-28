"use client";

import { motion } from "framer-motion";

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
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-mono text-xs font-semibold text-slate-700"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-500" />
          About Donna
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-(family-name:--font-doto) mb-6 text-4xl font-black tracking-tight text-slate-950 md:text-5xl lg:text-6xl"
        >
          Your AI workspace,{" "}
          <span className="text-slate-400">reimagined</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-2xl font-mono text-lg leading-relaxed text-slate-500"
        >
          Donna is an AI-powered workspace assistant that helps you manage documents, email, and
          calendar — all through natural conversation. Built for speed, privacy, and simplicity.
        </motion.p>
      </div>
    </section>
  );
}
