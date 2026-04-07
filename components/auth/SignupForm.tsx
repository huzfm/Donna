"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/db/supabase-browser";
import { getOAuthRedirectUrl, googleOAuthQueryParams } from "@/lib/auth/oauth-redirect";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface SignupFormProps {
      animationData: Record<string, unknown> | null;
}

export default function SignupForm({ animationData }: SignupFormProps) {
      const searchParams = useSearchParams();
      const nextPath = searchParams.get("next") || "/dashboard";

      const [fullName, setFullName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const [googleLoading, setGoogleLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [success, setSuccess] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);
      const [successAnimation, setSuccessAnimation] = useState<Record<
            string,
            unknown
      > | null>(null);

      const supabase = createClient();

      useEffect(() => {
            if (!success) return;
            fetch("/animations/email-sent.json")
                  .then((r) => r.json())
                  .then(setSuccessAnimation)
                  .catch(() => {});
      }, [success]);

      const inputClass =
            "w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10";

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
                        options: { data: { full_name: fullName.trim() } },
                  });
                  if (signUpError) throw signUpError;
                  setSuccess(true);
            } catch (err: unknown) {
                  setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                  setLoading(false);
            }
      };

      const handleGoogleSignUp = async () => {
            setGoogleLoading(true);
            setError(null);
            try {
                  const callbackUrl =
                        nextPath && nextPath !== "/dashboard"
                              ? `${getOAuthRedirectUrl()}?next=${encodeURIComponent(nextPath)}`
                              : getOAuthRedirectUrl();

                  const { error } = await supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                              redirectTo: callbackUrl,
                              queryParams: { ...googleOAuthQueryParams },
                        },
                  });
                  if (error) throw error;
            } catch (err: unknown) {
                  setError(err instanceof Error ? err.message : "Google sign-up failed");
                  setGoogleLoading(false);
            }
      };

      const loginHref =
            nextPath && nextPath !== "/dashboard"
                  ? `/login?next=${encodeURIComponent(nextPath)}`
                  : "/login";

      if (success) {
            return (
                  <div className="w-full max-w-md">
                        <div className="mb-8 text-center lg:hidden">
                              <Link href="/" className="mb-3 inline-block">
                                    {animationData && (
                                          <Lottie
                                                animationData={animationData}
                                                loop
                                                autoplay
                                                className="mx-auto h-24 w-24"
                                          />
                                    )}
                              </Link>
                              <span className="font-(family-name:--font-doto) text-lg font-bold tracking-tight text-slate-900">
                                    Donna
                              </span>
                        </div>

                        <div className="mb-8">
                              <h2 className="font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-950">
                                    Almost there
                              </h2>
                              <p className="mt-1.5 text-sm text-slate-500">
                                    One more step to activate your account
                              </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                              {successAnimation && (
                                    <Lottie
                                          animationData={successAnimation}
                                          loop={false}
                                          autoplay
                                          className="mx-auto mb-6 h-32 w-32"
                                    />
                              )}
                              <h3 className="mb-2 font-(family-name:--font-doto) text-xl font-black text-slate-950">
                                    Check your email
                              </h3>
                              <p className="text-sm leading-relaxed text-slate-500">
                                    We sent a confirmation link to{" "}
                                    <strong className="text-slate-900">{email}</strong>. Open it to
                                    finish signing up.
                              </p>
                              <Link
                                    href={loginHref}
                                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
                              >
                                    Continue to sign in
                                    <ArrowRight size={15} />
                              </Link>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-500">
                              Wrong email?{" "}
                              <button
                                    type="button"
                                    onClick={() => {
                                          setSuccess(false);
                                          setError(null);
                                    }}
                                    className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                              >
                                    Go back
                              </button>
                        </p>
                  </div>
            );
      }

      return (
            <div className="w-full max-w-md">
                  <div className="mb-8 text-center lg:hidden">
                        <Link href="/" className="mb-3 inline-block">
                              {animationData && (
                                    <Lottie
                                          animationData={animationData}
                                          loop
                                          autoplay
                                          className="mx-auto h-24 w-24"
                                    />
                              )}
                        </Link>
                        <span className="font-(family-name:--font-doto) text-lg font-bold tracking-tight text-slate-900">
                              Donna
                        </span>
                  </div>

                  <div className="mb-8">
                        <h2 className="font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-950">
                              Sign up
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                              Create your Donna workspace — it&apos;s free to start
                        </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-8">
                        {error && (
                              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                              </div>
                        )}

                        <button
                              type="button"
                              onClick={handleGoogleSignUp}
                              disabled={googleLoading}
                              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                        >
                              <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                          fill="#4285F4"
                                    />
                                    <path
                                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                          fill="#34A853"
                                    />
                                    <path
                                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                          fill="#FBBC05"
                                    />
                                    <path
                                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                          fill="#EA4335"
                                    />
                              </svg>
                              {googleLoading ? "Redirecting..." : "Continue with Google"}
                        </button>

                        <div className="my-6 flex items-center gap-3">
                              <div className="h-px flex-1 bg-slate-200" />
                              <span className="text-xs font-medium text-slate-400">or</span>
                              <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                              <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                          Full name
                                    </label>
                                    <div className="relative">
                                          <User
                                                size={16}
                                                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                                          />
                                          <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Your full name"
                                                className={`${inputClass} pr-4 pl-10`}
                                          />
                                    </div>
                              </div>
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
                                                className={`${inputClass} pr-4 pl-10`}
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
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="At least 6 characters"
                                                className={`${inputClass} pr-10 pl-10`}
                                          />
                                          <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                          >
                                                {showPassword ? (
                                                      <EyeOff size={16} />
                                                ) : (
                                                      <Eye size={16} />
                                                )}
                                          </button>
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
                                                type={showConfirm ? "text" : "password"}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter your password"
                                                className={`${inputClass} pr-10 pl-10`}
                                          />
                                          <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                          >
                                                {showConfirm ? (
                                                      <EyeOff size={16} />
                                                ) : (
                                                      <Eye size={16} />
                                                )}
                                          </button>
                                    </div>
                              </div>
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-white disabled:hover:ring-0"
                              >
                                    {loading ? "Creating account..." : "Create account"}
                                    {!loading && <ArrowRight size={15} />}
                              </button>
                        </form>
                  </div>

                  <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                              href={loginHref}
                              className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                        >
                              Sign in
                        </Link>
                  </p>
            </div>
      );
}
