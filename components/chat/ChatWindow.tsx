"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Sparkles, Layers } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import FeatureCards from "./FeatureCards";
import type { UploadedFile } from "./ContextPanel";

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
        content: `Successfully processed **${file.name}** — ${data.chunks} chunks indexed. You can now ask questions about this document.`,
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
    <div className="relative flex min-w-0 flex-1 flex-col">
      {/* Subtle background mesh */}
      <div className="chat-mesh pointer-events-none absolute inset-0" />

      {/* Messages area */}
      <div className="relative z-10 flex-1 space-y-5 overflow-y-auto px-6 py-6">
        {!hasMessages && (
          <motion.div
            className="flex flex-1 flex-col items-center justify-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Central spark icon */}
            <motion.div
              className="relative mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
            >
              <div className="from-spark-light to-accent-light border-spark/10 flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-br via-white">
                <Sparkles size={28} className="text-spark" />
              </div>
              <motion.div
                className="bg-spark absolute -top-1 -right-1 h-3 w-3 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="bg-accent absolute -bottom-1 -left-1 h-2 w-2 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>

            <h2 className="text-primary mb-1 text-xl font-semibold">What can I help you with?</h2>
            <p className="text-muted mb-8 text-sm">
              Upload documents & ask anything, or try a feature below
            </p>

            <FeatureCards onSelectFeature={sendFeaturePrompt} />
          </motion.div>
        )}

        <AnimatePresence>
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
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-border relative z-10 border-t bg-slate-950/80 px-6 py-4 backdrop-blur-sm">
        <div className="bg-surface/50 border-border focus-within:border-spark/40 flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.06)]">
          {/* File upload */}
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="text-muted hover:text-spark transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 15 }}
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

          {/* Text input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your documents..."
            className="text-primary placeholder:text-muted flex-1 bg-transparent text-sm outline-none"
          />

          {/* Context toggle */}
          <motion.button
            onClick={onToggleContext}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              contextOpen
                ? "bg-spark-light text-spark"
                : "text-muted hover:text-secondary hover:bg-surface-2"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <Layers size={16} />
          </motion.button>

          {/* Send */}
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="from-accent to-accent-hover shadow-accent/20 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <Send size={15} />
          </motion.button>
        </div>

        {/* File count hint */}
        {files.filter((f) => f.status === "ready").length > 0 && (
          <motion.p
            className="text-muted mt-2 text-center text-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-spark font-medium">
              {files.filter((f) => f.status === "ready").length}
            </span>{" "}
            document{files.filter((f) => f.status === "ready").length !== 1 ? "s" : ""} in context
          </motion.p>
        )}
      </div>
    </div>
  );
}
