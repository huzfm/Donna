"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Sparkles,
  Layers,
} from "lucide-react";
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
    <div className="flex-1 flex flex-col min-w-0 relative">
      {/* Subtle background mesh */}
      <div className="absolute inset-0 chat-mesh pointer-events-none" />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 relative z-10">
        {!hasMessages && (
          <motion.div
            className="flex-1 flex flex-col items-center justify-center py-16"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-spark-light via-white to-accent-light flex items-center justify-center border border-spark/10">
                <Sparkles size={28} className="text-spark" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-spark"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>

            <h2 className="text-xl font-semibold text-primary mb-1">What can I help you with?</h2>
            <p className="text-sm text-muted mb-8">Upload documents & ask anything, or try a feature below</p>

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
      <div className="border-t border-border px-6 py-4 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-3 bg-surface/50 border border-border rounded-2xl px-4 py-3 focus-within:border-spark/40 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.06)] transition-all">
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
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none"
          />

          {/* Context toggle */}
          <motion.button
            onClick={onToggleContext}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              contextOpen ? "bg-spark-light text-spark" : "text-muted hover:text-secondary hover:bg-surface-2"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <Layers size={16} />
          </motion.button>

          {/* Send */}
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-hover text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-sm shadow-accent/20"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <Send size={15} />
          </motion.button>
        </div>

        {/* File count hint */}
        {files.filter((f) => f.status === "ready").length > 0 && (
          <motion.p
            className="text-[10px] text-muted mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-spark font-medium">{files.filter((f) => f.status === "ready").length}</span> document{files.filter((f) => f.status === "ready").length !== 1 ? "s" : ""} in context
          </motion.p>
        )}
      </div>
    </div>
  );
}
