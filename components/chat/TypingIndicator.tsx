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
      <div className="from-accent-light to-spark-light relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br">
        <Sparkles size={15} className="text-spark" />
      </div>
      <div className="ai-bubble-gradient border-border/60 flex items-center gap-2 rounded-2xl rounded-bl-md border px-5 py-3.5">
        <span className="text-spark mr-1 text-[10px] font-semibold tracking-wider uppercase">
          Thinking
        </span>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="bg-spark h-1.5 w-1.5 rounded-full"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              delay: i * 0.15,
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
