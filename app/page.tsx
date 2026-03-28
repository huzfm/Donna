"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Brain,
  FileText,
  Mail,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Upload,
  Send,
  CheckCircle2,
  Loader2,
  User,
  Paperclip,
  Zap,
  Lock,
  Search,
  Globe,
  BarChart3,
  Clock,
  Users,
  ShieldCheck,
  ChevronDown,
  Code2,
  ExternalLink,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents, get summaries, and extract insights using advanced RAG technology.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    accent: "#059669",
    tag: "Core",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description:
      "Upload PDFs, Word docs, Excel files, and more. Donna indexes and understands your content instantly.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "#2563eb",
    tag: "Upload",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description:
      "Read your Gmail inbox, draft responses, and send emails — all through natural conversation.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "#d97706",
    tag: "Gmail",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Find exactly what you need across all your documents using meaning-based vector search, not just keywords.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    accent: "#0891b2",
    tag: "Search",
  },
  {
    icon: Globe,
    title: "Multi-Format Support",
    description:
      "Works with PDF, Word, Excel, CSV, and plain text. Upload anything and start asking questions immediately.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    accent: "#db2777",
    tag: "Files",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your documents and credentials are encrypted and stored privately. Only you can access your data.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    accent: "#7c3aed",
    tag: "Security",
  },
];

