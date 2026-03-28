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
    accentClass: "text-accent",
    bgClass: "bg-accent-light",
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Smart Calendar",
    description: "Schedule meetings intelligently",
    prompt: "Help me schedule a meeting with my team",
    accentClass: "text-spark",
    bgClass: "bg-spark-light",
  },
  {
    id: "gmail-analysis",
    icon: BarChart3,
    label: "Gmail Analysis",
    description: "Analyze email patterns and insights",
    prompt: "Analyze my recent email activity and give me insights",
    accentClass: "text-accent",
    bgClass: "bg-accent-light",
  },
  {
    id: "doc-analysis",
    icon: FileSearch,
    label: "Document Analysis",
    description: "Query and understand your documents",
    prompt: "Analyze the uploaded documents and summarize key points",
    accentClass: "text-spark",
    bgClass: "bg-spark-light",
  },
];

interface FeatureCardsProps {
  onSelectFeature: (prompt: string) => void;
}

export default function FeatureCards({ onSelectFeature }: FeatureCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 max-w-lg mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {chatFeatures.map((feature) => (
        <motion.button
          key={feature.id}
          variants={staggerItem}
          onClick={() => onSelectFeature(feature.prompt)}
          className="group flex flex-col items-start gap-3 p-4 rounded-xl border border-border bg-slate-900 hover:border-accent/30 card-glow text-left transition-all"
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
        >
          <div className={`w-9 h-9 rounded-lg ${feature.bgClass} flex items-center justify-center`}>
            <feature.icon size={16} className={feature.accentClass} />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">{feature.label}</p>
            <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{feature.description}</p>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
