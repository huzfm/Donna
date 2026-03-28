"use client";

import { motion } from "framer-motion";
import { steps } from "./data";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            How it works
          </span>
          <h2 className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Get started in <span className="text-emerald-600">three steps</span>
          </h2>
          <p className="text-[15px] text-slate-500">
            No complex setup — just sign up and start working smarter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-400"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-all duration-300 group-hover:border-emerald-300 group-hover:bg-emerald-50">
                    <StepIcon
                      size={20}
                      className="text-slate-400 transition-colors duration-300 group-hover:text-emerald-600"
                    />
                  </div>
                  <span className="font-(family-name:--font-doto) text-4xl font-black text-slate-100 transition-colors duration-300 group-hover:text-emerald-100">
                    {step.num}
                  </span>
                </div>
                <h3 className="mb-2 font-(family-name:--font-doto) text-base font-extrabold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-3 hidden h-px w-6 bg-slate-200 md:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
