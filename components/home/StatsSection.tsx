"use client";

import { motion } from "framer-motion";
import { stats } from "./data";

export default function StatsSection() {
  return (
    <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">By the numbers</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Designed to be{" "}
            <span className="text-emerald-600">fast, private & reliable</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center hover:border-slate-400 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-5`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-950 mb-1.5 tracking-tight font-(family-name:--font-doto)">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium leading-snug">{stat.label}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-12 rounded-full bg-emerald-500 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
