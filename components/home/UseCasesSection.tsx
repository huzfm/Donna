"use client";

import { motion } from "framer-motion";
import { useCases } from "./data";

export default function UseCasesSection() {
  return (
    <section className="bg-white px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 block text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            Use Cases
          </span>
          <h2 className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Built for the way <span className="text-emerald-600">you work</span>
          </h2>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-slate-500">
            Whether you&apos;re researching, managing emails, or building a knowledge base — Donna
            adapts to your workflow.
          </p>
        </motion.div>

        <div className="space-y-4">
          {useCases.map((uc, i) => {
            const UcIcon = uc.icon;
            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-slate-400 md:p-8"
              >
                <div
                  className="absolute top-0 left-0 h-full w-1 rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: uc.accent }}
                />
                <div className="flex items-start gap-5 md:gap-6">
                  <div
                    className={`h-13 w-13 rounded-xl ${uc.bg} flex shrink-0 items-center justify-center`}
                  >
                    <UcIcon size={24} className={uc.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="font-(family-name:--font-doto) text-lg font-extrabold tracking-tight text-slate-950">
                        {uc.title}
                      </h3>
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
                        style={{ color: uc.accent, borderColor: `${uc.accent}40` }}
                      >
                        {uc.detail}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500">{uc.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
