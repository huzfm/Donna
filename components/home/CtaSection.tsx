"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, FileText, Mail, Lock, Sparkles } from "lucide-react";

export default function CtaSection() {
  const highlights = [
    { icon: Brain, text: "AI chat powered by Groq — blazing fast responses" },
    { icon: FileText, text: "Upload PDFs, Word, Excel — 10+ formats supported" },
    { icon: Mail, text: "Gmail integration — read, draft & send from chat" },
    { icon: Lock, text: "100% private — your data never leaves your workspace" },
  ];

  return (
    <section className="py-28 px-6 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                  <Sparkles size={22} className="text-emerald-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-950 font-(family-name:--font-doto)">
                  Ready to work{" "}
                  <span className="text-emerald-600">smarter?</span>
                </h2>
                <p className="text-slate-500 mb-8 text-[15px] leading-relaxed max-w-sm">
                  Join Donna and let AI handle the heavy lifting — from document analysis to email management.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-3 rounded-full font-semibold transition-all text-sm hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
                  >
                    Get started free
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 border border-slate-300 text-slate-600 px-7 py-3 rounded-full font-medium transition-all text-sm hover:border-slate-900 hover:text-slate-900"
                  >
                    Sign in
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="bg-slate-50 p-10 md:p-14 border-t lg:border-t-0 lg:border-l border-slate-200">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="space-y-5"
              >
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">What you get</p>
                {highlights.map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <ItemIcon size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-sm text-slate-600 leading-relaxed">{item.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
