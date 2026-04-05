"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandLogo";

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
                  layout
                  className={`group/row flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
                  {!isUser && (
                        <div className="relative mt-1 shrink-0">
                              <motion.div
                                    whileHover={{ scale: 1.06 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                    className="shadow-sm shadow-emerald-500/10"
                              >
                                    <BrandMark size="bubble" />
                              </motion.div>
                              <motion.div
                                    className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white"
                                    animate={{ scale: [1, 1.35, 1], opacity: [0.75, 1, 0.75] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                              />
                        </div>
                  )}

                  {isUser && (
                        <motion.div
                              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-800 to-slate-950 text-[11px] font-bold tracking-wide text-white shadow-md ring-1 shadow-slate-900/20 ring-white/10"
                              whileHover={{ scale: 1.06 }}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        >
                              You
                        </motion.div>
                  )}

                  <div
                        className={`flex max-w-[min(85%,32rem)] flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                        {fileName && (
                              <motion.div
                                    className="mb-1.5 flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-2.5 py-1 text-[10px] font-medium text-emerald-900"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                              >
                                    <FileText size={10} />
                                    {fileName}
                              </motion.div>
                        )}

                        <div
                              className={`rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)] transition-shadow duration-200 group-hover/row:shadow-[0_4px_24px_-6px_rgba(15,23,42,0.12)] sm:text-[15px] ${
                                    isUser
                                          ? "rounded-br-md border border-slate-200/90 bg-slate-100/95 text-slate-900 ring-1 ring-slate-900/[0.04]"
                                          : "rounded-bl-md border border-emerald-100/80 bg-linear-to-br from-white to-emerald-50/35 text-slate-800 ring-1 ring-emerald-500/[0.07]"
                              }`}
                        >
                              {!isUser && (
                                    <div className="mb-1.5 flex items-center gap-1.5">
                                          <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                                                Donna
                                          </span>
                                          <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                    </div>
                              )}
                              <div className="whitespace-pre-wrap">{content}</div>
                        </div>

                        {timestamp && (
                              <span className="mt-1.5 text-[10px] text-slate-400 tabular-nums">
                                    {timestamp}
                              </span>
                        )}
                  </div>
            </motion.div>
      );
}
