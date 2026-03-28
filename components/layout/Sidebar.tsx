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
    <aside className="w-[240px] h-screen flex flex-col bg-slate-950 border-r border-slate-800 shrink-0">
      <div className="px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Brain size={16} className="text-emerald-400" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">Donna</span>
        </Link>
      </div>

      <motion.nav
        className="flex-1 px-3 mt-2"
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
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all mb-1 ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
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
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-medium text-sm">
            D
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Donna User</p>
            <p className="text-xs text-slate-500 truncate">user@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
