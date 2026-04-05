"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#tech-stack" },
];

const ACCOUNT_LINKS = [
  { label: "Log in", href: "/login" },
  { label: "Sign up", href: "/signup" },
  { label: "Dashboard", href: "/dashboard" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

function smoothScrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isHash = href.startsWith("#");

  const inner = (
    <span className="group flex items-center gap-1 font-mono text-sm text-slate-300 transition-all duration-200 hover:text-white">
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/50 transition-all duration-300 group-hover:w-full" />
      </span>
      <ArrowUpRight
        size={11}
        className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-60"
      />
    </span>
  );

  if (isHash) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo(href.slice(1));
        }}
      >
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800/80 bg-[#020617] px-6 pt-16 pb-8 text-white">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-white/2 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Grid */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand column */}
          <motion.div className="md:col-span-5" {...fadeUp} transition={{ duration: 0.5 }}>
            <Link href="/" className="group mb-4 inline-flex items-center gap-2.5">
              <span className="font-(family-name:--font-doto) text-2xl font-black tracking-tight text-white transition-opacity duration-200 group-hover:opacity-80">
                Donna
              </span>
            </Link>
            <p className="mb-6 max-w-xs font-mono text-sm leading-relaxed text-slate-300">
              Your personal AI workspace — understands documents, manages emails, and helps you work
              smarter.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            className="md:col-span-3 md:col-start-7"
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="mb-4 font-mono text-xs font-semibold tracking-widest text-slate-200 uppercase">
              Product
            </h4>
            <div className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </motion.div>

          {/* Account */}
          <motion.div
            className="md:col-span-2"
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h4 className="mb-4 font-mono text-xs font-semibold tracking-widest text-slate-200 uppercase">
              Account
            </h4>
            <div className="space-y-3">
              {ACCOUNT_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-6 sm:flex-row"
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="font-mono text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Donna. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
            Built with Next.js, Supabase &amp; Groq
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
