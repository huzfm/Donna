"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Sparkles, AtSign, AlignLeft, Send, ChevronRight } from "lucide-react";

interface EmailDraft {
      to: string;
      subject: string;
      body: string;
}
type Tone = "professional" | "friendly" | "concise";
const TONES: { id: Tone; label: string }[] = [
      { id: "professional", label: "Professional" },
      { id: "friendly", label: "Friendly" },
      { id: "concise", label: "Concise" },
];

export default function EmailComposeModal({
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
      // Keep a ref to the latest draft so setTimeout callbacks never read stale closure values
      const draftRef = useRef(draft);
      useEffect(() => { draftRef.current = draft; }, [draft]);

      useEffect(() => {
            toRef.current?.focus();
      }, []);

      const handle = useCallback(
            (field: keyof EmailDraft) =>
                  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const val = e.target.value;
                        setDraft((d) => ({ ...d, [field]: val }));
                        if (field === "body") {
                              setGhostText("");
                              if (ghostTimer) clearTimeout(ghostTimer);
                              if (val.trim().length > 20) {
                                    const t = setTimeout(async () => {
                                          try {
                                                // Read from ref so we always get the latest to/subject,
                                                // not the values captured at the time the handler was created
                                                const { to, subject } = draftRef.current;
                                                const res = await fetch("/api/email-suggest", {
                                                      method: "POST",
                                                      headers: { "Content-Type": "application/json" },
                                                      body: JSON.stringify({
                                                            type: "complete_body",
                                                            to,
                                                            subject,
                                                            body: val,
                                                      }),
                                                });
                                                const data = await res.json();
                                                if (data.result && !val.endsWith(data.result))
                                                      setGhostText(data.result);
                                          } catch {
                                                /* silent */
                                          }
                                    }, 1200);
                                    setGhostTimer(t);
                              }
                        }
                  },
            // ghostTimer changes every keystroke — intentionally excluded to avoid
            // re-creating the handler; clearTimeout is called via the captured ref value
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [ghostTimer]
      );

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

      const handleSuggestSubject = async () => {
            if (!draft.body.trim() || suggestingSubject) return;
            setSuggestingSubject(true);
            setSubjectSuggestions([]);
            try {
                  const res = await fetch("/api/email-suggest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                              type: "suggest_subject",
                              to: draft.to,
                              body: draft.body,
                        }),
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
                  <div className="flex items-center justify-between border-b border-slate-300/80 bg-slate-100/50 px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900">
                                    <Mail size={13} className="text-white" />
                              </div>
                              <span className="text-[13px] font-semibold text-slate-900">
                                    New Email
                              </span>
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

                  <div className="flex items-center gap-2 border-b border-slate-100 bg-white/80 px-4 py-2.5">
                        <Sparkles size={10} className="shrink-0 text-black" />
                        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                              Tone
                        </span>
                        <div className="ml-1 flex gap-1.5">
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

                  <div className="space-y-3 p-4">
                        <div className="overflow-hidden rounded-xl" style={fieldStyle("to")}>
                              <div className="flex items-center gap-2.5 px-4 py-2.5">
                                    <AtSign size={13} className="shrink-0 text-slate-500" />
                                    <span className="w-12 shrink-0 text-[11px] font-medium text-slate-500">
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
                                          className="flex-1 bg-transparent text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                              </div>
                        </div>

                        <div className="overflow-hidden rounded-xl" style={fieldStyle("subject")}>
                              <div className="flex items-center gap-2.5 px-4 py-2.5">
                                    <AlignLeft size={13} className="shrink-0 text-slate-500" />
                                    <span className="w-12 shrink-0 text-[11px] font-medium text-slate-500">
                                          Subject
                                    </span>
                                    <input
                                          type="text"
                                          value={draft.subject}
                                          onChange={handle("subject")}
                                          onFocus={() => setFocused("subject")}
                                          onBlur={() => setFocused(null)}
                                          placeholder="What's this email about?"
                                          className="flex-1 bg-transparent text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                          onClick={handleSuggestSubject}
                                          disabled={!draft.body.trim() || suggestingSubject}
                                          title="AI suggest subject lines"
                                          className="ml-1 flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-[10px] font-medium text-black transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                          {suggestingSubject ? (
                                                <motion.div
                                                      animate={{ rotate: 360 }}
                                                      transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                      }}
                                                >
                                                      <Sparkles size={9} />
                                                </motion.div>
                                          ) : (
                                                <Sparkles size={9} />
                                          )}
                                          Suggest
                                    </button>
                              </div>
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
                                                                        setDraft((d) => ({
                                                                              ...d,
                                                                              subject: s,
                                                                        }));
                                                                        setSubjectSuggestions([]);
                                                                  }}
                                                                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-[12px] text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-100"
                                                            >
                                                                  <ChevronRight
                                                                        size={10}
                                                                        className="shrink-0 text-black"
                                                                  />
                                                                  {s}
                                                            </button>
                                                      ))}
                                                </div>
                                          </motion.div>
                                    )}
                              </AnimatePresence>
                        </div>

                        <div
                              className="overflow-hidden rounded-xl transition-all"
                              style={{
                                    ...fieldStyle("body"),
                                    border: improveFlash
                                          ? "1px solid rgba(0,0,0,0.45)"
                                          : fieldStyle("body").border,
                                    boxShadow: improveFlash ? "0 0 12px rgba(0,0,0,0.15)" : "none",
                              }}
                        >
                              <div className="px-4 pt-2.5 pb-1">
                                    <div className="mb-2 flex items-center justify-between">
                                          <p className="text-[11px] font-medium text-slate-500">
                                                Message
                                          </p>
                                          <button
                                                onClick={handleImprove}
                                                disabled={!draft.body.trim() || improving}
                                                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-medium transition-all"
                                                style={{
                                                      background: improving
                                                            ? "rgba(15,23,42,0.1)"
                                                            : "rgba(15,23,42,0.05)",
                                                      color: !draft.body.trim()
                                                            ? "#94a3b8"
                                                            : "#0f172a",
                                                      border: `1px solid ${improving ? "#94a3b8" : "#cbd5e1"}`,
                                                      cursor: !draft.body.trim()
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                                title={`Improve with AI (${tone} tone)`}
                                          >
                                                {improving ? (
                                                      <>
                                                            <motion.div
                                                                  animate={{ rotate: 360 }}
                                                                  transition={{
                                                                        duration: 0.8,
                                                                        repeat: Infinity,
                                                                        ease: "linear",
                                                                  }}
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
                                    <div className="relative">
                                          <textarea
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
                                                className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-slate-900 caret-black outline-none"
                                          />
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

                  <div className="flex items-center justify-between px-4 pb-4">
                        <p className="text-[11px] text-slate-500">Email will be sent via server</p>
                        <button
                              onClick={submit}
                              disabled={!canSend}
                              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold transition-all ${canSend ? "cursor-pointer bg-slate-900 text-white shadow-md shadow-slate-300/25" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}
                        >
                              <Send size={12} />
                              Send Email
                        </button>
                  </div>
            </motion.div>
      );
}
