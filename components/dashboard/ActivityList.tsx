"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import Badge from "@/components/ui/Badge";

interface Activity {
  name: string;
  action: string;
  time: string;
  status: "sent" | "scheduled" | "draft";
}

const activities: Activity[] = [
  { name: "Sarah Miller", action: "Follow-up email sent", time: "2 min ago", status: "sent" },
  { name: "Team Standup", action: "Meeting scheduled", time: "1 hr ago", status: "scheduled" },
  { name: "Client Report", action: "Draft reviewed by AI", time: "3 hrs ago", status: "draft" },
  { name: "Project Brief", action: "Email composed and sent", time: "5 hrs ago", status: "sent" },
  { name: "Weekly Sync", action: "Calendar invite sent", time: "Yesterday", status: "sent" },
];

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  sent: { label: "Sent", variant: "success" },
  scheduled: { label: "Scheduled", variant: "warning" },
  draft: { label: "Draft", variant: "default" },
};

export default function ActivityList() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-primary text-base font-semibold">Recent Activity</h3>
        <button className="text-accent hover:text-accent-hover text-sm transition-colors">
          View all
        </button>
      </div>

      <motion.div
        className="space-y-1"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {activities.map((a, i) => {
          const s = statusMap[a.status];
          return (
            <motion.div
              key={i}
              variants={staggerItem}
              className="hover:bg-surface flex items-center gap-4 rounded-lg px-3 py-3 transition-colors"
            >
              <div className="bg-accent-light text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {a.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-primary truncate text-sm font-medium">{a.action}</p>
                <p className="text-muted text-xs">
                  {a.name} &middot; {a.time}
                </p>
              </div>
              <Badge variant={s.variant}>{s.label}</Badge>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
