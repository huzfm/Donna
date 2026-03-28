"use client";

import { motion } from "framer-motion";
import { Mail, Settings, CheckCircle2, AlertCircle, Pencil, ShieldCheck, Zap } from "lucide-react";

export default function GmailPanel({
  gmailUser, gmailPassword, onGmailUserChange, onGmailPasswordChange,
  onSave, saving, message
}: {
  gmailUser: string; gmailPassword: string;
  onGmailUserChange: (v: string) => void; onGmailPasswordChange: (v: string) => void;
  onSave: (e: React.FormEvent) => void; saving: boolean; message: string | null;
}) {
  const isError = message?.startsWith("error:");
  const msgText = message?.replace(/^(error|success):/, "") ?? null;
  const isConnected = gmailUser && gmailPassword;

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col flex-1 overflow-hidden bg-[#09090b]"
      >
        <div className="border-b border-zinc-800/80 px-6 py-3.5 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100">Gmail</h1>
            <p className="text-[11px] text-zinc-600 mt-0.5">Connected & ready</p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-3">

            {/* Two boxes in a row */}
            <div className="grid grid-cols-2 gap-3">

              {/* Account box */}
              <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-emerald-400" />
                  </div>
                  <button
                    onClick={() => { onGmailUserChange(""); onGmailPasswordChange(""); }}
                    className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-200 border border-zinc-700/60 hover:border-zinc-500 bg-zinc-800/40 hover:bg-zinc-800 px-2.5 py-1 rounded-lg transition-all"
                  >
                    <Pencil size={10} />
                    Change
                  </button>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-600 mb-1">Connected account</p>
                  <p className="text-sm font-medium text-zinc-100 truncate">{gmailUser}</p>
                  <div className="mt-2 bg-zinc-800/50 rounded-md px-2.5 py-1.5 text-xs text-zinc-600 font-mono tracking-widest">
                    {"•".repeat(16)}
                  </div>
                </div>
              </div>

              {/* Capabilities box */}
              <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Zap size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-600 mb-2.5">What Donna can do</p>
                  <ul className="space-y-2">
                    {[
                      "Send emails on your behalf",
                      "Attach Meet links automatically",
                      "Use your address as sender",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                        <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col flex-1 overflow-hidden bg-[#09090b]"
    >
      <div className="border-b border-zinc-800/80 px-6 py-3.5 shrink-0">
        <h1 className="text-sm font-semibold text-zinc-100">Gmail</h1>
        <p className="text-[11px] text-zinc-600 mt-0.5">Connect to send emails through Donna</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-3">

          {/* Two boxes in a row */}
          <div className="grid grid-cols-2 gap-3 items-start">

            {/* Form box */}
            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Connect Gmail</p>
                  <p className="text-[11px] text-zinc-600">Stored privately & securely</p>
                </div>
              </div>

              <form onSubmit={onSave} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                    Gmail address
                  </label>
                  <input
                    type="email" required value={gmailUser}
                    onChange={e => onGmailUserChange(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600 transition-all placeholder:text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                    App Password
                  </label>
                  <input
                    type="password" required value={gmailPassword}
                    onChange={e => onGmailPasswordChange(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600 transition-all placeholder:text-zinc-700"
                  />
                </div>

                {msgText && (
                  <div className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                    isError
                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  }`}>
                    {isError ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                    {msgText}
                  </div>
                )}

                <button
                  type="submit" disabled={saving}
                  className="w-full bg-zinc-100 hover:bg-white disabled:opacity-30 text-zinc-900 py-2 rounded-lg text-sm font-semibold transition-colors mt-1"
                >
                  {saving ? "Connecting…" : "Connect Gmail"}
                </button>
              </form>
            </div>

            {/* How to guide box */}
            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <Settings size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">App Password</p>
                  <p className="text-[11px] text-zinc-600">How to get one</p>
                </div>
              </div>

              <ol className="space-y-3">
                {[
                  { step: "Google Account", desc: "Go to Security settings" },
                  { step: "2-Step Verification", desc: "Enable if not already on" },
                  { step: "App Passwords", desc: "Search in your account settings" },
                  { step: "Generate", desc: `Create one for "Mail"` },
                  { step: "Paste", desc: "Enter the 16-character code" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 font-semibold mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-zinc-300">{item.step}</p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}