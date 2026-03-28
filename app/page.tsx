"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Mail, Calendar, MessageSquare, ArrowRight, Sparkles, Check,
  Star, ChevronDown, Shield, Zap, Globe, Users,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

/* ── Data ── */

const features = [
  { icon: Mail, title: "Send emails with AI", description: "Compose professional emails in seconds. Donna writes, edits, and sends — you just approve." },
  { icon: Calendar, title: "Schedule meetings instantly", description: "Find the perfect time, create invites, and send them — all through a simple chat." },
  { icon: MessageSquare, title: "Chat-first experience", description: "No complex forms. Just tell Donna what you need in plain English and watch it happen." },
];

const showcases = [
  {
    badge: "Email AI",
    title: "Draft perfect emails in seconds",
    description: "Tell Donna who to email and what to say. She'll craft a professional message, suggest improvements, and send it when you approve. Supports follow-ups, templates, and bulk sending.",
    features: ["AI tone adjustment", "Smart templates", "Follow-up reminders"],
  },
  {
    badge: "Smart Calendar",
    title: "Scheduling that actually works",
    description: "No more back-and-forth. Donna checks everyone's availability, suggests optimal times, and sends polished calendar invites — all from a single chat message.",
    features: ["Conflict detection", "Time zone aware", "One-click invites"],
  },
  {
    badge: "AI Assistant",
    title: "Your workspace, supercharged",
    description: "Ask Donna anything about your inbox, meetings, or tasks. Get instant summaries, action items, and insights from across your entire workspace.",
    features: ["Inbox summaries", "Action extraction", "Priority sorting"],
  },
];

const steps = [
  { number: 1, title: "Connect your Gmail", description: "Link your email account in one click. Secure OAuth — we never see your password." },
  { number: 2, title: "Chat with your AI", description: "Tell Donna what you need. Compose emails, schedule meetings, or ask questions." },
  { number: 3, title: "Emails & meetings handled", description: "Review, approve, and send. Donna handles the details so you can focus on work." },
];

const testimonials = [
  { name: "Alex Chen", role: "Product Manager, TechCorp", content: "Donna has completely transformed how our team handles email. What used to take hours now takes minutes.", rating: 5 },
  { name: "Sarah Miller", role: "Founder, StartupXYZ", content: "The AI scheduling is magical. I just say 'set up a meeting with the team' and it handles everything.", rating: 5 },
  { name: "David Park", role: "Engineering Lead, BuildCo", content: "Finally, an AI tool that actually understands context. The email drafts are spot-on every time.", rating: 5 },
  { name: "Emily Rodriguez", role: "Sales Director, GrowthIO", content: "My team's productivity increased 40% in the first month. Donna is an essential part of our stack.", rating: 5 },
  { name: "James Wilson", role: "CEO, Acme Labs", content: "I was skeptical about AI for email, but Donna won me over. It just works — beautifully.", rating: 5 },
  { name: "Lisa Zhang", role: "Designer, CreativeCo", content: "The clean interface and thoughtful UX makes Donna a pleasure to use every single day.", rating: 5 },
];

const plans = [
  { name: "Starter", price: "Free", period: "", description: "For individuals getting started", features: ["5 AI emails per day", "Basic scheduling", "1 email account", "Chat support"], cta: "Get started free", popular: false },
  { name: "Pro", price: "$12", period: "/mo", description: "For professionals who need more", features: ["Unlimited AI emails", "Smart scheduling", "5 email accounts", "Priority support", "Advanced AI features", "Custom templates"], cta: "Start free trial", popular: true },
  { name: "Team", price: "$29", period: "/user/mo", description: "For teams that work together", features: ["Everything in Pro", "Team workspace", "Admin controls", "SSO & SAML", "Dedicated support", "API access"], cta: "Contact sales", popular: false },
];

