"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Settings, label: "Settings", href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen flex flex-col bg-surface border-r border-border shrink-0">
      <div className="px-5 py-5">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2C8 2 4 6 4 11c0 4 2 7 5 9l1 6h8l1-6c3-2 5-5 5-9 0-5-4-9-10-9z"
              fill="#16A34A"
              opacity="0.15"
            />
            <path
              d="M14 4c-4.5 0-8 3.2-8 7.5 0 3.2 2 5.8 4.8 7l.2.1v.4l.8 5h4.4l.8-5v-.4l.2-.1c2.8-1.2 4.8-3.8 4.8-7C22 7.2 18.5 4 14 4z"
              stroke="#16A34A"
              strokeWidth="1.5"
              fill="none"
            />
            <path d="M12 17h4M11 20h6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-lg font-semibold text-primary tracking-tight">Donna</span>
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
            <motion.div key={item.href} variants={staggerItem}>
              <Link
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1 ${
                  active
                    ? "bg-accent-light text-accent border-l-2 border-accent"
                    : "text-secondary hover:text-primary hover:bg-surface-2"
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

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent font-medium text-sm">
            J
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary truncate">John Doe</p>
            <p className="text-xs text-muted truncate">john@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
