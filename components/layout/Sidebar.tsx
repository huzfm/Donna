"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Settings, Brain } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
            <Brain size={16} className="text-emerald-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white font-doto">Donna</span>
        </Link>
      </div>

      <motion.nav
        className="mt-2 flex-1 px-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <motion.div key={item.label} variants={staggerItem}>
              <Link
                href={item.href}
                className={`group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <motion.div whileHover={{ x: active ? 0 : 2 }} transition={{ duration: 0.15 }}>
                  <item.icon size={18} />
                </motion.div>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-medium text-emerald-400">
            D
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">Donna User</p>
            <p className="truncate text-xs text-slate-500">user@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
