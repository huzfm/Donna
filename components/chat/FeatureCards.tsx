"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, FileSearch, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

export interface Feature {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  prompt: string;
  accentClass: string;
  bgClass: string;
}

export const chatFeatures: Feature[] = [
  {
    id: "email",
    icon: Mail,
    label: "Email AI",
    description: "Draft and send emails with AI assistance",
    prompt: "Help me compose a professional email",
    accentClass: "text-violet-700",
    bgClass: "bg-violet-100",
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Smart Calendar",
    description: "Schedule meetings intelligently",
    prompt: "Help me schedule a meeting with my team",
    accentClass: "text-emerald-700",
    bgClass: "bg-emerald-100",
  },
  {
    id: "gmail-analysis",
    icon: BarChart3,
    label: "Gmail Analysis",
    description: "Analyze email patterns and insights",
    prompt: "Analyze my recent email activity and give me insights",
    accentClass: "text-violet-700",
    bgClass: "bg-violet-100",
  },
  {
    id: "doc-analysis",
    icon: FileSearch,
    label: "Document Analysis",
    description: "Query and understand your documents",
    prompt: "Analyze the uploaded documents and summarize key points",
    accentClass: "text-emerald-700",
    bgClass: "bg-emerald-100",
  },
];

interface FeatureCardsProps {
  onSelectFeature: (prompt: string) => void;
}

export default function FeatureCards({ onSelectFeature }: FeatureCardsProps) {
  return (
    <motion.div
      className="mx-auto grid max-w-lg grid-cols-2 gap-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {chatFeatures.map((feature) => (
        <motion.button
          key={feature.id}
          variants={staggerItem}
          onClick={() => onSelectFeature(feature.prompt)}
          className="card-glow group flex flex-col items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-sm ring-1 ring-slate-900/3 transition-all duration-200 hover:border-emerald-200/90 hover:shadow-lg hover:shadow-emerald-500/10"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/[0.04] ${feature.bgClass}`}
            whileHover={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 0.45 }}
          >
            <feature.icon size={16} className={feature.accentClass} />
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{feature.label}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{feature.description}</p>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
