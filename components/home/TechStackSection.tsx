"use client";

import { motion } from "framer-motion";
import { techStack } from "./data";

export default function TechStackSection() {
  return (
    <section className="py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">Powered By</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 font-(family-name:--font-doto)">
            Built on cutting-edge technology
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] w-max gap-5">
          {[...Array(3)].map((_, setIdx) =>
            techStack.map((tech) => {
              const TechIcon = tech.icon;
              return (
                <div
                  key={`${setIdx}-${tech.name}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shrink-0 hover:border-slate-400 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl ${tech.bg} flex items-center justify-center shrink-0`}>
                    <TechIcon size={18} className={tech.color} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-slate-950 font-(family-name:--font-doto)">{tech.name}</div>
                    <div className="text-[11px] text-slate-400">{tech.desc}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
