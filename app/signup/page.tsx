"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, ArrowRight, ArrowLeft, Shield, Users, Sparkles } from "lucide-react";

function MagneticWrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <MagneticWrap className="inline-block">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
              <Brain size={28} className="text-emerald-600" />
            </div>
          </MagneticWrap>
          <h2 className="mb-3 font-[--font-doto] text-2xl font-bold text-slate-900">
            Check your email
          </h2>
          <p className="mb-8 text-sm text-slate-500">
            We sent a confirmation link to <strong className="text-slate-900">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="relative z-10 flex min-h-screen">
        {/* Left: branding panel */}
        <div className="hidden flex-col justify-between border-r border-slate-200 bg-slate-50 p-12 lg:flex lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <MagneticWrap>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
                  <Brain size={20} className="text-emerald-600" />
                </div>
              </MagneticWrap>
              <span className="font-[--font-doto] text-lg font-bold tracking-tight text-slate-900">
                Donna
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="mb-4 font-[--font-doto] text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Start working
              <br />
              <span className="text-emerald-600">smarter today</span>
            </h1>
            <p className="mb-10 max-w-sm text-[15px] leading-relaxed text-slate-500">
              Create your free account and unlock the power of AI for your documents and emails.
            </p>

            <div className="space-y-4">
              {[
                { icon: Sparkles, text: "Free to use — no credit card required" },
                { icon: Shield, text: "Your data stays private and encrypted" },
                { icon: Users, text: "Join users already working smarter" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
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

        {/* Right: signup form */}
        <div className="flex flex-1 items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="mb-4 inline-flex items-center gap-2">
                <MagneticWrap>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
                    <Brain size={20} className="text-emerald-600" />
                  </div>
                </MagneticWrap>
                <span className="font-[--font-doto] text-lg font-bold tracking-tight text-slate-900">
                  Donna
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="font-[--font-doto] text-2xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">Get started with Donna for free</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                <MagneticWrap className="w-full">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-white disabled:hover:ring-0"
                  >
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                </MagneticWrap>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