const stats = [
  { value: "10+", label: "File formats supported", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "< 3s", label: "Average response time", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { value: "100%", label: "Private & encrypted", icon: Lock, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "24/7", label: "Always available", icon: Clock, color: "text-violet-600", bg: "bg-violet-50" },
];

const useCases = [
  {
    icon: BarChart3,
    title: "Research & Analysis",
    description: "Upload research papers and reports. Ask Donna to summarize findings, compare data, and extract key takeaways.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "#2563eb",
    detail: "PDF, Word, Excel — all supported",
  },
  {
    icon: Mail,
    title: "Email Productivity",
    description: "Connect your Gmail and let Donna read, summarize, draft replies, and send emails through simple chat commands.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "#d97706",
    detail: "Gmail integration built-in",
  },
  {
    icon: Users,
    title: "Team Knowledge Base",
    description: "Build a shared knowledge base from your team's documents. Anyone can ask questions and get instant answers.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    accent: "#7c3aed",
    detail: "Shared workspace for teams",
  },
];

const faqs = [
  {
    q: "What file types does Donna support?",
    a: "Donna supports PDF, Word (.doc, .docx), Excel (.xls, .xlsx), CSV, and plain text files. Upload any of these and start asking questions instantly.",
    icon: FileText,
  },
  {
    q: "How does the AI understand my documents?",
    a: "Donna uses advanced RAG (Retrieval-Augmented Generation) technology. Your documents are chunked, embedded using Hugging Face models, and stored in a vector database for semantic search.",
    icon: Brain,
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. Your documents and credentials are stored privately with Supabase. Only you can access your data — we never share or train on your files.",
    icon: Lock,
  },
  {
    q: "How does the Gmail integration work?",
    a: "You connect your Gmail using an App Password (not your real password). Donna can then read your inbox, summarize emails, and send messages through natural chat commands.",
    icon: Mail,
  },
  {
    q: "How fast are the AI responses?",
    a: "Donna is powered by Groq for blazing fast inference. Most responses arrive in under 3 seconds, even for complex document queries across multiple files.",
    icon: Zap,
  },
  {
    q: "Can I use Donna for free?",
    a: "Yes — Donna is free to use. Sign up, upload your documents, and start chatting with your AI workspace assistant right away.",
    icon: Sparkles,
  },
];

const steps = [
  {
    num: "01",
    title: "Upload Your Files",
    description: "Drag and drop PDFs, Word docs, or spreadsheets into your workspace.",
    icon: Upload,
  },
  {
    num: "02",
    title: "Ask Anything",
    description: "Chat naturally — Donna searches your knowledge base and finds answers.",
    icon: MessageSquare,
  },
  {
    num: "03",
    title: "Take Action",
    description: "Send emails, get summaries, extract data, and automate your workflow.",
    icon: Zap,
  },
];

/* ───────────────────────────────────────────────────────────────────────── */
/*  Navbar auth button — Login if signed out, Dashboard if signed in        */
/* ───────────────────────────────────────────────────────────────────────── */

function NavAuthButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/supabase-browser").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setLoggedIn(!!user);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <div className="w-[100px] h-8" />;

  if (loggedIn) {
    return (
      <Link
        href="/dashboard"
        className="text-[13px] font-semibold bg-slate-900 text-white px-5 py-1.5 rounded-full transition-all duration-200 hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-[13px] font-semibold bg-slate-900 text-white px-5 py-1.5 rounded-full transition-all duration-200 hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
    >
      Log in
    </Link>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/*  Animated Dashboard Demo                                                 */
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
function FeatureStack() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const INTERVAL = 3500;

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % features.length);
    }, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
  };

  const activeFeature = features[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      {/* Left: sliding card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 min-h-[420px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex flex-col justify-center p-10"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${activeFeature.accent}15` }}
            >
              <activeFeature.icon size={26} className={activeFeature.color} />
            </div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest mb-2 block font-(family-name:--font-doto)"
              style={{ color: activeFeature.accent }}
            >
              {activeFeature.tag}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 font-(family-name:--font-doto)">
              {activeFeature.title}
            </h3>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-sm">
              {activeFeature.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div className="absolute bottom-5 left-10 flex items-center gap-2">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                backgroundColor: i === active ? f.accent : "#cbd5e1",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: feature list / indicators */}
      <div className="flex flex-col justify-between gap-1.5 py-1">
        {features.map((feature, i) => (
          <button
            key={feature.title}
            onClick={() => goTo(i)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`w-full text-left rounded-xl px-5 py-4 transition-all duration-300 border ${
              i === active
                ? "bg-white border-slate-300"
                : "bg-transparent border-transparent hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  i === active ? feature.bg : "bg-slate-100"
                }`}
              >
                <feature.icon
                  size={17}
                  className={`transition-colors duration-300 ${i === active ? feature.color : "text-slate-400"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold transition-colors duration-300 font-(family-name:--font-doto) block ${
                  i === active ? "text-slate-900" : "text-slate-500"
                }`}>
                  {feature.title}
                </span>
                {i === active && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-slate-400 mt-0.5 block leading-snug"
                  >
                    {feature.description.slice(0, 60)}...
                  </motion.span>
                )}
              </div>
              {i === active && (
                <div className="h-1.5 w-14 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: feature.accent }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                    key={active}
                  />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer, index, icon: Icon }: { question: string; answer: string; index: number; icon: React.ElementType }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-4 rounded-2xl border bg-white px-6 py-5 text-left transition-all duration-300 ${
          open ? "border-emerald-300" : "border-slate-200 hover:border-slate-400"
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
          open ? "bg-emerald-50" : "bg-slate-100"
        }`}>
          <Icon size={16} className={`transition-colors duration-300 ${open ? "text-emerald-600" : "text-slate-400"}`} />
        </div>
        <span className="flex-1 text-sm font-semibold leading-snug text-slate-900 font-(family-name:--font-doto)">{question}</span>
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
          open ? "border-emerald-300 bg-emerald-50 rotate-180" : "border-slate-200"
        }`}>
          <ChevronDown
            size={14}
            className={`transition-colors duration-300 ${open ? "text-emerald-600" : "text-slate-400"}`}
          />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pl-19 pr-6 pt-2 pb-5 text-sm text-slate-500 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const DEMO_RESPONSE =
  "Based on your Q1 report, here are the key findings:\n\n1. Revenue grew 23% YoY to $4.2M\n2. Customer retention rate improved to 94%\n3. Three new enterprise clients onboarded\n4. Operating costs reduced by 8%";

function DashboardDemo() {
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
      {/* Subtle shadow glow */}
      <div className="absolute -inset-4 bg-slate-200/40 rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl border border-slate-200/60 bg-white p-1 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
        <div className="rounded-xl bg-slate-950 overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-slate-900">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="text-[10px] text-slate-500 bg-slate-800 px-3 py-0.5 rounded-md">
                donna.ai/dashboard
              </div>
            </div>
          </div>

          <div className="flex h-[380px]">
            {/* Mini sidebar */}
            <div className="w-44 border-r border-slate-800/80 p-3 hidden lg:flex flex-col bg-slate-900/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <Brain size={11} className="text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-300">Donna</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                  <MessageSquare size={12} />
                  Chat
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500 text-[11px] rounded-lg hover:bg-slate-800/50">
                  <FileText size={12} />
                  Files
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500 text-[11px] rounded-lg hover:bg-slate-800/50">
                  <Mail size={12} />
                  Gmail
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500 text-[11px] rounded-lg hover:bg-slate-800/50">
                  <User size={12} />
                  Account
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-800/80">
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
              <div className="px-4 py-2.5 border-b border-slate-800/80 shrink-0">
                <p className="text-xs font-semibold text-slate-200">Chat</p>
                <p className="text-[10px] text-slate-500">
                  {showFile ? "1 file in your knowledge base" : "Upload files to get started"}
                </p>
              </div>

              <div className="flex-1 overflow-hidden px-4 py-3 space-y-3">
                <AnimatePresence mode="wait">
                  {phase === "uploading" && (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2.5"
                    >
                      <Loader2 size={14} className="text-emerald-400 animate-spin" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-200 font-medium truncate">Q1-Report-2026.pdf</p>
                        <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
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
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-emerald-600 text-white text-[11px] px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] font-medium shadow-md shadow-emerald-500/20">
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
                      <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2">
                        <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Thinking</span>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-orange-400"
                            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }}
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
                      <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[90%]">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles size={10} className="text-orange-400" />
                          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Donna AI</span>
                        </div>
                        <p className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {DEMO_RESPONSE.slice(0, responseChars)}
                          {phase === "responding" && (
                            <motion.span
                              className="inline-block w-[2px] h-3.5 bg-emerald-400 ml-0.5 align-middle rounded-full"
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

              <div className="border-t border-slate-800/80 px-3 py-2.5 shrink-0">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/40 rounded-xl px-3 py-2">
                  <Paperclip size={13} className="text-slate-600 shrink-0" />
                  <div className="flex-1 text-[11px] text-slate-500 min-w-0 truncate">
                    {phase === "typing" ? (
                      <span className="text-slate-200">
                        {DEMO_PROMPT.slice(0, typedChars)}
                        <motion.span
                          className="inline-block w-[2px] h-3.5 bg-emerald-400 ml-0.5 align-middle rounded-full"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      </span>
                    ) : (
                      "Ask about your files, check emails..."
                    )}
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${phase === "typing"
                      ? "bg-emerald-600 shadow-sm shadow-emerald-500/30"
                      : "bg-slate-800"
                      }`}
                  >
                    <Send size={12} className={phase === "typing" ? "text-white" : "text-slate-600"} />
                  </div>
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
    <div className="min-h-screen overflow-hidden relative">
      {/* Global grid background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
      </div>
      {/* ─── Floating Navbar ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-full shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] px-2.5 py-1.5"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 pl-2 group">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Brain size={15} className="text-emerald-600" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900">Donna</span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#how-it-works" className="nav-link">
                How it works
              </a>
              <Link href="/signup" className="nav-link">
                Sign up
              </Link>
              <a href="#" className="nav-link">
                Docs
              </a>
              <a href="#" className="nav-link">
                About
              </a>
            </nav>

            <NavAuthButton />
          </div>
        </motion.header>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative bg-white pt-32 md:pt-40 pb-24 px-6">
        {/* Lightning grid */}
        <div className="lightning-grid">
          <div className="lightning-grid-lines" />
          <div className="lightning-pulse-h" style={{ top: "25%", animationDelay: "0s" }} />
          <div className="lightning-pulse-h" style={{ top: "50%", animationDelay: "1.5s" }} />
          <div className="lightning-pulse-h" style={{ top: "75%", animationDelay: "2.8s" }} />
          <div className="lightning-pulse-v" style={{ left: "20%", animationDelay: "0.5s" }} />
          <div className="lightning-pulse-v" style={{ left: "50%", animationDelay: "2s" }} />
          <div className="lightning-pulse-v" style={{ left: "80%", animationDelay: "3.5s" }} />
          <div className="lightning-flash" style={{ top: "30%", left: "25%", animationDelay: "0s" }} />
          <div className="lightning-flash" style={{ top: "60%", left: "70%", animationDelay: "1.5s" }} />
          <div className="lightning-flash" style={{ top: "20%", left: "60%", animationDelay: "2.5s" }} />
        </div>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-600 font-semibold mb-7 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Powered by Groq &amp; Hugging Face
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-(family-name:--font-doto) text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-slate-950"
            >
              Your AI-Powered
              <br />
              <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Workspace Brain
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-mono text-[15px] md:text-base text-slate-600 max-w-md mb-9 leading-relaxed"
            >
              Upload documents, ask questions, manage emails — all in one
              intelligent workspace. Donna understands your files and helps you
              work smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold transition-all text-sm hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
              >
                Get Started
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-4 mt-10 pt-8 border-t border-slate-100"
            >
              {[
                { icon: Upload, text: "PDF, Word, Excel" },
                { icon: MessageSquare, text: "Natural chat" },
                { icon: Mail, text: "Gmail built-in" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <badge.icon size={12} className="text-slate-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div> */}
          </div>

          {/* Right — animated dashboard demo */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <DashboardDemo />
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900">
              Everything you need in{" "}
              <span className="text-emerald-600">one workspace</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[15px]">
              Donna brings together document intelligence, email management, and AI chat
              into a seamless experience.
            </p>
          </motion.div>

          <FeatureStack />
        </div>
      </section>

      {/* ─── Stats / Social Proof ─── */}
      <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">By the numbers</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Designed to be{" "}
              <span className="text-emerald-600">fast, private & reliable</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center hover:border-slate-400 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-5`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1.5 tracking-tight font-(family-name:--font-doto)">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 font-medium leading-snug">{stat.label}</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-12 rounded-full bg-emerald-500 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use Cases ─── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">Use Cases</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900 font-(family-name:--font-doto)">
              Built for the way{" "}
              <span className="text-emerald-600">you work</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[15px] leading-relaxed">
              Whether you&apos;re researching, managing emails, or building a knowledge base — Donna adapts to your workflow.
            </p>
          </motion.div>

          <div className="space-y-4">
            {useCases.map((uc, i) => {
              const UcIcon = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-7 md:p-8 hover:border-slate-400 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full rounded-r-full transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundColor: uc.accent }} />
                  <div className="flex items-start gap-5 md:gap-6">
                    <div className={`w-13 h-13 rounded-xl ${uc.bg} flex items-center justify-center shrink-0`}>
                      <UcIcon size={24} className={uc.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight font-(family-name:--font-doto)">
                          {uc.title}
                        </h3>
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border" style={{ color: uc.accent, borderColor: `${uc.accent}40` }}>
                          {uc.detail}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{uc.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="py-28 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900 font-(family-name:--font-doto)">
              Get started in{" "}
              <span className="text-emerald-600">three steps</span>
            </h2>
            <p className="text-slate-500 text-[15px]">No complex setup — just sign up and start working smarter.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-slate-400 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all duration-300">
                      <StepIcon size={20} className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-300" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 font-(family-name:--font-doto) group-hover:text-emerald-100 transition-colors duration-300">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 tracking-tight text-slate-900 font-(family-name:--font-doto)">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-slate-200" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">Powered By</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-(family-name:--font-doto)">
              Built on cutting-edge technology
            </h2>
          </motion.div>
        </div>

        {/* Marquee track */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] w-max gap-5">
            {[...Array(3)].map((_, setIdx) =>
              [
                { name: "Groq", desc: "LLM inference", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                { name: "Hugging Face", desc: "Embeddings", icon: Brain, color: "text-emerald-600", bg: "bg-emerald-50" },
                { name: "Supabase", desc: "Auth & database", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "Next.js", desc: "App framework", icon: Globe, color: "text-slate-900", bg: "bg-slate-100" },
                { name: "TypeScript", desc: "Type safety", icon: Code2, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "Tailwind CSS", desc: "Styling", icon: Sparkles, color: "text-cyan-600", bg: "bg-cyan-50" },
              ].map((tech) => {
                const TechIcon = tech.icon;
                return (
                  <div
                    key={`${setIdx}-${tech.name}`}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shrink-0 hover:border-slate-400 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl ${tech.bg} flex items-center justify-center shrink-0`}>
                      <TechIcon size={18} className={tech.color} />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-slate-900 font-(family-name:--font-doto)">{tech.name}</div>
                      <div className="text-[11px] text-slate-400">{tech.desc}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section id="team" className="py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">The Team</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900 font-(family-name:--font-doto)">
              Meet the{" "}
              <span className="text-emerald-600">builders</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[15px] leading-relaxed">
              Two full-stack developers passionate about building AI-powered tools that make work easier.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Huzaif",
                role: "Full Stack Developer",
                bio: "Passionate about building seamless user experiences and scalable backend systems. Focused on AI integration and real-time features.",
                skills: ["React", "Next.js", "Node.js", "AI/ML"],
                gradient: "from-emerald-500 to-teal-500",
                initial: "H",
              },
              {
                name: "Faisal",
                role: "Full Stack Developer",
                bio: "Driven by clean architecture and performance optimization. Specializes in database design, API development, and cloud infrastructure.",
                skills: ["TypeScript", "Supabase", "Python", "DevOps"],
                gradient: "from-blue-500 to-indigo-500",
                initial: "F",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-slate-400 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${member.gradient}`} />

                <div className="flex items-start gap-5 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${member.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-2xl font-black text-white font-(family-name:--font-doto)">{member.initial}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight font-(family-name:--font-doto)">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Code2 size={13} className="text-slate-400" />
                      <span className="text-sm text-slate-500 font-medium">{member.role}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">{member.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200 text-slate-500 group-hover:border-slate-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 hover:text-slate-900 hover:border-slate-400 transition-all">
                    <Code2 size={12} />
                    GitHub
                  </a>
                  <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 hover:text-slate-900 hover:border-slate-400 transition-all">
                    <ExternalLink size={12} />
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-28 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">
            {/* Left: heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-32 self-start"
            >
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-(family-name:--font-doto)">
                Frequently asked{" "}
                <span className="text-emerald-600">questions</span>
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed mb-6">
                Everything you need to know about Donna. Can&apos;t find what you&apos;re looking for? Reach out to our team.
              </p>
              <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
                <MessageSquare size={14} />
                <span>{faqs.length} questions answered</span>
              </div>
            </motion.div>

            {/* Right: accordion */}
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} index={i} icon={faq.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 relative overflow-hidden"
          >
            {/* Top accent border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: content */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                    <Sparkles size={22} className="text-emerald-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900 font-(family-name:--font-doto)">
                    Ready to work{" "}
                    <span className="text-emerald-600">smarter?</span>
                  </h2>
                  <p className="text-slate-500 mb-8 text-[15px] leading-relaxed max-w-sm">
                    Join Donna and let AI handle the heavy lifting — from document analysis to email management.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <Link
                      href="/signup"
                      className="group inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-3 rounded-full font-semibold transition-all text-sm hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
                    >
                      Get started free
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 border border-slate-300 text-slate-600 px-7 py-3 rounded-full font-medium transition-all text-sm hover:border-slate-900 hover:text-slate-900"
                    >
                      Sign in
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right: feature highlights */}
              <div className="bg-slate-50 p-10 md:p-14 border-t lg:border-t-0 lg:border-l border-slate-200">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="space-y-5"
                >
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">What you get</p>
                  {[
                    { icon: Brain, text: "AI chat powered by Groq — blazing fast responses" },
                    { icon: FileText, text: "Upload PDFs, Word, Excel — 10+ formats supported" },
                    { icon: Mail, text: "Gmail integration — read, draft & send from chat" },
                    { icon: Lock, text: "100% private — your data never leaves your workspace" },
                  ].map((item, i) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <ItemIcon size={14} className="text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-600 leading-relaxed">{item.text}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800 py-12 px-6 bg-[#020617] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Brain size={14} className="text-emerald-400" />
                </div>
                <span className="text-sm font-bold">Donna</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your AI-powered workspace brain. Upload, ask, and automate.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-slate-500 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block text-sm text-slate-500 hover:text-white transition-colors">How it works</a>
                <a href="#team" className="block text-sm text-slate-500 hover:text-white transition-colors">Team</a>
                <Link href="/signup" className="block text-sm text-slate-500 hover:text-white transition-colors">Sign up</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Account</h4>
              <div className="space-y-2">
                <Link href="/login" className="block text-sm text-slate-500 hover:text-white transition-colors">Log in</Link>
                <Link href="/dashboard" className="block text-sm text-slate-500 hover:text-white transition-colors">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Donna. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock size={11} />
              Built with Next.js, Supabase &amp; Groq
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
