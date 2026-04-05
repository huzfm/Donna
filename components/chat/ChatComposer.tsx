"use client";

import { motion } from "framer-motion";
import { Send, Paperclip, Layers } from "lucide-react";
import { useRef } from "react";
import { springSoft } from "@/lib/ui/animations";
import type { UploadedFile } from "./ContextPanel";

interface ChatComposerProps {
      input: string;
      isTyping: boolean;
      contextOpen: boolean;
      files: UploadedFile[];
      onInputChange: (v: string) => void;
      onSend: () => void;
      onToggleContext: () => void;
      onFilesUploaded: (file: File) => void;
}

export default function ChatComposer({
      input,
      isTyping,
      contextOpen,
      files,
      onInputChange,
      onSend,
      onToggleContext,
      onFilesUploaded,
}: ChatComposerProps) {
      const fileInputRef = useRef<HTMLInputElement>(null);
      const readyCount = files.filter((f) => f.status === "ready").length;

      const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = e.target.files;
            if (!selected) return;
            Array.from(selected).forEach(onFilesUploaded);
            e.target.value = "";
      };

      return (
            <motion.div
                  className="relative z-10 border-t border-slate-200/90 bg-linear-to-t from-white via-white to-slate-50/50 px-4 py-4 backdrop-blur-md sm:px-6"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...springSoft, delay: 0.08 }}
            >
                  <div className="mx-auto max-w-3xl">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] transition-all focus-within:border-emerald-300/80 focus-within:shadow-[0_12px_40px_-16px_rgba(16,185,129,0.18)] focus-within:ring-2 focus-within:ring-emerald-500/15 sm:gap-3 sm:px-4 sm:py-3">
                              <motion.button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                    whileTap={{ scale: 0.92 }}
                                    whileHover={{ rotate: 12 }}
                                    aria-label="Attach file"
                              >
                                    <Paperclip size={18} />
                              </motion.button>
                              <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv"
                                    multiple
                                    onChange={handleFileSelect}
                              />

                              <input
                                    value={input}
                                    onChange={(e) => onInputChange(e.target.value)}
                                    onKeyDown={(e) => {
                                          if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                onSend();
                                          }
                                    }}
                                    placeholder="Ask anything about your documents…"
                                    className="min-h-[44px] flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 sm:text-[15px]"
                              />

                              <motion.button
                                    type="button"
                                    onClick={onToggleContext}
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${contextOpen ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                                    whileTap={{ scale: 0.92 }}
                                    whileHover={{ scale: 1.06 }}
                                    aria-label={
                                          contextOpen
                                                ? "Hide document context"
                                                : "Show document context"
                                    }
                              >
                                    <Layers size={16} />
                              </motion.button>

                              <motion.button
                                    type="button"
                                    onClick={onSend}
                                    disabled={!input.trim() || isTyping}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                                    whileTap={{ scale: 0.92 }}
                                    whileHover={input.trim() && !isTyping ? { scale: 1.06 } : {}}
                                    aria-label="Send message"
                              >
                                    <Send size={16} />
                              </motion.button>
                        </div>
                  </div>

                  {readyCount > 0 && (
                        <motion.p
                              className="mt-2.5 text-center text-[10px] text-slate-500"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={springSoft}
                        >
                              <span className="font-semibold text-emerald-600">{readyCount}</span>{" "}
                              document{readyCount !== 1 ? "s" : ""} in context
                        </motion.p>
                  )}
            </motion.div>
      );
}