const faqs = [
  { q: "How does Donna's AI work?", a: "Donna uses advanced language models to understand your requests, draft emails, and schedule meetings. It learns your writing style over time for more personalized responses." },
  { q: "Is my email data secure?", a: "Absolutely. We use end-to-end encryption, SOC 2 compliance, and never store your email content on our servers. Your data stays yours." },
  { q: "Can I use Donna with any email provider?", a: "Currently we support Gmail and Google Workspace. Outlook and other providers are coming soon." },
  { q: "What happens when I exceed the free plan limits?", a: "You'll receive a notification and can upgrade anytime. We never cut off access mid-email — your work is always safe." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalties. Your data will be available for 30 days after cancellation." },
];

const brands = ["Vercel", "Stripe", "Linear", "Notion", "Figma", "Slack", "GitHub", "Webflow"];

const floatingShapes = [
  { w: 64, h: 64, x: "8%", y: "18%", delay: 0, dur: 7, r: "rounded-2xl", rot: 12 },
  { w: 40, h: 40, x: "87%", y: "12%", delay: 1, dur: 5, r: "rounded-full", rot: -8 },
  { w: 72, h: 72, x: "78%", y: "62%", delay: 2, dur: 8, r: "rounded-3xl", rot: 15 },
  { w: 32, h: 32, x: "12%", y: "72%", delay: 0.5, dur: 6, r: "rounded-xl", rot: -20 },
  { w: 48, h: 48, x: "52%", y: "6%", delay: 1.5, dur: 9, r: "rounded-full", rot: 10 },
  { w: 56, h: 56, x: "35%", y: "82%", delay: 3, dur: 7, r: "rounded-2xl", rot: -5 },
];

const footerLinks: Record<string, string[]> = {
  Product: ["Features", "Pricing", "Changelog"],
  Company: ["About", "Careers", "Contact"],
  Resources: ["Blog", "Help Center", "Docs"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const headlineWords = "Your AI-powered workspace for email & meetings".split(" ");

/* ── Animated counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return (
    <motion.span
      ref={ref}
      className="tabular-nums"
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {count}{suffix}
    </motion.span>
  );
}

/* ── Page ── */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-6 overflow-hidden hero-mesh">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

        {/* Floating shapes */}
        {floatingShapes.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute ${s.r} border border-accent/10 bg-accent/[0.03]`}
            style={{ width: s.w, height: s.h, left: s.x, top: s.y }}
            animate={{ y: [0, -18, 0], rotate: [0, s.rot, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light/60 px-4 py-1.5 text-xs font-medium text-accent mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            AI-Powered Workspace
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-primary leading-[1.08] mb-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={fadeInUp}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Compose emails, schedule meetings, and manage your inbox — all through a simple AI chat interface.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="inline-flex items-center gap-2 animated-gradient text-white font-medium px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-accent/20"
                whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(22,163,74,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get started free
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <a href="#how-it-works">
              <Button variant="ghost" size="lg">See how it works</Button>
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex -space-x-2.5">
              {["#16A34A", "#15803D", "#86EFAC", "#DCFCE7", "#4A5E4A"].map((c, i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: c }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.08, type: "spring" }}
                />
              ))}
            </div>
            <span className="text-sm text-secondary">Trusted by <strong className="text-primary">2,000+</strong> teams</span>
          </motion.div>

          {/* Browser Mockup with parallax */}
          <motion.div
            className="mx-auto max-w-4xl rounded-2xl border border-border shadow-2xl shadow-black/5 overflow-hidden bg-white"
            style={{ y: mockupY, scale: mockupScale }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" as const }}
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-8">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-muted border border-border max-w-xs mx-auto">app.donna.ai/dashboard</div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[{ l: "Emails Sent", v: "24" }, { l: "Meetings", v: "8" }, { l: "Pending", v: "5" }, { l: "AI Actions", v: "142" }].map((s) => (
                  <div key={s.l} className="bg-surface rounded-lg p-3">
                    <div className="text-[10px] text-muted mb-1">{s.l}</div>
                    <div className="text-lg font-semibold text-primary">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["Sarah Miller — Follow-up sent", "Team standup — Scheduled", "Client report — Draft ready"].map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-surface"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                  >
                    <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-accent text-[10px] font-bold">{item[0]}</div>
                    <span className="text-xs text-secondary">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ LOGO CLOUD ════════ */}
      <section className="py-10 border-y border-border overflow-hidden bg-surface">
        <div className="flex items-center gap-12 marquee-track">
          {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
            <span key={i} className="text-xl font-semibold text-muted/40 shrink-0 select-none tracking-tight">{b}</span>
          ))}
        </div>
      </section>

      {/* ════════ FEATURES GRID ════════ */}
      <section id="features" className="py-28 px-6 relative">
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="inline-block text-sm text-accent font-medium uppercase tracking-wider mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >Features</motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary tracking-tight">
              Everything you need, one chat away
            </h2>
            <p className="text-secondary mt-4 max-w-lg mx-auto">Donna combines email, calendar, and AI into a seamless workspace.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="group bg-white border border-border rounded-2xl p-8 card-glow relative overflow-hidden"
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-5"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <f.icon size={22} className="text-accent" />
                </motion.div>
                <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ FEATURE SHOWCASE ════════ */}
      <section className="py-20 px-6 bg-surface">
        <div className="mx-auto max-w-6xl space-y-32">
          {showcases.map((item, idx) => (
            <motion.div
              key={idx}
              className={`flex flex-col ${idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Animated illustration */}
              <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, x: idx % 2 === 1 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="relative rounded-2xl border border-border bg-white p-6 overflow-hidden shadow-sm">
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-light flex items-center justify-center pulse-soft">
                    <Sparkles size={14} className="text-accent" />
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-2">
                      <div className="h-2.5 w-10 rounded bg-accent-light" />
                      <div className="h-2.5 w-28 rounded bg-surface-2" />
                    </div>
                    {[100, 85, 70, 55].map((w, j) => (
                      <motion.div
                        key={j}
                        className="h-2.5 rounded bg-surface-2"
                        style={{ width: `${w}%` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + j * 0.12, duration: 0.6, ease: "easeOut" as const }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 mt-5">
                    {item.features.map((f) => (
                      <span key={f} className="text-[10px] font-medium px-2 py-1 rounded-full bg-accent-light text-accent">{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <div className="flex-1">
                <motion.span
                  className="inline-block text-xs font-medium uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >{item.badge}</motion.span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight mb-4">{item.title}</h3>
                <p className="text-secondary leading-relaxed mb-6">{item.description}</p>
                <ul className="space-y-2.5">
                  {item.features.map((f, fi) => (
                    <motion.li
                      key={f}
                      className="flex items-center gap-3 text-sm text-secondary"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + fi * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                        <Check size={12} className="text-accent" />
                      </div>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-accent font-medium uppercase tracking-wider">How it works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary tracking-tight">
              Get started in three simple steps
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              className="hidden md:block absolute top-7 left-[16%] right-[16%] h-0.5 origin-left"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent-muted), var(--accent), var(--accent-muted), transparent)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" as const }}
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {steps.map((step) => (
                <motion.div key={step.number} variants={staggerItem} className="flex flex-col items-center text-center relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-5 shadow-lg shadow-accent/20"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-base font-semibold text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section className="py-28 px-6 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-accent font-medium uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-primary tracking-tight">Loved by teams everywhere</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="bg-white border border-border rounded-2xl p-6 card-glow"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-secondary leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center text-accent font-semibold text-xs">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="py-20 px-6 bg-accent-light/40 border-y border-accent/10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: 2000, suffix: "+", label: "Teams" },
              { value: 500, suffix: "K+", label: "Emails Sent" },
              { value: 99, suffix: "%", label: "Uptime" },
              { value: 4.9, suffix: "", label: "Rating", decimal: true },
            ].map((stat, i) => (
              <motion.div key={stat.label} variants={staggerItem} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary tracking-tight mb-1">
                  {stat.decimal ? "4.9" : <Counter target={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-sm text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section id="pricing" className="py-28 px-6 relative">
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-accent font-medium uppercase tracking-wider">Pricing</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-primary tracking-tight">Simple, transparent pricing</h2>
            <p className="text-secondary mt-3">No hidden fees. Cancel anytime.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                className={`relative bg-white rounded-2xl p-8 card-glow ${
                  plan.popular
                    ? "border-2 border-accent shadow-lg shadow-accent/10"
                    : "border border-border"
                }`}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium bg-accent text-white px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
                <p className="text-sm text-muted mt-1 mb-5">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
                </div>
                <motion.button
                  className={`w-full py-2.5 rounded-lg text-sm font-medium mb-6 transition-colors ${
                    plan.popular
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-border text-primary hover:bg-surface"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {plan.cta}
                </motion.button>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-secondary">
                      <Check size={14} className="text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="py-28 px-6 bg-surface">
        <div className="mx-auto max-w-2xl">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary tracking-tight">Frequently asked questions</h2>
          </motion.div>

          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="bg-white border border-border rounded-xl overflow-hidden card-glow"
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  whileTap={{ scale: 0.995 }}
                >
                  <span className="text-sm font-medium text-primary pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} className="text-muted shrink-0" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" as const }}
                    >
                      <div className="px-6 pb-5 text-sm text-secondary leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ CTA BANNER ════════ */}
      <section className="py-20 px-6">
        <motion.div
          className="relative mx-auto max-w-4xl animated-gradient rounded-3xl p-14 text-center overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Floating circles in CTA */}
          {[
            { w: 80, x: "5%", y: "10%", o: 0.08 },
            { w: 60, x: "90%", y: "60%", o: 0.06 },
            { w: 100, x: "70%", y: "-10%", o: 0.05 },
          ].map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ width: c.w, height: c.w, left: c.x, top: c.y, opacity: c.o }}
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <h2 className="relative z-10 text-3xl sm:text-4xl font-semibold text-white mb-4">
            Start your free workspace today
          </h2>
          <p className="relative z-10 text-white/80 mb-8 max-w-md mx-auto">
            No credit card required. Set up in 30 seconds.
          </p>
          <Link href="/dashboard">
            <motion.button
              className="relative z-10 bg-white text-accent font-medium px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              Get started free <ArrowRight size={16} className="inline ml-1" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-border py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2C8 2 4 6 4 11c0 4 2 7 5 9l1 6h8l1-6c3-2 5-5 5-9 0-5-4-9-10-9z" fill="#16A34A" opacity="0.15" />
                  <path d="M14 4c-4.5 0-8 3.2-8 7.5 0 3.2 2 5.8 4.8 7l.2.1v.4l.8 5h4.4l.8-5v-.4l.2-.1c2.8-1.2 4.8-3.8 4.8-7C22 7.2 18.5 4 14 4z" stroke="#16A34A" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="font-semibold text-primary">Donna</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">Your AI-powered workspace for email &amp; meetings.</p>
            </div>
            {Object.entries(footerLinks).map(([cat, items]) => (
              <div key={cat}>
                <h4 className="text-sm font-semibold text-primary mb-4">{cat}</h4>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}><a href="#" className="text-sm text-muted hover:text-secondary transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-xs text-muted">&copy; {new Date().getFullYear()} Donna. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
