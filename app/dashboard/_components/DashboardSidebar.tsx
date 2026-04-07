"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Settings, Plus, Trash2, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { TABS, TabId, ChatSession } from "./types";
import type { UsageData } from "../_hooks/useUsage";
import { FREE_LIMITS } from "@/lib/payments/limits";

interface DashboardSidebarProps {
      open: boolean;
      onClose: () => void;
      activeTab: TabId;
      setActiveTab: (t: TabId) => void;
      sessions: ChatSession[];
      sessionsLoading: boolean;
      activeSessionId: string | null;
      groupedSessions: Record<string, ChatSession[]>;
      groupOrder: string[];
      userEmail: string | null;
      userName: string | null;
      userCreated: string | null;
      usage: UsageData | null;
      showAccountPopup: boolean;
      setShowAccountPopup: (v: boolean) => void;
      onNewChat: () => void;
      onSelectSession: (id: string) => void;
      onDeleteSession: (id: string) => void;
      onLogout: () => void;
      onOpenUpgrade: () => void;
}

export default function DashboardSidebar({
      open,
      onClose,
      activeTab,
      setActiveTab,
      sessions,
      sessionsLoading,
      activeSessionId,
      groupedSessions,
      groupOrder,
      userEmail,
      userName,
      userCreated,
      usage,
      showAccountPopup,
      setShowAccountPopup,
      onNewChat,
      onSelectSession,
      onDeleteSession,
      onLogout,
      onOpenUpgrade,
}: DashboardSidebarProps) {
      return (
            <AnimatePresence initial={false}>
                  {open && (
                        <>
                              <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={onClose}
                                    className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
                              />
                              <motion.aside
                                    key="sidebar"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 280, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                    className="absolute inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl border-r border-slate-200/90 bg-white shadow-2xl transition-transform md:static md:my-4 md:ml-4 md:h-[calc(100vh-2rem)] md:rounded-2xl md:border md:shadow-xl"
                              >
                                    <div className="flex items-center justify-between px-3 pt-4 pb-2">
                                          <Link
                                                href="/"
                                                className="px-2 font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-900"
                                          >
                                                Donna
                                          </Link>
                                          <button
                                                type="button"
                                                onClick={onClose}
                                                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                                          >
                                                <PanelLeftClose size={16} />
                                          </button>
                                    </div>

                                    <div className="px-3 pb-2">
                                          <button
                                                type="button"
                                                onClick={onNewChat}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/25 transition-all hover:ring-2 hover:ring-slate-900/20"
                                          >
                                                <Plus size={15} strokeWidth={2.5} /> New chat
                                          </button>
                                    </div>

                                    <div className="space-y-0.5 px-3 pb-2">
                                          {TABS.filter((t) => t.id !== "chat").map((tab) => {
                                                const active = activeTab === tab.id;
                                                return (
                                                      <button
                                                            type="button"
                                                            key={tab.id}
                                                            onClick={() => setActiveTab(tab.id)}
                                                            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all ${
                                                                  active
                                                                        ? "bg-slate-100 text-black shadow-sm ring-1 ring-slate-200"
                                                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                            }`}
                                                      >
                                                            <tab.icon
                                                                  size={14}
                                                                  className={
                                                                        active
                                                                              ? "text-black"
                                                                              : undefined
                                                                  }
                                                            />
                                                            {tab.label}
                                                      </button>
                                                );
                                          })}
                                    </div>

                                    <div className="flex-1 overflow-y-auto border-t border-slate-200/80 px-2 pt-1">
                                          {sessionsLoading ? (
                                                <div className="space-y-1 px-2 py-2">
                                                      {[1, 2, 3, 4].map((i) => (
                                                            <div
                                                                  key={i}
                                                                  className="h-8 animate-pulse rounded-lg bg-slate-100/80"
                                                            />
                                                      ))}
                                                </div>
                                          ) : sessions.length === 0 ? (
                                                <p className="px-3 py-8 text-center text-xs leading-relaxed text-slate-500">
                                                      No conversations yet — start with{" "}
                                                      <span className="font-medium text-black">
                                                            New chat
                                                      </span>
                                                      .
                                                </p>
                                          ) : (
                                                <div className="py-2">
                                                      {groupOrder.map((group) => {
                                                            const groupSessions =
                                                                  groupedSessions[group];
                                                            if (!groupSessions?.length) return null;
                                                            return (
                                                                  <div key={group} className="mb-3">
                                                                        <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                                                                              {group}
                                                                        </p>
                                                                        {groupSessions.map(
                                                                              (session) => {
                                                                                    const isActive =
                                                                                          activeSessionId ===
                                                                                                session.id &&
                                                                                          activeTab ===
                                                                                                "chat";
                                                                                    return (
                                                                                          <div
                                                                                                key={
                                                                                                      session.id
                                                                                                }
                                                                                                className={`group flex cursor-pointer items-center gap-2 rounded-xl border-l-[3px] px-3 py-2 transition-all ${
                                                                                                      isActive
                                                                                                            ? "border-black bg-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]"
                                                                                                            : "border-transparent hover:bg-slate-50/90"
                                                                                                }`}
                                                                                                onClick={() =>
                                                                                                      onSelectSession(
                                                                                                            session.id
                                                                                                      )
                                                                                                }
                                                                                                onKeyDown={(
                                                                                                      e
                                                                                                ) => {
                                                                                                      if (
                                                                                                            e.key ===
                                                                                                                  "Enter" ||
                                                                                                            e.key ===
                                                                                                                  " "
                                                                                                      ) {
                                                                                                            e.preventDefault();
                                                                                                            onSelectSession(
                                                                                                                  session.id
                                                                                                            );
                                                                                                      }
                                                                                                }}
                                                                                                role="button"
                                                                                                tabIndex={
                                                                                                      0
                                                                                                }
                                                                                          >
                                                                                                <p
                                                                                                      className={`flex-1 truncate text-[12.5px] leading-tight ${isActive ? "font-medium text-black" : "text-slate-600"}`}
                                                                                                >
                                                                                                      {
                                                                                                            session.title
                                                                                                      }
                                                                                                </p>
                                                                                                <button
                                                                                                      onClick={(
                                                                                                            e
                                                                                                      ) => {
                                                                                                            e.stopPropagation();
                                                                                                            onDeleteSession(
                                                                                                                  session.id
                                                                                                            );
                                                                                                      }}
                                                                                                      className="shrink-0 rounded p-1 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                                                                                                >
                                                                                                      <Trash2
                                                                                                            size={
                                                                                                                  11
                                                                                                            }
                                                                                                      />
                                                                                                </button>
                                                                                          </div>
                                                                                    );
                                                                              }
                                                                        )}
                                                                  </div>
                                                            );
                                                      })}
                                                </div>
                                          )}
                                    </div>

                                    <div className="relative border-t border-slate-200 p-2">
                                          <button
                                                onClick={() =>
                                                      setShowAccountPopup(!showAccountPopup)
                                                }
                                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-slate-100/90"
                                          >
                                                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm ring-2 shadow-slate-900/25 ring-white">
                                                      {(userName ??
                                                            userEmail)?.[0]?.toUpperCase() ?? "?"}
                                                      {usage?.is_subscribed && (
                                                            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                                                      )}
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                      <p className="truncate text-[12.5px] font-medium text-slate-800">
                                                            {userName ?? userEmail ?? "…"}
                                                      </p>
                                                      <p className="text-[10px] font-semibold tracking-wide">
                                                            {usage?.is_subscribed ? (
                                                                  <span className="text-emerald-600">
                                                                        Pro
                                                                  </span>
                                                            ) : (
                                                                  <span className="text-slate-400">
                                                                        Free plan
                                                                  </span>
                                                            )}
                                                      </p>
                                                </div>
                                                <Settings size={13} className="text-slate-500" />
                                          </button>

                                          <AnimatePresence>
                                                {showAccountPopup && (
                                                      <motion.div
                                                            initial={{
                                                                  opacity: 0,
                                                                  y: 8,
                                                                  scale: 0.97,
                                                            }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                            transition={{ duration: 0.14 }}
                                                            className="absolute right-2 bottom-full left-2 z-50 mb-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                                                      >
                                                            <div className="border-b border-slate-100 px-4 py-3.5">
                                                                  <div className="flex items-center gap-3">
                                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white shadow-md ring-2 shadow-slate-900/20 ring-white">
                                                                              {(userName ??
                                                                                    userEmail)?.[0]?.toUpperCase() ??
                                                                                    "?"}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                              {userName && (
                                                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                                                          {userName}
                                                                                    </p>
                                                                              )}
                                                                              <p className="truncate text-xs text-slate-600">
                                                                                    {userEmail}
                                                                              </p>
                                                                              {userCreated && (
                                                                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                                                                          Since{" "}
                                                                                          {new Date(
                                                                                                userCreated
                                                                                          ).toLocaleDateString(
                                                                                                "en-US",
                                                                                                {
                                                                                                      month: "short",
                                                                                                      year: "numeric",
                                                                                                }
                                                                                          )}
                                                                                    </p>
                                                                              )}
                                                                        </div>
                                                                  </div>

                                                                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                                                                        {usage?.is_subscribed ? (
                                                                              <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-2">
                                                                                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                                          <span className="text-[12px] font-semibold text-slate-800">
                                                                                                Pro
                                                                                                plan
                                                                                          </span>
                                                                                    </div>
                                                                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                                                          Active
                                                                                    </span>
                                                                              </div>
                                                                        ) : (
                                                                              <div>
                                                                                    <div className="mb-2 flex items-center justify-between">
                                                                                          <span className="text-[12px] font-semibold text-slate-700">
                                                                                                Free
                                                                                                plan
                                                                                          </span>
                                                                                          <span className="text-[10px] text-slate-400">
                                                                                                {usage?.prompts_used ??
                                                                                                      0}
                                                                                                /{FREE_LIMITS.prompts}
                                                                                                prompts
                                                                                                used
                                                                                          </span>
                                                                                    </div>
                                                                                    <div className="mb-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                                                                          <div
                                                                                                className="h-full rounded-full bg-slate-800 transition-all"
                                                                                                style={{
                                                                                                      width: `${Math.min(((usage?.prompts_used ?? 0) / 3) * 100, 100)}%`,
                                                                                                }}
                                                                                          />
                                                                                    </div>
                                                                                    <button
                                                                                          onClick={() => {
                                                                                                setShowAccountPopup(
                                                                                                      false
                                                                                                );
                                                                                                onOpenUpgrade();
                                                                                          }}
                                                                                          className="w-full rounded-lg bg-slate-900 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-slate-700"
                                                                                    >
                                                                                          Upgrade to
                                                                                          Pro →
                                                                                    </button>
                                                                              </div>
                                                                        )}
                                                                  </div>
                                                            </div>
                                                            <div className="p-2">
                                                                  <button
                                                                        onClick={() => {
                                                                              setShowAccountPopup(
                                                                                    false
                                                                              );
                                                                              setActiveTab(
                                                                                    "billing"
                                                                              );
                                                                        }}
                                                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-slate-700 transition-all hover:bg-slate-50"
                                                                  >
                                                                        <Settings size={14} />{" "}
                                                                        Manage billing
                                                                  </button>
                                                                  <button
                                                                        onClick={onLogout}
                                                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-red-600 transition-all hover:bg-red-50"
                                                                  >
                                                                        <LogOut size={14} /> Log out
                                                                  </button>
                                                            </div>
                                                      </motion.div>
                                                )}
                                          </AnimatePresence>
                                    </div>
                              </motion.aside>
                        </>
                  )}
            </AnimatePresence>
      );
}
