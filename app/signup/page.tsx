"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
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
      <div className="flex h-screen items-center justify-center bg-white text-neutral-900 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-5">
            <Brain size={24} className="text-neutral-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Check your email</h2>
          <p className="text-neutral-500 text-sm mb-6">
            We sent a confirmation link to <strong className="text-neutral-800">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-900 hover:underline font-medium"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-white text-neutral-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
          </Link>
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-sm text-neutral-500 mt-1">Get started with Donna for free</p>
        </div>

        <div className="border border-neutral-200 rounded-xl p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all placeholder:text-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all placeholder:text-neutral-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all placeholder:text-neutral-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-black disabled:opacity-40 text-white py-2.5 rounded-lg text-sm font-medium transition-colors mt-1"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-neutral-900 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
