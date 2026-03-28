"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip, Sparkles, Square, Copy, Check,
  X, Zap, ArrowUp, Trash2,
} from "lucide-react";
import { ChatMessage, SLASH_COMMANDS } from "./types";
import MarkdownContent from "./MarkdownContent";

/* ─── CopyButton ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      style={{ color: "hsl(240,5%,45%)" }}
      onMouseEnter={e => { e.currentTarget.style.background = "hsl(240,6%,18%)"; e.currentTarget.style.color = "hsl(0,0%,75%)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(240,5%,45%)"; }}
      title="Copy"
    >
      {copied ? <Check size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
    </button>
  );
}

/* ─── SlashPopup ─── */
function SlashPopup({ query, onSelect, onClose }: { query: string; onSelect: (fill: string) => void; onClose: () => void }) {
  const filtered = SLASH_COMMANDS.filter(c => c.trigger.toLowerCase().startsWith(query.toLowerCase()));
  if (!filtered.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden shadow-2xl z-50"
      style={{ background: "hsl(240,10%,12%)", border: "1px solid hsl(240,6%,20%)" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid hsl(240,6%,16%)" }}>
        <div className="flex items-center gap-2">
          <Zap size={11} style={{ color: "#fbbf24" }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "hsl(240,5%,40%)" }}>Commands</span>
        </div>
        <button onClick={onClose} style={{ color: "hsl(240,5%,40%)" }} className="transition-colors hover:text-white"><X size={12} /></button>
      </div>
      <div className="py-1 max-h-64 overflow-y-auto">
        {filtered.map(cmd => (
          <button key={cmd.trigger} onClick={() => onSelect(cmd.fill)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
            onMouseEnter={e => e.currentTarget.style.background = "hsl(240,6%,15%)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(240,6%,18%)" }}>
              <cmd.icon size={14} style={{ color: "hsl(240,5%,60%)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-mono font-medium" style={{ color: "hsl(0,0%,88%)" }}>{cmd.label}</p>
              <p className="text-[11px]" style={{ color: "hsl(240,5%,45%)" }}>{cmd.description}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Prompt suggestions ─── */
const SUGGESTIONS = [
  { emoji: "📄", label: "Summarize my resume", fill: "Summarize the uploaded resume" },
  { emoji: "📬", label: "Check my inbox", fill: "Check my emails and summarize my inbox" },
  { emoji: "✉️", label: "Send an email", fill: "/email to: [recipient] subject: [subject] body: [message]" },
  { emoji: "🔍", label: "Find key facts", fill: "Find the key facts in my uploaded documents" },
  { emoji: "📝", label: "Draft a reply", fill: "/draft " },
  { emoji: "💡", label: "What can you do?", fill: "Show me what you can do" },
];

/* ─── ChatPanel ─── */
export default function ChatPanel({
  messages, input, onInputChange, onSend, onStop, onClear, loading,
  chatEndRef, fileInputRef, onFileSelect, fileCount,
}: {
  messages: ChatMessage[]; input: string;
  onInputChange: (v: string) => void; onSend: (v?: string) => void; onStop: () => void; onClear: () => void;
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileCount: number;
}) {
  const showSlash = input.startsWith("/") && !input.includes(" ");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + "px";
    }
  }, [input]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col flex-1 overflow-hidden"
      style={{ background: "hsl(240,10%,9%)" }}
    >
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: "1px solid hsl(240,6%,13%)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium" style={{ color: "hsl(0,0%,70%)" }}>
            {fileCount > 0 ? `${fileCount} file${fileCount !== 1 ? "s" : ""} in knowledge base` : "Donna AI"}
          </span>
        </div>
        {messages.length > 0 && (
          <button onClick={onClear}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "hsl(240,5%,45%)", border: "1px solid hsl(240,6%,18%)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "hsl(0,60%,30%)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "hsl(240,5%,45%)"; e.currentTarget.style.borderColor = "hsl(240,6%,18%)"; }}
          >
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>

      {/* Messages / Empty state */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Animated logo */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", boxShadow: "0 0 40px rgba(124,58,237,0.3)" }}
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: "hsl(0,0%,90%)" }}>Hello! How can I help?</h2>
              <p className="text-sm mb-10 max-w-sm mx-auto leading-relaxed" style={{ color: "hsl(240,5%,45%)" }}>
                I can search your documents, check your email, and much more.
                Try a suggestion or type <span className="font-mono px-1 py-0.5 rounded text-xs" style={{ background: "hsl(240,6%,18%)", color: "hsl(0,0%,75%)" }}>/</span> for commands.
              </p>

              {/* Suggestions grid */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button key={s.label}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    onClick={() => onSend(s.fill)}
                    className="flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all"
                    style={{ background: "hsl(240,6%,13%)", border: "1px solid hsl(240,6%,17%)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "hsl(240,6%,16%)"; e.currentTarget.style.borderColor = "hsl(240,6%,22%)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "hsl(240,6%,13%)"; e.currentTarget.style.borderColor = "hsl(240,6%,17%)"; }}
                  >
                    <span className="text-lg shrink-0">{s.emoji}</span>
                    <span className="text-[12.5px] leading-tight" style={{ color: "hsl(240,5%,60%)" }}>{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
            {messages.map((msg, idx) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: idx === messages.length - 1 ? 0.04 : 0 }}
                className="group"
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end gap-3">
                    <div className="max-w-[82%] px-5 py-3.5 rounded-2xl rounded-br-sm text-[14.5px] leading-relaxed whitespace-pre-wrap"
                      style={{ background: "hsl(240,6%,16%)", color: "hsl(0,0%,90%)", border: "1px solid hsl(240,6%,22%)" }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3.5 items-start">
                    {/* AI avatar */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose-response">
                        <MarkdownContent content={msg.content} />
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <CopyButton text={msg.content} />
                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(240,5%,38%)" }}>{msg.timestamp}</span>
                        {msg.status === "cancelled" && (
                          <span className="text-[10px] ml-1" style={{ color: "#fbbf24" }}>· Stopped</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                  <Sparkles size={13} className="text-white" />
                </div>
                <div className="flex items-center gap-2 py-2.5">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      className="w-1.5 h-1.5 rounded-full"
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
      <div className="shrink-0 px-4 pb-5 pt-3">
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence>
            {showSlash && <SlashPopup query={input} onSelect={v => onInputChange(v)} onClose={() => onInputChange("")} />}
          </AnimatePresence>

          {/* Input box */}
          <div className="rounded-2xl transition-all overflow-hidden"
            style={{ background: "hsl(240,6%,13%)", border: "1px solid hsl(240,6%,20%)" }}
          >
            {/* Row 1 — Textarea */}
            <div className="px-4 pt-3.5 pb-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
                  if (e.key === "Escape") onInputChange("");
                }}
                placeholder="Message Donna… (type / for commands)"
                rows={1}
                className="w-full bg-transparent outline-none resize-none leading-relaxed text-[14px] max-h-[180px]"
                style={{ color: "hsl(0,0%,90%)", caretColor: "#7c3aed" }}
              />
              <style>{`textarea::placeholder { color: hsl(240,5%,36%); }`}</style>
            </div>

            {/* Row 2 — Actions bar */}
            <div className="flex items-center justify-between px-3 pb-3">
              {/* Left: attach + command chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
                  style={{ color: "hsl(240,5%,42%)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "hsl(0,0%,75%)"; e.currentTarget.style.background = "hsl(240,6%,20%)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "hsl(240,5%,42%)"; e.currentTarget.style.background = "transparent"; }}
                  title="Attach file"
                >
                  <Paperclip size={15} />
                </button>
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv" multiple onChange={onFileSelect} />

                {/* Divider */}
                <div className="w-px h-3.5 mx-0.5" style={{ background: "hsl(240,6%,22%)" }} />

                {SLASH_COMMANDS.slice(0, 4).map(cmd => (
                  <button key={cmd.trigger} onClick={() => onInputChange(cmd.fill)}
                    className="inline-flex items-center gap-1 text-[10.5px] font-mono px-2 py-1 rounded-lg transition-all"
                    style={{ color: "hsl(240,5%,40%)", background: "hsl(240,6%,17%)", border: "1px solid hsl(240,6%,21%)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "hsl(0,0%,75%)"; e.currentTarget.style.background = "hsl(240,6%,21%)"; e.currentTarget.style.borderColor = "hsl(240,6%,28%)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "hsl(240,5%,40%)"; e.currentTarget.style.background = "hsl(240,6%,17%)"; e.currentTarget.style.borderColor = "hsl(240,6%,21%)"; }}
                  >
                    <cmd.icon size={9} />
                    {cmd.trigger}
                  </button>
                ))}
              </div>

              {/* Right: send/stop */}
              <div className="shrink-0 ml-2">
                {loading ? (
                  <button onClick={onStop}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ background: "hsl(240,6%,22%)", color: "hsl(0,0%,75%)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "hsl(240,6%,28%)"}
                    onMouseLeave={e => e.currentTarget.style.background = "hsl(240,6%,22%)"}
                    title="Stop"
                  >
                    <Square size={11} fill="currentColor" />
                  </button>
                ) : (
                  <button onClick={() => onSend()} disabled={!input.trim()}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: input.trim() ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "hsl(240,6%,18%)",
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

          <p className="text-center text-[10px] mt-2" style={{ color: "hsl(240,5%,32%)" }}>
            Shift+Enter for new line · Esc to clear
          </p>
        </div>
      </div>
    </motion.div>
  );
}
