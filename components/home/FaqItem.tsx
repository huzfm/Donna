"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
      question: string;
      answer: string;
      index: number;
      icon: React.ElementType;
}

export default function FaqItem({ question, answer, index, icon: Icon }: FaqItemProps) {
      const [open, setOpen] = useState(false);
      return (
            <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
            >
                  <button
                        onClick={() => setOpen((v) => !v)}
                        className={`flex w-full items-center gap-4 rounded-2xl border bg-white px-6 py-5 text-left transition-all duration-300 ${
                              open
                                    ? "border-slate-400 bg-slate-50"
                                    : "border-slate-200 hover:border-slate-400"
                        }`}
                  >
                        <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                                    open
                                          ? "border border-slate-200 bg-white shadow-sm"
                                          : "bg-slate-100"
                              }`}
                        >
                              <Icon
                                    size={16}
                                    className={`transition-colors duration-300 ${open ? "text-black" : "text-slate-400"}`}
                              />
                        </div>
                        <span className="flex-1 font-(family-name:--font-doto) text-sm leading-snug font-bold text-black">
                              {question}
                        </span>
                        <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                                    open
                                          ? "rotate-180 border-slate-400 bg-white shadow-sm"
                                          : "border-slate-200 bg-slate-50"
                              }`}
                        >
                              <ChevronDown
                                    size={14}
                                    className={`transition-colors duration-300 ${open ? "text-black" : "text-slate-400"}`}
                              />
                        </div>
                  </button>
                  <AnimatePresence>
                        {open && (
                              <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                              >
                                    <div className="pt-2 pr-6 pb-5 pl-19 font-mono text-sm leading-relaxed text-slate-500">
                                          {answer}
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </motion.div>
      );
}
