"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, Clock, Sparkles, Bell, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import ActivityList from "@/components/dashboard/ActivityList";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { staggerContainer, staggerItem } from "@/lib/animations";

const RechartsBar = dynamic(
  () =>
    import("recharts").then((mod) => {
      const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
      function Chart({ data }: { data: { day: string; emails: number }[] }) {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E2" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8A9E8A" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8A9E8A" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E2E8E2",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="emails" fill="#16A34A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
      Chart.displayName = "Chart";
      return Chart;
    }),
  { ssr: false, loading: () => <div className="h-[280px] shimmer-bg rounded-lg" /> }
);

const stats = [
  { label: "Emails Sent Today", value: 24, icon: Mail },
  { label: "Meetings Scheduled", value: 8, icon: Calendar },
  { label: "Pending Replies", value: 5, icon: Clock },
  { label: "AI Interactions", value: 142, icon: Sparkles },
];

const weeklyData = [
  { day: "Mon", emails: 12 },
  { day: "Tue", emails: 19 },
  { day: "Wed", emails: 15 },
  { day: "Thu", emails: 22 },
  { day: "Fri", emails: 18 },
  { day: "Sat", emails: 5 },
  { day: "Sun", emails: 3 },
];

const tips = [
  { icon: TrendingUp, text: "Your email response rate increased 12% this week", color: "text-accent" },
  { icon: Sparkles, text: "Try: \"Draft a follow-up for yesterday's meetings\"", color: "text-accent" },
  { icon: Calendar, text: "You have 3 meetings tomorrow — want a summary?", color: "text-accent" },
];

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between px-8 py-6 border-b border-border bg-white sticky top-0 z-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <motion.h1
              className="text-2xl font-semibold text-primary tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {greeting}, John
            </motion.h1>
            <motion.p
              className="text-sm text-muted mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {today}
            </motion.p>
          </div>
          <motion.button
            className="w-10 h-10 rounded-lg border border-border hover:bg-surface flex items-center justify-center text-secondary transition-colors relative"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Bell size={18} />
            <motion.span
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>

        <div className="p-8 space-y-8">
          {/* AI Tips Banner */}
          <motion.div
            className="bg-accent-light/40 border border-accent/10 rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="flex items-start gap-3 flex-1 bg-white/60 rounded-xl p-3 border border-accent/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center shrink-0 mt-0.5">
                    <tip.icon size={14} className={tip.color} />
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">{tip.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} index={i} />
            ))}
          </div>

          {/* Activity + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <ActivityList />
            </div>

            <motion.div
              className="lg:col-span-2 bg-white border border-border rounded-xl p-6 shadow-sm card-glow"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h3 variants={staggerItem} className="text-base font-semibold text-primary mb-5">
                Quick Actions
              </motion.h3>
              <motion.div variants={staggerItem} className="space-y-3 mb-5">
                <Link href="/chat">
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Button className="w-full justify-between">
                      <span className="flex items-center"><Mail size={16} className="mr-2" />Compose email</span>
                      <ArrowUpRight size={14} className="opacity-60" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/chat">
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center"><Calendar size={16} className="mr-2" />Schedule meeting</span>
                      <ArrowUpRight size={14} className="opacity-40" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div variants={staggerItem}>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Ask AI</label>
                <Input placeholder="Ask Donna anything..." icon={<Sparkles size={16} />} />
              </motion.div>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            className="bg-white border border-border rounded-xl p-6 shadow-sm card-glow"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-primary">Email Activity This Week</h3>
              <span className="text-xs text-accent font-medium bg-accent-light px-2.5 py-1 rounded-full">+18% vs last week</span>
            </div>
            <div className="h-[280px]">
              <RechartsBar data={weeklyData} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
