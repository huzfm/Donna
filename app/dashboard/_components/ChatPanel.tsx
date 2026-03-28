"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Sparkles,
  Square,
  Copy,
  Check,
  X,
  Zap,
  ArrowUp,
  Trash2,
  Mail,
  Send,
  AtSign,
  AlignLeft,
  ChevronRight,
} from "lucide-react";
import { ChatMessage, SLASH_COMMANDS } from "./types";
import MarkdownContent from "./MarkdownContent";
import { BrandLogo, BrandMark } from "@/components/brand/BrandLogo";

/* ══════════════════════════════════════════════
   CopyButton
══════════════════════════════════════════════ */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all group-hover:bg-slate-100 group-hover:text-slate-800 group-hover:opacity-100"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-black" /> : <Copy size={13} />}
    </button>
  );
}

/* ══════════════════════════════════════════════
   Email Compose Modal   with AI Suggestions
══════════════════════════════════════════════ */
interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

type Tone = "professional" | "friendly" | "concise";

const TONES: { id: Tone; label: string;  }[] = [
  { id: "professional", label: "Professional", },
  { id: "friendly", label: "Friendly"},
  { id: "concise", label: "Concise"},
];

function EmailComposeModal({
  onSend,
  onClose,
}: {
  onSend: (msg: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<EmailDraft>({ to: "", subject: "", body: "" });
  const [focused, setFocused] = useState<keyof EmailDraft | null>(null);
  const [tone, setTone] = useState<Tone>("professional");
  const [improving, setImproving] = useState(false);
  const [suggestingSubject, setSuggestingSubject] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [ghostText, setGhostText] = useState("");
  const [ghostTimer, setGhostTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [improveFlash, setImproveFlash] = useState(false);
  const toRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    toRef.current?.focus();
  }, []);

  const handle =
    (field: keyof EmailDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setDraft((d) => ({ ...d, [field]: val }));

      // Ghost-text: trigger on body changes with debounce
      if (field === "body") {
        setGhostText("");
        if (ghostTimer) clearTimeout(ghostTimer);
        if (val.trim().length > 20) {
          const t = setTimeout(async () => {
            try {
              const res = await fetch("/api/email-suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "complete_body",
                  to: draft.to,
                  subject: draft.subject,
                  body: val,
                }),
              });
              const data = await res.json();
              if (data.result && !val.endsWith(data.result)) {
                setGhostText(data.result);
              }
            } catch {
              /* silent */
            }
          }, 1200);
          setGhostTimer(t);
        }
      }
    };

  // Accept ghost-text with Tab key
  const handleBodyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      setDraft((d) => ({ ...d, body: d.body + ghostText }));
      setGhostText("");
    }
  };

  const canSend = draft.to.trim() && draft.subject.trim() && draft.body.trim();

  const submit = () => {
    if (!canSend) return;
    onSend(
      `Send an email to ${draft.to.trim()} with subject "${draft.subject.trim()}" and body: ${draft.body.trim()}`
    );
    onClose();
  };

  // ── AI: Improve body ──────────────────────────────────────────────────
  const handleImprove = async () => {
    if (!draft.body.trim() || improving) return;
    setImproving(true);
    setGhostText("");
    try {
      const res = await fetch("/api/email-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "improve_body",
          to: draft.to,
          subject: draft.subject,
          body: draft.body,
          tone,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setDraft((d) => ({ ...d, body: data.result }));
        setImproveFlash(true);
        setTimeout(() => setImproveFlash(false), 800);
      }
    } catch {
      /* silent */
    } finally {
      setImproving(false);
    }
  };

  // ── AI: Suggest subjects ──────────────────────────────────────────────
  const handleSuggestSubject = async () => {
    if (!draft.body.trim() || suggestingSubject) return;
    setSuggestingSubject(true);
    setSubjectSuggestions([]);
    try {
      const res = await fetch("/api/email-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "suggest_subject", to: draft.to, body: draft.body }),
      });
      const data = await res.json();
      if (Array.isArray(data.result)) setSubjectSuggestions(data.result);
    } catch {
      /* silent */
    } finally {
      setSuggestingSubject(false);
    }
  };

  const fieldStyle = (f: keyof EmailDraft) => ({
    background: focused === f ? "#f8fafc" : "#ffffff",
    border: `1px solid ${focused === f ? "#94a3b8" : "#e2e8f0"}`,
    transition: "all 0.18s",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 bottom-full left-0 z-50 mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-300/80 bg-slate-100/50 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 shadow-sm shadow-slate-300/20">
            <Mail size={13} className="text-white" />
          </div>
          <span className="text-[13px] font-semibold text-slate-900">New Email</span>
          <span className="ml-1 flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-black">
            <Sparkles size={8} className="text-black" />
            AI
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={13} />
        </button>
      </div>

      {/* Tone selector */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white/80 px-4 py-2.5">
        <Sparkles size={10} className="shrink-0 text-black" />
        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Tone</span>
        <div className="flex gap-1.5 ml-1">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10.5px] font-medium transition-all"
              style={{
                background: tone === t.id ? "#f1f5f9" : "#f8fafc",
                color: tone === t.id ? "#0f172a" : "#64748b",
                border: `1px solid ${tone === t.id ? "#94a3b8" : "#e2e8f0"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3 p-4">
        {/* To */}
        <div className="overflow-hidden rounded-xl" style={fieldStyle("to")}>
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <AtSign size={13} className="shrink-0 text-slate-500" />
            <span className="w-12 shrink-0 text-[11px] font-medium text-slate-500">To</span>
            <input
              ref={toRef}
              type="email"
              value={draft.to}
              onChange={handle("to")}
              onFocus={() => setFocused("to")}
              onBlur={() => setFocused(null)}
              placeholder="recipient@example.com"
              className="flex-1 bg-transparent text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="overflow-hidden rounded-xl" style={fieldStyle("subject")}>
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <AlignLeft size={13} className="shrink-0 text-slate-500" />
            <span className="w-12 shrink-0 text-[11px] font-medium text-slate-500">Subject</span>
            <input
              type="text"
              value={draft.subject}
              onChange={handle("subject")}
              onFocus={() => setFocused("subject")}
              onBlur={() => setFocused(null)}
              placeholder="What's this email about?"
              className="flex-1 bg-transparent text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            {/* AI subject suggest button */}
            <button
              onClick={handleSuggestSubject}
              disabled={!draft.body.trim() || suggestingSubject}
              title="AI suggest subject lines"
              className="ml-1 flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-[10px] font-medium text-black transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestingSubject ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={9} />
                </motion.div>
              ) : (
                <Sparkles size={9} />
              )}
              Suggest
            </button>
          </div>
          {/* Subject suggestions */}
          <AnimatePresence>
            {subjectSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-100 px-4 py-2"
              >
                <p className="mb-1.5 text-[9.5px] tracking-wider text-slate-500 uppercase">
                  AI Suggestions — click to use
                </p>
                <div className="flex flex-col gap-1">
                  {subjectSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDraft((d) => ({ ...d, subject: s }));
                        setSubjectSuggestions([]);
                      }}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-[12px] text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-100"
                    >
                      <ChevronRight size={10} className="shrink-0 text-black" />
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Body */}
        <div
          className="overflow-hidden rounded-xl transition-all"
          style={{
            ...fieldStyle("body"),
            border: improveFlash ? "1px solid rgba(0,0,0,0.45)" : fieldStyle("body").border,
            boxShadow: improveFlash ? "0 0 12px rgba(0,0,0,0.15)" : "none",
          }}
        >
          <div className="px-4 pt-2.5 pb-1">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-500">Message</p>
              {/* AI Improve button */}
              <button
                onClick={handleImprove}
                disabled={!draft.body.trim() || improving}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-medium transition-all"
                style={{
                  background: improving ? "rgba(15,23,42,0.1)" : "rgba(15,23,42,0.05)",
                  color: !draft.body.trim() ? "#94a3b8" : "#0f172a",
                  border: `1px solid ${improving ? "#94a3b8" : "#cbd5e1"}`,
                  cursor: !draft.body.trim() ? "not-allowed" : "pointer",
                }}
                title={`Improve with AI (${tone} tone)`}
              >
                {improving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={9} />
                    </motion.div>
                    Improving…
                  </>
                ) : (
                  <>
                    <Sparkles size={9} />
                    Improve
                  </>
                )}
              </button>
            </div>

            {/* Ghost-text overlay wrapper */}
            <div className="relative">
              <textarea
                ref={bodyRef}
                value={draft.body}
                onChange={handle("body")}
                onKeyDown={handleBodyKeyDown}
                onFocus={() => setFocused("body")}
                onBlur={() => {
                  setFocused(null);
                  setGhostText("");
                }}
                placeholder="Write your message here…"
                rows={5}
                className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-slate-900 outline-none caret-black"
              />
              {/* Ghost text shown below current text */}
              {ghostText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pointer-events-none absolute right-0 bottom-0 left-0 text-[11px] leading-relaxed text-slate-500"
                >
                  <span className="italic">{ghostText}</span>
                  <span className="ml-1.5 rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-600 not-italic">
                    Tab ↹
                  </span>
                </motion.div>
              )}
            </div>

            {ghostText && <div className="pb-5" />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4">
        <p className="text-[11px] text-slate-500">Email will be sent via your configured Gmail</p>
        <button
          onClick={submit}
          disabled={!canSend}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold transition-all ${
            canSend
              ? "cursor-pointer bg-slate-900 text-white shadow-md shadow-slate-300/25"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          <Send size={12} />
          Send Email
        </button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Slash Command Popup
══════════════════════════════════════════════ */
function SlashPopup({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (fill: string) => void;
  onClose: () => void;
}) {
  const filtered = SLASH_COMMANDS.filter((c) =>
    c.trigger.toLowerCase().startsWith(query.toLowerCase())
  );
  const [hovered, setHovered] = useState<string | null>(null);
  if (!filtered.length) return null;

  const hoveredCmd = filtered.find((c) => c.trigger === hovered) ?? filtered[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className="absolute right-0 bottom-full left-0 z-50 mb-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
    >
      {/* Left: command list */}
      <div className="flex w-52 shrink-0 flex-col border-r border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-amber-500" />
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Commands
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            <X size={11} />
          </button>
        </div>
        <div className="py-1">
          {filtered.map((cmd) => (
            <button
              key={cmd.trigger}
              onClick={() => onSelect(cmd.fill)}
              onMouseEnter={() => setHovered(cmd.trigger)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-all ${
                hovered === cmd.trigger ? "bg-slate-100" : "bg-transparent"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  hovered === cmd.trigger ? "bg-slate-200" : "bg-slate-100"
                }`}
              >
                <cmd.icon
                  size={13}
                  className={hovered === cmd.trigger ? "text-black" : "text-slate-500"}
                />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[12.5px] font-medium text-slate-900">{cmd.trigger}</p>
                <p className="truncate text-[10.5px] text-slate-500">{cmd.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: AI suggestions for hovered command */}
      <div className="min-w-0 flex-1 bg-slate-50/50 p-3">
        <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          <Sparkles size={9} className="text-black" />
          Suggestions
        </p>
        <div className="space-y-1.5">
          {(hoveredCmd?.suggestions ?? []).map((s, i) => (
            <button
              key={i}
              onClick={() =>
                onSelect(
                  hoveredCmd.trigger === "/email"
                    ? hoveredCmd.fill
                    : s
                )
              }
              className="flex w-full items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-all hover:border-slate-300 hover:bg-slate-100/80"
            >
              <ChevronRight size={11} className="mt-0.5 shrink-0 text-black" />
              <span className="text-[12px] leading-snug text-slate-700">{s}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   ChatPanel
══════════════════════════════════════════════ */
export default function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  onStop,
  onClear,
  loading,
  chatEndRef,
  fileInputRef,
  onFileSelect,
  fileCount,
}: {
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: (v?: string) => void;
  onStop: () => void;
  onClear: () => void;
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileCount: number;
}) {
  const showSlash = input.startsWith("/") && !input.includes(" ");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [emailOpen, setEmailOpen] = useState(false);

  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  let loadingText = "Thinking";
  if (lastUserMsg && loading) {
    const text = lastUserMsg.content.toLowerCase();
    if (text.includes("/email") || text.includes("mail")) loadingText = "Drafting email";
    else if (text.includes("/diagram") || text.includes("diagram") || text.includes("chart") || text.includes("mermaid")) loadingText = "Generating diagram";
    else if (text.includes("/doc") || text.includes("document") || text.includes("file") || text.includes("report") || text.includes("pdf")) loadingText = "Analyzing document";
    else if (text.includes("/search") || text.includes("search") || text.includes("find")) loadingText = "Searching";
    else if (text.includes("code") || text.includes("debug") || text.includes("fix") || text.includes("error")) loadingText = "Analyzing code";
    else if (text.includes("/jira") || text.includes("ticket") || text.includes("issue") || text.includes("task")) loadingText = "Updating tasks";
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + "px";
    }
  }, [input]);

  // Open email modal when /email command is selected
  const handleSlashSelect = (fill: string) => {
    if (fill === "/email") {
      setEmailOpen(true);
      onInputChange("");
    } else {
      onInputChange(fill);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-1 flex-col overflow-hidden bg-transparent"
    >
      {/* ── Topbar ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 pl-14 md:pl-6 pr-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div>
            <span className="font-(family-name:--font-doto) text-xl font-black tracking-tight text-slate-950">
              Donna
            </span>
            <p className="text-[11px] text-slate-500">
              {fileCount > 0
                ? `${fileCount} file${fileCount !== 1 ? "s" : ""} in your knowledge base`
                : "Your personal AI workspace"}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-xs text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>

      {/* ── Messages / Empty state ── */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 pb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-300/35 bg-white/70 px-6 py-10 shadow-[0_4px_32px_-12px_rgba(16,185,129,0.12)] ring-1 ring-slate-300/[0.05] backdrop-blur-sm"
            >
              <div className="lightning-grid pointer-events-none absolute inset-0 opacity-[0.22]">
                <div className="lightning-grid-lines" />
              </div>
           
              <div className="relative">
                <h2 className="font-(family-name:--font-doto) mb-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  Hello, I&apos;m{" "}
                  <span className="bg-slate-900 bg-clip-text text-transparent">
                    Donna
                  </span>
                </h2>
                <p className="mx-auto mb-3 font-mono max-w-md text-sm leading-relaxed text-slate-600">
                  Your personal AI assistant for documents, email, and calendar.
                </p>
                <p className="mx-auto  font-mono max-w-md text-sm text-slate-500">
                  Type a message below or use <span className="font-mono text-xs text-black">/</span> commands.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: idx === messages.length - 1 ? 0.04 : 0 }}
                className="group"
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end gap-3">
                    <div className="max-w-[min(82%,32rem)] rounded-2xl rounded-br-sm border border-slate-200/90 bg-slate-100/95 px-5 py-3.5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-slate-900 shadow-sm ring-1 ring-slate-900/[0.04]">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0 shadow-sm shadow-slate-300/10">
                      <BrandMark size="bubble" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="prose-response">
                        <MarkdownContent content={msg.content} />
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <CopyButton text={msg.content} />
                        <span className="text-[10px] text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                          {msg.timestamp}
                        </span>
                        {msg.status === "cancelled" && (
                          <span className="ml-1 text-[10px]" style={{ color: "#fbbf24" }}>
                            · Stopped
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3.5"
              >
                <div className="mt-0.5 shrink-0 shadow-sm shadow-slate-300/10">
                  <BrandMark size="bubble" floating />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-300/90 bg-slate-50 px-4 py-3 ring-1 ring-slate-300/[0.06]">
                  <span className="mr-1 text-[10px] font-semibold tracking-wider text-black uppercase">
                    {loadingText}
                  </span>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-slate-1000"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                      transition={{ delay: i * 0.18, duration: 1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-4 pt-3 pb-5">
        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence>
            {emailOpen && <EmailComposeModal onSend={onSend} onClose={() => setEmailOpen(false)} />}
            {!emailOpen && showSlash && (
              <SlashPopup
                query={input}
                onSelect={handleSlashSelect}
                onClose={() => onInputChange("")}
              />
            )}
          </AnimatePresence>

          {/* Input box */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] transition-all focus-within:border-slate-300/80 focus-within:shadow-[0_12px_40px_-16px_rgba(16,185,129,0.15)] focus-within:ring-2 focus-within:ring-slate-300/15">
            {/* Row 1 — Textarea */}
            <div className="px-4 pt-3.5 pb-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                  if (e.key === "Escape") onInputChange("");
                }}
                placeholder="Talk to Donna or type / for commands"
                rows={1}
                className="max-h-[180px] w-full resize-none bg-transparent text-[14px] leading-relaxed text-slate-900 outline-none caret-black placeholder:text-slate-400"
              />
            </div>

            {/* Row 2   Actions bar */}
            <div className="flex items-center justify-between px-3 pb-3">
              {/* Left: attach + command chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-black"
                  title="Attach file"
                >
                  <Paperclip size={15} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv"
                  multiple
                  onChange={onFileSelect}
                />

                {/* Divider */}
                <div className="mx-0.5 h-3.5 w-px bg-slate-300" />

                {/* Command chips   email opens modal, others fill input */}
                {SLASH_COMMANDS.map((cmd) => (
                  <button
                    key={cmd.trigger}
                    onClick={() => {
                      if (cmd.trigger === "/email") setEmailOpen(true);
                      else onInputChange(cmd.fill);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 font-mono text-[10.5px] text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:text-black"
                  >
                    <cmd.icon size={9} />
                    {cmd.trigger}
                  </button>
                ))}
              </div>

              {/* Right: send/stop */}
              <div className="ml-2 shrink-0">
                {loading ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-800 transition-all hover:bg-slate-300"
                    title="Stop"
                  >
                    <Square size={11} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSend()}
                    disabled={!input.trim()}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                      input.trim()
                        ? "cursor-pointer bg-slate-900 text-white shadow-lg shadow-slate-300/25"
                        : "cursor-not-allowed bg-slate-200 text-slate-400"
                    }`}
                    title="Send"
                  >
                    <ArrowUp size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-center text-[10px] text-slate-500">
            Shift+Enter new line · Esc clear · / for commands
          </p>
        </div>
      </div>
    </motion.div>
  );
}
