"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
  icon: React.ElementType;
}

export default function FaqItem({ question, answer, index, icon: Icon }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-4 rounded-2xl border bg-white px-6 py-5 text-left transition-all duration-300 ${
          open ? "border-emerald-300" : "border-slate-200 hover:border-slate-400"
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
          open ? "bg-emerald-50" : "bg-slate-100"
        }`}>
          <Icon size={16} className={`transition-colors duration-300 ${open ? "text-emerald-600" : "text-slate-400"}`} />
        </div>
        <span className="flex-1 text-sm font-bold leading-snug text-slate-950 font-(family-name:--font-doto)">{question}</span>
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
          open ? "border-emerald-300 bg-emerald-50 rotate-180" : "border-slate-200"
        }`}>
          <ChevronDown size={14} className={`transition-colors duration-300 ${open ? "text-emerald-600" : "text-slate-400"}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pl-19 pr-6 pt-2 pb-5 text-sm text-slate-500 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
