"use client";

import { motion } from "framer-motion";
import { stats } from "./data";

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 block text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            By the numbers
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Designed to be <span className="text-emerald-600">fast, private & reliable</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all duration-300 hover:border-slate-400 md:p-8"
            >
              <div
                className={`h-12 w-12 rounded-xl ${stat.bg} mx-auto mb-5 flex items-center justify-center`}
              >
                <stat.icon size={22} className={stat.color} />
              </div>
              <div className="mb-1.5 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                {stat.value}
              </div>
              <div className="text-xs leading-snug font-medium text-slate-400">{stat.label}</div>
              <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-emerald-500 transition-all duration-500 group-hover:w-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
