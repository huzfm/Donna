"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Send, Paperclip, Sparkles, Layers } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { BrandLogo, BrandMark } from "@/components/brand/BrandLogo";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import FeatureCards from "./FeatureCards";
import WorkspaceActivityChart from "./WorkspaceActivityChart";
import type { UploadedFile } from "./ContextPanel";
import { chatStaggerContainer, chatStaggerItem, springSoft } from "@/lib/animations";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const uploadFile = async (file: File) => {
    const tempIdx = files.length;
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      status: "uploading",
    };
    onFilesUploaded([newFile]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onUpdateFile(tempIdx, { status: "ready", chunks: data.chunks });

      const sysMsg: Message = {
        id: nextId.current++,
        role: "ai",
        content: `Successfully processed **${file.name}**   ${data.chunks} chunks indexed. You can now ask questions about this document.`,
        fileName: file.name,
        timestamp: timeNow(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    } catch (err: unknown) {
      onUpdateFile(tempIdx, { status: "error" });
      const errMsg = err instanceof Error ? err.message : "Upload failed";
      const sysMsg: Message = {
        id: nextId.current++,
        role: "ai",
        content: `Failed to process **${file.name}**: ${errMsg}`,
        timestamp: timeNow(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    Array.from(selectedFiles).forEach(uploadFile);
    e.target.value = "";
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
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Query failed");

      const aiMsg: Message = {
        id: nextId.current++,
        role: "ai",
        content: data.answer,
        timestamp: timeNow(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      setIsTyping(false);
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      const aiMsg: Message = {
        id: nextId.current++,
        role: "ai",
        content: `Sorry, I encountered an error: ${errMsg}`,
        timestamp: timeNow(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
  };

  const sendFeaturePrompt = (prompt: string) => {
    setInput(prompt);
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
              {/* <BrandMark size="sm" className="shrink-0 shadow-sm shadow-emerald-500/10" /> */}
              <div className="min-w-0">
                <p className="font-(family-name:--font-doto) truncate text-sm font-black tracking-tight text-slate-950">
                  Chat
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}
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

                  <motion.div variants={chatStaggerItem} className="relative mb-6">
                    {/* <BrandLogo size="hero" animate /> */}
                    <motion.div
                      className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30 ring-2 ring-white"
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles size={14} className="text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    variants={chatStaggerItem}
                    className="font-(family-name:--font-doto) mb-2 text-center text-2xl font-black tracking-tight text-slate-950 md:text-3xl"
                  >
                    What can I
                    <br />
                    <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      help you with?
                    </span>
                  </motion.h2>
                  <motion.p
                    variants={chatStaggerItem}
                    className="mb-8 max-w-md text-center text-sm leading-relaxed text-slate-600"
                  >
                    Upload documents and ask anything, or try a feature below   same polish as the homepage hero.
                  </motion.p>

                  <motion.div variants={chatStaggerItem} className="mb-8 w-full">
                    <FeatureCards onSelectFeature={sendFeaturePrompt} />
                  </motion.div>

                  <WorkspaceActivityChart />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`mx-auto w-full max-w-3xl ${hasMessages ? "space-y-5" : ""}`}>
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
          <AnimatePresence initial={false}>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>
        </div>
        <div ref={messagesEndRef} />
      </div>

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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your documents…"
            className="placeholder:text-slate-400 min-h-[44px] flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-slate-900 outline-none sm:text-[15px]"
          />

          <motion.button
            type="button"
            onClick={onToggleContext}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
              contextOpen
                ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            aria-label={contextOpen ? "Hide document context" : "Show document context"}
          >
            <Layers size={16} />
          </motion.button>

          <motion.button
            type="button"
            onClick={sendMessage}
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

        {files.filter((f) => f.status === "ready").length > 0 && (
          <motion.p
            className="mt-2.5 text-center text-[10px] text-slate-500"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springSoft}
          >
            <span className="font-semibold text-emerald-600">
              {files.filter((f) => f.status === "ready").length}
            </span>{" "}
            document{files.filter((f) => f.status === "ready").length !== 1 ? "s" : ""} in context
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
