"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Square, ArrowUp } from "lucide-react";
import { SLASH_COMMANDS } from "../types";
import SlashPopup from "./SlashPopup";
import EmailComposeModal from "./EmailComposeModal";
import type { UploadQueueItem } from "../../_hooks/useUpload";

interface ChatInputBarProps {
      input: string;
      onInputChange: (v: string) => void;
      onSend: (v?: string) => void;
      onStop: () => void;
      loading: boolean;
      fileInputRef: React.RefObject<HTMLInputElement | null>;
      onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
      uploadQueue: UploadQueueItem[];
}

export default function ChatInputBar({
      input,
      onInputChange,
      onSend,
      onStop,
      loading,
      fileInputRef,
      onFileSelect,
      uploadQueue,
}: ChatInputBarProps) {
      const textareaRef = useRef<HTMLTextAreaElement>(null);
      const [emailOpen, setEmailOpen] = useState(false);
      const showSlash = input.startsWith("/") && !input.includes(" ");

      useEffect(() => {
            if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height =
                        Math.min(textareaRef.current.scrollHeight, 180) + "px";
            }
      }, [input]);

      const handleSlashSelect = useCallback(
            (fill: string) => {
                  if (fill === "/email") {
                        setEmailOpen(true);
                        onInputChange("");
                  } else onInputChange(fill);
            },
            [onInputChange]
      );

      const isUploading = uploadQueue.some((i) => i.status === "uploading");

      return (
            <div className="shrink-0 px-4 pt-3 pb-5">
                  <div className="relative mx-auto max-w-3xl">
                        <AnimatePresence>
                              {emailOpen && (
                                    <EmailComposeModal
                                          onClose={() => setEmailOpen(false)}
                                          onSend={onSend}
                                    />
                              )}
                              {!emailOpen && showSlash && (
                                    <SlashPopup
                                          query={input}
                                          onSelect={handleSlashSelect}
                                          onClose={() => onInputChange("")}
                                    />
                              )}
                        </AnimatePresence>

                        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/4 transition-all focus-within:border-slate-300/80 focus-within:shadow-[0_12px_40px_-16px_rgba(16,185,129,0.15)] focus-within:ring-2 focus-within:ring-slate-300/15">
                              <AnimatePresence>
                                    {uploadQueue.length > 0 && (
                                          <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.16 }}
                                                className="overflow-hidden border-b border-slate-100"
                                          >
                                                <div className="flex flex-col gap-1 px-4 py-2">
                                                      {uploadQueue.map((item) => (
                                                            <div
                                                                  key={item.id}
                                                                  className="flex items-center gap-2"
                                                            >
                                                                  {item.status === "uploading" ? (
                                                                        <motion.div
                                                                              animate={{
                                                                                    rotate: 360,
                                                                              }}
                                                                              transition={{
                                                                                    duration: 1,
                                                                                    repeat: Infinity,
                                                                                    ease: "linear",
                                                                              }}
                                                                              className="shrink-0"
                                                                        >
                                                                              <svg
                                                                                    className="h-3 w-3 text-slate-500"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                              >
                                                                                    <circle
                                                                                          className="opacity-25"
                                                                                          cx="12"
                                                                                          cy="12"
                                                                                          r="10"
                                                                                          stroke="currentColor"
                                                                                          strokeWidth="3"
                                                                                    />
                                                                                    <path
                                                                                          className="opacity-75"
                                                                                          fill="currentColor"
                                                                                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                                    />
                                                                              </svg>
                                                                        </motion.div>
                                                                  ) : item.status === "done" ? (
                                                                        <svg
                                                                              className="h-3 w-3 shrink-0 text-emerald-500"
                                                                              viewBox="0 0 24 24"
                                                                              fill="none"
                                                                              stroke="currentColor"
                                                                              strokeWidth="2.5"
                                                                        >
                                                                              <polyline points="20 6 9 17 4 12" />
                                                                        </svg>
                                                                  ) : (
                                                                        <svg
                                                                              className="h-3 w-3 shrink-0 text-red-400"
                                                                              viewBox="0 0 24 24"
                                                                              fill="none"
                                                                              stroke="currentColor"
                                                                              strokeWidth="2.5"
                                                                        >
                                                                              <line
                                                                                    x1="18"
                                                                                    y1="6"
                                                                                    x2="6"
                                                                                    y2="18"
                                                                              />
                                                                              <line
                                                                                    x1="6"
                                                                                    y1="6"
                                                                                    x2="18"
                                                                                    y2="18"
                                                                              />
                                                                        </svg>
                                                                  )}
                                                                  <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-slate-600">
                                                                        {item.name}
                                                                  </span>
                                                                  <span
                                                                        className={`shrink-0 text-[10px] font-semibold ${item.status === "uploading" ? "text-slate-400" : item.status === "done" ? "text-emerald-500" : "text-red-400"}`}
                                                                  >
                                                                        {item.status === "uploading"
                                                                              ? "Indexing…"
                                                                              : item.status ===
                                                                                  "done"
                                                                                ? "Ready"
                                                                                : (item.error ??
                                                                                  "Error")}
                                                                  </span>
                                                            </div>
                                                      ))}
                                                </div>
                                          </motion.div>
                                    )}
                              </AnimatePresence>

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
                                          className="max-h-[180px] w-full resize-none bg-transparent text-[14px] leading-relaxed text-slate-900 caret-black outline-none placeholder:text-slate-400"
                                    />
                              </div>

                              <div className="flex items-center justify-between px-3 pb-3">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                          <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                className="relative flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                                title={isUploading ? "Uploading…" : "Attach file"}
                                          >
                                                {isUploading ? (
                                                      <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{
                                                                  duration: 1,
                                                                  repeat: Infinity,
                                                                  ease: "linear",
                                                            }}
                                                      >
                                                            <svg
                                                                  className="h-[15px] w-[15px]"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                            >
                                                                  <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="3"
                                                                  />
                                                                  <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                  />
                                                            </svg>
                                                      </motion.div>
                                                ) : (
                                                      <Paperclip size={15} />
                                                )}
                                          </button>
                                          <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv"
                                                multiple
                                                onChange={onFileSelect}
                                          />
                                          <div className="mx-0.5 h-3.5 w-px bg-slate-300" />
                                          {SLASH_COMMANDS.map((cmd) => (
                                                <button
                                                      key={cmd.trigger}
                                                      onClick={() => {
                                                            if (cmd.trigger === "/email")
                                                                  setEmailOpen(true);
                                                            else onInputChange(cmd.fill);
                                                      }}
                                                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 font-mono text-[10.5px] text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:text-black"
                                                >
                                                      <cmd.icon size={9} />
                                                      {cmd.trigger}
                                                </button>
                                          ))}
                                    </div>
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
                                                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${input.trim() ? "cursor-pointer bg-slate-900 text-white shadow-lg shadow-slate-300/25" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}
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
      );
}
