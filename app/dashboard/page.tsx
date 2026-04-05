"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut,
  Settings,
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";

import {
  UploadedFile,
  ChatMessage,
  ChatSession,
  TABS,
  TabId,
  timeNow,
  preprocessSlashCommand,
} from "./_components/types";
import dynamic from "next/dynamic";
import ChatPanel from "./_components/ChatPanel";

const FilesPanel = dynamic(() => import("./_components/FilesPanel"), { ssr: false });
const GmailPanel = dynamic(() => import("./_components/GmailPanel"), { ssr: false });
const BillingPanel = dynamic(() => import("./_components/BillingPanel"), { ssr: false });

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const supabase = createClient();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userCreated, setUserCreated] = useState<string | null>(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextMsgId = useRef(1);
  const abortRef = useRef<AbortController | null>(null);

  const [savedFiles, setSavedFiles] = useState<UploadedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Per-file upload queue for toast notifications ─────────────────────
  const [uploadQueue, setUploadQueue] = useState<
    { id: string; name: string; status: "uploading" | "done" | "error"; error?: string }[]
  >([]);

  const [gmailUser, setGmailUser] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  // ── Usage + payments ─────────────────────────────────────────────────
  const [usage, setUsage] = useState<{
    prompts_used: number;
    uploads_used: number;
    is_subscribed: boolean;
  } | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  // ─────────────────────────────────────────────────────────────────────

  const sessionCacheKey = (id: string) => `donna_msgs_${id}`;

  const writeMsgCache = useCallback((sessionId: string, msgs: ChatMessage[]) => {
    try {
      sessionStorage.setItem(sessionCacheKey(sessionId), JSON.stringify(msgs.slice(-80)));
    } catch {}
  }, []);

  const readMsgCache = useCallback((sessionId: string): ChatMessage[] | null => {
    try {
      const raw = sessionStorage.getItem(sessionCacheKey(sessionId));
      if (!raw) return null;
      return JSON.parse(raw) as ChatMessage[];
    } catch {
      return null;
    }
  }, []);

  const persistMessage = useCallback(
    (sessionId: string, role: "user" | "assistant", content: string, status?: string) => {
      fetch("/api/chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, role, content, status: status ?? "done" }),
      }).catch(() => {});
    },
    []
  );

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    // Show cached messages instantly so the UI never goes blank
    const cached = readMsgCache(sessionId);
    if (cached && cached.length > 0) {
      setMessages(cached);
      nextMsgId.current = Math.max(...cached.map((m) => m.id)) + 1;
    }

    try { 
      const res = await fetch(`/api/chat-history?session_id=${sessionId}`);
      const { messages: msgs } = await res.json();
      if (Array.isArray(msgs) && msgs.length > 0) {
        const loaded: ChatMessage[] = msgs.map(
          (m: {
            id: number;
            role: "user" | "assistant";
            content: string;
            status?: string;
            created_at: string;
          }) => ({
            id: nextMsgId.current++,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: m.status as ChatMessage["status"],
          })
        );
        setMessages(loaded);
        writeMsgCache(sessionId, loaded);
      } else {
        if (!cached) setMessages([]);
      }
    } catch {
      if (!cached) setMessages([]);
    }
  }, [readMsgCache, writeMsgCache]);

  const createNewSession = useCallback(async (title?: string) => {
    try {
      const res = await fetch("/api/chat-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "New Chat" }),
      });
      const { session } = await res.json();
      if (session) {
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(session.id);
        setMessages([]);
        setActiveTab("chat");
        return session.id as string;
      }
    } catch {}
    return null;
  }, []);

  const autoTitleSession = useCallback((sessionId: string, firstMessage: string) => {
    const title = firstMessage.length > 38 ? firstMessage.slice(0, 38) + "…" : firstMessage;
    fetch("/api/chat-sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, title }),
    }).catch(() => {});
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)));
  }, []);

  // ── Upgrade handler ───────────────────────────────────────────────────
  const handleUpgrade = useCallback(async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/dodo/checkout", { method: "POST" });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      alert("Could not start checkout. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }, []);
  // ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Check if returning from successful Dodo checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      setUpgradeOpen(false);
      window.history.replaceState({}, "", "/dashboard");

      const subscriptionId = params.get("subscription_id");
      if (subscriptionId) {
        // Verify + activate subscription immediately via Dodo API
        fetch("/api/dodo/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_id: subscriptionId }),
        })
          .then(() => fetch("/api/usage"))
          .then((r) => r.json())
          .then(({ usage: u }) => { if (u) setUsage(u); });
      } else {
        // Fallback: just refresh usage
        fetch("/api/usage").then((r) => r.json()).then(({ usage: u }) => { if (u) setUsage(u); });
      }
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
      setUserCreated(user?.created_at ?? null);
      setUserName(user?.user_metadata?.full_name ?? null);
    });
    fetch("/api/upload")
      .then((r) => r.json())
      .then(({ files }) => {
        if (Array.isArray(files)) setSavedFiles(files);
      })
      .finally(() => setFilesLoading(false));
    fetch("/api/settings")
      .then((r) => r.json())
      .then(({ settings }) => {
        if (settings) {
          setGmailUser(settings.gmail_user ?? "");
          setGmailPassword(settings.gmail_app_password ?? "");
        }
      });
    fetch("/api/chat-sessions")
      .then((r) => r.json())
      .then(({ sessions: s }) => {
        if (Array.isArray(s) && s.length > 0) {
          setSessions(s);
          setActiveSessionId(s[0].id);
        }
      })
      .finally(() => setSessionsLoading(false));
    fetch("/api/usage")
      .then((r) => r.json())
      .then(({ usage: u }) => { if (u) setUsage(u); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSessionId) loadSessionMessages(activeSessionId);
    // Reset scroll tracking when session changes so loading history doesn't scroll
    prevMsgCountRef.current = -1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  // Only scroll to bottom when a new message is appended (length grows),
  // not when switching sessions / loading history.
  const prevMsgCountRef = useRef(-1);
  useEffect(() => {
    const prev = prevMsgCountRef.current;
    const curr = messages.length;
    prevMsgCountRef.current = curr;
    // prev === -1 means session just switched — skip auto-scroll (it's history)
    if (prev !== -1 && curr > prev) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  const handleNewChat = useCallback(async () => {
    await createNewSession();
  }, [createNewSession]);

  const handleSelectSession = useCallback(
    async (sessionId: string) => {
      setActiveSessionId(sessionId);
      setMessages([]);
      setActiveTab("chat");
      await loadSessionMessages(sessionId);
    },
    [loadSessionMessages]
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch("/api/chat-sessions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        setSessions((prev) => {
          const updated = prev.filter((s) => s.id !== sessionId);
          if (activeSessionId === sessionId) {
            setActiveSessionId(updated.length > 0 ? updated[0].id : null);
            setMessages([]);
          }
          return updated;
        });
      } catch {}
    },
    [activeSessionId]
  );

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setChatLoading(false);
    const content = "Generation stopped.";
    setMessages((prev) => [
      ...prev,
      {
        id: nextMsgId.current++,
        role: "assistant",
        content,
        timestamp: timeNow(),
        status: "cancelled",
      },
    ]);
    if (activeSessionId) persistMessage(activeSessionId, "assistant", content, "cancelled");
  }, [persistMessage, activeSessionId]);

  const sendMessage = useCallback(
    async (overrideInput?: string) => {
      const raw = (overrideInput ?? chatInput).trim();
      if (!raw) return;
      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = await createNewSession(raw.length > 38 ? raw.slice(0, 38) + "…" : raw);
        if (!sessionId) return;
      }
      const processed = preprocessSlashCommand(raw);
      const isFirstMessage = messages.length === 0;
      setMessages((prev) => {
        const updated = [
          ...prev,
          { id: nextMsgId.current++, role: "user" as const, content: raw, timestamp: timeNow() },
        ];
        writeMsgCache(sessionId, updated);
        return updated;
      });
      persistMessage(sessionId, "user", raw);
      if (isFirstMessage) autoTitleSession(sessionId, raw);
      setChatInput("");
      setChatLoading(true);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        // Build history from current messages (exclude the one we just appended)
        const history = messages
          .filter((m) => m.status !== "cancelled")
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: processed, history }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.status === 402 && data.error === "free_limit_reached") {
          setChatLoading(false);
          setUpgradeOpen(true);
          return;
        }
        if (!res.ok) throw new Error(data.error || "Query failed");
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              id: nextMsgId.current++,
              role: "assistant" as const,
              content: data.answer,
              timestamp: timeNow(),
            },
          ];
          writeMsgCache(sessionId, updated);
          return updated;
        });
        persistMessage(sessionId, "assistant", data.answer);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const m = err instanceof Error ? err.message : "Something went wrong";
        const errContent = `Sorry, I hit an error: ${m}`;
        setMessages((prev) => {
          const updated = [
            ...prev,
            { id: nextMsgId.current++, role: "assistant" as const, content: errContent, timestamp: timeNow() },
          ];
          writeMsgCache(sessionId, updated);
          return updated;
        });
        persistMessage(sessionId, "assistant", errContent);
      } finally {
        abortRef.current = null;
        setChatLoading(false);
      }
    },
    [chatInput, persistMessage, activeSessionId, createNewSession, autoTitleSession, messages, writeMsgCache]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    if (activeSessionId) {
      try { sessionStorage.removeItem(sessionCacheKey(activeSessionId)); } catch {}
      fetch("/api/chat-history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: activeSessionId }),
      }).catch(() => {});
    }
  }, [activeSessionId]);

  const handleUpload = async (file: File) => {
    const qid = `${Date.now()}-${file.name}`;
    setUploadQueue((q) => [...q, { id: qid, name: file.name, status: "uploading" }]);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.status === 402 && data.error === "free_limit_reached") {
        setUploadQueue((q) => q.map((item) => item.id === qid ? { ...item, status: "error", error: "Upload limit reached" } : item));
        setTimeout(() => setUploadQueue((q) => q.filter((item) => item.id !== qid)), 4000);
        setUpgradeOpen(true);
        return;
      }
      if (!res.ok) {
        const msg = data.error || "Upload failed";
        setUploadQueue((q) => q.map((item) => item.id === qid ? { ...item, status: "error", error: msg } : item));
        setTimeout(() => setUploadQueue((q) => q.filter((item) => item.id !== qid)), 4000);
        return;
      }
      setUploadQueue((q) => q.map((item) => item.id === qid ? { ...item, status: "done" } : item));
      setTimeout(() => setUploadQueue((q) => q.filter((item) => item.id !== qid)), 3000);
      setUsage((prev) => prev ? { ...prev, uploads_used: prev.uploads_used + 1 } : prev);
      setSavedFiles((prev) => [
        { file_name: file.name, uploaded_at: new Date().toISOString() },
        ...prev.filter((f) => f.file_name !== file.name),
      ]);
    } catch {
      setUploadQueue((q) => q.map((item) => item.id === qid ? { ...item, status: "error", error: "Upload failed" } : item));
      setTimeout(() => setUploadQueue((q) => q.filter((item) => item.id !== qid)), 4000);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: fileName }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Delete failed");
        return;
      }
      setSavedFiles((prev) => prev.filter((f) => f.file_name !== fileName));
    } catch {
      alert("Delete failed");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail_user: gmailUser, gmail_app_password: gmailPassword }),
      });
      const data = await res.json();
      setSettingsMsg(res.ok ? "success:Settings saved successfully" : `error:${data.error}`);
    } catch {
      setSettingsMsg("error:Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  /* ── group sessions by date ── */
  const groupedSessions = sessions.reduce<Record<string, ChatSession[]>>((acc, s) => {
    const d = new Date(s.updated_at);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const group =
      diff < 86400000
        ? "Today"
        : diff < 172800000
          ? "Yesterday"
          : diff < 604800000
            ? "This week"
            : "Older";
    return { ...acc, [group]: [...(acc[group] ?? []), s] };
  }, {});
  const groupOrder = ["Today", "Yesterday", "This week", "Older"];

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50/50 text-slate-900">
      {/* Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-slate-50 via-white to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[3rem_3rem]" />
      </div>

      {/* ═══ Sidebar ═══ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
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
              {/* Top: Logo + collapse */}
              <div className="flex items-center justify-between px-3 pt-4 pb-2">
                <Link
                  href="/"
                  className="px-2 font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-900"
                >
                  Donna
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose size={16} />
                </button>
              </div>

              {/* New Chat */}
              <div className="px-3 pb-2">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/25 transition-all hover:ring-2 hover:ring-slate-900/20"
                >
                  <Plus size={15} strokeWidth={2.5} /> New chat
                </button>
              </div>

              {/* Non-chat nav */}
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
                      <tab.icon size={14} className={active ? "text-black" : undefined} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Sessions */}
              <div className="flex-1 overflow-y-auto border-t border-slate-200/80 px-2 pt-1">
                {sessionsLoading ? (
                  <div className="space-y-1 px-2 py-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-100/80" />
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="px-3 py-8 text-center text-xs leading-relaxed text-slate-500">
                    No conversations yet start with{" "}
                    <span className="font-medium text-black">New chat</span>.
                  </p>
                ) : (
                  <div className="py-2">
                    {groupOrder.map((group) => {
                      const groupSessions = groupedSessions[group];
                      if (!groupSessions?.length) return null;
                      return (
                        <div key={group} className="mb-3">
                          <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                            {group}
                          </p>
                          {groupSessions.map((session) => {
                            const isActive = activeSessionId === session.id && activeTab === "chat";
                            return (
                              <div
                                key={session.id}
                                className={`group flex cursor-pointer items-center gap-2 rounded-xl border-l-[3px] px-3 py-2 transition-all ${
                                  isActive
                                    ? "border-black bg-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]"
                                    : "border-transparent hover:bg-slate-50/90"
                                }`}
                                onClick={() => handleSelectSession(session.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleSelectSession(session.id);
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                <p
                                  className={`flex-1 truncate text-[12.5px] leading-tight ${
                                    isActive ? "font-medium text-black" : "text-slate-600"
                                  }`}
                                >
                                  {session.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                  }}
                                  className="shrink-0 rounded p-1 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Account */}
              <div className="relative border-t border-slate-200 p-2">
                <button
                  onClick={() => setShowAccountPopup((v) => !v)}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-slate-100/90"
                >
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm ring-2 shadow-slate-900/25 ring-white">
                    {(userName ?? userEmail)?.[0]?.toUpperCase() ?? "?"}
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
                        <span className="text-emerald-600">Pro</span>
                      ) : (
                        <span className="text-slate-400">Free plan</span>
                      )}
                    </p>
                  </div>
                  <Settings size={13} className="text-slate-500" />
                </button>

                <AnimatePresence>
                  {showAccountPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-2 bottom-full left-2 z-50 mb-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    >
                      <div className="border-b border-slate-100 px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white shadow-md ring-2 shadow-slate-900/20 ring-white">
                            {(userName ?? userEmail)?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            {userName && (
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {userName}
                              </p>
                            )}
                            <p className="truncate text-xs text-slate-600">{userEmail}</p>
                            {userCreated && (
                              <p className="mt-0.5 text-[10px] text-slate-500">
                                Since{" "}
                                {new Date(userCreated).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Subscription status */}
                        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                          {usage?.is_subscribed ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-[12px] font-semibold text-slate-800">Pro plan</span>
                              </div>
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Active
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-[12px] font-semibold text-slate-700">Free plan</span>
                                <span className="text-[10px] text-slate-400">
                                  {usage?.prompts_used ?? 0}/{3} prompts used
                                </span>
                              </div>
                              <div className="mb-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full rounded-full bg-slate-800 transition-all"
                                  style={{ width: `${Math.min(((usage?.prompts_used ?? 0) / 3) * 100, 100)}%` }}
                                />
                              </div>
                              <button
                                onClick={() => { setShowAccountPopup(false); setUpgradeOpen(true); }}
                                className="w-full rounded-lg bg-slate-900 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-slate-700"
                              >
                                Upgrade to Pro →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { setShowAccountPopup(false); setActiveTab("billing"); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-slate-700 transition-all hover:bg-slate-50"
                        >
                          <Settings size={14} /> Manage billing
                        </button>
                        <button
                          onClick={handleLogout}
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

      {/* Sidebar toggle when closed */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="absolute top-3.5 left-3.5 z-30 rounded-xl border border-slate-200/80 bg-white/90 p-2 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Open sidebar"
        >
          <PanelLeft size={17} />
        </button>
      )}

      {/* ═══ Main ═══ */}
      <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center p-0 sm:p-2 md:p-4">
        <main className="relative z-10 flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none border-0 border-slate-200 bg-white shadow-none sm:rounded-2xl sm:border sm:shadow-xl md:max-h-212.5">
          <div className="chat-mesh pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "chat" && (
                <ChatPanel
                  key="chat"
                  messages={messages}
                  input={chatInput}
                  onInputChange={setChatInput}
                  onSend={sendMessage}
                  onStop={stopGeneration}
                  onClear={clearChat}
                  loading={chatLoading}
                  chatEndRef={chatEndRef}
                  fileInputRef={fileInputRef}
                  onFileSelect={(e) => {
                    if (e.target.files) Array.from(e.target.files).forEach(handleUpload);
                    e.target.value = "";
                  }}
                  fileCount={savedFiles.length}
                  usage={usage}
                  onUpgrade={() => setUpgradeOpen(true)}
                  uploadQueue={uploadQueue}
                />
              )}
              {activeTab === "files" && (
                <FilesPanel
                  key="files"
                  files={savedFiles}
                  filesLoading={filesLoading}
                  uploading={uploading}
                  uploadQueue={uploadQueue}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                />
              )}
              {activeTab === "gmail" && (
                <GmailPanel
                  key="gmail"
                  gmailUser={gmailUser}
                  gmailPassword={gmailPassword}
                  onGmailUserChange={setGmailUser}
                  onGmailPasswordChange={setGmailPassword}
                  onSave={handleSaveSettings}
                  saving={settingsSaving}
                  message={settingsMsg}
                />
              )}
              {activeTab === "billing" && (
                <BillingPanel
                  key="billing"
                  usage={usage}
                  userEmail={userEmail}
                  onUpgrade={() => { setUpgradeOpen(true); }}
                  onRefreshUsage={() => {
                    fetch("/api/usage").then((r) => r.json()).then(({ usage: u }) => { if (u) setUsage(u); });
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ═══ Upgrade Modal ═══ */}
      <AnimatePresence>
        {upgradeOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUpgradeOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
              >
                {/* Header */}
                <div className="bg-slate-900 px-6 pt-6 pb-5 text-white">
                  <p className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                    Donna Pro
                  </p>
                  <h2 className="font-(family-name:--font-doto) text-2xl font-black tracking-tight">
                    Unlock unlimited access
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    You&apos;ve used your free prompts. Upgrade to keep going.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 px-6 py-5">
                  {[
                    { emoji: "💬", text: "Unlimited AI prompts" },
                    { emoji: "📁", text: "Unlimited file uploads" },
                    { emoji: "📧", text: "Email send & read" },
                    { emoji: "📊", text: "Diagrams from your data" },
                  ].map((f) => (
                    <div key={f.text} className="flex items-center gap-3 text-sm text-slate-700">
                      <span className="text-base">{f.emoji}</span>
                      {f.text}
                    </div>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="border-t border-slate-100 px-6 pb-6">
                  <div className="mb-4 flex items-baseline gap-1 pt-4">
                    <span className="font-(family-name:--font-doto) text-3xl font-black text-slate-900">
                      ₹299
                    </span>
                    <span className="text-sm text-slate-500">/ month</span>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700 disabled:opacity-50"
                  >
                    {upgrading ? "Redirecting…" : "Upgrade to Pro →"}
                  </button>
                  <button
                    onClick={() => setUpgradeOpen(false)}
                    className="mt-2 w-full py-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Maybe later
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Upload Toast Tray ═══ */}
      <AnimatePresence>
        {uploadQueue.length > 0 && (
          <div className="fixed right-4 bottom-4 z-[70] flex flex-col gap-2 sm:right-6 sm:bottom-6">
            {uploadQueue.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={`flex min-w-[240px] max-w-xs items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
                  item.status === "done"
                    ? "border-emerald-200 bg-white"
                    : item.status === "error"
                      ? "border-red-200 bg-white"
                      : "border-slate-200 bg-white"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    item.status === "done"
                      ? "bg-emerald-100"
                      : item.status === "error"
                        ? "bg-red-100"
                        : "bg-slate-100"
                  }`}
                >
                  {item.status === "uploading" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      {/* spinner */}
                      <svg className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    </motion.div>
                  ) : item.status === "done" ? (
                    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-slate-900">{item.name}</p>
                  <p
                    className={`text-[10.5px] font-medium ${
                      item.status === "done"
                        ? "text-emerald-600"
                        : item.status === "error"
                          ? "text-red-500"
                          : "text-slate-500"
                    }`}
                  >
                    {item.status === "uploading"
                      ? "Uploading & indexing…"
                      : item.status === "done"
                        ? "Uploaded & indexed ✓"
                        : (item.error ?? "Upload failed")}
                  </p>
                </div>

                {/* Dismiss on error */}
                {item.status === "error" && (
                  <button
                    onClick={() => setUploadQueue((q) => q.filter((i) => i.id !== item.id))}
                    className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
