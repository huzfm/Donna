"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { faqs } from "./data";
import FaqItem from "./FaqItem";

export default function FaqSection() {
  return (
    <section className="bg-slate-50 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="self-start lg:sticky lg:top-32"
          >
            <span className="mb-3 block font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase">
              FAQ
            </span>
            <h2 className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-black md:text-4xl">
              Frequently asked <span className="text-black">questions</span>
            </h2>
            <p className="mb-6 font-mono text-[15px] leading-relaxed text-slate-500">
              Everything you need to know about Donna. Can&apos;t find what you&apos;re looking for?
              Reach out to our team.
            </p>
            <div className="hidden items-center gap-2 font-mono text-sm text-slate-400 lg:flex">
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
