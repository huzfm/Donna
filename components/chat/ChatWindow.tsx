"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import FeatureCards from "./FeatureCards";
import WorkspaceActivityChart from "./WorkspaceActivityChart";
import ChatComposer from "./ChatComposer";
import type { UploadedFile } from "./ContextPanel";
import { chatStaggerContainer, chatStaggerItem } from "@/lib/ui/animations";

export interface Message {
      id: number;
      role: "user" | "ai";
      content: string;
      fileName?: string;
      timestamp: string;
}

interface ChatWindowProps {
      onToggleContext: () => void;
      contextOpen: boolean;
      files: UploadedFile[];
      onFilesUploaded: (newFiles: UploadedFile[]) => void;
      onUpdateFile: (index: number, update: Partial<UploadedFile>) => void;
}

function timeNow() {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const STORAGE_KEY = "donna_chat_messages";
const MAX_STORED = 60;

export default function ChatWindow({
      onToggleContext,
      contextOpen,
      files,
      onFilesUploaded,
      onUpdateFile,
}: ChatWindowProps) {
      const [messages, setMessages] = useState<Message[]>([]);
      const [input, setInput] = useState("");
      const [isTyping, setIsTyping] = useState(false);
      const messagesEndRef = useRef<HTMLDivElement>(null);
      const nextId = useRef(1);

      useEffect(() => {
            try {
                  const raw = localStorage.getItem(STORAGE_KEY);
                  if (raw) {
                        const parsed: Message[] = JSON.parse(raw);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                              setMessages(parsed);
                              nextId.current = Math.max(...parsed.map((m) => m.id)) + 1;
                        }
                  }
            } catch {
                  /* ignore corrupted storage */
            }
      }, []);

      useEffect(() => {
            if (messages.length === 0) return;
            try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
            } catch {
                  /* quota exceeded */
            }
      }, [messages]);

      const scrollToBottom = useCallback(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, []);

      useEffect(() => {
            scrollToBottom();
      }, [messages, isTyping, scrollToBottom]);

      const uploadFile = async (file: File) => {
            const tempIdx = files.length;
            onFilesUploaded([{ name: file.name, size: file.size, status: "uploading" }]);
            try {
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Upload failed");
                  onUpdateFile(tempIdx, { status: "ready", chunks: data.chunks });
                  setMessages((prev) => [
                        ...prev,
                        {
                              id: nextId.current++,
                              role: "ai",
                              content: `Successfully processed **${file.name}**  ${data.chunks} chunks indexed.`,
                              fileName: file.name,
                              timestamp: timeNow(),
                        },
                  ]);
            } catch (err: unknown) {
                  onUpdateFile(tempIdx, { status: "error" });
                  setMessages((prev) => [
                        ...prev,
                        {
                              id: nextId.current++,
                              role: "ai",
                              content: `Failed to process **${file.name}**: ${err instanceof Error ? err.message : "Upload failed"}`,
                              timestamp: timeNow(),
                        },
                  ]);
            }
      };

      const sendMessage = async () => {
            if (!input.trim()) return;
            const userMsg: Message = {
                  id: nextId.current++,
                  role: "user",
                  content: input.trim(),
                  timestamp: timeNow(),
            };
            setMessages((prev) => [...prev, userMsg]);
            const question = input.trim();
            setInput("");
            setIsTyping(true);
            try {
                  const history = messages
                        .filter((m) => m.content?.trim())
                        .slice(-6)
                        .map((m) => ({
                              role: m.role === "user" ? "user" : "assistant",
                              content: m.content,
                        }));
                  const res = await fetch("/api/query", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question, history }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Query failed");
                  setIsTyping(false);
                  setMessages((prev) => [
                        ...prev,
                        {
                              id: nextId.current++,
                              role: "ai",
                              content: data.answer,
                              timestamp: timeNow(),
                        },
                  ]);
            } catch (err: unknown) {
                  setIsTyping(false);
                  setMessages((prev) => [
                        ...prev,
                        {
                              id: nextId.current++,
                              role: "ai",
                              content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Something went wrong"}`,
                              timestamp: timeNow(),
                        },
                  ]);
            }
      };

      const hasMessages = messages.length > 0;

      return (
            <motion.div
                  className="relative flex min-w-0 flex-1 flex-col bg-linear-to-b from-slate-50/90 via-white to-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
            >
                  <div className="chat-mesh pointer-events-none absolute inset-0" />

                  {hasMessages && (
                        <motion.header
                              className="relative z-10 shrink-0 border-b border-slate-200/80 bg-white/70 px-6 py-3 backdrop-blur-md"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        >
                              <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                          <div className="min-w-0">
                                                <p className="truncate font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
                                                      Chat
                                                </p>
                                                <p className="truncate text-[11px] text-slate-500">
                                                      {messages.length} message
                                                      {messages.length !== 1 ? "s" : ""}
                                                      {isTyping ? " · Donna is replying…" : ""}
                                                </p>
                                          </div>
                                    </div>
                                    <div className="hidden items-center gap-2 sm:flex">
                                          <span className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                                                Live
                                          </span>
                                    </div>
                              </div>
                        </motion.header>
                  )}

                  <div
                        className={`relative z-10 flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6 ${hasMessages ? "chat-scroll-mask pb-2" : ""}`}
                  >
                        <AnimatePresence mode="wait">
                              {!hasMessages && (
                                    <motion.div
                                          key="empty"
                                          className="flex flex-1 flex-col items-center justify-center py-8"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0, y: -12 }}
                                          transition={{ duration: 0.25 }}
                                    >
                                          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-200/40 bg-white/80 px-6 py-10 shadow-[0_4px_40px_-12px_rgba(16,185,129,0.15),0_2px_24px_-8px_rgba(15,23,42,0.08)] ring-1 ring-emerald-500/[0.06] backdrop-blur-md">
                                                <div className="lightning-grid pointer-events-none absolute inset-0 opacity-[0.28]">
                                                      <div className="lightning-grid-lines" />
                                                </div>
                                                <motion.div
                                                      className="pointer-events-none absolute -right-6 -bottom-6 opacity-[0.14]"
                                                      aria-hidden
                                                      initial={{ opacity: 0, scale: 0.8 }}
                                                      animate={{ opacity: 0.14, scale: 1 }}
                                                      transition={{ delay: 0.2, duration: 0.5 }}
                                                >
                                                      <Image
                                                            src="/globe.svg"
                                                            alt=""
                                                            width={120}
                                                            height={120}
                                                            className="select-none"
                                                            unoptimized
                                                      />
                                                </motion.div>
                                                <motion.div
                                                      className="relative z-10 flex flex-col items-center"
                                                      variants={chatStaggerContainer}
                                                      initial="hidden"
                                                      animate="visible"
                                                >
                                                      <motion.div
                                                            variants={chatStaggerItem}
                                                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-600 shadow-sm"
                                                      >
                                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                            Powered by Groq &amp; your documents
                                                      </motion.div>
                                                      <motion.div
                                                            variants={chatStaggerItem}
                                                            className="relative mb-6"
                                                      >
                                                            <motion.div
                                                                  className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-md ring-2 shadow-emerald-500/30 ring-white"
                                                                  animate={{
                                                                        rotate: [0, 8, -8, 0],
                                                                  }}
                                                                  transition={{
                                                                        duration: 4,
                                                                        repeat: Infinity,
                                                                        ease: "easeInOut",
                                                                  }}
                                                            >
                                                                  <Sparkles
                                                                        size={14}
                                                                        className="text-white"
                                                                  />
                                                            </motion.div>
                                                      </motion.div>
                                                      <motion.h2
                                                            variants={chatStaggerItem}
                                                            className="mb-2 text-center font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-950 md:text-3xl"
                                                      >
                                                            What can I<br />
                                                            <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                                                  help you with?
                                                            </span>
                                                      </motion.h2>
                                                      <motion.p
                                                            variants={chatStaggerItem}
                                                            className="mb-8 max-w-md text-center text-sm leading-relaxed text-slate-600"
                                                      >
                                                            Upload documents and ask anything, or
                                                            try a feature below.
                                                      </motion.p>
                                                      <motion.div
                                                            variants={chatStaggerItem}
                                                            className="mb-8 w-full"
                                                      >
                                                            <FeatureCards
                                                                  onSelectFeature={(p) =>
                                                                        setInput(p)
                                                                  }
                                                            />
                                                      </motion.div>
                                                      <WorkspaceActivityChart />
                                                </motion.div>
                                          </div>
                                    </motion.div>
                              )}
                        </AnimatePresence>

                        <div
                              className={`mx-auto w-full max-w-3xl ${hasMessages ? "space-y-5" : ""}`}
                        >
                              <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                          <MessageBubble
                                                key={msg.id}
                                                role={msg.role}
                                                content={msg.content}
                                                fileName={msg.fileName}
                                                timestamp={msg.timestamp}
                                          />
                                    ))}
                              </AnimatePresence>
                              <AnimatePresence initial={false}>
                                    {isTyping && <TypingIndicator key="typing" />}
                              </AnimatePresence>
                        </div>
                        <div ref={messagesEndRef} />
                  </div>

                  <ChatComposer
                        input={input}
                        isTyping={isTyping}
                        contextOpen={contextOpen}
                        files={files}
                        onInputChange={setInput}
                        onSend={sendMessage}
                        onToggleContext={onToggleContext}
                        onFilesUploaded={uploadFile}
                  />
            </motion.div>
      );
}
