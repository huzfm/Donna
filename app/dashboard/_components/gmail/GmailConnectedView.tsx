"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  UserCircle,
  Zap,
  ShieldCheck,
  Activity,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import { lazy, Suspense } from "react";

const DEMO_WEEKLY = [
  { day: "Mon", sent: 4, received: 12 },
  { day: "Tue", sent: 7, received: 9 },
  { day: "Wed", sent: 3, received: 15 },
  { day: "Thu", sent: 6, received: 11 },
  { day: "Fri", sent: 5, received: 8 },
  { day: "Sat", sent: 1, received: 3 },
  { day: "Sun", sent: 0, received: 2 },
];

function EmailChart() {
  const {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
  } = require("recharts");
  return (
    <div className="h-45 min-h-45 min-w-0 sm:h-50">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={DEMO_WEEKLY}
          barGap={2}
          margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
        >
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
          <Bar dataKey="received" name="Received" fill="#334155" radius={[6, 6, 0, 0]} barSize={16} />
          <Bar dataKey="sent" name="Sent" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const LazyEmailChart = lazy(() => Promise.resolve({ default: EmailChart }));

interface GmailConnectedViewProps {
  gmailUser: string;
  onGmailUserChange: (v: string) => void;
  onGmailPasswordChange: (v: string) => void;
  onRemoveGmail: () => void;
  onChangeGmail: () => void;
  removing: boolean;
  message: string | null;
}

export default function GmailConnectedView({
  gmailUser,
  onRemoveGmail,
  onChangeGmail,
  removing,
  message,
}: GmailConnectedViewProps) {
  const isError = message?.startsWith("error:");
  const msgText = message?.replace(/^(error|success):/, "") ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden bg-transparent"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 py-4 pr-4 pl-14 backdrop-blur-md sm:pr-6 md:pl-6">
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
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-900" />
          Active
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

          {/* Message */}
          {msgText && (
            <div className={`mb-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${
              isError
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}>
              {isError
                ? <AlertCircle size={14} className="shrink-0" />
                : <CheckCircle2 size={14} className="shrink-0" />}
              {msgText}
            </div>
          )}

          {/* Stat cards */}
          <div className="xs:grid-cols-3 mb-6 grid grid-cols-1 gap-3">
            {[
              { label: "Account", value: gmailUser, icon: UserCircle },
            
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
              >
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
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

          {/* Chart + account card */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Chart */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 md:col-span-3">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-black">
                    <Activity size={13} strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Email activity</p>
                    <p className="text-[10px] text-slate-500">Demo preview</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-900" />
                    Received
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                    Sent
                  </span>
                </div>
              </div>
              <Suspense
                fallback={
                  <div className="flex h-[200px] items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-slate-400" />
                  </div>
                }
              >
                <LazyEmailChart />
              </Suspense>
            </div>

            {/* Account card */}
            <div className="flex flex-col gap-4 md:col-span-2">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    Connected account
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Change → flips to disconnected form with email pre-filled */}
                    <button
                      type="button"
                      onClick={onChangeGmail}
                      disabled={removing}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-black disabled:opacity-50"
                    >
                      <Pencil size={9} />
                      Change
                    </button>
                    {/* Remove → deletes from DB and flips to disconnected */}
                    <button
                      type="button"
                      onClick={onRemoveGmail}
                      disabled={removing}
                      className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-800 transition-all hover:border-red-300 hover:bg-red-100 disabled:opacity-50"
                    >
                      {removing
                        ? <Loader2 size={9} className="animate-spin" />
                        : <Trash2 size={9} />}
                      Remove
                    </button>
                  </div>
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
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}