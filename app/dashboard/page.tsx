"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Mail,
  User,
  Send,
  Upload,
  Paperclip,
  Brain,
  LogOut,
  Trash2,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface UploadedFile {
  file_name: string;
  uploaded_at: string;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText size={16} className="text-red-400" />;
  if (ext === "doc" || ext === "docx") return <FileText size={16} className="text-blue-400" />;
  if (ext === "xls" || ext === "xlsx" || ext === "csv") return <FileText size={16} className="text-emerald-400" />;
  return <FileText size={16} className="text-slate-400" />;
}

type TabId = "chat" | "files" | "gmail" | "account";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "files", label: "Files", icon: FileText },
  { id: "gmail", label: "Gmail Settings", icon: Mail },
  { id: "account", label: "Account", icon: User },
];

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const supabase = createClient();
  const router = useRouter();

  // User state
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCreated, setUserCreated] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextMsgId = useRef(1);

  // Files state
  const [savedFiles, setSavedFiles] = useState<UploadedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gmail settings state
  const [gmailUser, setGmailUser] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
      setUserCreated(user?.created_at ?? null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ── Chat ──
  const sendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: nextMsgId.current++,
      role: "user",
      content: chatInput.trim(),
      timestamp: timeNow(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const question = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Query failed");

      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId.current++,
          role: "assistant",
          content: data.answer,
          timestamp: timeNow(),
        },
      ]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        {
          id: nextMsgId.current++,
          role: "assistant",
          content: `Sorry, I encountered an error: ${errMsg}`,
          timestamp: timeNow(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput]);

  // ── Upload ──
  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }
      const newEntry: UploadedFile = {
        file_name: file.name,
        uploaded_at: new Date().toISOString(),
      };
      setSavedFiles((prev) => {
        const filtered = prev.filter((f) => f.file_name !== file.name);
        return [newEntry, ...filtered];
      });
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Gmail settings ──
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
      if (!res.ok) {
        setSettingsMsg(`error:${data.error}`);
      } else {
        setSettingsMsg("success:Settings saved successfully");
      }
    } catch {
      setSettingsMsg("error:Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-slate-800 flex flex-col shrink-0 bg-slate-950">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Brain size={18} className="text-emerald-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Donna</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {active && (
                  <ChevronRight size={14} className="ml-auto opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-800 p-4">
          {userEmail && (
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-medium text-sm shrink-0">
                {userEmail[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200 truncate">{userEmail}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center text-xs text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-700/50 rounded-xl py-2.5 transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <ChatPanel
              key="chat"
              messages={messages}
              input={chatInput}
              onInputChange={setChatInput}
              onSend={sendMessage}
              loading={chatLoading}
              chatEndRef={chatEndRef}
              fileInputRef={fileInputRef}
              onFileSelect={(e) => {
                const files = e.target.files;
                if (files) Array.from(files).forEach(handleUpload);
                e.target.value = "";
              }}
              fileCount={savedFiles.length}
            />
          )}
          {activeTab === "files" && (
            <FilesPanel
              key="files"
              files={savedFiles}
              filesLoading={filesLoading}
              uploading={uploading}
              onUpload={handleUpload}
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
          {activeTab === "account" && (
            <AccountPanel
              key="account"
              email={userEmail}
              createdAt={userCreated}
              onLogout={handleLogout}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Chat Panel                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  chatEndRef,
  fileInputRef,
  onFileSelect,
  fileCount,
}: {
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 bg-slate-950/50">
        <div>
          <h1 className="text-lg font-semibold">Chat</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {fileCount > 0
              ? `${fileCount} file(s) in your knowledge base`
              : "Upload files to get started, or ask about your emails"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Brain size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Ask Donna anything</h2>
            <p className="text-sm text-slate-500 max-w-sm">
              Ask about your documents, check emails, or send messages — all through natural conversation.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-md">
              {[
                "Summarize my resume",
                "Check my emails",
                "Send a mail to team",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onInputChange(prompt)}
                  className="text-xs border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm"
                  : "bg-slate-800 text-slate-200 rounded-tl-sm"
              }`}
            >
              {msg.content}
              <div className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-emerald-200/60" : "text-slate-500"}`}>
                {msg.timestamp}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-slate-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/50 shrink-0">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 focus-within:border-emerald-500/40 transition-all">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-500 hover:text-emerald-400 transition-colors"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv"
            multiple
            onChange={onFileSelect}
          />
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask about your files, check emails, send a message..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Files Panel                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

function FilesPanel({
  files,
  filesLoading,
  uploading,
  onUpload,
}: {
  files: UploadedFile[];
  filesLoading: boolean;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 bg-slate-950/50">
        <div>
          <h1 className="text-lg font-semibold">Files</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your uploaded documents and knowledge base
          </p>
        </div>
        <label className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl cursor-pointer transition-colors">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
            multiple
            onChange={(e) => Array.from(e.target.files || []).forEach(onUpload)}
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Upload drop zone */}
        <label className="block border-2 border-dashed border-slate-700 hover:border-emerald-500/40 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 group">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
            className="hidden"
            multiple
            onChange={(e) => Array.from(e.target.files || []).forEach(onUpload)}
          />
          <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 transition-colors">
            <Upload size={22} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-sm text-slate-400 mb-1">
            {uploading ? (
              <span className="text-emerald-400 animate-pulse">Processing files...</span>
            ) : (
              "Click to upload or drag files here"
            )}
          </p>
          <p className="text-xs text-slate-600">PDF, Word, Excel, CSV, TXT</p>
        </label>

        {/* Files list */}
        <div className="space-y-2">
          {filesLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 shimmer-bg rounded-xl" />
            ))
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No files uploaded yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Upload documents to build your knowledge base
              </p>
            </div>
          ) : (
            files.map((f, i) => (
              <motion.div
                key={`${f.file_name}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl px-5 py-4 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  {fileIcon(f.file_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {f.file_name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock size={10} className="text-slate-600" />
                    <span className="text-xs text-slate-500">{timeAgo(f.uploaded_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 size={14} />
                  <span className="text-xs">Indexed</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Gmail Settings Panel                                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

function GmailPanel({
  gmailUser,
  gmailPassword,
  onGmailUserChange,
  onGmailPasswordChange,
  onSave,
  saving,
  message,
}: {
  gmailUser: string;
  gmailPassword: string;
  onGmailUserChange: (v: string) => void;
  onGmailPasswordChange: (v: string) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
  message: string | null;
}) {
  const isError = message?.startsWith("error:");
  const msgText = message?.replace(/^(error|success):/, "") ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <div className="border-b border-slate-800 px-6 py-4 shrink-0 bg-slate-950/50">
        <h1 className="text-lg font-semibold">Gmail Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your Gmail to read and send emails through Donna
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Gmail Integration</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Credentials are stored privately — only you can see them.
                  Use a Gmail <strong className="text-slate-300">App Password</strong>, not your real password.
                </p>
              </div>
            </div>

            <form onSubmit={onSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Gmail address</label>
                <input
                  type="email"
                  required
                  value={gmailUser}
                  onChange={(e) => onGmailUserChange(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">App Password</label>
                <input
                  type="password"
                  required
                  value={gmailPassword}
                  onChange={(e) => onGmailPasswordChange(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                />
              </div>

              {msgText && (
                <div
                  className={`text-sm px-4 py-3 rounded-xl flex items-center gap-2 ${
                    isError
                      ? "bg-red-500/10 border border-red-500/20 text-red-300"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                  {msgText}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-500/10"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-5">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Settings size={14} className="text-slate-500" />
              How to get an App Password
            </h4>
            <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Go to your Google Account security settings</li>
              <li>Enable 2-Step Verification if not already enabled</li>
              <li>Search for &ldquo;App Passwords&rdquo; in your account settings</li>
              <li>Generate a new app password for &ldquo;Mail&rdquo;</li>
              <li>Paste the 16-character code above</li>
            </ol>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Account Panel                                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

function AccountPanel({
  email,
  createdAt,
  onLogout,
}: {
  email: string | null;
  createdAt: string | null;
  onLogout: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <div className="border-b border-slate-800 px-6 py-4 shrink-0 bg-slate-950/50">
        <h1 className="text-lg font-semibold">Account</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your account details</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg">
          {/* Profile card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-2xl font-bold shrink-0">
                {email?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{email ?? "—"}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {createdAt
                    ? `Member since ${new Date(createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <p className="text-sm text-slate-200">{email ?? "—"}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Authentication
                </label>
                <p className="text-sm text-slate-200">Email &amp; Password (Supabase)</p>
              </div>
              {createdAt && (
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Account Created
                  </label>
                  <p className="text-sm text-slate-200">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="border border-red-900/30 rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
              <AlertCircle size={14} />
              Session
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Sign out of your current session on this device.
            </p>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
