"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";

type DemoPhase = "idle" | "uploading" | "uploaded" | "typing" | "thinking" | "responding" | "done";

const DEMO_PROMPT = "Summarize the key findings from the report";
const DEMO_RESPONSE =
      "Based on your Q1 report, here are the key findings:\n\n1. Revenue grew 23% YoY to $4.2M\n2. Customer retention rate improved to 94%\n3. Three new enterprise clients onboarded\n4. Operating costs reduced by 8%";

interface DashboardDemoMessagesProps {
      phase: DemoPhase;
      responseChars: number;
}

export default function DashboardDemoMessages({
      phase,
      responseChars,
}: DashboardDemoMessagesProps) {
      const showFile = phase !== "idle";
      const showPromptBubble = ["thinking", "responding", "done"].includes(phase);
      const showThinking = phase === "thinking";
      const showResponse = ["responding", "done"].includes(phase);

      return (
            <div className="flex-1 space-y-3 overflow-hidden px-4 py-3">
                  <AnimatePresence mode="wait">
                        {phase === "uploading" && (
                              <motion.div
                                    key="uploading"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2.5 rounded-xl border border-slate-700/40 bg-slate-800/60 px-3 py-2.5"
                              >
                                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                                    <div className="min-w-0 flex-1">
                                          <p className="truncate text-[11px] font-medium text-slate-200">
                                                Q1-Report-2026.pdf
                                          </p>
                                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-700">
                                                <motion.div
                                                      className="h-full rounded-full bg-emerald-500"
                                                      initial={{ width: "0%" }}
                                                      animate={{ width: "100%" }}
                                                      transition={{
                                                            duration: 2.2,
                                                            ease: "easeInOut",
                                                      }}
                                                />
                                          </div>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <AnimatePresence>
                        {showFile && phase !== "uploading" && (
                              <motion.div
                                    key="uploaded"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-start"
                              >
                                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800/70 px-3.5 py-2.5">
                                          <div className="mb-1 flex items-center gap-1.5">
                                                <Sparkles size={10} className="text-orange-400" />
                                                <span className="text-[9px] font-bold tracking-wider text-orange-400 uppercase">
                                                      Donna AI
                                                </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                                <CheckCircle2
                                                      size={12}
                                                      className="shrink-0 text-emerald-400"
                                                />
                                                <p className="text-[11px] text-slate-300">
                                                      Processed{" "}
                                                      <strong className="text-white">
                                                            Q1-Report-2026.pdf
                                                      </strong>{" "}
                                                      12 chunks indexed.
                                                </p>
                                          </div>
                                    </div>
                              </motion.div>
                        )}

                        {showPromptBubble && (
                              <motion.div
                                    key="prompt"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-end"
                              >
                                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-600 px-3.5 py-2.5 text-[11px] font-medium text-white shadow-md shadow-emerald-500/20">
                                          {DEMO_PROMPT}
                                    </div>
                              </motion.div>
                        )}

                        {showThinking && (
                              <motion.div
                                    key="thinking"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-start"
                              >
                                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-800/70 px-3.5 py-2.5">
                                          <span className="text-[9px] font-bold tracking-wider text-orange-400 uppercase">
                                                Thinking
                                          </span>
                                          {[0, 1, 2].map((i) => (
                                                <motion.div
                                                      key={i}
                                                      className="h-1.5 w-1.5 rounded-full bg-orange-400"
                                                      animate={{
                                                            y: [0, -4, 0],
                                                            opacity: [0.4, 1, 0.4],
                                                      }}
                                                      transition={{
                                                            delay: i * 0.15,
                                                            duration: 0.6,
                                                            repeat: Infinity,
                                                      }}
                                                />
                                          ))}
                                    </div>
                              </motion.div>
                        )}

                        {showResponse && (
                              <motion.div
                                    key="response"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-start"
                              >
                                    <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-800/70 px-3.5 py-2.5">
                                          <div className="mb-1 flex items-center gap-1.5">
                                                <Sparkles size={10} className="text-orange-400" />
                                                <span className="text-[9px] font-bold tracking-wider text-orange-400 uppercase">
                                                      Donna AI
                                                </span>
                                          </div>
                                          <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-300">
                                                {DEMO_RESPONSE.slice(0, responseChars)}
                                                {phase === "responding" && (
                                                      <motion.span
                                                            className="ml-0.5 inline-block h-3.5 w-[2px] rounded-full bg-emerald-400 align-middle"
                                                            animate={{ opacity: [1, 0] }}
                                                            transition={{
                                                                  duration: 0.5,
                                                                  repeat: Infinity,
                                                            }}
                                                      />
                                                )}
                                          </p>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}
