"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, X, ChevronRight, Sparkles } from "lucide-react";
import { SLASH_COMMANDS } from "../types";

export default function SlashPopup({
      query,
      onSelect,
      onClose,
}: {
      query: string;
      onSelect: (fill: string) => void;
      onClose: () => void;
}) {
      const filtered = SLASH_COMMANDS.filter((c) =>
            c.trigger.toLowerCase().startsWith(query.toLowerCase())
      );
      const [hovered, setHovered] = useState<string | null>(null);
      if (!filtered.length) return null;

      const hoveredCmd = filtered.find((c) => c.trigger === hovered) ?? filtered[0];

      return (
            <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 bottom-full left-0 z-50 mb-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
                  <div className="flex w-52 shrink-0 flex-col border-r border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
                              <div className="flex items-center gap-1.5">
                                    <Zap size={10} className="text-amber-500" />
                                    <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                                          Commands
                                    </span>
                              </div>
                              <button
                                    onClick={onClose}
                                    className="text-slate-500 transition-colors hover:text-slate-900"
                              >
                                    <X size={11} />
                              </button>
                        </div>
                        <div className="py-1">
                              {filtered.map((cmd) => (
                                    <button
                                          key={cmd.trigger}
                                          onClick={() => onSelect(cmd.fill)}
                                          onMouseEnter={() => setHovered(cmd.trigger)}
                                          className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-all ${hovered === cmd.trigger ? "bg-slate-100" : "bg-transparent"}`}
                                    >
                                          <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${hovered === cmd.trigger ? "bg-slate-200" : "bg-slate-100"}`}
                                          >
                                                <cmd.icon
                                                      size={13}
                                                      className={
                                                            hovered === cmd.trigger
                                                                  ? "text-black"
                                                                  : "text-slate-500"
                                                      }
                                                />
                                          </div>
                                          <div className="min-w-0">
                                                <p className="font-mono text-[12.5px] font-medium text-slate-900">
                                                      {cmd.trigger}
                                                </p>
                                                <p className="truncate text-[10.5px] text-slate-500">
                                                      {cmd.description}
                                                </p>
                                          </div>
                                    </button>
                              ))}
                        </div>
                  </div>

                  <div className="min-w-0 flex-1 bg-slate-50/50 p-3">
                        <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                              <Sparkles size={9} className="text-black" />
                              Suggestions
                        </p>
                        <div className="space-y-1.5">
                              {(hoveredCmd?.suggestions ?? []).map((s, i) => (
                                    <button
                                          key={i}
                                          onClick={() =>
                                                onSelect(
                                                      hoveredCmd.trigger === "/email"
                                                            ? hoveredCmd.fill
                                                            : s
                                                )
                                          }
                                          className="flex w-full items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-all hover:border-slate-300 hover:bg-slate-100/80"
                                    >
                                          <ChevronRight
                                                size={11}
                                                className="mt-0.5 shrink-0 text-black"
                                          />
                                          <span className="text-[12px] leading-snug text-slate-700">
                                                {s}
                                          </span>
                                    </button>
                              ))}
                        </div>
                  </div>
            </motion.div>
      );
}
