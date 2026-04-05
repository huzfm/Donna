"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
      FileText,
      Clock,
      Trash2,
      Loader2,
      CheckCircle2,
      FileSpreadsheet,
      FileType2,
      File,
} from "lucide-react";
import { UploadedFile, timeAgo } from "../types";

export function getFileCategory(fileName: string) {
      const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
      if (ext === "pdf")
            return {
                  label: "PDF",
                  color: "#ef4444",
                  bg: "rgba(239,68,68,0.08)",
                  border: "rgba(239,68,68,0.18)",
                  icon: FileType2,
            };
      if (["doc", "docx"].includes(ext))
            return {
                  label: "Word",
                  color: "#3b82f6",
                  bg: "rgba(59,130,246,0.08)",
                  border: "rgba(59,130,246,0.18)",
                  icon: FileText,
            };
      if (["xls", "xlsx", "csv"].includes(ext))
            return {
                  label: "Sheet",
                  color: "#10b981",
                  bg: "rgba(16,185,129,0.08)",
                  border: "rgba(16,185,129,0.18)",
                  icon: FileSpreadsheet,
            };
      if (ext === "txt")
            return {
                  label: "Text",
                  color: "#8b5cf6",
                  bg: "rgba(139,92,246,0.08)",
                  border: "rgba(139,92,246,0.18)",
                  icon: FileText,
            };
      return {
            label: "File",
            color: "#94a3b8",
            bg: "rgba(148,163,184,0.08)",
            border: "rgba(148,163,184,0.18)",
            icon: File,
      };
}

interface FileCardProps {
      file: UploadedFile;
      index: number;
      deleting: string | null;
      onDelete: (name: string) => void;
}

const FileCard = memo(function FileCard({ file, index, deleting, onDelete }: FileCardProps) {
      const cat = getFileCategory(file.file_name);
      const Icon = cat.icon;
      return (
            <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03, duration: 0.15 }}
                  className="group relative flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md"
            >
                  <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                  >
                        <Icon size={16} style={{ color: cat.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-900">
                              {file.file_name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span
                                    className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase"
                                    style={{
                                          background: cat.bg,
                                          color: cat.color,
                                          border: `1px solid ${cat.border}`,
                                    }}
                              >
                                    {cat.label}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <Clock size={8} />
                                    {timeAgo(file.uploaded_at)}
                              </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-black">
                              <CheckCircle2 size={10} />
                              <span>Indexed</span>
                        </div>
                  </div>
                  <button
                        type="button"
                        onClick={() => onDelete(file.file_name)}
                        disabled={deleting === file.file_name}
                        title="Delete"
                        className="absolute top-3 right-3 rounded-lg p-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                        {deleting === file.file_name ? (
                              <Loader2 size={13} className="animate-spin" />
                        ) : (
                              <Trash2 size={13} />
                        )}
                  </button>
            </motion.div>
      );
});

export default FileCard;
