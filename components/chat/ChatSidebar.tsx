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
    <div className="w-[260px] border-r border-border bg-white flex flex-col shrink-0">
      {/* New Chat button */}
      <div className="p-4 border-b border-border">
        <motion.button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-hover text-white rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm shadow-accent/15"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(22,163,74,0.2)" }}
        >
          <Plus size={16} />
          New Chat
        </motion.button>
      </div>

      {/* Feature quick-access */}
      <div className="px-3 py-3 border-b border-border">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 mb-2">Tools</p>
        <div className="space-y-0.5">
          {chatFeatures.map((feature) => (
            <motion.button
              key={feature.id}
              onClick={() => onFeaturePrompt(feature.prompt)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-surface transition-colors group"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <div className={`w-7 h-7 rounded-md ${feature.bgClass} flex items-center justify-center shrink-0`}>
                <feature.icon size={13} className={feature.accentClass} />
              </div>
              <span className="text-xs font-medium text-secondary group-hover:text-primary truncate">
                {feature.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Session history */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-5 pt-3 pb-2">Recent</p>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          {sessions.map((session) => {
            const active = session.id === activeSession;
            return (
              <motion.button
                key={session.id}
                variants={staggerItem}
                onClick={() => onSelectSession(session.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all group ${
                  active
                    ? "bg-spark-light/50 border-l-2 border-spark"
                    : "hover:bg-surface border-l-2 border-transparent"
                }`}
                whileHover={{ x: active ? 0 : 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  active ? "bg-spark-light" : "bg-surface-2"
                }`}>
                  <MessageSquare size={13} className={active ? "text-spark" : "text-muted"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-medium truncate ${active ? "text-spark" : "text-primary"}`}>
                      {session.title}
                    </span>
                    <span className="text-[10px] text-muted shrink-0">{session.time}</span>
                  </div>
                  <p className="text-[11px] text-muted truncate mt-0.5">{session.preview}</p>
                </div>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-muted hover:text-destructive shrink-0 mt-1 transition-opacity"
                  whileTap={{ scale: 0.85 }}
                >
                  <Trash2 size={11} />
                </motion.button>
              </motion.button>
            );
          })}
        </motion.div>

        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <Sparkles size={20} className="text-muted mb-2" />
            <p className="text-xs text-muted">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
