"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Trash2 } from "lucide-react";

export interface UploadedFile {
      name: string;
      size: number;
      chunks?: number;
      status: "uploading" | "ready" | "error";
}

interface ContextPanelProps {
      files: UploadedFile[];
      onRemoveFile: (index: number) => void;
      onClose: () => void;
      isOpen: boolean;
}

export default function ContextPanel({ files, onRemoveFile, onClose, isOpen }: ContextPanelProps) {
      return (
            <AnimatePresence>
                  {isOpen && (
                        <motion.div
                              className="flex w-[300px] shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-slate-50"
                              initial={{ width: 0, opacity: 0 }}
                              animate={{ width: 300, opacity: 1 }}
                              exit={{ width: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 380, damping: 38 }}
                        >
                              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                                    <div>
                                          <h3 className="font-(family-name:--font-doto) text-sm font-black text-slate-950">
                                                Context
                                          </h3>
                                          <p className="mt-0.5 text-[10px] text-slate-500">
                                                {files.length} document
                                                {files.length !== 1 ? "s" : ""} loaded
                                          </p>
                                    </div>
                                    <motion.button
                                          onClick={onClose}
                                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                          whileTap={{ scale: 0.92 }}
                                          whileHover={{ rotate: 90 }}
                                    >
                                          <X size={14} />
                                    </motion.button>
                              </div>

                              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                                    <AnimatePresence mode="popLayout">
                                          {files.map((file, i) => (
                                                <motion.div
                                                      key={`${file.name}-${i}`}
                                                      layout
                                                      className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                                                            file.status === "error"
                                                                  ? "border-red-200 bg-red-50"
                                                                  : file.status === "uploading"
                                                                    ? "border-violet-200 bg-violet-50/80"
                                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                                      }`}
                                                      initial={{ opacity: 0, x: 16, scale: 0.98 }}
                                                      animate={{ opacity: 1, x: 0, scale: 1 }}
                                                      exit={{ opacity: 0, x: -12, scale: 0.96 }}
                                                      transition={{
                                                            type: "spring",
                                                            stiffness: 400,
                                                            damping: 30,
                                                      }}
                                                >
                                                      <div
                                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                                  file.status === "uploading"
                                                                        ? "bg-violet-100"
                                                                        : file.status === "error"
                                                                          ? "bg-red-100"
                                                                          : "bg-emerald-100"
                                                            }`}
                                                      >
                                                            <FileText
                                                                  size={14}
                                                                  className={
                                                                        file.status === "uploading"
                                                                              ? "text-violet-700"
                                                                              : file.status ===
                                                                                  "error"
                                                                                ? "text-red-600"
                                                                                : "text-emerald-700"
                                                                  }
                                                            />
                                                      </div>
                                                      <div className="min-w-0 flex-1">
                                                            <p className="truncate text-xs font-medium text-slate-900">
                                                                  {file.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500">
                                                                  {file.status === "uploading"
                                                                        ? "Processing..."
                                                                        : file.status === "error"
                                                                          ? "Upload failed"
                                                                          : `${(file.size / 1024).toFixed(1)} KB${file.chunks ? ` · ${file.chunks} chunks` : ""}`}
                                                            </p>
                                                            {file.status === "uploading" && (
                                                                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
                                                                        <motion.div
                                                                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"
                                                                              initial={{
                                                                                    width: "0%",
                                                                              }}
                                                                              animate={{
                                                                                    width: "100%",
                                                                              }}
                                                                              transition={{
                                                                                    duration: 3,
                                                                                    ease: "easeInOut" as const,
                                                                              }}
                                                                        />
                                                                  </div>
                                                            )}
                                                      </div>
                                                      {file.status === "ready" && (
                                                            <motion.button
                                                                  onClick={() => onRemoveFile(i)}
                                                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                                  whileTap={{ scale: 0.85 }}
                                                            >
                                                                  <Trash2 size={12} />
                                                            </motion.button>
                                                      )}
                                                </motion.div>
                                          ))}
                                    </AnimatePresence>

                                    {files.length === 0 && (
                                          <motion.div
                                                className="flex flex-col items-center justify-center py-12 text-center"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                      type: "spring",
                                                      stiffness: 300,
                                                      damping: 28,
                                                }}
                                          >
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white">
                                                      <FileText
                                                            size={20}
                                                            className="text-slate-400"
                                                      />
                                                </div>
                                                <p className="text-xs text-slate-600">
                                                      No documents uploaded yet
                                                </p>
                                                <p className="mt-1 text-[10px] text-slate-400">
                                                      Attach files to add context
                                                </p>
                                          </motion.div>
                                    )}
                              </div>
                        </motion.div>
                  )}
            </AnimatePresence>
      );
}
