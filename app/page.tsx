"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  FileText,
  Mail,
  MessageSquare,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Upload,
  Send,
  CheckCircle2,
  Loader2,
  User,
  Paperclip,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents, get summaries, and extract insights using advanced RAG technology.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description:
      "Upload PDFs, Word docs, Excel files, and more. Donna indexes and understands your content instantly.",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description:
      "Read your Gmail inbox, draft responses, and send emails — all through natural conversation.",
    gradient: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your documents and credentials are stored securely. Only you can access your data.",
    gradient: "from-violet-500/20 to-violet-500/5",
  },
];

const steps = [
  { num: "01", title: "Upload Your Files", description: "Drag and drop PDFs, Word docs, or spreadsheets." },
  { num: "02", title: "Ask Anything", description: "Chat naturally — Donna searches your knowledge base." },
  { num: "03", title: "Take Action", description: "Send emails, get summaries, and automate tasks." },
];

/* ───────────────────────────────────────────────────────────────────────── */
/*  Animated Dashboard Demo (right side of hero)                            */
/* ───────────────────────────────────────────────────────────────────────── */

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

function DashboardDemo() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [typedChars, setTypedChars] = useState(0);
  const [responseChars, setResponseChars] = useState(0);

  const resetDemo = useCallback(() => {
    setPhase("idle");
    setTypedChars(0);
    setResponseChars(0);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    // Phase 1: start upload after 1.5s
    schedule(() => setPhase("uploading"), 1500);
    // Phase 2: upload complete after 3s
    schedule(() => setPhase("uploaded"), 4000);
    // Phase 3: start typing prompt after 5s
    schedule(() => setPhase("typing"), 5500);

    return () => timers.forEach(clearTimeout);
  }, []);

  // Typing animation for the prompt
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

  // Thinking → responding
  useEffect(() => {
    if (phase !== "thinking") return;
    const t = setTimeout(() => setPhase("responding"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // Response typing animation
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

  // Loop: reset after done
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
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-1 shadow-2xl shadow-black/50">
      <div className="rounded-xl bg-slate-950 overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-[10px] text-slate-500 bg-slate-800/50 px-3 py-0.5 rounded">
              donna.ai/dashboard
            </div>
          </div>
        </div>

        <div className="flex h-[380px]">
          {/* Mini sidebar */}
          <div className="w-44 border-r border-slate-800 p-3 hidden lg:flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded bg-emerald-500/15 flex items-center justify-center">
                <Brain size={11} className="text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-slate-300">Donna</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                <MessageSquare size={12} />
                Chat
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-500 text-[11px]">
                <FileText size={12} />
                Files
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-500 text-[11px]">
                <Mail size={12} />
                Gmail
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-500 text-[11px]">
                <User size={12} />
                Account
              </div>
            </div>
            <div className="mt-auto pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-[9px] font-bold">
                  J
                </div>
                <span className="text-[10px] text-slate-500 truncate">john@email.com</span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="px-4 py-2.5 border-b border-slate-800 shrink-0">
              <p className="text-xs font-medium text-slate-300">Chat</p>
              <p className="text-[10px] text-slate-600">
                {showFile ? "1 file in your knowledge base" : "Upload files to get started"}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden px-4 py-3 space-y-3">
              {/* File upload notification */}
              <AnimatePresence>
                {phase === "uploading" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2"
                  >
                    <Loader2 size={12} className="text-emerald-400 animate-spin" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-300 truncate">Q1-Report-2026.pdf</p>
                      <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.2, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {showFile && phase !== "uploading" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800/80 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={10} className="text-orange-400" />
                        <span className="text-[9px] font-semibold text-orange-400 uppercase tracking-wider">Donna AI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        <p className="text-[11px] text-slate-300">
                          Processed <strong>Q1-Report-2026.pdf</strong> — 12 chunks indexed.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* User prompt bubble */}
                {showPromptBubble && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-emerald-600 text-white text-[11px] px-3 py-2 rounded-xl rounded-tr-sm max-w-[80%]">
                      {DEMO_PROMPT}
                    </div>
                  </motion.div>
                )}

                {/* Thinking indicator */}
                {showThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800/80 rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-orange-400 uppercase tracking-wider">Thinking</span>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full bg-orange-400"
                          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* AI Response */}
                {showResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800/80 rounded-xl rounded-tl-sm px-3 py-2 max-w-[90%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={10} className="text-orange-400" />
                        <span className="text-[9px] font-semibold text-orange-400 uppercase tracking-wider">Donna AI</span>
                      </div>
                      <p className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {DEMO_RESPONSE.slice(0, responseChars)}
                        {phase === "responding" && (
                          <motion.span
                            className="inline-block w-[2px] h-3 bg-emerald-400 ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="border-t border-slate-800 px-3 py-2.5 shrink-0">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2">
                <Paperclip size={13} className="text-slate-600 shrink-0" />
                <div className="flex-1 text-[11px] text-slate-500 min-w-0 truncate">
                  {phase === "typing" ? (
                    <span className="text-slate-300">
                      {DEMO_PROMPT.slice(0, typedChars)}
                      <motion.span
                        className="inline-block w-[2px] h-3 bg-emerald-400 ml-0.5 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    </span>
                  ) : (
                    "Ask about your files, check emails..."
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${phase === "typing"
                    ? "bg-emerald-600"
                    : "bg-slate-800"
                    }`}
                >
                  <Send size={11} className={phase === "typing" ? "text-white" : "text-slate-600"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/*  Page                                                                    */
/* ───────────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Brain size={18} className="text-emerald-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Donna</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  Hero — text left, animated demo right                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 md:pt-36 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/3 w-[700px] h-[500px] bg-emerald-500/7 rounded-full blur-[120px]" />
          <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-xs text-slate-300 mb-6"
            >
              <Sparkles size={12} className="text-emerald-400" />
              Powered by Groq &amp; Hugging Face
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-(family-name:--font-doto) text-8
              xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Your AI-Powered{" "}
              <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Workspace Brain
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-(family-name:--font-doto) text-base md:text-lg text-slate-400 max-w-lg mb-8 leading-relaxed"
            >
              Upload documents, ask questions, manage emails — all in one
              intelligent workspace. Donna understands your files and helps you
              work smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
              >
                Start for free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-7 py-3.5 rounded-xl font-medium transition-all"
              >
                Sign in to your account
              </Link>
            </motion.div>

            {/* Mini trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-5 mt-10"
            >
              {[
                { icon: Upload, text: "PDF, Word, Excel" },
                { icon: MessageSquare, text: "Natural chat" },
                { icon: Mail, text: "Gmail built-in" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 text-slate-500">
                  <badge.icon size={13} className="text-emerald-500/70" />
                  <span className="text-xs">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — animated dashboard demo */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <DashboardDemo />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need in{" "}
              <span className="text-emerald-400">one workspace</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Donna brings together document intelligence, email management, and AI chat
              into a seamless experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 hover:border-slate-700 transition-all"
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-5 group-hover:bg-emerald-500/10 transition-colors">
                    <feature.icon size={22} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started in{" "}
              <span className="text-emerald-400">three steps</span>
            </h2>
            <p className="text-slate-400">No complex setup — just sign up and start working smarter.</p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-start gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl border border-slate-700 bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all">
                  <span className="text-sm font-bold text-emerald-400">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="rounded-3xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-orange-500/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to work smarter?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Join Donna and let AI handle the heavy lifting — from document analysis to email management.
              </p>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                Create free account
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">Donna</span>
          </div>
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Donna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
