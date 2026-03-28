"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut, Settings, Plus, MessageSquare, Trash2,
  PanelLeftClose, PanelLeft, Mail, FileText, Sparkles,
} from "lucide-react";

import { UploadedFile, ChatMessage, ChatSession, TABS, TabId, timeNow, preprocessSlashCommand } from "./_components/types";
import ChatPanel from "./_components/ChatPanel";
import FilesPanel from "./_components/FilesPanel";
import GmailPanel from "./_components/GmailPanel";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const supabase = createClient();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const [gmailUser, setGmailUser] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  const persistMessage = useCallback((sessionId: string, role: "user" | "assistant", content: string, status?: string) => {
    fetch("/api/chat-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, role, content, status: status ?? "done" }),
    }).catch(() => {});
  }, []);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat-history?session_id=${sessionId}`);
      const { messages: msgs } = await res.json();
      if (Array.isArray(msgs) && msgs.length > 0) {
        const loaded: ChatMessage[] = msgs.map((m: { id: number; role: "user" | "assistant"; content: string; status?: string; created_at: string }) => ({
          id: nextMsgId.current++,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: m.status as ChatMessage["status"],
        }));
        setMessages(loaded);
      } else {
        setMessages([]);
      }
    } catch { setMessages([]); }
  }, []);

  const createNewSession = useCallback(async (title?: string) => {
    try {
      const res = await fetch("/api/chat-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "New Chat" }),
      });
      const { session } = await res.json();
      if (session) {
        setSessions(prev => [session, ...prev]);
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
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
      setUserCreated(user?.created_at ?? null);
      setUserName(user?.user_metadata?.full_name ?? null);
    });
    fetch("/api/upload").then(r => r.json()).then(({ files }) => { if (Array.isArray(files)) setSavedFiles(files); }).finally(() => setFilesLoading(false));
    fetch("/api/settings").then(r => r.json()).then(({ settings }) => {
      if (settings) { setGmailUser(settings.gmail_user ?? ""); setGmailPassword(settings.gmail_app_password ?? ""); }
    });
    fetch("/api/chat-sessions").then(r => r.json()).then(({ sessions: s }) => {
      if (Array.isArray(s) && s.length > 0) { setSessions(s); setActiveSessionId(s[0].id); }
    }).finally(() => setSessionsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSessionId) loadSessionMessages(activeSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatLoading]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  const handleNewChat = useCallback(async () => { await createNewSession(); }, [createNewSession]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    setActiveTab("chat");
    await loadSessionMessages(sessionId);
  }, [loadSessionMessages]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      await fetch("/api/chat-sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      setSessions(prev => {
        const updated = prev.filter(s => s.id !== sessionId);
        if (activeSessionId === sessionId) {
          setActiveSessionId(updated.length > 0 ? updated[0].id : null);
          setMessages([]);
        }
        return updated;
      });
    } catch {}
  }, [activeSessionId]);

  const stopGeneration = useCallback(() => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    setChatLoading(false);
    const content = "Generation stopped.";
    setMessages(prev => [...prev, { id: nextMsgId.current++, role: "assistant", content, timestamp: timeNow(), status: "cancelled" }]);
    if (activeSessionId) persistMessage(activeSessionId, "assistant", content, "cancelled");
  }, [persistMessage, activeSessionId]);

  const sendMessage = useCallback(async (overrideInput?: string) => {
    const raw = (overrideInput ?? chatInput).trim();
    if (!raw) return;
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = await createNewSession(raw.length > 38 ? raw.slice(0, 38) + "…" : raw);
      if (!sessionId) return;
    }
    const processed = preprocessSlashCommand(raw);
    const isFirstMessage = messages.length === 0;
    setMessages(prev => [...prev, { id: nextMsgId.current++, role: "user", content: raw, timestamp: timeNow() }]);
    persistMessage(sessionId, "user", raw);
    if (isFirstMessage) autoTitleSession(sessionId, raw);
    setChatInput("");
    setChatLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      // Build history from current messages (exclude the one we just appended)
      const history = messages
        .filter(m => m.status !== "cancelled")
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: processed, history }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Query failed");
      setMessages(prev => [...prev, { id: nextMsgId.current++, role: "assistant", content: data.answer, timestamp: timeNow() }]);
      persistMessage(sessionId, "assistant", data.answer);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const m = err instanceof Error ? err.message : "Something went wrong";
      const errContent = `Sorry, I hit an error: ${m}`;
      setMessages(prev => [...prev, { id: nextMsgId.current++, role: "assistant", content: errContent, timestamp: timeNow() }]);
      persistMessage(sessionId, "assistant", errContent);
    } finally { abortRef.current = null; setChatLoading(false); }
  }, [chatInput, persistMessage, activeSessionId, createNewSession, autoTitleSession, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    if (activeSessionId) {
      fetch("/api/chat-history", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: activeSessionId }) }).catch(() => {});
    }
  }, [activeSessionId]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Upload failed"); return; }
      setSavedFiles(prev => [{ file_name: file.name, uploaded_at: new Date().toISOString() }, ...prev.filter(f => f.file_name !== file.name)]);
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const res = await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file_name: fileName }) });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Delete failed"); return; }
      setSavedFiles(prev => prev.filter(f => f.file_name !== fileName));
    } catch { alert("Delete failed"); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSettingsSaving(true); setSettingsMsg(null);
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gmail_user: gmailUser, gmail_app_password: gmailPassword }) });
      const data = await res.json();
      setSettingsMsg(res.ok ? "success:Settings saved successfully" : `error:${data.error}`);
    } catch { setSettingsMsg("error:Failed to save settings"); } finally { setSettingsSaving(false); }
  };

  /* ── group sessions by date ── */
  const groupedSessions = sessions.reduce<Record<string, ChatSession[]>>((acc, s) => {
    const d = new Date(s.updated_at);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const group = diff < 86400000 ? "Today" : diff < 172800000 ? "Yesterday" : diff < 604800000 ? "This week" : "Older";
    return { ...acc, [group]: [...(acc[group] ?? []), s] };
  }, {});
  const groupOrder = ["Today", "Yesterday", "This week", "Older"];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(240,10%,9%)", color: "hsl(0,0%,90%)" }}>

      {/* ═══ Sidebar ═══ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 268, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col shrink-0 overflow-hidden border-r"
            style={{ borderColor: "hsl(240,6%,15%)", background: "hsl(240,10%,7%)" }}
          >
            {/* Top: Logo + collapse */}
            <div className="flex items-center justify-between px-3 pt-4 pb-2">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-sm font-semibold tracking-tight" style={{ color: "hsl(0,0%,92%)" }}>Donna</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "hsl(240,5%,45%)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "hsl(240,6%,15%)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            {/* New Chat */}
            <div className="px-3 pb-2">
              <button onClick={handleNewChat}
                className="w-full flex items-center gap-2 text-[13px] font-medium px-3 py-2.5 rounded-xl transition-all"
                style={{ color: "hsl(0,0%,80%)", border: "1px solid hsl(240,6%,18%)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "hsl(240,6%,14%)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <Plus size={15} style={{ color: "hsl(240,5%,55%)" }} /> New chat
              </button>
            </div>

            {/* Non-chat nav */}
            <div className="px-3 pb-2 space-y-0.5">
              {TABS.filter(t => t.id !== "chat").map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all"
                    style={{
                      background: active ? "hsl(240,6%,15%)" : "transparent",
                      color: active ? "hsl(0,0%,90%)" : "hsl(240,5%,50%)",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "hsl(240,6%,13%)"; e.currentTarget.style.color = "hsl(0,0%,85%)"; }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(240,5%,50%)"; } }}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sessions */}
            <div className="flex-1 overflow-y-auto px-2 pt-1" style={{ borderTop: "1px solid hsl(240,6%,13%)" }}>
              {sessionsLoading ? (
                <div className="space-y-1 px-2 py-2">
                  {[1,2,3,4].map(i => <div key={i} className="h-8 rounded-lg animate-pulse" style={{ background: "hsl(240,6%,14%)" }} />)}
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: "hsl(240,5%,35%)" }}>No conversations yet</p>
              ) : (
                <div className="py-2">
                  {groupOrder.map(group => {
                    const groupSessions = groupedSessions[group];
                    if (!groupSessions?.length) return null;
                    return (
                      <div key={group} className="mb-3">
                        <p className="text-[10px] uppercase tracking-widest font-semibold px-3 mb-1.5" style={{ color: "hsl(240,5%,35%)" }}>{group}</p>
                        {groupSessions.map(session => {
                          const isActive = activeSessionId === session.id && activeTab === "chat";
                          return (
                            <div key={session.id}
                              className="group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all"
                              style={{ background: isActive ? "hsl(240,6%,16%)" : "transparent" }}
                              onClick={() => handleSelectSession(session.id)}
                              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "hsl(240,6%,13%)"; }}
                              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                            >
                              <p className="text-[12.5px] truncate flex-1 leading-tight"
                                style={{ color: isActive ? "hsl(0,0%,92%)" : "hsl(240,5%,55%)" }}>
                                {session.title}
                              </p>
                              <button
                                onClick={e => { e.stopPropagation(); handleDeleteSession(session.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all shrink-0"
                                style={{ color: "hsl(240,5%,45%)" }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "hsl(0,60%,15%)"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "hsl(240,5%,45%)"; e.currentTarget.style.background = "transparent"; }}
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
            <div className="p-2 relative" style={{ borderTop: "1px solid hsl(240,6%,13%)" }}>
              <button onClick={() => setShowAccountPopup(v => !v)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                onMouseEnter={e => e.currentTarget.style.background = "hsl(240,6%,14%)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                  {(userName ?? userEmail)?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[12.5px] font-medium truncate" style={{ color: "hsl(0,0%,85%)" }}>{userName ?? userEmail ?? "…"}</p>
                </div>
                <Settings size={13} style={{ color: "hsl(240,5%,38%)" }} />
              </button>

              <AnimatePresence>
                {showAccountPopup && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute bottom-full left-2 right-2 mb-2 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ background: "hsl(240,10%,12%)", border: "1px solid hsl(240,6%,20%)" }}
                  >
                    <div className="px-4 py-3.5" style={{ borderBottom: "1px solid hsl(240,6%,16%)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                          {(userName ?? userEmail)?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          {userName && <p className="text-sm font-semibold truncate" style={{ color: "hsl(0,0%,92%)" }}>{userName}</p>}
                          <p className="text-xs truncate" style={{ color: "hsl(240,5%,50%)" }}>{userEmail}</p>
                          {userCreated && <p className="text-[10px] mt-0.5" style={{ color: "hsl(240,5%,38%)" }}>Since {new Date(userCreated).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 text-[13px] px-3 py-2 rounded-lg transition-all"
                        style={{ color: "#f87171" }}
                        onMouseEnter={e => e.currentTarget.style.background = "hsl(0,60%,12%)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <LogOut size={14} /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar toggle when closed */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)}
          className="absolute top-3.5 left-3.5 z-30 p-2 rounded-lg transition-all"
          style={{ color: "hsl(240,5%,50%)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "hsl(240,6%,15%)"; e.currentTarget.style.color = "hsl(0,0%,85%)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(240,5%,50%)"; }}
        >
          <PanelLeft size={17} />
        </button>
      )}

      {/* ═══ Main ═══ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "hsl(240,10%,9%)" }}>
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <ChatPanel key="chat" messages={messages} input={chatInput} onInputChange={setChatInput}
              onSend={sendMessage} onStop={stopGeneration} onClear={clearChat} loading={chatLoading}
              chatEndRef={chatEndRef} fileInputRef={fileInputRef}
              onFileSelect={e => { if (e.target.files) Array.from(e.target.files).forEach(handleUpload); e.target.value = ""; }}
              fileCount={savedFiles.length} />
          )}
          {activeTab === "files" && <FilesPanel key="files" files={savedFiles} filesLoading={filesLoading} uploading={uploading} onUpload={handleUpload} onDelete={handleDelete} />}
          {activeTab === "gmail" && <GmailPanel key="gmail" gmailUser={gmailUser} gmailPassword={gmailPassword} onGmailUserChange={setGmailUser} onGmailPasswordChange={setGmailPassword} onSave={handleSaveSettings} saving={settingsSaving} message={settingsMsg} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
