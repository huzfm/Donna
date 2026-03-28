"use client";

import { motion } from "framer-motion";
import { Mail, Settings, CheckCircle2, AlertCircle, Pencil, ShieldCheck, Zap } from "lucide-react";

export default function GmailPanel({
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
  const isConnected = gmailUser && gmailPassword;

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-1 flex-col overflow-hidden bg-[#09090b]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 px-6 py-3.5">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100">Gmail</h1>
            <p className="mt-0.5 text-[11px] text-zinc-600">Connected & ready</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-3">
            {/* Two boxes in a row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Account box */}
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                    <ShieldCheck size={14} className="text-emerald-400" />
                  </div>
                  <button
                    onClick={() => {
                      onGmailUserChange("");
                      onGmailPasswordChange("");
                    }}
                    className="flex items-center gap-1 rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-2.5 py-1 text-[11px] text-zinc-500 transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    <Pencil size={10} />
                    Change
                  </button>
                </div>
                <div>
                  <p className="mb-1 text-[11px] text-zinc-600">Connected account</p>
                  <p className="truncate text-sm font-medium text-zinc-100">{gmailUser}</p>
                  <div className="mt-2 rounded-md bg-zinc-800/50 px-2.5 py-1.5 font-mono text-xs tracking-widest text-zinc-600">
                    {"•".repeat(16)}
                  </div>
                </div>
              </div>

              {/* Capabilities box */}
              <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                  <Zap size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="mb-2.5 text-[11px] text-zinc-600">What Donna can do</p>
                  <ul className="space-y-2">
                    {[
                      "Send emails on your behalf",
                      "Attach Meet links automatically",
                      "Use your address as sender",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                        <CheckCircle2 size={11} className="shrink-0 text-emerald-500" />
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden bg-[#09090b]"
    >
      <div className="shrink-0 border-b border-zinc-800/80 px-6 py-3.5">
        <h1 className="text-sm font-semibold text-zinc-100">Gmail</h1>
        <p className="mt-0.5 text-[11px] text-zinc-600">Connect to send emails through Donna</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-3">
          {/* Two boxes in a row */}
          <div className="grid grid-cols-2 items-start gap-3">
            {/* Form box */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                  <Mail size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Connect Gmail</p>
                  <p className="text-[11px] text-zinc-600">Stored privately & securely</p>
                </div>
              </div>

              <form onSubmit={onSave} className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                    Gmail address
                  </label>
                  <input
                    type="email"
                    required
                    value={gmailUser}
                    onChange={(e) => onGmailUserChange(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-100 transition-all outline-none placeholder:text-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                    App Password
                  </label>
                  <input
                    type="password"
                    required
                    value={gmailPassword}
                    onChange={(e) => onGmailPasswordChange(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-100 transition-all outline-none placeholder:text-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600"
                  />
                </div>

                {msgText && (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                      isError
                        ? "border border-red-500/20 bg-red-500/10 text-red-400"
                        : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {isError ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                    {msgText}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-1 w-full rounded-lg bg-zinc-100 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-30"
                >
                  {saving ? "Connecting…" : "Connect Gmail"}
                </button>
              </form>
            </div>

            {/* How to guide box */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
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
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-semibold text-zinc-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-zinc-300">{item.step}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-600">{item.desc}</p>
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
