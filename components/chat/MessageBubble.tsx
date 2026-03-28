"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText } from "lucide-react";

export interface MessageBubbleProps {
  role: "user" | "ai";
  content: string;
  fileName?: string;
  timestamp?: string;
}

export default function MessageBubble({ role, content, fileName, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
    >
      {/* AI avatar with spark orbit */}
      {!isUser && (
        <div className="relative mt-1 shrink-0">
          <div className="from-accent-light to-spark-light spark-ring flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br">
            <Sparkles size={15} className="text-spark" />
          </div>
          <motion.div
            className="bg-spark absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      {/* User avatar */}
      {isUser && (
        <div className="bg-accent mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <span className="text-xs font-bold text-white">You</span>
        </div>
      )}

      <div className={`flex max-w-[75%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* File badge */}
        {fileName && (
          <motion.div
            className="text-spark bg-spark-light border-spark/10 mb-1.5 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FileText size={10} />
            {fileName}
          </motion.div>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "user-bubble-gradient shadow-accent/10 rounded-br-md text-white shadow-md"
              : "ai-bubble-gradient border-border/60 text-primary rounded-bl-md border shadow-sm"
          }`}
        >
          {!isUser && (
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-spark text-[10px] font-semibold tracking-wider uppercase">
                <span className="font-doto normal-case tracking-tight text-[11px]">Donna</span> AI
              </span>
              <div className="bg-spark/50 h-1 w-1 rounded-full" />
            </div>
          )}
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className={`mt-1 text-[10px] ${isUser ? "text-muted" : "text-muted"}`}>
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
