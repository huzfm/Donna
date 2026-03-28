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
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-primary">Recent Activity</h3>
        <button className="text-sm text-accent hover:text-accent-hover transition-colors">
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
              className="flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-surface transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center text-accent font-medium text-sm shrink-0">
                {a.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{a.action}</p>
                <p className="text-xs text-muted">{a.name} &middot; {a.time}</p>
              </div>
              <Badge variant={s.variant}>{s.label}</Badge>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
