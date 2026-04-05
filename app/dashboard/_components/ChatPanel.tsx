"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { ChatMessage } from "./types";
import ChatMessages from "./chat/ChatMessages";
import ChatInputBar from "./chat/ChatInputBar";
import type { UploadQueueItem } from "../_hooks/useUpload";
import { FREE_LIMITS } from "@/lib/payments/limits";

interface ChatPanelProps {
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
      usage: { prompts_used: number; uploads_used: number; is_subscribed: boolean } | null;
      onUpgrade: () => void;
      uploadQueue: UploadQueueItem[];
}

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
      usage,
      onUpgrade,
      uploadQueue,
}: ChatPanelProps) {
      const loadingText = useMemo(() => {
            if (!loading) return "Thinking";
            const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
            if (!lastUserMsg) return "Thinking";
            const text = lastUserMsg.content.toLowerCase();
            if (text.includes("/email") || text.includes("mail")) return "Drafting email";
            if (text.includes("diagram") || text.includes("chart") || text.includes("mermaid"))
                  return "Generating diagram";
            if (text.includes("document") || text.includes("file") || text.includes("pdf"))
                  return "Analyzing document";
            if (text.includes("search") || text.includes("find")) return "Searching";
            if (text.includes("code") || text.includes("debug") || text.includes("fix"))
                  return "Analyzing code";
            return "Thinking";
      }, [loading, messages]);

      return (
            <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col overflow-hidden bg-transparent"
            >
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 py-3 pr-6 pl-14 backdrop-blur-md md:pl-6">
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

                  <div className="flex-1 overflow-y-auto">
                        <ChatMessages
                              messages={messages}
                              loading={loading}
                              loadingText={loadingText}
                              chatEndRef={chatEndRef}
                        />
                  </div>

                  {usage && !usage.is_subscribed && (
                        <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 px-4 py-2">
                              <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                          <span className="shrink-0 text-[10px] font-semibold text-slate-500">
                                                {usage.prompts_used}/{FREE_LIMITS.prompts} prompts ·
                                                resets in 24h
                                          </span>
                                          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                      className="absolute inset-y-0 left-0 rounded-full bg-slate-800 transition-all"
                                                      style={{
                                                            width: `${Math.min((usage.prompts_used / FREE_LIMITS.prompts) * 100, 100)}%`,
                                                      }}
                                                />
                                          </div>
                                    </div>
                                    <button
                                          onClick={onUpgrade}
                                          className="shrink-0 rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white transition-all hover:bg-slate-700"
                                    >
                                          Upgrade →
                                    </button>
                              </div>
                        </div>
                  )}

                  <ChatInputBar
                        input={input}
                        onInputChange={onInputChange}
                        onSend={onSend}
                        onStop={onStop}
                        loading={loading}
                        fileInputRef={fileInputRef}
                        onFileSelect={onFileSelect}
                        uploadQueue={uploadQueue}
                  />
            </motion.div>
      );
}
