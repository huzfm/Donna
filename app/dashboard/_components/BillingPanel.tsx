"use client";

import { motion } from "framer-motion";
import {
      Crown,
      Zap,
      MessageSquare,
      Upload,
      BarChart2,
      Mail,
      Sparkles,
      Shield,
      AlertTriangle,
      Clock,
      ExternalLink,
      RefreshCw,
} from "lucide-react";
import { FREE_LIMITS } from "@/lib/payments/limits";
import UsageMeter from "./billing/UsageMeter";
import PlanCard from "./billing/PlanCard";
import BillingFaq from "./billing/BillingFaq";

interface UsageData {
      prompts_used: number;
      uploads_used: number;
      is_subscribed: boolean;
      dodo_subscription_id?: string | null;
      subscription_status?: string | null;
}

interface BillingPanelProps {
      usage: UsageData | null;
      userEmail: string | null;
      onUpgrade: () => void;
      onRefreshUsage: () => void;
}

const FREE_FEATURES = [
      { icon: MessageSquare, text: `${FREE_LIMITS.prompts} AI prompts total` },
      { icon: Upload, text: `${FREE_LIMITS.uploads} file uploads total` },
      { icon: BarChart2, text: "Diagram generation" },
      { icon: Mail, text: "Gmail integration" },
];

const PRO_FEATURES = [
      { icon: Zap, text: "Unlimited AI prompts", highlight: true },
      { icon: Upload, text: "Unlimited file uploads", highlight: true },
      { icon: MessageSquare, text: "Priority AI responses", highlight: true },
      { icon: BarChart2, text: "Advanced document analysis" },
      { icon: Mail, text: "Gmail read & compose" },
      { icon: BarChart2, text: "Diagram generation" },
      { icon: Sparkles, text: "Email AI suggestions" },
      { icon: Shield, text: "Priority support" },
];

