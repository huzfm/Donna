"use client";

import Link from "next/link";
import { Brain, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-12 px-6 bg-[#020617] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Brain size={14} className="text-emerald-400" />
              </div>
              <span className="text-sm font-bold">Donna</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your AI-powered workspace brain. Upload, ask, and automate.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Product</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-sm text-slate-500 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="block text-sm text-slate-500 hover:text-white transition-colors">How it works</a>
              <a href="#team" className="block text-sm text-slate-500 hover:text-white transition-colors">Team</a>
              <Link href="/signup" className="block text-sm text-slate-500 hover:text-white transition-colors">Sign up</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Account</h4>
            <div className="space-y-2">
              <Link href="/login" className="block text-sm text-slate-500 hover:text-white transition-colors">Log in</Link>
              <Link href="/dashboard" className="block text-sm text-slate-500 hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Donna. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock size={11} />
            Built with Next.js, Supabase &amp; Groq
          </div>
        </div>
      </div>
    </footer>
  );
}
