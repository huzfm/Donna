"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <BrandLogo size="lg" showWordmark={false} href={null} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-(family-name:--font-doto) mb-4 text-3xl font-black tracking-tight text-white md:text-4xl"
        >
          Ready to meet Donna?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-slate-400"
        >
          Sign up for free and start chatting with your documents, emails, and calendar in
          seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:ring-2 hover:ring-emerald-500/30"
          >
            Get started free <ArrowRight size={15} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-7 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
          >
            Log in
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
