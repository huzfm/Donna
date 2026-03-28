"use client";

import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandLogo";

export default function TypingIndicator() {
  return (
    <motion.div
      layout
      className="flex gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div
        className="relative shrink-0 shadow-sm shadow-emerald-500/10"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <BrandMark size="bubble" floating />
      </motion.div>
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-emerald-100/90 bg-linear-to-r from-white to-emerald-50/40 px-5 py-3.5 shadow-[0_2px_14px_-4px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/[0.06]">
        <span className="mr-1 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
          Thinking
        </span>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            animate={{ y: [0, -6, 0], opacity: [0.35, 1, 0.35] }}
            transition={{
              delay: i * 0.12,
              duration: 0.55,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
