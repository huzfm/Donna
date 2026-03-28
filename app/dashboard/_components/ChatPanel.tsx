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
      className="rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100"
      style={{ color: "hsl(240,5%,45%)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "hsl(240,6%,18%)";
        e.currentTarget.style.color = "hsl(0,0%,75%)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "hsl(240,5%,45%)";
      }}
      title="Copy"
    >
      {copied ? <Check size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
    </button>
  );
}

/* ══════════════════════════════════════════════
   Email Compose Modal — with AI Suggestions
══════════════════════════════════════════════ */
interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

type Tone = "professional" | "friendly" | "concise";

const TONES: { id: Tone; label: string; emoji: string }[] = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "concise", label: "Concise", emoji: "⚡" },
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
        body: JSON.stringify({ type: "improve_body", to: draft.to, subject: draft.subject, body: draft.body, tone }),
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
    background: focused === f ? "hsl(240,6%,15%)" : "hsl(240,6%,12%)",
    border: `1px solid ${focused === f ? "#7c3aed55" : "hsl(240,6%,20%)"}`,
    transition: "all 0.18s",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 bottom-full left-0 z-50 mb-3 overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: "hsl(240,10%,11%)", border: "1px solid hsl(240,6%,20%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: "hsl(240,6%,14%)", borderBottom: "1px solid hsl(240,6%,18%)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
          >
            <Mail size={13} className="text-white" />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "hsl(0,0%,88%)" }}>
            New Email
          </span>
          <span
            className="ml-1 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: "#7c3aed18", color: "#a78bfa", border: "1px solid #7c3aed30" }}
          >
            <Sparkles size={8} />
            AI
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-lg transition-all"
          style={{ color: "hsl(240,5%,45%)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "hsl(240,6%,20%)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "hsl(240,5%,45%)";
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Tone selector */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid hsl(240,6%,16%)", background: "hsl(240,6%,12%)" }}
      >
        <Sparkles size={10} style={{ color: "#a78bfa", flexShrink: 0 }} />
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "hsl(240,5%,40%)" }}>
          Tone
        </span>
        <div className="flex gap-1.5 ml-1">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10.5px] font-medium transition-all"
              style={{
                background: tone === t.id ? "#7c3aed22" : "hsl(240,6%,17%)",
                color: tone === t.id ? "#a78bfa" : "hsl(240,5%,50%)",
                border: `1px solid ${tone === t.id ? "#7c3aed44" : "hsl(240,6%,22%)"}`,
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3 p-4">
        {/* To */}
        <div className="overflow-hidden rounded-xl" style={fieldStyle("to")}>
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <AtSign size={13} style={{ color: "hsl(240,5%,45%)", flexShrink: 0 }} />
            <span className="w-12 shrink-0 text-[11px] font-medium" style={{ color: "hsl(240,5%,45%)" }}>
              To
            </span>
            <input
              ref={toRef}
              type="email"
              value={draft.to}
              onChange={handle("to")}
              onFocus={() => setFocused("to")}
              onBlur={() => setFocused(null)}
              placeholder="recipient@example.com"
              className="flex-1 bg-transparent text-[13.5px] outline-none"
              style={{ color: "hsl(0,0%,88%)" }}
            />
          </div>
        </div>

        {/* Subject */}
        <div className="overflow-hidden rounded-xl" style={fieldStyle("subject")}>
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <AlignLeft size={13} style={{ color: "hsl(240,5%,45%)", flexShrink: 0 }} />
            <span className="w-12 shrink-0 text-[11px] font-medium" style={{ color: "hsl(240,5%,45%)" }}>
              Subject
            </span>
            <input
              type="text"
              value={draft.subject}
              onChange={handle("subject")}
              onFocus={() => setFocused("subject")}
              onBlur={() => setFocused(null)}
              placeholder="What's this email about?"
              className="flex-1 bg-transparent text-[13.5px] outline-none"
              style={{ color: "hsl(0,0%,88%)" }}
            />
            {/* AI subject suggest button */}
            <button
              onClick={handleSuggestSubject}
              disabled={!draft.body.trim() || suggestingSubject}
              title="AI suggest subject lines"
              className="ml-1 flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all"
              style={{
                background: "#7c3aed18",
                color: !draft.body.trim() ? "hsl(240,5%,35%)" : "#a78bfa",
                border: "1px solid #7c3aed30",
                cursor: !draft.body.trim() ? "not-allowed" : "pointer",
              }}
            >
              {suggestingSubject ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
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
                className="border-t px-4 py-2"
                style={{ borderColor: "hsl(240,6%,18%)" }}
              >
                <p className="mb-1.5 text-[9.5px] uppercase tracking-wider" style={{ color: "hsl(240,5%,38%)" }}>
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
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-all"
                      style={{ background: "hsl(240,6%,15%)", color: "hsl(0,0%,80%)", border: "1px solid hsl(240,6%,19%)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "hsl(240,6%,19%)";
                        e.currentTarget.style.borderColor = "#7c3aed44";
                        e.currentTarget.style.color = "#c4b5fd";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "hsl(240,6%,15%)";
                        e.currentTarget.style.borderColor = "hsl(240,6%,19%)";
                        e.currentTarget.style.color = "hsl(0,0%,80%)";
                      }}
                    >
                      <ChevronRight size={10} style={{ color: "#7c3aed", flexShrink: 0 }} />
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
            border: improveFlash ? "1px solid #7c3aed88" : fieldStyle("body").border,
            boxShadow: improveFlash ? "0 0 12px rgba(124,58,237,0.2)" : "none",
          }}
        >
          <div className="px-4 pt-2.5 pb-1">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-medium" style={{ color: "hsl(240,5%,45%)" }}>
                Message
              </p>
              {/* AI Improve button */}
              <button
                onClick={handleImprove}
                disabled={!draft.body.trim() || improving}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-medium transition-all"
                style={{
                  background: improving ? "#7c3aed28" : "#7c3aed18",
                  color: !draft.body.trim() ? "hsl(240,5%,35%)" : "#a78bfa",
                  border: `1px solid ${improving ? "#7c3aed55" : "#7c3aed30"}`,
                  cursor: !draft.body.trim() ? "not-allowed" : "pointer",
                }}
                title={`Improve with AI (${tone} tone)`}
              >
                {improving ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
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
                onBlur={() => { setFocused(null); setGhostText(""); }}
                placeholder="Write your message here…"
                rows={5}
                className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed outline-none"
                style={{ color: "hsl(0,0%,88%)", caretColor: "#7c3aed" }}
              />
              {/* Ghost text shown below current text */}
              {ghostText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pointer-events-none absolute bottom-0 right-0 left-0 text-[11px] leading-relaxed"
                  style={{ color: "hsl(240,5%,40%)" }}
                >
                  <span className="italic">{ghostText}</span>
                  <span
                    className="ml-1.5 rounded px-1 py-0.5 text-[9px] not-italic"
                    style={{ background: "hsl(240,6%,20%)", color: "hsl(240,5%,50%)" }}
                  >
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
        <p className="text-[11px]" style={{ color: "hsl(240,5%,35%)" }}>
          Email will be sent via your configured Gmail
        </p>
        <button
          onClick={submit}
          disabled={!canSend}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold transition-all"
          style={{
            background: canSend ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "hsl(240,6%,18%)",
            color: canSend ? "white" : "hsl(240,5%,38%)",
            cursor: canSend ? "pointer" : "not-allowed",
            boxShadow: canSend ? "0 0 16px rgba(124,58,237,0.35)" : "none",
          }}
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
      className="absolute right-0 bottom-full left-0 z-50 mb-2 flex overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: "hsl(240,10%,12%)", border: "1px solid hsl(240,6%,20%)" }}
    >
      {/* Left: command list */}
      <div
        className="flex w-52 shrink-0 flex-col"
        style={{ borderRight: "1px solid hsl(240,6%,18%)" }}
      >
        <div
          className="flex items-center justify-between px-3.5 py-2.5"
          style={{ borderBottom: "1px solid hsl(240,6%,16%)" }}
        >
          <div className="flex items-center gap-1.5">
            <Zap size={10} style={{ color: "#fbbf24" }} />
            <span
              className="text-[10px] font-semibold tracking-wider uppercase"
              style={{ color: "hsl(240,5%,40%)" }}
            >
              Commands
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ color: "hsl(240,5%,40%)" }}
            className="transition-colors hover:text-white"
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
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-all"
              style={{ background: hovered === cmd.trigger ? "hsl(240,6%,16%)" : "transparent" }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: hovered === cmd.trigger ? "#7c3aed22" : "hsl(240,6%,17%)" }}
              >
                <cmd.icon
                  size={13}
                  style={{ color: hovered === cmd.trigger ? "#a78bfa" : "hsl(240,5%,55%)" }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className="font-mono text-[12.5px] font-medium"
                  style={{ color: "hsl(0,0%,86%)" }}
                >
                  {cmd.trigger}
                </p>
                <p className="truncate text-[10.5px]" style={{ color: "hsl(240,5%,45%)" }}>
                  {cmd.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: AI suggestions for hovered command */}
      <div className="min-w-0 flex-1 p-3">
        <p
          className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase"
          style={{ color: "hsl(240,5%,40%)" }}
        >
          <Sparkles size={9} style={{ color: "#a78bfa" }} />
          Suggestions
        </p>
        <div className="space-y-1.5">
          {(hoveredCmd?.suggestions ?? []).map((s, i) => (
            <button
              key={i}
              onClick={() =>
                onSelect(
                  hoveredCmd.trigger === "/email"
                    ? hoveredCmd.fill // open compose modal instead
                    : hoveredCmd.fill + (s.includes("about") ? "" : " " + s)
                )
              }
              className="flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left transition-all"
              style={{ background: "hsl(240,6%,15%)", border: "1px solid hsl(240,6%,19%)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsl(240,6%,18%)";
                e.currentTarget.style.borderColor = "hsl(240,6%,24%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "hsl(240,6%,15%)";
                e.currentTarget.style.borderColor = "hsl(240,6%,19%)";
              }}
            >
              <ChevronRight size={11} className="mt-0.5 shrink-0" style={{ color: "#7c3aed" }} />
              <span className="text-[12px] leading-snug" style={{ color: "hsl(240,5%,60%)" }}>
                {s}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Prompt Suggestions (empty state)
══════════════════════════════════════════════ */
const SUGGESTIONS = [
  { emoji: "📄", label: "Summarize my resume", fill: "Summarize the uploaded resume" },
  { emoji: "📬", label: "Check my inbox", fill: "Check my emails and summarize my inbox" },
  { emoji: "✉️", label: "Send an email", fill: "__EMAIL_MODAL__" },
  { emoji: "🔍", label: "Find key facts", fill: "Find the key facts in my uploaded documents" },
  { emoji: "📊", label: "Diagram my files", fill: "visualize my documents" },
  { emoji: "💬", label: "What can you help with?", fill: "What can you help me with?" },
];

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

  const handleSuggestion = (fill: string) => {
    if (fill === "__EMAIL_MODAL__") {
      setEmailOpen(true);
      return;
    }
    onSend(fill);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-1 flex-col overflow-hidden"
      style={{ background: "hsl(240,10%,9%)" }}
    >
      {/* ── Topbar ── */}
      <div
        className="flex shrink-0 items-center justify-between px-6 py-3"
        style={{ borderBottom: "1px solid hsl(240,6%,13%)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
          >
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium" style={{ color: "hsl(0,0%,70%)" }}>
            {fileCount > 0
              ? `${fileCount} file${fileCount !== 1 ? "s" : ""} in knowledge base`
              : "Donna AI"}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all"
            style={{ color: "hsl(240,5%,45%)", border: "1px solid hsl(240,6%,18%)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.borderColor = "hsl(0,60%,30%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(240,5%,45%)";
              e.currentTarget.style.borderColor = "hsl(240,6%,18%)";
            }}
          >
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>

      {/* ── Messages / Empty state ── */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.3)",
                }}
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-semibold" style={{ color: "hsl(0,0%,90%)" }}>
                Hello! my name is Donna
              </h2>
              <p
                className="mx-auto mb-10 max-w-sm text-sm leading-relaxed"
                style={{ color: "hsl(240,5%,45%)" }}
              >
                I am your personal AI Assitant
               
              </p>
              <p
                className="mx-auto mb-10 max-w-sm text-sm leading-relaxed"
                style={{ color: "hsl(240,5%,45%)" }}
              >
                How may i help you
               
              </p>
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
                    <div
                      className="max-w-[82%] rounded-2xl rounded-br-sm px-5 py-3.5 text-[14.5px] leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: "hsl(240,6%,16%)",
                        color: "hsl(0,0%,90%)",
                        border: "1px solid hsl(240,6%,22%)",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3.5">
                    <div
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
                    >
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="prose-response">
                        <MarkdownContent content={msg.content} />
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <CopyButton text={msg.content} />
                        <span
                          className="text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ color: "hsl(240,5%,38%)" }}
                        >
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
                <div
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
                >
                  <Sparkles size={13} className="text-white" />
                </div>
                <div className="flex items-center gap-2 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "hsl(240,5%,40%)" }}
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
          <div
            className="overflow-hidden rounded-2xl transition-all"
            style={{ background: "hsl(240,6%,13%)", border: "1px solid hsl(240,6%,20%)" }}
          >
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
                placeholder="Talk with Donna or (type / for commands)"
                rows={1}
                className="max-h-[180px] w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none"
                style={{ color: "hsl(0,0%,90%)", caretColor: "#7c3aed" }}
              />
              <style>{`textarea::placeholder { color: hsl(240,5%,36%); }`}</style>
            </div>

            {/* Row 2 — Actions bar */}
            <div className="flex items-center justify-between px-3 pb-3">
              {/* Left: attach + command chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                  style={{ color: "hsl(240,5%,42%)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "hsl(0,0%,75%)";
                    e.currentTarget.style.background = "hsl(240,6%,20%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "hsl(240,5%,42%)";
                    e.currentTarget.style.background = "transparent";
                  }}
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
                <div className="mx-0.5 h-3.5 w-px" style={{ background: "hsl(240,6%,22%)" }} />

                {/* Command chips — email opens modal, others fill input */}
                {SLASH_COMMANDS.map((cmd) => (
                  <button
                    key={cmd.trigger}
                    onClick={() => {
                      if (cmd.trigger === "/email") setEmailOpen(true);
                      else onInputChange(cmd.fill);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[10.5px] transition-all"
                    style={{
                      color: "hsl(240,5%,40%)",
                      background: "hsl(240,6%,17%)",
                      border: "1px solid hsl(240,6%,21%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "hsl(0,0%,75%)";
                      e.currentTarget.style.background = "hsl(240,6%,21%)";
                      e.currentTarget.style.borderColor = "hsl(240,6%,28%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "hsl(240,5%,40%)";
                      e.currentTarget.style.background = "hsl(240,6%,17%)";
                      e.currentTarget.style.borderColor = "hsl(240,6%,21%)";
                    }}
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
                    onClick={onStop}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
                    style={{ background: "hsl(240,6%,22%)", color: "hsl(0,0%,75%)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(240,6%,28%)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(240,6%,22%)")}
                    title="Stop"
                  >
                    <Square size={11} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    onClick={() => onSend()}
                    disabled={!input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
                    style={{
                      background: input.trim()
                        ? "linear-gradient(135deg,#7c3aed,#3b82f6)"
                        : "hsl(240,6%,18%)",
                      color: input.trim() ? "white" : "hsl(240,5%,38%)",
                      cursor: input.trim() ? "pointer" : "not-allowed",
                      boxShadow: input.trim() ? "0 0 16px rgba(124,58,237,0.35)" : "none",
                    }}
                    title="Send"
                  >
                    <ArrowUp size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px]" style={{ color: "hsl(240,5%,32%)" }}>
            Shift+Enter for new line · Esc to clear
          </p>
        </div>
      </div>
    </motion.div>
  );
}