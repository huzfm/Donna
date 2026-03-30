"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <span className="font-(family-name:--font-doto) text-4xl font-black text-white">D</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-white md:text-4xl"
        >
          Ready to meet Donna?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 max-w-md font-mono text-[15px] leading-relaxed text-slate-400"
        >
          Sign up for free and start chatting with your documents, emails, and calendar in seconds.
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-mono text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl"
          >
            Get started free <ArrowRight size={15} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-7 py-3 font-mono text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
          >
            Log in
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