export default function BillingPanel({
      usage,
      userEmail,
      onUpgrade,
      onRefreshUsage,
}: BillingPanelProps) {
      const isSubscribed = usage?.is_subscribed ?? false;
      const promptsUsed = usage?.prompts_used ?? 0;
      const uploadsUsed = usage?.uploads_used ?? 0;
      const subId = usage?.dodo_subscription_id;
      const subStatus = usage?.subscription_status;

      return (
            <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col overflow-hidden bg-transparent"
            >
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 px-6 py-3.5 backdrop-blur-md">
                        <div>
                              <h1 className="text-sm font-semibold text-slate-900">
                                    Billing & Subscription
                              </h1>
                              <p className="text-[11px] text-slate-400">
                                    Manage your plan, usage, and payments
                              </p>
                        </div>
                        <button
                              onClick={onRefreshUsage}
                              title="Refresh usage"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
                        >
                              <RefreshCw size={14} />
                        </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="mx-auto max-w-2xl space-y-6">
                              <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className={`flex items-center gap-4 overflow-hidden rounded-2xl border p-5 ${isSubscribed ? "border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white" : "border-amber-200/80 bg-gradient-to-r from-amber-50 to-white"}`}
                              >
                                    <div
                                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isSubscribed ? "bg-emerald-100" : "bg-amber-100"}`}
                                    >
                                          {isSubscribed ? (
                                                <Crown size={22} className="text-emerald-700" />
                                          ) : (
                                                <AlertTriangle
                                                      size={20}
                                                      className="text-amber-600"
                                                />
                                          )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                          {isSubscribed ? (
                                                <>
                                                      <div className="flex items-center gap-2">
                                                            <h2 className="text-sm font-bold text-slate-900">
                                                                  Pro Plan
                                                            </h2>
                                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                                                                  Active
                                                            </span>
                                                      </div>
                                                      <p className="mt-0.5 text-[12px] text-slate-500">
                                                            {userEmail} · Unlimited access to all
                                                            features
                                                      </p>
                                                      {subId && (
                                                            <p className="mt-1 font-mono text-[10px] text-slate-400">
                                                                  ID: {subId}
                                                            </p>
                                                      )}
                                                </>
                                          ) : (
                                                <>
                                                      <h2 className="text-sm font-bold text-slate-900">
                                                            Free Plan
                                                      </h2>
                                                      <p className="mt-0.5 text-[12px] text-slate-500">
                                                            {promptsUsed >= FREE_LIMITS.prompts
                                                                  ? "You've used all your free prompts. Upgrade to continue."
                                                                  : `${FREE_LIMITS.prompts - promptsUsed} prompts remaining`}
                                                      </p>
                                                </>
                                          )}
                                    </div>
                                    {!isSubscribed && (
                                          <button
                                                onClick={onUpgrade}
                                                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-slate-700"
                                          >
                                                <Crown size={12} />
                                                Upgrade
                                          </button>
                                    )}
                              </motion.div>

                              <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                              >
                                    <div className="border-b border-slate-100 px-5 py-3.5">
                                          <h3 className="text-[13px] font-semibold text-slate-800">
                                                Usage
                                          </h3>
                                          <p className="text-[11px] text-slate-400">
                                                Your usage this billing period
                                          </p>
                                    </div>
                                    <div className="space-y-5 p-5">
                                          <UsageMeter
                                                label="AI Prompts"
                                                used={promptsUsed}
                                                limit={FREE_LIMITS.prompts}
                                                unlimited={isSubscribed}
                                                icon={MessageSquare}
                                          />
                                          <UsageMeter
                                                label="File Uploads"
                                                used={uploadsUsed}
                                                limit={FREE_LIMITS.uploads}
                                                unlimited={isSubscribed}
                                                icon={Upload}
                                          />
                                    </div>
                              </motion.div>

                              <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                              >
                                    <h3 className="mb-3 text-[13px] font-semibold text-slate-700">
                                          Plans
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                          <PlanCard
                                                title="Free"
                                                price="$0"
                                                description="Get started with basic features"
                                                features={FREE_FEATURES}
                                                isPro={false}
                                                isCurrent={!isSubscribed}
                                          />
                                          <PlanCard
                                                title="Pro"
                                                price="₹299"
                                                period="mo"
                                                description="Unlimited access, priority support"
                                                features={PRO_FEATURES}
                                                isPro={true}
                                                isCurrent={isSubscribed}
                                                onUpgrade={!isSubscribed ? onUpgrade : undefined}
                                          />
                                    </div>
                              </motion.div>

                              {isSubscribed && (
                                    <motion.div
                                          initial={{ opacity: 0, y: 6 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.2 }}
                                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                    >
                                          <div className="border-b border-slate-100 px-5 py-3.5">
                                                <h3 className="text-[13px] font-semibold text-slate-800">
                                                      Subscription Details
                                                </h3>
                                          </div>
                                          <div className="divide-y divide-slate-50">
                                                {[
                                                      {
                                                            label: "Status",
                                                            value: subStatus ?? "active",
                                                            badge: true,
                                                      },
                                                      { label: "Plan", value: "Pro — Monthly" },
                                                      {
                                                            label: "Billing email",
                                                            value: userEmail ?? "—",
                                                      },
                                                      ...(subId
                                                            ? [
                                                                    {
                                                                          label: "Subscription ID",
                                                                          value: subId,
                                                                          mono: true,
                                                                    },
                                                              ]
                                                            : []),
                                                ].map((row) => (
                                                      <div
                                                            key={row.label}
                                                            className="flex items-center justify-between px-5 py-3"
                                                      >
                                                            <span className="text-[12px] text-slate-500">
                                                                  {row.label}
                                                            </span>
                                                            {"badge" in row && row.badge ? (
                                                                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 capitalize">
                                                                        {row.value}
                                                                  </span>
                                                            ) : (
                                                                  <span
                                                                        className={`text-[12.5px] ${"mono" in row && row.mono ? "font-mono text-slate-500" : "font-medium text-slate-800"}`}
                                                                  >
                                                                        {row.value}
                                                                  </span>
                                                            )}
                                                      </div>
                                                ))}
                                          </div>
                                          <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                      <Clock size={11} />
                                                      To cancel or modify your subscription, contact
                                                      us or visit the Dodo Payments portal.
                                                </p>
                                                <a
                                                      href="https://app.dodopayments.com"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:text-slate-900"
                                                >
                                                      Manage in Dodo Payments
                                                      <ExternalLink size={10} />
                                                </a>
                                          </div>
                                    </motion.div>
                              )}

                              <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                              >
                                    <BillingFaq />
                              </motion.div>
                        </div>
                  </div>
            </motion.div>
      );
}
