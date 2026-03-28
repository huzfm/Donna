"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 1.5, ease: "easeOut" as const });
      return controls.stop;
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  index: number;
}

export default function StatCard({ label, value, icon: Icon, index }: StatCardProps) {
  return (
    <motion.div
      className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-slate-600"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" as const }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-secondary text-sm">{label}</span>
        <div className="bg-accent-light flex h-9 w-9 items-center justify-center rounded-lg">
          <Icon size={18} className="text-accent" />
        </div>
      </div>
      <div className="text-primary text-3xl font-semibold tracking-tight">
        <AnimatedNumber target={value} />
      </div>
    </motion.div>
  );
}
