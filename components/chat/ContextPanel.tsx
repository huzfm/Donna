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
          className="border-border flex w-[300px] shrink-0 flex-col border-l bg-slate-950"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
        >
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-primary text-sm font-semibold">Context Window</h3>
              <p className="text-muted mt-0.5 text-[10px]">
                {files.length} document{files.length !== 1 ? "s" : ""} loaded
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="hover:bg-surface-2 text-muted flex h-7 w-7 items-center justify-center rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} />
            </motion.button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            <AnimatePresence>
              {files.map((file, i) => (
                <motion.div
                  key={`${file.name}-${i}`}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                    file.status === "error"
                      ? "border-destructive/20 bg-red-50/50"
                      : file.status === "uploading"
                        ? "border-spark/20 bg-spark-light/50"
                        : "border-border bg-surface/50 hover:bg-surface"
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      file.status === "uploading"
                        ? "bg-spark-light"
                        : file.status === "error"
                          ? "bg-red-50"
                          : "bg-accent-light"
                    }`}
                  >
                    <FileText
                      size={14}
                      className={
                        file.status === "uploading"
                          ? "text-spark"
                          : file.status === "error"
                            ? "text-destructive"
                            : "text-accent"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-primary truncate text-xs font-medium">{file.name}</p>
                    <p className="text-muted text-[10px]">
                      {file.status === "uploading"
                        ? "Processing..."
                        : file.status === "error"
                          ? "Upload failed"
                          : `${(file.size / 1024).toFixed(1)} KB${file.chunks ? ` · ${file.chunks} chunks` : ""}`}
                    </p>
                    {file.status === "uploading" && (
                      <div className="bg-surface-2 mt-1.5 h-1 overflow-hidden rounded-full">
                        <motion.div
                          className="bg-spark h-full rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" as const }}
                        />
                      </div>
                    )}
                  </div>
                  {file.status === "ready" && (
                    <motion.button
                      onClick={() => onRemoveFile(i)}
                      className="text-muted hover:text-destructive flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-red-50"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Trash2 size={12} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {files.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-surface-2 mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
                  <FileText size={20} className="text-muted" />
                </div>
                <p className="text-muted text-xs">No documents uploaded yet</p>
                <p className="text-muted/60 mt-1 text-[10px]">Attach files to add context</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
