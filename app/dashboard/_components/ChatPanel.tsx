"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Paperclip, Brain, Zap,
  Sparkles, Square, Trash2, Copy, Check, User,
  Mail, Inbox, FileSearch, Hash, HelpCircle, X,
} from "lucide-react";
import { ChatMessage, SLASH_COMMANDS } from "./types";

/* ─── CopyButton ─── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
      title="Copy">
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
    </button>
  );
}

/* ─── SlashPopup ─── */

function SlashPopup({ query, onSelect, onClose }: { query: string; onSelect: (fill: string) => void; onClose: () => void; }) {
  const filtered = SLASH_COMMANDS.filter(c => c.trigger.toLowerCase().startsWith(query.toLowerCase()));
  if (filtered.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.12 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-lg z-50">
      <div className="px-3 pt-2 pb-1 border-b border-neutral-100 flex items-center justify-between">
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Commands</span>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors"><X size={12} /></button>
      </div>
      <div className="py-1 max-h-64 overflow-y-auto">
        {filtered.map(cmd => (
          <button key={cmd.trigger} onClick={() => onSelect(cmd.fill)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 transition-colors text-left group">
            <div className="w-7 h-7 rounded-md bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center shrink-0 transition-colors">
              <cmd.icon size={14} className="text-neutral-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-mono font-medium text-neutral-800">{cmd.label}</p>
              <p className="text-[11px] text-neutral-400">{cmd.description}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── PromptChips ─── */

const PROMPT_CHIPS = [
  { icon: FileSearch, label: "Summarize my resume", fill: "Summarize the uploaded resume" },
  { icon: Inbox, label: "Check inbox", fill: "Check my emails and summarize my inbox" },
  { icon: Mail, label: "Send an email", fill: "/email to: [recipient] subject: [subject] body: [message]" },
  { icon: Hash, label: "Find key facts", fill: "Find the key facts in my uploaded documents" },
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
  const [showHelp, setShowHelp] = useState(false);
  const showSlash = input.startsWith("/") && !input.includes(" ");

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.15 }} className="flex flex-col flex-1 overflow-hidden bg-white">

      {/* Header */}
      <div className="border-b border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
            <MessageSquare size={15} className="text-neutral-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-neutral-900">Chat</h1>
            <p className="text-[11px] text-neutral-400">
              {fileCount > 0 ? `${fileCount} file${fileCount !== 1 ? "s" : ""} in knowledge base` : "Upload files or ask about emails"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button onClick={onClear}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-500 border border-neutral-200 hover:border-red-200 rounded-md px-2 py-1 transition-colors">
              <Trash2 size={11} /> Clear
            </button>
          )}
          <button onClick={() => setShowHelp(v => !v)}
            className={`flex items-center gap-1 text-[11px] border rounded-md px-2 py-1 transition-colors ${
              showHelp ? "text-neutral-900 border-neutral-300 bg-neutral-100" : "text-neutral-400 hover:text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}>
            <Zap size={11} /> Commands
          </button>
        </div>
      </div>

      {/* Help panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }} className="border-b border-neutral-200 bg-neutral-50/60 overflow-hidden shrink-0">
            <div className="px-6 py-3">
              <p className="text-[11px] font-medium text-neutral-500 mb-2.5">
                Type <code className="font-mono text-neutral-900 bg-neutral-200/80 px-1 py-0.5 rounded text-[10px]">/</code> in chat to autocomplete
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {SLASH_COMMANDS.map(cmd => (
                  <button key={cmd.trigger} onClick={() => { onInputChange(cmd.fill); setShowHelp(false); }}
                    className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg px-2.5 py-2 text-left transition-colors group">
                    <cmd.icon size={12} className="text-neutral-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono font-medium text-neutral-700">{cmd.trigger}</p>
                      <p className="text-[9px] text-neutral-400 truncate">{cmd.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5 border border-neutral-200">
              <Brain size={28} className="text-neutral-400" />
            </motion.div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-1">What can I help you with?</h2>
            <p className="text-sm text-neutral-400 max-w-sm mb-8 leading-relaxed">
              Search your documents, check email, or send messages.
              Type <kbd className="font-mono bg-neutral-100 border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded text-[11px]">/</kbd> for commands.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {PROMPT_CHIPS.map((chip, i) => (
                <motion.button key={chip.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }}
                  onClick={() => onSend(chip.fill)}
                  className="flex items-center gap-2.5 bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm rounded-lg px-3 py-2.5 text-left transition-all group">
                  <chip.icon size={14} className="text-neutral-400 group-hover:text-neutral-600 shrink-0 transition-colors" />
                  <span className="text-xs text-neutral-500 group-hover:text-neutral-700 transition-colors">{chip.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div key={msg.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx === messages.length - 1 ? 0.03 : 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5 group`}>

            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={12} className="text-neutral-500" />
              </div>
            )}

            <div className={`max-w-[70%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`flex items-center gap-1.5 mb-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <span className="text-[10px] font-medium text-neutral-400">{msg.role === "user" ? "You" : "Donna"}</span>
                <span className="text-[10px] text-neutral-300">{msg.timestamp}</span>
                {msg.status === "cancelled" && <span className="text-[10px] text-orange-500 font-medium">Stopped</span>}
              </div>

              <div className={`px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-neutral-900 text-white rounded-2xl rounded-tr-sm"
                  : "bg-neutral-50 text-neutral-800 rounded-2xl rounded-tl-sm border border-neutral-200"
              }`}>
                {msg.content}
              </div>

              {msg.role === "assistant" && (
                <div className="mt-0.5 flex items-center gap-1"><CopyButton text={msg.content} /></div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} className="text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={12} className="text-neutral-500" />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-medium text-neutral-400">Donna</span>
                <span className="text-[10px] text-neutral-400">is thinking…</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                      animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 1, 0.3] }}
                      transition={{ delay: i * 0.15, duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                  ))}
                </div>
                <span className="text-[12px] text-neutral-400">Generating response…</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 px-6 py-3 shrink-0">
        <div className="relative">
          <AnimatePresence>
            {showSlash && <SlashPopup query={input} onSelect={fill => onInputChange(fill)} onClose={() => onInputChange("")} />}
          </AnimatePresence>

          <div className="flex items-center gap-2.5 bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all shadow-sm">
            <button onClick={() => fileInputRef.current?.click()} className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0" title="Attach file">
              <Paperclip size={16} />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv" multiple onChange={onFileSelect} />

            <input value={input} onChange={e => onInputChange(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } if (e.key === "Escape") onInputChange(""); }}
              placeholder="Message Donna…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-300 text-neutral-800" />

            {input === "" && !loading && (
              <kbd className="text-[10px] text-neutral-300 font-mono border border-neutral-200 rounded px-1.5 py-0.5 shrink-0 hidden sm:block">/</kbd>
            )}

            {loading ? (
              <motion.button initial={{ scale: 0.85 }} animate={{ scale: 1 }} onClick={onStop}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 flex items-center justify-center transition-colors shrink-0"
                title="Stop generation">
                <Square size={12} fill="currentColor" />
              </motion.button>
            ) : (
              <button onClick={() => onSend()} disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0">
                <Send size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2.5 mt-1.5">
            {[
              { key: "Enter", label: "send" },
              { key: "/", label: "commands" },
              { key: "Esc", label: "clear" },
            ].map(h => (
              <p key={h.key} className="text-[10px] text-neutral-300">
                <kbd className="font-mono bg-neutral-50 border border-neutral-200 px-1 py-0.5 rounded text-[9px] text-neutral-400">{h.key}</kbd> {h.label}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
