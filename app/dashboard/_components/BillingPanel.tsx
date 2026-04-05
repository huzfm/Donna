"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Zap,
  Check,
  MessageSquare,
  Upload,
  Mail,
  BarChart2,
  Sparkles,
  Shield,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { FREE_LIMITS } from "@/lib/limits";

/* ── Types ── */
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

/* ── Plan features ── */
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

/* ── Usage meter ── */
function UsageMeter({
  label,
  used,
  limit,
  unlimited,
  icon: Icon,
}: {
  label: string;
  used: number;
  limit: number;
  unlimited?: boolean;
  icon: React.ElementType;
}) {
  const pct = unlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !unlimited && pct >= 80;
  const isAtLimit = !unlimited && pct >= 100;

  return (
    <div className="flex items-start gap-3.5">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isAtLimit
            ? "bg-red-100 text-red-600"
            : isNearLimit
              ? "bg-amber-100 text-amber-600"
              : "bg-slate-100 text-slate-600"
        }`}
      >
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[13px] font-medium text-slate-800">{label}</span>
          {unlimited ? (
            <span className="text-[11px] font-semibold text-emerald-600">Unlimited</span>
          ) : (
            <span
              className={`text-[11px] font-semibold ${
                isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-slate-500"
              }`}
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
              className={`h-full rounded-full ${
                isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-slate-800"
              }`}
            />
          </div>
        )}
        {isAtLimit && !unlimited && (
          <p className="mt-1 text-[10px] text-red-500">Limit reached — upgrade for unlimited access</p>
        )}
      </div>
    </div>
  );
}

/* ── Plan card ── */
function PlanCard({
  title,
  price,
  period,
  description,
  features,
  isPro,
  isCurrent,
  onUpgrade,
  loading,
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: { icon: React.ElementType; text: string; highlight?: boolean }[];
  isPro: boolean;
  isCurrent: boolean;
  onUpgrade?: () => void;
  loading?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
        isPro
          ? "border-slate-900 bg-slate-900 shadow-xl shadow-slate-900/20"
          : "border-slate-200 bg-white"
      }`}
    >
      {isPro && (
        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
      )}

      {isCurrent && (
        <div className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
          isPro ? "bg-emerald-400/20 text-emerald-300" : "bg-slate-100 text-slate-600"
        }`}>
          Current plan
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isPro ? "bg-white/10" : "bg-slate-100"}`}>
            {isPro ? (
              <Crown size={15} className="text-amber-400" />
            ) : (
              <Zap size={15} className="text-slate-600" />
            )}
          </div>
          <span className={`text-sm font-semibold ${isPro ? "text-white" : "text-slate-900"}`}>{title}</span>
        </div>

        <div className="flex items-end gap-1">
          <span className={`text-3xl font-black ${isPro ? "text-white" : "text-slate-900"}`}>{price}</span>
          {period && (
            <span className={`mb-1 text-[12px] ${isPro ? "text-slate-400" : "text-slate-400"}`}>/{period}</span>
          )}
        </div>
        <p className={`mt-1 text-[12px] ${isPro ? "text-slate-400" : "text-slate-500"}`}>{description}</p>
      </div>

      <ul className="mb-5 space-y-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
              isPro ? "bg-emerald-400/20" : "bg-slate-100"
            }`}>
              <Check size={9} className={isPro ? "text-emerald-400" : "text-slate-600"} />
            </div>
            <span className={`text-[12.5px] leading-snug ${
              f.highlight
                ? isPro ? "font-medium text-white" : "font-medium text-slate-900"
                : isPro ? "text-slate-300" : "text-slate-600"
            }`}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {!isCurrent && onUpgrade && (
        <button
          onClick={onUpgrade}
          disabled={loading}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all ${
            isPro
              ? "bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-60"
              : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
          }`}
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
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium ${
          "bg-white/8 text-emerald-400"
        }`}>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Subscription active
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   BillingPanel
══════════════════════════════════════════════ */
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
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 px-6 py-3.5 backdrop-blur-md">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Billing & Subscription</h1>
          <p className="text-[11px] text-slate-400">Manage your plan, usage, and payments</p>
        </div>
        <button
          onClick={onRefreshUsage}
          title="Refresh usage"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* ── Current plan banner ── */}
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-4 overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-white p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                <Crown size={22} className="text-emerald-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">Pro Plan</h2>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                    Active
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {userEmail} · Unlimited access to all features
                </p>
                {subId && (
                  <p className="mt-1 font-mono text-[10px] text-slate-400">
                    ID: {subId}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-4 overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-white p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-900">Free Plan</h2>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {promptsUsed >= FREE_LIMITS.prompts
                    ? "You've used all your free prompts. Upgrade to continue."
                    : `${FREE_LIMITS.prompts - promptsUsed} prompts remaining`}
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-slate-700"
              >
                <Crown size={12} />
                Upgrade
              </button>
            </motion.div>
          )}

          {/* ── Usage ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h3 className="text-[13px] font-semibold text-slate-800">Usage</h3>
              <p className="text-[11px] text-slate-400">Your usage this billing period</p>
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

          {/* ── Plans ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="mb-3 text-[13px] font-semibold text-slate-700">Plans</h3>
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
                price="$9"
                period="mo"
                description="Unlimited access, priority support"
                features={PRO_FEATURES}
                isPro={true}
                isCurrent={isSubscribed}
                onUpgrade={!isSubscribed ? onUpgrade : undefined}
              />
            </div>
          </motion.div>

          {/* ── Subscription details (pro only) ── */}
          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-100 px-5 py-3.5">
                <h3 className="text-[13px] font-semibold text-slate-800">Subscription Details</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { label: "Status", value: subStatus ?? "active", badge: true },
                  { label: "Plan", value: "Pro — Monthly" },
                  { label: "Billing email", value: userEmail ?? "—" },
                  ...(subId ? [{ label: "Subscription ID", value: subId, mono: true }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-[12px] text-slate-500">{row.label}</span>
                    {"badge" in row && row.badge ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold capitalize text-emerald-700">
                        {row.value}
                      </span>
                    ) : (
                      <span className={`text-[12.5px] ${("mono" in row && row.mono) ? "font-mono text-slate-500" : "font-medium text-slate-800"}`}>
                        {row.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock size={11} />
                  To cancel or modify your subscription, contact us or visit the Dodo Payments portal.
                </p>
                <a
                  href="https://app.dodopayments.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Manage in Dodo Payments
                  <ExternalLink size={10} />
                </a>
              </div>
            </motion.div>
          )}

          {/* ── FAQ ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h3 className="text-[13px] font-semibold text-slate-800">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                {
                  q: "What happens when I hit the free limit?",
                  a: "Your prompts will be paused. You can upgrade to Pro for unlimited access at any time.",
                },
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, you can cancel anytime. Your Pro access continues until the end of the billing period.",
                },
                {
                  q: "Is my payment information secure?",
                  a: "All payments are processed securely through Dodo Payments. We never store your card details.",
                },
                {
                  q: "What payment methods are accepted?",
                  a: "Dodo Payments supports major credit and debit cards, UPI, and other local payment methods.",
                },
              ].map((faq) => (
                <div key={faq.q} className="px-5 py-4">
                  <p className="mb-1 text-[12.5px] font-semibold text-slate-800">{faq.q}</p>
                  <p className="text-[12px] leading-relaxed text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
