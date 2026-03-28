"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Brain, ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Docs", href: "#" },
  { label: "About", href: "/about", isRoute: true },
];

function NavAuthButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/supabase-browser").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setLoggedIn(!!user);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <div className="h-8 w-[100px]" />;

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={loggedIn ? "/dashboard" : "/login"}
        className="group inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-2 text-[13px] font-semibold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30"
      >
        {loggedIn ? "Dashboard" : "Get started"}
        <ArrowRight
          size={13}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30);
  });

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4">
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-4xl rounded-full border px-3 py-1.5 backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? "border-emerald-200/50 bg-white/90 shadow-[0_8px_32px_-8px_rgba(16,185,129,0.15)]"
            : "border-slate-200/80 bg-white/80 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)]"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 pl-2">
            <motion.div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                scrolled ? "bg-emerald-500/15" : "bg-emerald-500/10"
              } group-hover:bg-emerald-500/20 group-hover:shadow-md group-hover:shadow-emerald-500/10`}
              whileHover={{ rotate: 6, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Brain size={16} className="text-emerald-600" strokeWidth={2.2} />
            </motion.div>
            <span className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950 transition-colors group-hover:text-emerald-700">
              Donna
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" onMouseLeave={() => setHoveredLink(null)}>
            {NAV_LINKS.map((link) => {
              const isHovered = hoveredLink === link.label;
              const Tag = link.isRoute ? Link : "a";
              return (
                <Tag
                  key={link.label}
                  href={link.href}
                  className="nav-link-enhanced relative"
                  onMouseEnter={() => setHoveredLink(link.label)}
                >
                  {/* Hover pill background */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full bg-emerald-50 ring-1 ring-emerald-200/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className={`relative z-10 transition-colors duration-150 ${isHovered ? "text-emerald-800" : ""}`}>
                    {link.label}
                  </span>
                </Tag>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <NavAuthButton />

            {/* Mobile toggle */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800 md:hidden"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-18 right-4 left-4 z-50 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {NAV_LINKS.map((link) => {
              const Tag = link.isRoute ? Link : "a";
              return (
                <Tag
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {link.label}
                </Tag>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
