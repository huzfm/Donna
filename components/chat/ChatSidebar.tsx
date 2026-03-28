"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles, MessageSquare, Trash2 } from "lucide-react";
import { chatFeatures } from "./FeatureCards";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  time: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSession: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onFeaturePrompt: (prompt: string) => void;
}

export default function ChatSidebar({
  sessions,
  activeSession,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onFeaturePrompt,
}: ChatSidebarProps) {
  return (
    <div className="border-border flex w-[260px] shrink-0 flex-col border-r bg-slate-950">
      {/* New Chat button */}
      <div className="border-border border-b p-4">
        <motion.button
          onClick={onNewChat}
          className="from-accent to-accent-hover shadow-accent/15 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-medium text-white shadow-sm"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(22,163,74,0.2)" }}
        >
          <Plus size={16} />
          New Chat
        </motion.button>
      </div>

      {/* Feature quick-access */}
      <div className="border-border border-b px-3 py-3">
        <p className="text-muted mb-2 px-2 text-[10px] font-semibold tracking-wider uppercase">
          Tools
        </p>
        <div className="space-y-0.5">
          {chatFeatures.map((feature) => (
            <motion.button
              key={feature.id}
              onClick={() => onFeaturePrompt(feature.prompt)}
              className="hover:bg-surface group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <div
                className={`h-7 w-7 rounded-md ${feature.bgClass} flex shrink-0 items-center justify-center`}
              >
                <feature.icon size={13} className={feature.accentClass} />
              </div>
              <span className="text-secondary group-hover:text-primary truncate text-xs font-medium">
                {feature.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Session history */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-muted px-5 pt-3 pb-2 text-[10px] font-semibold tracking-wider uppercase">
          Recent
        </p>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          {sessions.map((session) => {
            const active = session.id === activeSession;
            return (
              <motion.button
                key={session.id}
                variants={staggerItem}
                onClick={() => onSelectSession(session.id)}
                className={`group flex w-full items-start gap-3 px-4 py-3 text-left transition-all ${
                  active
                    ? "bg-spark-light/50 border-spark border-l-2"
                    : "hover:bg-surface border-l-2 border-transparent"
                }`}
                whileHover={{ x: active ? 0 : 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    active ? "bg-spark-light" : "bg-surface-2"
                  }`}
                >
                  <MessageSquare size={13} className={active ? "text-spark" : "text-muted"} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-xs font-medium ${active ? "text-spark" : "text-primary"}`}
                    >
                      {session.title}
                    </span>
                    <span className="text-muted shrink-0 text-[10px]">{session.time}</span>
                  </div>
                  <p className="text-muted mt-0.5 truncate text-[11px]">{session.preview}</p>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="text-muted hover:text-destructive mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100"
                  whileTap={{ scale: 0.85 }}
                >
                  <Trash2 size={11} />
                </motion.button>
              </motion.button>
            );
          })}
        </motion.div>

        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <Sparkles size={20} className="text-muted mb-2" />
            <p className="text-muted text-xs">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
