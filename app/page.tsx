"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [gmailUser, setGmailUser] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Load user session + saved Gmail settings
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });

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

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Save Gmail settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmail_user: gmailUser,
          gmail_app_password: gmailPassword,
        }),
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

  // 📄 Upload
  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Upload failed"); return; }
      setUploadedFiles((prev) => [...prev, file.name]);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 💬 Ask
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

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* ── Sidebar ── */}
      <div className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">

        {/* Brand */}
        <h1 className="text-lg font-bold">🧠 AI Brain</h1>

        {/* Upload Box */}
        <label className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
            className="hidden"
            multiple
            onChange={(e) => {
              Array.from(e.target.files || []).forEach((f) => handleUpload(f));
            }}
          />
          <div className="text-2xl mb-1">📁</div>
          <div className="text-sm text-gray-400">
            {uploading ? (
              <span className="text-blue-400">Uploading...</span>
            ) : (
              "Click to upload files"
            )}
          </div>
          <div className="text-xs text-gray-600 mt-1">PDF, Word, Excel, CSV, TXT</div>
        </label>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Uploaded</div>
            {uploadedFiles.map((name, i) => (
              <div key={i} className="text-xs text-green-400 bg-gray-900 rounded px-2 py-1 truncate">
                ✅ {name}
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <button
            onClick={() => setUploadedFiles([])}
            className="text-xs text-red-400 hover:text-red-300 text-left"
          >
            Clear list
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Settings button */}
        <button
          onClick={() => { setSettingsMsg(null); setShowSettings(true); }}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-2 py-2 rounded-lg hover:bg-gray-800"
        >
          ⚙️ Gmail Settings
        </button>

        {/* User + Logout */}
        <div className="border-t border-gray-800 pt-3 space-y-2">
          {userEmail && (
            <div className="text-xs text-gray-500 truncate" title={userEmail}>
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

      {/* ── Chat Area ── */}
      <div className="flex flex-col flex-1">
        <div className="border-b border-gray-800 px-6 py-3 text-sm text-gray-400">
          {uploadedFiles.length > 0
            ? `${uploadedFiles.length} file(s) loaded — ask anything`
            : "Upload files to get started, or ask me to send an email"}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chat.length === 0 && (
            <div className="text-center text-gray-600 mt-20">
              <div className="text-4xl mb-3">🧠</div>
              <div className="text-sm">Upload a file and ask a question</div>
              <div className="text-xs mt-2 text-gray-700">
                e.g. &quot;What is the total in the Excel sheet?&quot; or &quot;Check my emails&quot;
              </div>
            </div>
          )}

          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
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
                🤖 Thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-gray-800 p-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your files, or: Check my emails / Send a mail to x@email.com"
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

      {/* ── Settings Modal ── */}
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
              These credentials are stored privately — only you can see them.<br />
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
                <div className={`text-sm px-3 py-2 rounded-lg ${settingsMsg.startsWith("✅") ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>
                  {settingsMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={settingsSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
              >
                {settingsSaving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}