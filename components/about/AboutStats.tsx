"use client";

import { motion } from "framer-motion";
import { FileText, Zap, Lock, Clock } from "lucide-react";

const stats = [
  {
    value: "10+",
    label: "File formats",
    icon: FileText,
    desc: "PDF, Word, Excel, CSV, TXT and more",
  },
  {
    value: "< 3s",
    label: "Response time",
    icon: Zap,
    desc: "Powered by Groq's blazing-fast inference",
  },
  {
    value: "100%",
    label: "Private",
    icon: Lock,
    desc: "Your data is never shared or used for training",
  },
  { value: "24/7", label: "Available", icon: Clock, desc: "Always on, always ready to help" },
];

export default function AboutStats() {
  return (
    <section className="border-y border-slate-200/80 bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group text-center"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200/60 transition-transform group-hover:scale-110">
                <stat.icon size={20} strokeWidth={2} />
              </div>
              <p className="font-(family-name:--font-doto) text-3xl font-black tracking-tight text-slate-950">
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-700">{stat.label}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-400">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
