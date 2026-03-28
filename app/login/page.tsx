"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, ArrowRight, Sparkles, FileText, Zap } from "lucide-react";

function MagneticWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  }, []);

  const handleLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex">
        {/* Left: branding panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-50 border-r border-slate-200 flex-col justify-between p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <MagneticWrap>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Brain size={20} className="text-emerald-600" />
                </div>
              </MagneticWrap>
              <span className="text-lg font-bold text-slate-900 tracking-tight font-[--font-doto]">Donna</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4 font-[--font-doto]">
              Your AI-Powered<br />
              <span className="text-emerald-600">Workspace Brain</span>
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm mb-10">
              Upload documents, ask questions, manage emails — all in one intelligent workspace.
            </p>

            <div className="space-y-4">
              {[
                { icon: FileText, text: "Upload & analyze documents instantly" },
                { icon: Sparkles, text: "AI-powered answers from your files" },
                { icon: Zap, text: "Blazing fast responses via Groq" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <item.icon size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-600">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-slate-400"
          >
            &copy; {new Date().getFullYear()} Donna. All rights reserved.
          </motion.p>
        </div>

        {/* Right: login form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <MagneticWrap>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <Brain size={20} className="text-emerald-600" />
                  </div>
                </MagneticWrap>
                <span className="text-lg font-bold text-slate-900 tracking-tight font-[--font-doto]">Donna</span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-[--font-doto]">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1.5">Sign in to your Donna workspace</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <MagneticWrap className="w-full">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold transition-all text-sm flex items-center justify-center gap-2 hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-white disabled:hover:ring-0"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                </MagneticWrap>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
