"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "/about", isRoute: true },
];

function NavAuthButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/supabase-browser").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setLoggedIn(!!user);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <div className="h-8 w-[100px]" />;

  return (
    <Link
      href={loggedIn ? "/dashboard" : "/login"}
      className="rounded-full bg-slate-900/90 px-5 py-1.5 text-[13px] font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-slate-900 hover:ring-1 hover:ring-slate-300"
    >
      {loggedIn ? "Dashboard" : "Log in"}
    </Link>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4">
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-4xl rounded-full border border-white/60 bg-linear-to-b from-white/90 via-white/70 to-white/40 px-3 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5 backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-white/80 before:to-transparent before:opacity-60 after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-white/40"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2">
            <span className="font-(family-name:--font-doto) text-xl font-black tracking-tight text-slate-900">
              Donna
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-5 font-mono md:flex">
            <a
              href="#features"
              className="rounded-md px-2 py-1 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:bg-white/40 hover:text-black"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="rounded-md px-2 py-1 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:bg-white/40 hover:text-black"
            >
              How it works
            </a>

            <Link
              href="/about"
              className="rounded-md px-2 py-1 text-[13px] font-semibold text-slate-700 transition-all duration-200 hover:bg-white/40 hover:text-black"
            >
              About
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <NavAuthButton />

            {/* Mobile toggle */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-18 right-4 left-4 z-50 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {NAV_LINKS.map((link) => {
              const Tag = link.isRoute ? Link : "a";
              return (
                <Tag
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center rounded-xl px-4 py-2.5 font-mono text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 hover:text-black"
                >
                  {link.label}
                </Tag>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
