"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const sizes = {
  sm: { box: "h-7 w-7 rounded-lg", icon: 15 as const, word: "text-sm font-bold tracking-tight" },
  md: { box: "h-8 w-8 rounded-lg", icon: 16 as const, word: "text-lg font-black tracking-tight" },
  lg: {
    box: "h-12 w-12 rounded-2xl",
    icon: 24 as const,
    word: "text-xl font-black tracking-tight",
  },
  hero: {
    box: "h-[4.5rem] w-[4.5rem] rounded-2xl",
    icon: 32 as const,
    word: "text-3xl font-black tracking-tight",
  },
  /** Message / typing row (matches previous 9×9 avatars) */
  bubble: {
    box: "h-9 w-9 rounded-xl",
    icon: 15 as const,
    word: "text-sm font-bold tracking-tight",
  },
};

export type BrandSize = keyof typeof sizes;

type BrandLogoProps = {
  size?: BrandSize;
  showWordmark?: boolean;
  /** If omitted, renders a non-link row (e.g. hero). If set, wraps in `next/link`. */
  href?: string | null;
  className?: string;
  /** Continuous float motion (hero empty state) */
  animate?: boolean;
};

/**
 * Same visual language as the homepage nav: emerald Brain tile + Doto “Donna”.
 */
export function BrandLogo({
  size = "md",
  showWordmark = true,
  href,
  className = "",
  animate = false,
}: BrandLogoProps) {
  const s = sizes[size];

  const mark = (
    <motion.div
      className={`flex shrink-0 items-center justify-center bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20 ${s.box}`}
      whileHover={animate ? undefined : { scale: 1.04 }}
      whileTap={animate ? undefined : { scale: 0.98 }}
      animate={animate ? { y: [0, -5, 0] } : undefined}
      transition={
        animate
          ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          : { type: "spring", stiffness: 400, damping: 22 }
      }
    >
      <Brain size={s.icon} className="text-emerald-600" strokeWidth={2} />
    </motion.div>
  );

  const wordmark = showWordmark ? (
    <span className={`font-(family-name:--font-doto) text-slate-950 ${s.word}`}>Donna</span>
  ) : null;

  const inner = (
    <>
      {mark}
      {wordmark}
    </>
  );

  if (href != null) {
    return (
      <Link
        href={href}
        className={`group flex items-center gap-2.5 outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`group flex items-center gap-2.5 ${className}`}>{inner}</div>;
}

/** Icon-only mark for avatars / typing   matches homepage logo tile. */
export function BrandMark({
  size = "md",
  className = "",
  floating = false,
}: {
  size?: BrandSize;
  className?: string;
  floating?: boolean;
}) {
  const s = sizes[size];
  return (
    <motion.div
      className={`flex items-center justify-center bg-emerald-500/10 ring-1 ring-emerald-500/15 ${s.box} ${className}`}
      animate={floating ? { y: [0, -4, 0] } : undefined}
      transition={floating ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <Brain size={s.icon} className="text-emerald-600" strokeWidth={2} />
    </motion.div>
  );
}
