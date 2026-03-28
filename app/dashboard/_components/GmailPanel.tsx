"use client";

import { motion } from "framer-motion";
import { Mail, Settings, CheckCircle2, AlertCircle } from "lucide-react";

export default function GmailPanel({ gmailUser, gmailPassword, onGmailUserChange, onGmailPasswordChange, onSave, saving, message }: {
  gmailUser: string; gmailPassword: string;
  onGmailUserChange: (v: string) => void; onGmailPasswordChange: (v: string) => void;
  onSave: (e: React.FormEvent) => void; saving: boolean; message: string | null;
}) {
  const isError = message?.startsWith("error:");
  const msgText = message?.replace(/^(error|success):/, "") ?? null;
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="border-b border-neutral-200 px-6 py-3 shrink-0">
        <h1 className="text-sm font-semibold text-neutral-900">Gmail Settings</h1>
        <p className="text-[11px] text-neutral-400">Connect Gmail to read & send emails through Donna</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg">
          <div className="border border-neutral-200 rounded-xl p-6 mb-5">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <Mail size={16} className="text-neutral-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">Gmail Integration</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Stored privately — only you can see them. Use a Gmail <strong className="text-neutral-600">App Password</strong>, not your real password.
                </p>
              </div>
            </div>
            <form onSubmit={onSave} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Gmail address</label>
                <input type="email" required value={gmailUser} onChange={e => onGmailUserChange(e.target.value)} placeholder="you@gmail.com"
                  className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all placeholder:text-neutral-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">App Password</label>
                <input type="password" required value={gmailPassword} onChange={e => onGmailPasswordChange(e.target.value)} placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all placeholder:text-neutral-300" />
              </div>
              {msgText && (
                <div className={`text-sm px-3 py-2.5 rounded-lg flex items-center gap-2 ${isError ? "bg-red-50 border border-red-200 text-red-600" : "bg-green-50 border border-green-200 text-green-700"}`}>
                  {isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                  {msgText}
                </div>
              )}
              <button type="submit" disabled={saving}
                className="w-full bg-neutral-900 hover:bg-black disabled:opacity-40 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </form>
          </div>
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
              <Settings size={12} className="text-neutral-400" />
              How to get an App Password
            </h4>
            <ol className="text-xs text-neutral-500 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Go to your Google Account → Security</li>
              <li>Enable 2-Step Verification</li>
              <li>Search <strong className="text-neutral-600">App Passwords</strong> in your account settings</li>
              <li>Generate a new app password for &ldquo;Mail&rdquo;</li>
              <li>Paste the 16-character code above</li>
            </ol>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
