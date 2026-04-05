"use client";

import { motion } from "framer-motion";

interface UsageMeterProps {
      label: string;
      used: number;
      limit: number;
      unlimited?: boolean;
      icon: React.ElementType;
}

export default function UsageMeter({ label, used, limit, unlimited, icon: Icon }: UsageMeterProps) {
      const pct = unlimited ? 0 : Math.min((used / limit) * 100, 100);
      const isNearLimit = !unlimited && pct >= 80;
      const isAtLimit = !unlimited && pct >= 100;

      return (
            <div className="flex items-start gap-3.5">
                  <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isAtLimit ? "bg-red-100 text-red-600" : isNearLimit ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}
                  >
                        <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between">
                              <span className="text-[13px] font-medium text-slate-800">
                                    {label}
                              </span>
                              {unlimited ? (
                                    <span className="text-[11px] font-semibold text-emerald-600">
                                          Unlimited
                                    </span>
                              ) : (
                                    <span
                                          className={`text-[11px] font-semibold ${isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-slate-500"}`}
                                    >
                                          {used} / {limit}
                                    </span>
                              )}
                        </div>
                        {unlimited ? (
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
                                    <div className="h-full w-full rounded-full bg-emerald-400" />
                              </div>
                        ) : (
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${pct}%` }}
                                          transition={{ duration: 0.6, ease: "easeOut" }}
                                          className={`h-full rounded-full ${isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-slate-800"}`}
                                    />
                              </div>
                        )}
                        {isAtLimit && !unlimited && (
                              <p className="mt-1 text-[10px] text-red-500">
                                    Limit reached — upgrade for unlimited access
                              </p>
                        )}
                  </div>
            </div>
      );
}
