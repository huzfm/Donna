"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-accent-light to-spark-light flex items-center justify-center shrink-0">
        <Sparkles size={15} className="text-spark" />
      </div>
      <div className="ai-bubble-gradient border border-border/60 rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-spark uppercase tracking-wider mr-1">Thinking</span>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-spark"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity, ease: "easeInOut" as const }}
          />
        ))}
      </div>
    </motion.div>
  );
}
