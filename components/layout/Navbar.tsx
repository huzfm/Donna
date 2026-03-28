"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[60] origin-left"
        style={{ scaleX }}
      />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 12 }} transition={{ type: "spring", stiffness: 300 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2C8 2 4 6 4 11c0 4 2 7 5 9l1 6h8l1-6c3-2 5-5 5-9 0-5-4-9-10-9z" fill="#16A34A" opacity="0.15" />
                <path d="M14 4c-4.5 0-8 3.2-8 7.5 0 3.2 2 5.8 4.8 7l.2.1v.4l.8 5h4.4l.8-5v-.4l.2-.1c2.8-1.2 4.8-3.8 4.8-7C22 7.2 18.5 4 14 4z" stroke="#16A34A" strokeWidth="1.5" fill="none" />
                <path d="M12 17h4M11 20h6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
            <span className="text-lg font-semibold text-primary tracking-tight">Donna</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm text-secondary hover:text-primary transition-colors"
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Link href="/dashboard">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </motion.header>
    </>
  );
}
