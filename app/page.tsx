"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface UploadedFile {
  file_name: string;
  uploaded_at: string; // ISO string
}

/** Return a short "2h ago" / "Just now" label */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** Pick an emoji icon by file extension */
function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "📄";
  if (ext === "doc" || ext === "docx") return "📝";
  if (ext === "xls" || ext === "xlsx" || ext === "csv") return "📊";
  return "📃";
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Files from DB + freshly uploaded this session
  const [savedFiles, setSavedFiles] = useState<UploadedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [gmailUser, setGmailUser] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // ─── On mount: load user, their files, and Gmail settings ───────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) =>
      setUserEmail(user?.email ?? null)
    );

    // Fetch user's previously uploaded files
    fetch("/api/upload")
      .then((r) => r.json())
      .then(({ files }) => {
        if (Array.isArray(files)) setSavedFiles(files);
      })
      .finally(() => setFilesLoading(false));

    // Fetch saved Gmail creds
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

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ─── Save Gmail settings ─────────────────────────────────────────────────────
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
        setSettingsMsg(`❌ ${data.error}`);
      } else {
        setSettingsMsg("✅ Saved!");
        setTimeout(() => setShowSettings(false), 800);
      }
    } catch {
      setSettingsMsg("❌ Failed to save");
    } finally {
      setSettingsSaving(false);
    }
  };

  // ─── Upload ──────────────────────────────────────────────────────────────────
  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Upload failed"); return; }

      // Prepend to the local list immediately (no refetch needed)
      const newEntry: UploadedFile = {
        file_name: file.name,
        uploaded_at: new Date().toISOString(),
      };
      setSavedFiles((prev) => {
        // Remove any old entry for the same filename, then prepend
        const filtered = prev.filter((f) => f.file_name !== file.name);
        return [newEntry, ...filtered];
      });
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ─── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!question.trim()) return;
    const userMsg = question;
    setQuestion("");
    setChat((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Query failed"); return; }
      setChat((prev) => [...prev, { role: "assistant", content: data.answer }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* ══ Sidebar ══════════════════════════════════════════════════════════ */}
      <div className="w-72 border-r border-gray-800 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold">🧠 AI Brain</h1>
        </div>

        {/* Upload zone */}
        <div className="p-4">
          <label className="block border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
              className="hidden"
              multiple
              onChange={(e) => Array.from(e.target.files || []).forEach(handleUpload)}
            />
            <div className="text-2xl mb-1">📁</div>
            <div className="text-sm text-gray-400">
              {uploading
                ? <span className="text-blue-400 animate-pulse">Uploading…</span>
                : "Click to upload files"}
            </div>
            <div className="text-xs text-gray-600 mt-1">PDF · Word · Excel · CSV · TXT</div>
          </label>
        </div>

        {/* ── My Files ── */}
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>My Files</span>
            {savedFiles.length > 0 && (
              <span className="bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">
                {savedFiles.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {filesLoading ? (
            // Skeleton placeholders
            [1, 2, 3].map((n) => (
              <div key={n} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
            ))
          ) : savedFiles.length === 0 ? (
            <div className="text-xs text-gray-600 text-center py-6">
              No files yet.<br />Upload one to get started.
            </div>
          ) : (
            savedFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-gray-900 hover:bg-gray-800 rounded-lg px-3 py-2 transition group"
                title={f.file_name}
              >
                <span className="text-base mt-0.5 shrink-0">{fileIcon(f.file_name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-200 truncate font-medium">
                    {f.file_name}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-0.5">
                    {timeAgo(f.uploaded_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Bottom controls ── */}
        <div className="border-t border-gray-800 p-4 space-y-3">
          <button
            onClick={() => { setSettingsMsg(null); setShowSettings(true); }}
            className="flex items-center gap-2 w-full text-sm text-gray-400 hover:text-white transition px-2 py-2 rounded-lg hover:bg-gray-800"
          >
            ⚙️ Gmail Settings
          </button>

          {userEmail && (
            <div className="text-xs text-gray-500 truncate px-2" title={userEmail}>
              👤 {userEmail}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg py-2 transition"
          >
            Log out
          </button>
        </div>
      </div>

      {/* ══ Chat area ═════════════════════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden">

        <div className="border-b border-gray-800 px-6 py-3 text-sm text-gray-400 shrink-0">
          {savedFiles.length > 0
            ? `${savedFiles.length} file(s) in your knowledge base — ask anything`
            : "Upload files to get started, or ask me to check your emails"}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chat.length === 0 && (
            <div className="text-center text-gray-600 mt-20">
              <div className="text-4xl mb-3">🧠</div>
              <div className="text-sm">Ask a question about your documents</div>
              <div className="text-xs mt-2 text-gray-700">
                e.g. &quot;Summarise my resume&quot; · &quot;Check my emails&quot; · &quot;Send a mail to x@y.com&quot;
              </div>
            </div>
          )}

          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl text-sm text-gray-400 animate-pulse">
                🤖 Thinking…
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-gray-800 p-4 flex gap-2 shrink-0">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your files · Check my emails · Send a mail to x@email.com"
            className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 rounded-xl text-sm font-medium transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* ══ Settings Modal ════════════════════════════════════════════════════ */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">⚙️ Gmail Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              Credentials are stored privately — only you can see them.<br />
              Use a Gmail <strong className="text-gray-300">App Password</strong>, not your real password.
            </p>

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Gmail address</label>
                <input
                  type="email"
                  required
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">App Password</label>
                <input
                  type="password"
                  required
                  value={gmailPassword}
                  onChange={(e) => setGmailPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              {settingsMsg && (
                <div
                  className={`text-sm px-3 py-2 rounded-lg ${
                    settingsMsg.startsWith("✅")
                      ? "bg-green-900/40 text-green-300"
                      : "bg-red-900/40 text-red-300"
                  }`}
                >
                  {settingsMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={settingsSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
              >
                {settingsSaving ? "Saving…" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}