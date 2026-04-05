"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Brain, FileText, Mail, MessageSquare, User, Paperclip, Send } from "lucide-react";
import DashboardDemoMessages from "./DashboardDemoMessages";

type DemoPhase = "idle" | "uploading" | "uploaded" | "typing" | "thinking" | "responding" | "done";

const DEMO_PROMPT = "Summarize the key findings from the report";

export default function DashboardDemo() {
      const [phase, setPhase] = useState<DemoPhase>("idle");
      const [typedChars, setTypedChars] = useState(0);
      const [responseChars, setResponseChars] = useState(0);
      const [cycle, setCycle] = useState(0);

      const DEMO_RESPONSE_LEN = 160;

      const resetDemo = useCallback(() => {
            setPhase("idle");
            setTypedChars(0);
            setResponseChars(0);
            setCycle((c) => c + 1);
      }, []);

      useEffect(() => {
            const timers: ReturnType<typeof setTimeout>[] = [];
            const schedule = (fn: () => void, ms: number) => {
                  timers.push(setTimeout(fn, ms));
            };
            schedule(() => setPhase("uploading"), 1500);
            schedule(() => setPhase("uploaded"), 4000);
            schedule(() => setPhase("typing"), 5500);
            return () => timers.forEach(clearTimeout);
      }, [cycle]);

      useEffect(() => {
            if (phase !== "typing") return;
            if (typedChars >= DEMO_PROMPT.length) {
                  const t = setTimeout(() => setPhase("thinking"), 600);
                  return () => clearTimeout(t);
            }
            const t = setTimeout(() => setTypedChars((c) => c + 1), 40 + Math.random() * 40);
            return () => clearTimeout(t);
      }, [phase, typedChars]);

      useEffect(() => {
            if (phase !== "thinking") return;
            const t = setTimeout(() => setPhase("responding"), 2000);
            return () => clearTimeout(t);
      }, [phase]);

      useEffect(() => {
            if (phase !== "responding") return;
            if (responseChars >= DEMO_RESPONSE_LEN) {
                  const t = setTimeout(() => setPhase("done"), 2000);
                  return () => clearTimeout(t);
            }
            const t = setTimeout(() => setResponseChars((c) => c + 2), 12 + Math.random() * 18);
            return () => clearTimeout(t);
      }, [phase, responseChars, DEMO_RESPONSE_LEN]);

      useEffect(() => {
            if (phase !== "done") return;
            const t = setTimeout(resetDemo, 3000);
            return () => clearTimeout(t);
      }, [phase, resetDemo]);

      const showFile = phase !== "idle";

      return (
            <div className="relative">
                  <motion.div
                        initial={{ opacity: 0, y: 20, rotateX: 8 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{ perspective: 1200 }}
                        className="relative"
                  >
                        <div className="relative rounded-2xl border border-slate-200 bg-white p-1">
                              <div className="overflow-hidden rounded-xl bg-slate-950">
                                    {/* Title bar */}
                                    <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-900 px-4 py-2.5">
                                          <div className="flex gap-1.5">
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                                          </div>
                                          <div className="flex flex-1 justify-center">
                                                <div className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-0.5 text-[10px] text-slate-500">
                                                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                      donna.ai/dashboard
                                                </div>
                                          </div>
                                          <div className="w-12" />
                                    </div>

                                    <div className="flex h-[380px]">
                                          {/* Sidebar */}
                                          <div className="hidden w-44 flex-col border-r border-slate-800/80 bg-slate-900/50 p-3 lg:flex">
                                                <div className="mb-5 flex items-center gap-2">
                                                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15">
                                                            <Brain
                                                                  size={11}
                                                                  className="text-emerald-400"
                                                            />
                                                      </div>
                                                      <span className="text-xs font-semibold text-slate-300">
                                                            Donna
                                                      </span>
                                                </div>
                                                <div className="space-y-0.5">
                                                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2.5 py-2 text-[11px] font-medium text-emerald-400">
                                                            <MessageSquare size={12} /> Chat
                                                      </div>
                                                      <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] text-slate-500">
                                                            <FileText size={12} /> Files
                                                      </div>
                                                      <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] text-slate-500">
                                                            <Mail size={12} /> Gmail
                                                      </div>
                                                      <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] text-slate-500">
                                                            <User size={12} /> Account
                                                      </div>
                                                </div>
                                                <div className="mt-auto border-t border-slate-800/80 pt-3">
                                                      <div className="flex items-center gap-2">
                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-bold text-emerald-400">
                                                                  J
                                                            </div>
                                                            <span className="truncate text-[10px] text-slate-500">
                                                                  john@email.com
                                                            </span>
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Main content */}
                                          <div className="flex min-w-0 flex-1 flex-col">
                                                <div className="shrink-0 border-b border-slate-800/80 px-4 py-2.5">
                                                      <p className="text-xs font-semibold text-slate-200">
                                                            Chat
                                                      </p>
                                                      <p className="text-[10px] text-slate-500">
                                                            {showFile
                                                                  ? "1 file in your knowledge base"
                                                                  : "Upload files to get started"}
                                                      </p>
                                                </div>

                                                <DashboardDemoMessages
                                                      phase={phase}
                                                      responseChars={responseChars}
                                                />

                                                {/* Input bar */}
                                                <div className="shrink-0 border-t border-slate-800/80 px-3 py-2.5">
                                                      <div className="flex items-center gap-2 rounded-xl border border-slate-700/40 bg-slate-900 px-3 py-2">
                                                            <Paperclip
                                                                  size={13}
                                                                  className="shrink-0 text-slate-600"
                                                            />
                                                            <div className="min-w-0 flex-1 truncate text-[11px] text-slate-500">
                                                                  {phase === "typing" ? (
                                                                        <span className="text-slate-200">
                                                                              {DEMO_PROMPT.slice(
                                                                                    0,
                                                                                    typedChars
                                                                              )}
                                                                              <motion.span
                                                                                    className="ml-0.5 inline-block h-3.5 w-[2px] rounded-full bg-emerald-400 align-middle"
                                                                                    animate={{
                                                                                          opacity: [
                                                                                                1,
                                                                                                0,
                                                                                          ],
                                                                                    }}
                                                                                    transition={{
                                                                                          duration: 0.5,
                                                                                          repeat: Infinity,
                                                                                    }}
                                                                              />
                                                                        </span>
                                                                  ) : (
                                                                        "Ask about your files, check emails..."
                                                                  )}
                                                            </div>
                                                            <div
                                                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${phase === "typing" ? "bg-emerald-600 shadow-sm shadow-emerald-500/30" : "bg-slate-800"}`}
                                                            >
                                                                  <Send
                                                                        size={12}
                                                                        className={
                                                                              phase === "typing"
                                                                                    ? "text-white"
                                                                                    : "text-slate-600"
                                                                        }
                                                                  />
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </motion.div>
            </div>
      );
}
