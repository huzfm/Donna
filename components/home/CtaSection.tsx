"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, FileText, Mail, Lock, Sparkles } from "lucide-react";

export default function CtaSection() {
  const highlights = [
    { icon: Brain, text: "AI chat powered by Groq   blazing fast responses" },
    { icon: FileText, text: "Upload PDFs, Word, Excel   10+ formats supported" },
    { icon: Mail, text: "Gmail integration   read, draft & send from chat" },
    { icon: Lock, text: "100% private   your data never leaves your workspace" },
  ];

  return (
    <section className="relative overflow-hidden bg-white px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200"
        >
          <div className="absolute top-0 right-0 left-0 h-1 bg-black" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-10 md:p-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <Sparkles size={22} className="text-black" />
                </div>
                <h2 className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-black md:text-4xl">
                  Ready to work <span className="text-black">smarter?</span>
                </h2>
                <p className="mb-8 max-w-sm font-mono text-[15px] leading-relaxed text-slate-500">
                  Join Donna and let AI handle the heavy lifting   from document analysis to email
                  management.
                </p>
                <div className="flex flex-col items-start gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
                  >
                    Get started free
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-7 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-900 hover:text-slate-900"
                  >
                    Sign in
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-10 md:p-14 lg:border-t-0 lg:border-l">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="space-y-5"
              >
                <p className="mb-6 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                  What you get
                </p>
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
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <ItemIcon size={14} className="text-black" />
                      </div>
                      <span className="font-mono text-sm leading-relaxed text-slate-600">{item.text}</span>
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
