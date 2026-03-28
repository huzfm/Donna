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

  if (loading) return <div className="h-8 w-[100px]" />;

  return (
    <Link
      href={loggedIn ? "/dashboard" : "/login"}
      className="rounded-full bg-slate-900 px-5 py-1.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
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
        className="w-full max-w-4xl rounded-full border border-slate-200 bg-white/80 px-2.5 py-1.5 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 pl-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
              <Brain size={15} className="text-emerald-600" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">Donna</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How it works
            </a>
            <Link href="/signup" className="nav-link">
              Sign up
            </Link>
            <a href="#" className="nav-link">
              Docs
            </a>
            <a href="#" className="nav-link">
              About
            </a>
          </nav>

          <NavAuthButton />
        </div>
      </motion.header>
    </div>
  );
}
