"use client";

import { motion } from "framer-motion";
import { steps } from "./data";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">How it works</span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-950 font-(family-name:--font-doto)">
            Get started in{" "}
            <span className="text-emerald-600">three steps</span>
          </h2>
          <p className="text-slate-500 text-[15px]">No complex setup — just sign up and start working smarter.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-slate-400 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all duration-300">
                    <StepIcon size={20} className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-300" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 font-(family-name:--font-doto) group-hover:text-emerald-100 transition-colors duration-300">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-extrabold mb-2 tracking-tight text-slate-950 font-(family-name:--font-doto)">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-slate-200" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
