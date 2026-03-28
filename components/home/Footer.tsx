"use client";

import Link from "next/link";
import { Brain, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#020617] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                <Brain size={14} className="text-emerald-400" />
              </div>
              <span className="text-sm font-bold">Donna</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Your AI-powered workspace brain. Upload, ask, and automate.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Product
            </h4>
            <div className="space-y-2">
              <a
                href="#features"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                How it works
              </a>
              <a
                href="#team"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Team
              </a>
              <Link
                href="/signup"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Sign up
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Account
            </h4>
            <div className="space-y-2">
              <Link
                href="/login"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Legal
            </h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Privacy
              </a>
              <a
                href="#"
                className="block text-sm text-slate-500 transition-colors hover:text-white"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Donna. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock size={11} />
            Built with Next.js, Supabase &amp; Groq
          </div>
        </div>
      </div>
    </footer>
  );
}
