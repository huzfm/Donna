"use client";

import { motion } from "framer-motion";
import { techStack } from "@/components/home/data";

export default function AboutTechStack() {
  return (
    <section className="bg-slate-50/80 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Technology
          </span>
          <h2 className="font-(family-name:--font-doto) mb-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Built on the <span className="text-slate-400">best stack</span>
          </h2>
<<<<<<< HEAD
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-slate-500">
            Modern, fast, and reliable   every layer is chosen for performance and developer
=======
          <p className="mx-auto max-w-lg font-mono text-[15px] leading-relaxed text-slate-500">
            Modern, fast, and reliable — every layer is chosen for performance and developer
>>>>>>> d58ff45d2689923026512ed9fa6a45d2ae11995d
            experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tech.bg} ring-1 ring-slate-200/60 transition-all group-hover:scale-110`}
              >
                <tech.icon size={20} className={tech.color} strokeWidth={2} />
              </div>
              <h3 className="font-(family-name:--font-doto) text-base font-black tracking-tight text-slate-950">
                {tech.name}
              </h3>
              <p className="mt-1 font-mono text-sm text-slate-500">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
