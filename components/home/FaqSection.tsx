"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { faqs } from "./data";
import FaqItem from "./FaqItem";

export default function FaqSection() {
  return (
    <section className="py-28 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-32 self-start"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 mb-4 font-(family-name:--font-doto)">
              Frequently asked{" "}
              <span className="text-emerald-600">questions</span>
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-6">
              Everything you need to know about Donna. Can&apos;t find what you&apos;re looking for? Reach out to our team.
            </p>
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
              <MessageSquare size={14} />
              <span>{faqs.length} questions answered</span>
            </div>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} icon={faq.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
