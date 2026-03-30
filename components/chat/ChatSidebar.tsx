"use client";

import { motion } from "framer-motion";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { BrandLogo, BrandMark } from "@/components/brand/BrandLogo";
import { chatFeatures } from "./FeatureCards";
import { staggerContainer, staggerItem, springSoft } from "@/lib/animations";

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
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springSoft}
      className="flex w-[280px] shrink-0 flex-col border-r border-slate-200/90 bg-linear-to-b from-slate-50/95 via-white to-white"
    >
      <div className="border-b border-slate-200/80 px-4 py-4">
        <p className="mb-3.5 text-[11px] leading-relaxed text-slate-500">
          Quick tools, sessions, and the same Donna mark as the homepage.
        </p>
        <motion.button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:ring-2 hover:ring-emerald-500/20"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 28px rgba(16, 185, 129, 0.35)" }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          <Plus size={16} />
          New Chat
        </motion.button>
      </div>

      <div className="border-b border-slate-100 px-3 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Tools
        </p>
        <div className="space-y-0.5">
          {chatFeatures.map((feature, i) => (
            <motion.button
              key={feature.id}
              onClick={() => onFeaturePrompt(feature.prompt)}
              className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-emerald-50/60"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, ...springSoft }}
              whileHover={{ x: 3 }}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${feature.bgClass}`}
              >
                <feature.icon size={13} className={feature.accentClass} />
              </div>
              <span className="truncate text-xs font-medium text-slate-700 group-hover:text-slate-900">
                {feature.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="px-5 pt-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Recent
        </p>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          {sessions.map((session) => {
            const active = session.id === activeSession;
            return (
              <motion.button
                key={session.id}
                variants={staggerItem}
                layout
                onClick={() => onSelectSession(session.id)}
                className={`group flex w-full items-start gap-3 border-l-[3px] px-4 py-3 text-left transition-all ${
                  active
                    ? "border-emerald-600 bg-emerald-50/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]"
                    : "border-transparent hover:bg-slate-50/90"
                }`}
                whileHover={{ x: active ? 0 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    active ? "bg-emerald-100 ring-1 ring-emerald-200/60" : "bg-slate-100"
                  }`}
                >
                  <MessageSquare
                    size={13}
                    className={active ? "text-emerald-800" : "text-slate-500"}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-xs font-medium ${active ? "text-emerald-950" : "text-slate-800"}`}
                    >
                      {session.title}
                    </span>
                    <span className="shrink-0 text-[10px] text-slate-400">{session.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">{session.preview}</p>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                  whileTap={{ scale: 0.85 }}
                >
                  <Trash2 size={11} />
                </motion.button>
              </motion.button>
            );
          })}
        </motion.div>

        {sessions.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center px-6 py-10 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <motion.div
              className="mb-3 flex justify-center"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* <BrandMark size="md" className="shadow-md shadow-emerald-500/15" /> */}
            </motion.div>
            <p className="text-xs font-medium text-slate-600">No conversations yet</p>
            <p className="mt-1 px-4 text-[11px] leading-relaxed text-slate-400">
              Start a new chat your history will show up here.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
