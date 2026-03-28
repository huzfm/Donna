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
          className="w-[300px] border-l border-border bg-white flex flex-col shrink-0"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-primary">Context Window</h3>
              <p className="text-[10px] text-muted mt-0.5">{files.length} document{files.length !== 1 ? "s" : ""} loaded</p>
            </div>
            <motion.button
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-surface-2 flex items-center justify-center text-muted"
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <AnimatePresence>
              {files.map((file, i) => (
                <motion.div
                  key={`${file.name}-${i}`}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    file.status === "uploading"
                      ? "bg-spark-light"
                      : file.status === "error"
                        ? "bg-red-50"
                        : "bg-accent-light"
                  }`}>
                    <FileText size={14} className={
                      file.status === "uploading" ? "text-spark" :
                      file.status === "error" ? "text-destructive" : "text-accent"
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">{file.name}</p>
                    <p className="text-[10px] text-muted">
                      {file.status === "uploading"
                        ? "Processing..."
                        : file.status === "error"
                          ? "Upload failed"
                          : `${(file.size / 1024).toFixed(1)} KB${file.chunks ? ` · ${file.chunks} chunks` : ""}`}
                    </p>
                    {file.status === "uploading" && (
                      <div className="mt-1.5 h-1 bg-surface-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-spark rounded-full"
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
                      className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center text-muted hover:text-destructive shrink-0"
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
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mb-3">
                  <FileText size={20} className="text-muted" />
                </div>
                <p className="text-xs text-muted">No documents uploaded yet</p>
                <p className="text-[10px] text-muted/60 mt-1">Attach files to add context</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
