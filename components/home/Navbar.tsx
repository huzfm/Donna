"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

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
      className="
        rounded-full
        bg-slate-900/90
        px-5 py-1.5
        text-[13px]
        font-semibold
        text-white
        backdrop-blur-md
        transition-all duration-200
        hover:bg-white
        hover:text-slate-900
        hover:ring-1 hover:ring-slate-300
      "
    >
      {loggedIn ? "Dashboard" : "Log in"}
    </Link>
  );
}

export default function Navbar() {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4">
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative w-full max-w-4xl rounded-full px-3 py-2

          bg-gradient-to-b from-white/90 via-white/70 to-white/40
          backdrop-blur-2xl

          border border-white/60
          ring-1 ring-black/5

          shadow-[0_10px_40px_rgba(0,0,0,0.08)]

          before:absolute before:inset-0 before:rounded-full
          before:bg-gradient-to-b before:from-white/80 before:to-transparent
          before:opacity-60 before:pointer-events-none

          after:absolute after:inset-0 after:rounded-full
          after:ring-1 after:ring-white/40
          after:pointer-events-none
        "
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2">
            <span className="font-(family-name:--font-doto) text-xl font-black tracking-tight text-slate-900">
              Donna
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-5 md:flex font-mono">
            <a
              href="#features"
className="px-2 py-1 text-[13px] rounded-md text-slate-700 font-semibold transition-all duration-200 hover:bg-white/40 hover:text-black"            >
              Features
            </a>
            <a
              href="#how-it-works"
className="px-2 py-1 text-[13px] rounded-md text-slate-700 font-semibold transition-all duration-200 hover:bg-white/40 hover:text-black"            >
              How it works
            </a>
        
         
            <a
              href="#"
className="px-2 py-1 text-[13px] rounded-md text-slate-700 font-semibold transition-all duration-200 hover:bg-white/40 hover:text-black"
            >
              About
            </a>
          </nav>

          <NavAuthButton />
        </div>
      </motion.header>
    </div>
  );
}