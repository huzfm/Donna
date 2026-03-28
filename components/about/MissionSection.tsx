"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Shield, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose-built",
    description:
      "Every feature exists because it solves a real problem. No bloat, no feature creep   just the tools you actually need.",
  },
  {
    icon: Zap,
    title: "Speed first",
    description:
      "Powered by Groq's lightning-fast inference. Responses arrive in under 3 seconds, even for complex multi-document queries.",
  },
  {
    icon: Shield,
    title: "Privacy by default",
    description:
      "Your documents and credentials are encrypted and stored privately. We never share, sell, or train on your data.",
  },
  {
    icon: Lightbulb,
    title: "Intuitive design",
    description:
      "A clean, focused interface that gets out of your way. Upload docs, ask questions, take action   no learning curve.",
  },
];

export default function MissionSection() {
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
          <span className="mb-3 block text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            Our Mission
          </span>
          <h2 className="font-(family-name:--font-doto) mb-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Make AI work <span className="text-emerald-600">for you</span>
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-slate-500">
            We believe AI should amplify your productivity, not add complexity. Donna brings together
            document intelligence, email management, and smart chat into one seamless workspace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/60 transition-colors group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-500">
                <v.icon size={20} strokeWidth={2} />
              </div>
              <h3 className="font-(family-name:--font-doto) mb-2 text-lg font-black tracking-tight text-slate-950">
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
