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
        <div className="relative shrink-0 mt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-light to-spark-light flex items-center justify-center spark-ring">
            <Sparkles size={15} className="text-spark" />
          </div>
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-spark"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      {/* User avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0 mt-1">
          <span className="text-white text-xs font-bold">You</span>
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* File badge */}
        {fileName && (
          <motion.div
            className="flex items-center gap-1.5 text-[10px] font-medium text-spark bg-spark-light px-2.5 py-1 rounded-full mb-1.5 border border-spark/10"
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
              ? "user-bubble-gradient text-white rounded-br-md shadow-md shadow-accent/10"
              : "ai-bubble-gradient border border-border/60 text-primary rounded-bl-md shadow-sm"
          }`}
        >
          {!isUser && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-semibold text-spark uppercase tracking-wider">Donna AI</span>
              <div className="w-1 h-1 rounded-full bg-spark/50" />
            </div>
          )}
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className={`text-[10px] mt-1 ${isUser ? "text-muted" : "text-muted"}`}>{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
}
