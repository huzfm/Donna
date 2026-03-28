"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Brain, FileText, LogOut, ChevronRight } from "lucide-react";

import { UploadedFile, ChatMessage, SLASH_COMMANDS, TABS, TabId, timeNow, preprocessSlashCommand } from "./_components/types";
import ChatPanel from "./_components/ChatPanel";
import FilesPanel from "./_components/FilesPanel";
import GmailPanel from "./_components/GmailPanel";
import AccountPanel from "./_components/AccountPanel";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const supabase = createClient();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCreated, setUserCreated] = useState<string | null>(null);

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

  /* ── load on mount ── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
      setUserCreated(user?.created_at ?? null);
    });
    fetch("/api/upload").then(r => r.json()).then(({ files }) => { if (Array.isArray(files)) setSavedFiles(files); }).finally(() => setFilesLoading(false));
    fetch("/api/settings").then(r => r.json()).then(({ settings }) => {
      if (settings) { setGmailUser(settings.gmail_user ?? ""); setGmailPassword(settings.gmail_app_password ?? ""); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatLoading]);

  /* ── handlers ── */
  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const stopGeneration = useCallback(() => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    setChatLoading(false);
    setMessages(prev => [...prev, { id: nextMsgId.current++, role: "assistant", content: "Generation stopped.", timestamp: timeNow(), status: "cancelled" }]);
  }, []);

  const sendMessage = useCallback(async (overrideInput?: string) => {
    const raw = (overrideInput ?? chatInput).trim();
    if (!raw) return;
    const processed = preprocessSlashCommand(raw);
    setMessages(prev => [...prev, { id: nextMsgId.current++, role: "user", content: raw, timestamp: timeNow() }]);
    setChatInput("");
    setChatLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: processed }), signal: controller.signal });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Query failed");
      setMessages(prev => [...prev, { id: nextMsgId.current++, role: "assistant", content: data.answer, timestamp: timeNow() }]);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const m = err instanceof Error ? err.message : "Something went wrong";
      setMessages(prev => [...prev, { id: nextMsgId.current++, role: "assistant", content: `Sorry, I hit an error: ${m}`, timestamp: timeNow() }]);
    } finally { abortRef.current = null; setChatLoading(false); }
  }, [chatInput]);

  const clearChat = useCallback(() => setMessages([]), []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Upload failed"); return; }
      setSavedFiles(prev => [{ file_name: file.name, uploaded_at: new Date().toISOString() }, ...prev.filter(f => f.file_name !== file.name)]);
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const res = await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file_name: fileName }) });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Delete failed"); return; }
      setSavedFiles(prev => prev.filter(f => f.file_name !== fileName));
    } catch { alert("Delete failed"); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSettingsSaving(true); setSettingsMsg(null);
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gmail_user: gmailUser, gmail_app_password: gmailPassword }) });
      const data = await res.json();
      setSettingsMsg(res.ok ? "success:Settings saved successfully" : `error:${data.error}`);
    } catch { setSettingsMsg("error:Failed to save settings"); }
    finally { setSettingsSaving(false); }
  };

  /* ── render ── */
  return (
    <div className="flex h-screen bg-white text-neutral-900 overflow-hidden">

      {/* ═══ Sidebar ═══ */}
      <aside className="w-[260px] border-r border-neutral-200 flex flex-col shrink-0 bg-neutral-50/80">
        <div className="px-5 py-5 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">Donna</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-neutral-100 text-neutral-900" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60"
                }`}>
                <tab.icon size={16} className={active ? "text-neutral-900" : "text-neutral-400"} />
                {tab.label}
                {active && <ChevronRight size={12} className="ml-auto text-neutral-400" />}
              </button>
            );
          })}

          <div className="mt-5 pt-4 border-t border-neutral-200">
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium px-2 mb-2">Commands</p>
            <div className="space-y-0.5">
              {SLASH_COMMANDS.slice(0, 4).map(cmd => (
                <button key={cmd.trigger} onClick={() => { setActiveTab("chat"); setChatInput(cmd.fill); }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-100 transition-colors text-left group">
                  <cmd.icon size={12} className="text-neutral-400 group-hover:text-neutral-600 shrink-0 transition-colors" />
                  <span className="text-[11px] font-mono text-neutral-500 group-hover:text-neutral-700 transition-colors">{cmd.trigger}</span>
                </button>
              ))}
            </div>
          </div>

          {savedFiles.length > 0 && (
            <div className="mt-3 mx-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <FileText size={12} className="text-neutral-400 shrink-0" />
              <span className="text-xs text-neutral-500"><strong className="text-neutral-700">{savedFiles.length}</strong> file{savedFiles.length !== 1 ? "s" : ""} indexed</span>
            </div>
          )}
        </nav>

        <div className="border-t border-neutral-200 p-3">
          {userEmail && (
            <div className="flex items-center gap-2.5 mb-2.5 px-1">
              <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-white font-medium text-xs shrink-0">
                {userEmail[0]?.toUpperCase()}
              </div>
              <p className="text-xs text-neutral-600 truncate flex-1">{userEmail}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center text-xs text-neutral-500 hover:text-red-600 border border-neutral-200 hover:border-red-200 rounded-lg py-2 transition-colors">
            <LogOut size={12} />Log out
          </button>
        </div>
      </aside>

      {/* ═══ Main ═══ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
          {activeTab === "account" && <AccountPanel key="account" email={userEmail} createdAt={userCreated} onLogout={handleLogout} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
