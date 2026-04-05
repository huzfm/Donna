"use client";

import { motion } from "framer-motion";
import { Mail, ShieldCheck, Settings, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface GmailDisconnectedViewProps {
      gmailUser: string;
      gmailPassword: string;
      onGmailUserChange: (v: string) => void;
      onGmailPasswordChange: (v: string) => void;
      onSave: (e: React.FormEvent) => void;
      saving: boolean;
      message: string | null;
}

export default function GmailDisconnectedView({
      gmailUser,
      gmailPassword,
      onGmailUserChange,
      onGmailPasswordChange,
      onSave,
      saving,
      message,
}: GmailDisconnectedViewProps) {
      const isError = message?.startsWith("error:");
      const msgText = message?.replace(/^(error|success):/, "") ?? null;

      return (
            <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-1 flex-col overflow-hidden bg-transparent"
            >
                  <div className="shrink-0 border-b border-slate-200/90 bg-white/60 py-4 pr-4 pl-14 backdrop-blur-md sm:pr-6 md:pl-6">
                        <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 ring-1 ring-slate-200/60">
                                    <Mail size={15} strokeWidth={2} />
                              </span>
                              <div>
                                    <h1 className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
                                          Gmail
                                    </h1>
                                    <p className="text-[11px] text-slate-500">
                                          Connect to send emails through Donna
                                    </p>
                              </div>
                        </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
                              <div className="mb-8 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 ring-1 ring-slate-300/60">
                                          <Mail size={24} className="text-black" />
                                    </div>
                                    <h2 className="font-(family-name:--font-doto) text-xl font-black tracking-tight text-slate-950">
                                          Connect your Gmail
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                                          Link your Gmail account so Donna can send emails, attach
                                          calendar links, and manage your inbox all from chat.
                                    </p>
                              </div>

                              <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
                                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 md:col-span-3">
                                          <div className="mb-5 flex items-center gap-2.5">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 ring-1 ring-slate-300/60">
                                                      <ShieldCheck
                                                            size={14}
                                                            className="text-black"
                                                      />
                                                </span>
                                                <div>
                                                      <p className="text-sm font-semibold text-slate-900">
                                                            Credentials
                                                      </p>
                                                      <p className="text-[11px] text-slate-500">
                                                            Stored securely per-session
                                                      </p>
                                                </div>
                                          </div>

                                          <form onSubmit={onSave} className="flex flex-col gap-4">
                                                <div>
                                                      <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
                                                            Gmail address
                                                      </label>
                                                      <input
                                                            type="email"
                                                            required
                                                            value={gmailUser}
                                                            onChange={(e) =>
                                                                  onGmailUserChange(e.target.value)
                                                            }
                                                            placeholder="you@gmail.com"
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300/15"
                                                      />
                                                </div>
                                                <div>
                                                      <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
                                                            App password
                                                      </label>
                                                      <input
                                                            type="password"
                                                            required
                                                            value={gmailPassword}
                                                            onChange={(e) =>
                                                                  onGmailPasswordChange(
                                                                        e.target.value
                                                                  )
                                                            }
                                                            placeholder="xxxx xxxx xxxx xxxx"
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300/15"
                                                      />
                                                </div>

                                                {msgText && (
                                                      <div
                                                            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium ${isError ? "border border-red-200 bg-red-50 text-red-700" : "border border-slate-300 bg-slate-100 text-black"}`}
                                                      >
                                                            {isError ? (
                                                                  <AlertCircle size={13} />
                                                            ) : (
                                                                  <CheckCircle2 size={13} />
                                                            )}
                                                            {msgText}
                                                      </div>
                                                )}

                                                <button
                                                      type="submit"
                                                      disabled={saving}
                                                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-300/25 transition-all hover:ring-2 hover:ring-slate-300/20 disabled:opacity-30"
                                                >
                                                      {saving ? (
                                                            "Connecting…"
                                                      ) : (
                                                            <>
                                                                  <span>Connect Gmail</span>
                                                                  <ArrowRight size={14} />
                                                            </>
                                                      )}
                                                </button>
                                          </form>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 md:col-span-2">
                                          <div className="mb-5 flex items-center gap-2.5">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 ring-1 ring-slate-300/60">
                                                      <Settings size={14} className="text-black" />
                                                </span>
                                                <div>
                                                      <p className="text-sm font-semibold text-slate-900">
                                                            Setup guide
                                                      </p>
                                                      <p className="text-[11px] text-slate-500">
                                                            5 quick steps
                                                      </p>
                                                </div>
                                          </div>
                                          <ol className="space-y-4">
                                                {[
                                                      {
                                                            step: "Google Account",
                                                            desc: "Go to Security settings",
                                                      },
                                                      {
                                                            step: "2-Step Verification",
                                                            desc: "Enable if not already on",
                                                      },
                                                      {
                                                            step: "App Passwords",
                                                            desc: "Search in account settings",
                                                      },
                                                      {
                                                            step: "Generate",
                                                            desc: 'Create one for "Mail"',
                                                      },
                                                      {
                                                            step: "Paste",
                                                            desc: "Enter the 16-char code above",
                                                      },
                                                ].map((item, i) => (
                                                      <li
                                                            key={i}
                                                            className="flex items-start gap-3"
                                                      >
                                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-black ring-1 ring-slate-300/60">
                                                                  {i + 1}
                                                            </span>
                                                            <div>
                                                                  <p className="text-xs font-semibold text-slate-800">
                                                                        {item.step}
                                                                  </p>
                                                                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                                                                        {item.desc}
                                                                  </p>
                                                            </div>
                                                      </li>
                                                ))}
                                          </ol>
                                    </div>
                              </div>
                        </div>
                  </div>
            </motion.div>
      );
}
