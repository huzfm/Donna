"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Settings,
  CheckCircle2,
  AlertCircle,
  Pencil,
  ShieldCheck,
  Zap,
  Activity,
  Send,
  Link2,
  UserCircle,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DEMO_WEEKLY = [
  { day: "Mon", sent: 4, received: 12 },
  { day: "Tue", sent: 7, received: 9 },
  { day: "Wed", sent: 3, received: 15 },
  { day: "Thu", sent: 6, received: 11 },
  { day: "Fri", sent: 5, received: 8 },
  { day: "Sat", sent: 1, received: 3 },
  { day: "Sun", sent: 0, received: 2 },
];

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

  /* ═══════════ Connected State ═══════════ */
  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-1 flex-col overflow-hidden bg-transparent"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 pl-14 md:pl-6 pr-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-black ring-1 ring-slate-300/60">
              <Mail size={15} strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
                Gmail
              </h1>
              <p className="text-[11px] text-slate-500">Connected &amp; ready</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-black">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-1000" />
            Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-6 py-6">
            {/* Quick stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { label: "Account", value: gmailUser, icon: UserCircle },
                { label: "Capabilities", value: "3 actions", icon: Zap },
                { label: "Status", value: "Active", icon: ShieldCheck },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-black">
                      <stat.icon size={13} strokeWidth={2.5} />
                    </span>
                    <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                      {stat.label}
                    </p>
                  </div>
                  <p className="truncate text-sm font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Main content: Chart + Capabilities side by side */}
            <div className="grid grid-cols-5 gap-4">
              {/* Chart — 3/5 */}
              <div className="col-span-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-black">
                      <Activity size={13} strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Email activity</p>
                      <p className="text-[10px] text-slate-500">Sample weekly overview</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <span className="inline-block h-2 w-2 rounded-full bg-slate-1000" />
                      Received
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <span className="inline-block h-2 w-2 rounded-full bg-teal-400" />
                      Sent
                    </span>
                  </div>
                </div>
                <div className="h-[200px] min-h-[200px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_WEEKLY} barGap={2} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, "dataMax + 4"]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          fontSize: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        }}
                      />
                      <Bar dataKey="received" name="Received" fill="#10b981" radius={[6, 6, 0, 0]} barSize={16} />
                      <Bar dataKey="sent" name="Sent" fill="#5eead4" radius={[6, 6, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right column — 2/5 */}
              <div className="col-span-2 flex flex-col gap-4">
                {/* Account card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                      Connected account
                    </p>
                    <button
                      type="button"
                      onClick={() => { onGmailUserChange(""); onGmailPasswordChange(""); }}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-black"
                    >
                      <Pencil size={9} />
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm shadow-slate-300/20">
                      {gmailUser[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{gmailUser}</p>
                      <p className="font-mono text-[10px] tracking-widest text-slate-400">
                        {"•".repeat(16)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Capabilities card */}
                <div className="flex-1 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    Capabilities
                  </p>
                  <ul className="space-y-3">
                    {[
                      { text: "Send emails on your behalf", icon: Send },
                      { text: "Attach Meet links automatically", icon: Link2 },
                      { text: "Use your address as sender", icon: UserCircle },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-300">
                          <item.icon size={12} className="text-black" />
                        </span>
                        <span className="text-xs font-medium text-slate-700">{item.text}</span>
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

  /* ═══════════ Disconnected State ═══════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden bg-transparent"
    >
      <div className="shrink-0 border-b border-slate-200/90 bg-white/60 pl-14 md:pl-6 pr-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 ring-1 ring-slate-200/60">
            <Mail size={15} strokeWidth={2} />
          </span>
          <div>
            <h1 className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
              Gmail
            </h1>
            <p className="text-[11px] text-slate-500">Connect to send emails through Donna</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">

          {/* Hero prompt */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 ring-1 ring-slate-300/60">
              <Mail size={24} className="text-black" />
            </div>
            <h2 className="font-(family-name:--font-doto) text-xl font-black tracking-tight text-slate-950">
              Connect your Gmail
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Link your Gmail account so Donna can send emails, attach calendar links, and manage your inbox — all from chat.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-5">
            {/* Form — 3/5 */}
            <div className="col-span-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 ring-1 ring-slate-300/60">
                  <ShieldCheck size={14} className="text-black" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Credentials</p>
                  <p className="text-[11px] text-slate-500">Stored securely per-session</p>
                </div>
              </div>

              <form onSubmit={onSave} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
                    Gmail address
                  </label>
                  <input
                    type="email"
                    required
                    value={gmailUser}
                    onChange={(e) => onGmailUserChange(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300/15"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
                    App password
                  </label>
                  <input
                    type="password"
                    required
                    value={gmailPassword}
                    onChange={(e) => onGmailPasswordChange(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300/15"
                  />
                </div>

                {msgText && (
                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium ${
                      isError
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : "border border-slate-300 bg-slate-100 text-black"
                    }`}
                  >
                    {isError ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
                    {msgText}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-300/25 transition-all hover:ring-2 hover:ring-slate-300/20 disabled:opacity-30"
                >
                  {saving ? "Connecting…" : (
                    <>Connect Gmail <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </div>

            {/* Steps guide — 2/5 */}
            <div className="col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 ring-1 ring-slate-300/60">
                  <Settings size={14} className="text-black" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Setup guide</p>
                  <p className="text-[11px] text-slate-500">5 quick steps</p>
                </div>
              </div>

              <ol className="space-y-4">
                {[
                  { step: "Google Account", desc: "Go to Security settings" },
                  { step: "2-Step Verification", desc: "Enable if not already on" },
                  { step: "App Passwords", desc: "Search in account settings" },
                  { step: "Generate", desc: 'Create one for "Mail"' },
                  { step: "Paste", desc: "Enter the 16-char code above" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-black ring-1 ring-slate-300/60">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{item.step}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.desc}</p>
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
