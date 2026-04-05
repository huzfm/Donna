"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ContextPanel from "@/components/chat/ContextPanel";
import type { ChatSession } from "@/components/chat/ChatSidebar";
import type { UploadedFile } from "@/components/chat/ContextPanel";
import { springSoft } from "@/lib/ui/animations";

export default function ChatPage() {
      const [contextOpen, setContextOpen] = useState(false);
      const [files, setFiles] = useState<UploadedFile[]>([]);

      const [sessions, setSessions] = useState<ChatSession[]>([]);
      const [activeSession, setActiveSession] = useState<string | null>(null);

      const handleNewChat = useCallback(() => {
            const id = Date.now().toString();
            const session: ChatSession = {
                  id,
                  title: "New conversation",
                  preview: "Start chatting...",
                  time: "now",
            };
            setSessions((prev) => [session, ...prev]);
            setActiveSession(id);
      }, []);

      const handleDeleteSession = useCallback((id: string) => {
            setSessions((prev) => prev.filter((s) => s.id !== id));
            setActiveSession((prev) => (prev === id ? null : prev));
      }, []);

      const handleFilesUploaded = useCallback(
            (newFiles: UploadedFile[]) => {
                  setFiles((prev) => [...prev, ...newFiles]);
                  if (!contextOpen) setContextOpen(true);
            },
            [contextOpen]
      );

      const handleUpdateFile = useCallback((index: number, update: Partial<UploadedFile>) => {
            setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...update } : f)));
      }, []);

      const handleRemoveFile = useCallback((index: number) => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
      }, []);

      const handleFeaturePrompt = useCallback(
            (_prompt: string) => {
                  handleNewChat();
            },
            [handleNewChat]
      );

      return (
            <motion.div
                  className="flex h-screen overflow-hidden bg-slate-50/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
            >
                  <Sidebar />
                  <motion.div
                        className="flex min-w-0 flex-1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springSoft, delay: 0.05 }}
                  >
                        <ChatSidebar
                              sessions={sessions}
                              activeSession={activeSession}
                              onSelectSession={setActiveSession}
                              onNewChat={handleNewChat}
                              onDeleteSession={handleDeleteSession}
                              onFeaturePrompt={handleFeaturePrompt}
                        />
                        <div className="relative flex min-w-0 flex-1">
                              <ChatWindow
                                    onToggleContext={() => setContextOpen((v) => !v)}
                                    contextOpen={contextOpen}
                                    files={files}
                                    onFilesUploaded={handleFilesUploaded}
                                    onUpdateFile={handleUpdateFile}
                              />
                              <ContextPanel
                                    isOpen={contextOpen}
                                    files={files}
                                    onRemoveFile={handleRemoveFile}
                                    onClose={() => setContextOpen(false)}
                              />
                        </div>
                  </motion.div>
            </motion.div>
      );
}
