"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Loader2,
  User,
  Paperclip,
} from "lucide-react";

type DemoPhase =
  | "idle"
  | "uploading"
  | "uploaded"
  | "typing"
  | "thinking"
  | "responding"
  | "done";

const DEMO_PROMPT = "Summarize the key findings from the report";
const DEMO_RESPONSE =
  "Based on your Q1 report, here are the key findings:\n\n1. Revenue grew 23% YoY to $4.2M\n2. Customer retention rate improved to 94%\n3. Three new enterprise clients onboarded\n4. Operating costs reduced by 8%";

export default function DashboardDemo() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [typedChars, setTypedChars] = useState(0);
  const [responseChars, setResponseChars] = useState(0);
  const [cycle, setCycle] = useState(0);

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
    const speed = 40 + Math.random() * 40;
    const t = setTimeout(() => setTypedChars((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [phase, typedChars]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const t = setTimeout(() => setPhase("responding"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "responding") return;
    if (responseChars >= DEMO_RESPONSE.length) {
      const t = setTimeout(() => setPhase("done"), 2000);
      return () => clearTimeout(t);
    }
    const speed = 12 + Math.random() * 18;
    const t = setTimeout(() => setResponseChars((c) => c + 2), speed);
    return () => clearTimeout(t);
  }, [phase, responseChars]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(resetDemo, 3000);
    return () => clearTimeout(t);
  }, [phase, resetDemo]);

  const showFile = phase !== "idle";
  const showPromptBubble = ["thinking", "responding", "done"].includes(phase);
  const showThinking = phase === "thinking";
  const showResponse = ["responding", "done"].includes(phase);

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
          <div className="rounded-xl bg-slate-950 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-slate-900">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="text-[10px] text-slate-500 bg-slate-800 px-3 py-0.5 rounded-md flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  donna.ai/dashboard
                </div>
              </div>
              <div className="w-12" />
            </div>

            <div className="flex h-[380px]">
              <div className="w-44 border-r border-slate-800/80 p-3 hidden lg:flex flex-col bg-slate-900/50">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Brain size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Donna</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                    <MessageSquare size={12} /> Chat
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500 text-[11px] rounded-lg hover:bg-slate-800/50">
                    <FileText size={12} /> Files
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500 text-[11px] rounded-lg hover:bg-slate-800/50">
                    <Mail size={12} /> Gmail
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500 text-[11px] rounded-lg hover:bg-slate-800/50">
                    <User size={12} /> Account
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-[9px] font-bold">J</div>
                    <span className="text-[10px] text-slate-500 truncate">john@email.com</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="px-4 py-2.5 border-b border-slate-800/80 shrink-0">
                  <p className="text-xs font-semibold text-slate-200">Chat</p>
                  <p className="text-[10px] text-slate-500">
                    {showFile ? "1 file in your knowledge base" : "Upload files to get started"}
                  </p>
                </div>

                <div className="flex-1 overflow-hidden px-4 py-3 space-y-3">
                  <AnimatePresence mode="wait">
                    {phase === "uploading" && (
                      <motion.div key="uploading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2.5">
                        <Loader2 size={14} className="text-emerald-400 animate-spin" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-slate-200 font-medium truncate">Q1-Report-2026.pdf</p>
                          <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.2, ease: "easeInOut" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showFile && phase !== "uploading" && (
                      <motion.div key="uploaded" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                        <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles size={10} className="text-orange-400" />
                            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Donna AI</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                            <p className="text-[11px] text-slate-300">
                              Processed <strong className="text-white">Q1-Report-2026.pdf</strong> — 12 chunks indexed.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {showPromptBubble && (
                      <motion.div key="prompt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end">
                        <div className="bg-emerald-600 text-white text-[11px] px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] font-medium shadow-md shadow-emerald-500/20">
                          {DEMO_PROMPT}
                        </div>
                      </motion.div>
                    )}

                    {showThinking && (
                      <motion.div key="thinking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                        <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2">
                          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Thinking</span>
                          {[0, 1, 2].map((i) => (
                            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400"
                              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }} />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {showResponse && (
                      <motion.div key="response" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                        <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[90%]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles size={10} className="text-orange-400" />
                            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Donna AI</span>
                          </div>
                          <p className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {DEMO_RESPONSE.slice(0, responseChars)}
                            {phase === "responding" && (
                              <motion.span className="inline-block w-[2px] h-3.5 bg-emerald-400 ml-0.5 align-middle rounded-full"
                                animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                            )}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-slate-800/80 px-3 py-2.5 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/40 rounded-xl px-3 py-2">
                    <Paperclip size={13} className="text-slate-600 shrink-0" />
                    <div className="flex-1 text-[11px] text-slate-500 min-w-0 truncate">
                      {phase === "typing" ? (
                        <span className="text-slate-200">
                          {DEMO_PROMPT.slice(0, typedChars)}
                          <motion.span className="inline-block w-[2px] h-3.5 bg-emerald-400 ml-0.5 align-middle rounded-full"
                            animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                        </span>
                      ) : (
                        "Ask about your files, check emails..."
                      )}
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      phase === "typing" ? "bg-emerald-600 shadow-sm shadow-emerald-500/30" : "bg-slate-800"
                    }`}>
                      <Send size={12} className={phase === "typing" ? "text-white" : "text-slate-600"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-medium text-slate-500">Live demo</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
