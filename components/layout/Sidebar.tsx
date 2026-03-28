"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { staggerContainer, staggerItem, springSoft } from "@/lib/animations";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springSoft}
      className="flex h-screen w-[240px] shrink-0 flex-col border-r border-slate-200 bg-slate-50"
    >
      <div className="px-5 py-5">
        <BrandLogo size="md" href="/" />
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
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                    : "border border-transparent text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <motion.span
                  animate={active ? { scale: [1, 1.06, 1] } : {}}
                  transition={{ duration: 0.35 }}
                >
                  <item.icon
                    size={18}
                    className={
                      active ? "text-emerald-600" : "text-slate-500 transition-colors group-hover:text-slate-800"
                    }
                  />
                </motion.span>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      <motion.div
        className="border-t border-slate-200 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-sm ring-2 ring-white">
            D
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">Donna User</p>
            <p className="truncate text-xs text-slate-500">user@email.com</p>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}
