"use client";

import { motion } from "framer-motion";
import { useCases } from "./data";

export default function UseCasesSection() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">Use Cases</span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-950 font-(family-name:--font-doto)">
            Built for the way{" "}
            <span className="text-emerald-600">you work</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-[15px] leading-relaxed">
            Whether you&apos;re researching, managing emails, or building a knowledge base — Donna adapts to your workflow.
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
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 md:p-8 hover:border-slate-400 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-r-full transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundColor: uc.accent }} />
                <div className="flex items-start gap-5 md:gap-6">
                  <div className={`w-13 h-13 rounded-xl ${uc.bg} flex items-center justify-center shrink-0`}>
                    <UcIcon size={24} className={uc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-slate-950 tracking-tight font-(family-name:--font-doto)">
                        {uc.title}
                      </h3>
                      <span className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border" style={{ color: uc.accent, borderColor: `${uc.accent}40` }}>
                        {uc.detail}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{uc.description}</p>
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
