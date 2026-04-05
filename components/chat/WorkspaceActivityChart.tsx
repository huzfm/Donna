"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import { chatStaggerItem } from "@/lib/animations";

/** Demo series   placeholder for future real usage metrics */
const WEEKLY = [
  { day: "Mon", queries: 3 },
  { day: "Tue", queries: 5 },
  { day: "Wed", queries: 4 },
  { day: "Thu", queries: 8 },
  { day: "Fri", queries: 6 },
  { day: "Sat", queries: 2 },
  { day: "Sun", queries: 4 },
];

export default function WorkspaceActivityChart() {
  return (
    <motion.div
      variants={chatStaggerItem}
      className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-100/80 bg-white/95 shadow-[0_4px_28px_-8px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/[0.05] backdrop-blur-md"
    >
      <div className="flex items-center justify-center gap-2 border-b border-slate-100/90 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <Activity size={14} strokeWidth={2.5} />
        </span>
        <div className="text-left">
          <p className="text-[10px] font-semibold tracking-wider text-slate-600 uppercase">
            Workspace pulse
          </p>
          <p className="text-[11px] text-slate-400">Sample weekly activity</p>
        </div>
      </div>
      <div className="h-[168px] min-h-[168px] w-full min-w-0 px-2 pt-1 pb-3">
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
          <AreaChart data={WEEKLY} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chatAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, "dataMax + 2"]} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase" }}
            />
            <Area
              type="monotone"
              dataKey="queries"
              name="Queries"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#chatAreaFill)"
              dot={{ r: 3, fill: "#059669", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
