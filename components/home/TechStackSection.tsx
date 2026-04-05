"use client";

import { motion } from "framer-motion";
import { techStack } from "./data";

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="overflow-hidden bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 block font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Powered By
          </span>
          <h2 className="font-(family-name:--font-doto) text-2xl font-black tracking-tight text-black md:text-3xl">
            Built on cutting-edge technology
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-linear-to-l from-white to-transparent" />

        <div className="flex w-max animate-[marquee_20s_linear_infinite] gap-5 hover:[animation-play-state:paused]">
          {[...Array(3)].map((_, setIdx) =>
            techStack.map((tech) => {
              const TechIcon = tech.icon;
              return (
                <div
                  key={`${setIdx}-${tech.name}`}
                  className="group flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 transition-all duration-300 hover:border-slate-400"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <TechIcon size={18} className="text-black" />
                  </div>
                  <div className="text-left">
                    <div className="font-(family-name:--font-doto) text-sm font-extrabold text-black">
                      {tech.name}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">{tech.desc}</div>
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
