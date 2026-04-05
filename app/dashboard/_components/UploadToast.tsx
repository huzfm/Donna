"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UploadQueueItem } from "../_hooks/useUpload";

export default function UploadToast({
      queue,
      onDismiss,
}: {
      queue: UploadQueueItem[];
      onDismiss: (id: string) => void;
}) {
      return (
            <AnimatePresence>
                  {queue.length > 0 && (
                        <div className="fixed right-4 bottom-4 z-[70] flex flex-col gap-2 sm:right-6 sm:bottom-6">
                              {queue.map((item) => (
                                    <motion.div
                                          key={item.id}
                                          initial={{ opacity: 0, y: 16, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                          transition={{ duration: 0.18 }}
                                          className={`flex max-w-xs min-w-[240px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
                                                item.status === "done"
                                                      ? "border-emerald-200 bg-white"
                                                      : item.status === "error"
                                                        ? "border-red-200 bg-white"
                                                        : "border-slate-200 bg-white"
                                          }`}
                                    >
                                          <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                                      item.status === "done"
                                                            ? "bg-emerald-100"
                                                            : item.status === "error"
                                                              ? "bg-red-100"
                                                              : "bg-slate-100"
                                                }`}
                                          >
                                                {item.status === "uploading" ? (
                                                      <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{
                                                                  duration: 1,
                                                                  repeat: Infinity,
                                                                  ease: "linear",
                                                            }}
                                                      >
                                                            <svg
                                                                  className="h-4 w-4 text-slate-700"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                            >
                                                                  <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="3"
                                                                  />
                                                                  <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                  />
                                                            </svg>
                                                      </motion.div>
                                                ) : item.status === "done" ? (
                                                      <svg
                                                            className="h-4 w-4 text-emerald-600"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                      >
                                                            <polyline points="20 6 9 17 4 12" />
                                                      </svg>
                                                ) : (
                                                      <svg
                                                            className="h-4 w-4 text-red-500"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                      >
                                                            <line x1="18" y1="6" x2="6" y2="18" />
                                                            <line x1="6" y1="6" x2="18" y2="18" />
                                                      </svg>
                                                )}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12.5px] font-semibold text-slate-900">
                                                      {item.name}
                                                </p>
                                                <p
                                                      className={`text-[10.5px] font-medium ${
                                                            item.status === "done"
                                                                  ? "text-emerald-600"
                                                                  : item.status === "error"
                                                                    ? "text-red-500"
                                                                    : "text-slate-500"
                                                      }`}
                                                >
                                                      {item.status === "uploading"
                                                            ? "Uploading & indexing…"
                                                            : item.status === "done"
                                                              ? "Uploaded & indexed ✓"
                                                              : (item.error ?? "Upload failed")}
                                                </p>
                                          </div>

                                          {item.status === "error" && (
                                                <button
                                                      onClick={() => onDismiss(item.id)}
                                                      className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                      <svg
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                      >
                                                            <line x1="18" y1="6" x2="6" y2="18" />
                                                            <line x1="6" y1="6" x2="18" y2="18" />
                                                      </svg>
                                                </button>
                                          )}
                                    </motion.div>
                              ))}
                        </div>
                  )}
            </AnimatePresence>
      );
}
