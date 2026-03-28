"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

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

  if (loading) return <div className="w-[100px] h-8" />;

  return (
    <Link
      href={loggedIn ? "/dashboard" : "/login"}
      className="text-[13px] font-semibold bg-slate-900 text-white px-5 py-1.5 rounded-full transition-all duration-200 hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
    >
      {loggedIn ? "Dashboard" : "Log in"}
    </Link>
  );
}

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-full shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] px-2.5 py-1.5"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 pl-2 group">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Brain size={15} className="text-emerald-600" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">Donna</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <Link href="/signup" className="nav-link">Sign up</Link>
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">About</a>
          </nav>

          <NavAuthButton />
        </div>
      </motion.header>
    </div>
  );
}
