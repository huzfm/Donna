"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardDemo from "./DashboardDemo";

export default function HeroSection() {
  return (
    <section className="relative bg-white pt-32 md:pt-40 pb-24 px-6">
      <div className="lightning-grid">
        <div className="lightning-grid-lines" />
        <div className="lightning-pulse-h" style={{ top: "25%", animationDelay: "0s" }} />
        <div className="lightning-pulse-h" style={{ top: "50%", animationDelay: "1.5s" }} />
        <div className="lightning-pulse-h" style={{ top: "75%", animationDelay: "2.8s" }} />
        <div className="lightning-pulse-v" style={{ left: "20%", animationDelay: "0.5s" }} />
        <div className="lightning-pulse-v" style={{ left: "50%", animationDelay: "2s" }} />
        <div className="lightning-pulse-v" style={{ left: "80%", animationDelay: "3.5s" }} />
        <div className="lightning-flash" style={{ top: "30%", left: "25%", animationDelay: "0s" }} />
        <div className="lightning-flash" style={{ top: "60%", left: "70%", animationDelay: "1.5s" }} />
        <div className="lightning-flash" style={{ top: "20%", left: "60%", animationDelay: "2.5s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-600 font-semibold mb-7 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Powered by Groq &amp; Hugging Face
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-(family-name:--font-doto) text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-slate-950"
          >
            Your AI-Powered
            <br />
            <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Workspace Brain
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-[15px] md:text-base text-slate-600 max-w-md mb-9 leading-relaxed"
          >
            Upload documents, ask questions, manage emails — all in one
            intelligent workspace. Donna understands your files and helps you
            work smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold transition-all text-sm hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
            >
              Get Started
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <DashboardDemo />
        </motion.div>
      </div>
    </section>
  );
}
