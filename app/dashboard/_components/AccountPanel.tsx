"use client";

import { motion } from "framer-motion";
import { AlertCircle, LogOut } from "lucide-react";

export default function AccountPanel({ email, createdAt, onLogout }: { email: string | null; createdAt: string | null; onLogout: () => void; }) {
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="border-b border-neutral-200 px-6 py-3 shrink-0">
        <h1 className="text-sm font-semibold text-neutral-900">Account</h1>
        <p className="text-[11px] text-neutral-400">Manage your account details</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg">
          <div className="border border-neutral-200 rounded-xl p-6 mb-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {email?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 truncate">{email ?? "—"}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {createdAt ? `Member since ${new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : ""}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Email Address", value: email ?? "—" },
                { label: "Authentication", value: "Email / Password (Supabase)" },
                ...(createdAt ? [{ label: "Account Created", value: new Date(createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) }] : []),
              ].map(row => (
                <div key={row.label} className="bg-neutral-50 border border-neutral-100 rounded-lg px-4 py-2.5">
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">{row.label}</label>
                  <p className="text-sm text-neutral-800">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-red-200 rounded-xl p-5 bg-red-50/30">
            <h4 className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1.5">
              <AlertCircle size={12} /> Danger Zone
            </h4>
            <p className="text-xs text-neutral-500 mb-3">Sign out of your current session on this device.</p>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 text-red-600 px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
