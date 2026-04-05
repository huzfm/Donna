"use client";

import { motion } from "framer-motion";
import { ChatMessage } from "../types";
import MessageRow from "./MessageRow";
import { BrandMark } from "@/components/brand/BrandLogo";

interface ChatMessagesProps {
      messages: ChatMessage[];
      loading: boolean;
      loadingText: string;
      chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
      messages,
      loading,
      loadingText,
      chatEndRef,
}: ChatMessagesProps) {
      if (messages.length === 0) {
            return (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 pb-8 text-center">
                        <motion.div
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-300/35 bg-white/70 px-6 py-10 shadow-[0_4px_32px_-12px_rgba(16,185,129,0.12)] ring-1 ring-slate-300/5 backdrop-blur-sm"
                        >
                              <div className="lightning-grid pointer-events-none absolute inset-0 opacity-[0.22]">
                                    <div className="lightning-grid-lines" />
                              </div>
                              <div className="relative">
                                    <h2 className="mb-2 font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                                          Hello, I&apos;m{" "}
                                          <span className="bg-slate-900 bg-clip-text text-transparent">
                                                Donna
                                          </span>
                                    </h2>
                                    <p className="mx-auto mb-3 max-w-md font-mono text-sm leading-relaxed text-slate-600">
                                          Your personal AI assistant for documents, email, and
                                          calendar.
                                    </p>
                                    <p className="mx-auto max-w-md font-mono text-sm text-slate-500">
                                          Type a message below or use{" "}
                                          <span className="font-mono text-xs text-black">/</span>{" "}
                                          commands.
                                    </p>
                              </div>
                        </motion.div>
                  </div>
            );
      }

      return (
            <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
                  {messages.map((msg, idx) => (
                        <MessageRow key={msg.id} msg={msg} animate={idx === messages.length - 1} />
                  ))}
                  {loading && (
                        <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-3.5"
                        >
                              <div className="mt-0.5 shrink-0 shadow-sm shadow-slate-300/10">
                                    <BrandMark size="bubble" floating />
                              </div>
                              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-300/90 bg-slate-50 px-4 py-3 ring-1 ring-slate-300/6">
                                    <span className="mr-1 text-[10px] font-semibold tracking-wider text-black uppercase">
                                          {loadingText}
                                    </span>
                                    {[0, 1, 2].map((i) => (
                                          <motion.div
                                                key={i}
                                                className="h-1.5 w-1.5 rounded-full bg-slate-900"
                                                animate={{
                                                      opacity: [0.3, 1, 0.3],
                                                      scale: [0.8, 1.1, 0.8],
                                                }}
                                                transition={{
                                                      delay: i * 0.18,
                                                      duration: 1,
                                                      repeat: Infinity,
                                                }}
                                          />
                                    ))}
                              </div>
                        </motion.div>
                  )}
                  <div ref={chatEndRef} />
            </div>
      );
}
