"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { ChatMessage } from "../types";
import MarkdownContent from "../MarkdownContent";
import { BrandMark } from "@/components/brand/BrandLogo";

function CopyButton({ text }: { text: string }) {
      const [copied, setCopied] = useState(false);
      return (
            <button
                  onClick={() => {
                        navigator.clipboard.writeText(text);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                  }}
                  className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all group-hover:bg-slate-100 group-hover:text-slate-800 group-hover:opacity-100"
                  title="Copy"
            >
                  {copied ? <Check size={13} className="text-black" /> : <Copy size={13} />}
            </button>
      );
}

const MessageRow = memo(function MessageRow({
      msg,
      animate,
}: {
      msg: ChatMessage;
      animate: boolean;
}) {
      if (msg.role === "user") {
            return (
                  <motion.div
                        initial={animate ? { opacity: 0, y: 8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="group flex justify-end gap-3"
                  >
                        <div className="max-w-[min(82%,32rem)] rounded-2xl rounded-br-sm border border-slate-200/90 bg-slate-100/95 px-5 py-3.5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-slate-900 shadow-sm ring-1 ring-slate-900/4">
                              {msg.content}
                        </div>
                  </motion.div>
            );
      }

      return (
            <motion.div
                  initial={animate ? { opacity: 0, y: 8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="group flex items-start gap-3.5"
            >
                  <div className="mt-0.5 shrink-0 shadow-sm shadow-slate-300/10">
                        <BrandMark size="bubble" />
                  </div>
                  <div className="min-w-0 flex-1">
                        <div className="prose-response">
                              <MarkdownContent content={msg.content} />
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                              <CopyButton text={msg.content} />
                              <span className="text-[10px] text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                                    {msg.timestamp}
                              </span>
                              {msg.status === "cancelled" && (
                                    <span className="ml-1 text-[10px]" style={{ color: "#fbbf24" }}>
                                          · Stopped
                                    </span>
                              )}
                        </div>
                  </div>
            </motion.div>
      );
});

export default MessageRow;
