"use client";

import { motion } from "framer-motion";
import { Rocket, Brain, Mail, FileSearch, BarChart3 } from "lucide-react";

const milestones = [
  {
    icon: Rocket,
    title: "Project kickoff",
    description: "Idea conceived and team formed during hackathon planning.",
    date: "March 2026",
  },
  {
    icon: FileSearch,
    title: "Document intelligence",
    description: "Built RAG pipeline with Hugging Face embeddings and vector search.",
    date: "March 2026",
  },
  {
    icon: Brain,
    title: "AI chat engine",
    description: "Integrated Groq LLM for blazing-fast document Q&A with conversation memory.",
    date: "March 2026",
  },
  {
    icon: Mail,
    title: "Gmail integration",
    description: "Added email sending, inbox reading, and AI-powered composition.",
    date: "March 2026",
  },
  {
    icon: BarChart3,
    title: "Dashboard & polish",
    description:
      "Full dashboard with file management, session history, and brand-consistent design.",
    date: "March 2026",
  },
];

export default function Timeline() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Journey
          </span>
          <h2 className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            How we <span className="text-slate-400">built it</span>
          </h2>
          <p className="mx-auto max-w-lg font-mono text-[15px] leading-relaxed text-slate-500">
            From idea to production in one focused sprint.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-8 w-px bg-linear-to-b from-slate-300 via-slate-400 to-slate-200" />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group relative flex items-start gap-6 pl-4"
              >
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-2 ring-white transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  <m.icon size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all group-hover:border-slate-300 group-hover:shadow-md">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
                      {m.title}
                    </h3>
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      {m.date}
                    </span>
                  </div>
                  <p className="font-mono text-sm leading-relaxed text-slate-500">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
