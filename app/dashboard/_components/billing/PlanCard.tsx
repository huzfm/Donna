"use client";

import { Crown, Zap, Check, RefreshCw } from "lucide-react";

interface PlanCardProps {
      title: string;
      price: string;
      period?: string;
      description: string;
      features: { icon: React.ElementType; text: string; highlight?: boolean }[];
      isPro: boolean;
      isCurrent: boolean;
      onUpgrade?: () => void;
      loading?: boolean;
}

export default function PlanCard({
      title,
      price,
      period,
      description,
      features,
      isPro,
      isCurrent,
      onUpgrade,
      loading,
}: PlanCardProps) {
      return (
            <div
                  className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${isPro ? "border-slate-900 bg-slate-900 shadow-xl shadow-slate-900/20" : "border-slate-200 bg-white"}`}
            >
                  {isPro && (
                        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
                  )}
                  {isCurrent && (
                        <div
                              className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${isPro ? "bg-emerald-400/20 text-emerald-300" : "bg-slate-100 text-slate-600"}`}
                        >
                              Current plan
                        </div>
                  )}

                  <div className="mb-4">
                        <div className="mb-3 flex items-center gap-2">
                              <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${isPro ? "bg-white/10" : "bg-slate-100"}`}
                              >
                                    {isPro ? (
                                          <Crown size={15} className="text-amber-400" />
                                    ) : (
                                          <Zap size={15} className="text-slate-600" />
                                    )}
                              </div>
                              <span
                                    className={`text-sm font-semibold ${isPro ? "text-white" : "text-slate-900"}`}
                              >
                                    {title}
                              </span>
                        </div>
                        <div className="flex items-end gap-1">
                              <span
                                    className={`text-3xl font-black ${isPro ? "text-white" : "text-slate-900"}`}
                              >
                                    {price}
                              </span>
                              {period && (
                                    <span
                                          className={`mb-1 text-[12px] ${isPro ? "text-slate-400" : "text-slate-400"}`}
                                    >
                                          /{period}
                                    </span>
                              )}
                        </div>
                        <p
                              className={`mt-1 text-[12px] ${isPro ? "text-slate-400" : "text-slate-500"}`}
                        >
                              {description}
                        </p>
                  </div>

                  <ul className="mb-5 space-y-2.5">
                        {features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                    <div
                                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isPro ? "bg-emerald-400/20" : "bg-slate-100"}`}
                                    >
                                          <Check
                                                size={9}
                                                className={
                                                      isPro ? "text-emerald-400" : "text-slate-600"
                                                }
                                          />
                                    </div>
                                    <span
                                          className={`text-[12.5px] leading-snug ${f.highlight ? (isPro ? "font-medium text-white" : "font-medium text-slate-900") : isPro ? "text-slate-300" : "text-slate-600"}`}
                                    >
                                          {f.text}
                                    </span>
                              </li>
                        ))}
                  </ul>

                  {!isCurrent && onUpgrade && (
                        <button
                              onClick={onUpgrade}
                              disabled={loading}
                              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all ${isPro ? "bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-60" : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"}`}
                        >
                              {loading ? (
                                    <RefreshCw size={13} className="animate-spin" />
                              ) : (
                                    <>
                                          <Crown size={13} />
                                          Upgrade to Pro
                                    </>
                              )}
                        </button>
                  )}

                  {isCurrent && isPro && (
                        <div className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2.5 text-[12px] font-medium text-emerald-400">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                              Subscription active
                        </div>
                  )}
            </div>
      );
}
