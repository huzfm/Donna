"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Clock,
  Trash2,
  Loader2,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileType2,
  File,
  FolderOpen,
  Plus,
} from "lucide-react";
import { UploadedFile, timeAgo } from "./types";

function getFileCategory(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf")
    return {
      label: "PDF",
      color: "#f87171",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.18)",
      icon: FileType2,
    };
  if (["doc", "docx"].includes(ext))
    return {
      label: "Word",
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.18)",
      icon: FileText,
    };
  if (["xls", "xlsx", "csv"].includes(ext))
    return {
      label: "Sheet",
      color: "#34d399",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.18)",
      icon: FileSpreadsheet,
    };
  if (ext === "txt")
    return {
      label: "Text",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.18)",
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

export default function FilesPanel({
  files,
  filesLoading,
  uploading,
  onUpload,
  onDelete,
}: {
  files: UploadedFile[];
  filesLoading: boolean;
  uploading: boolean;
  onUpload: (f: File) => void;
  onDelete: (name: string) => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const confirmDelete = async (fileName: string) => {
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    setDeleting(fileName);
    await onDelete(fileName);
    setDeleting(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(onUpload);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-1 flex-col overflow-hidden bg-[#09090b]"
    >
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Database size={14} className="text-zinc-500" />
          <h1 className="text-sm font-semibold text-zinc-100">Knowledge Base</h1>
          {files.length > 0 && (
            <span className="rounded-full border border-zinc-700/50 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
              {files.length}
            </span>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200/10 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 transition-all hover:bg-white">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          {uploading ? "Uploading…" : "Add files"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
            multiple
            onChange={(e) => Array.from(e.target.files || []).forEach(onUpload)}
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Drop Zone ── */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mx-6 mt-5 flex cursor-pointer items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 ${
            dragOver
              ? "border-zinc-500 bg-zinc-800/50"
              : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
          }`}
          style={{ border: "2px dashed" }}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
            className="hidden"
            multiple
            onChange={(e) => Array.from(e.target.files || []).forEach(onUpload)}
          />

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700/40 bg-zinc-800/80">
            {uploading ? (
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            ) : (
              <Upload size={16} className="text-zinc-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {uploading ? (
              <p className="animate-pulse text-sm text-zinc-400">Processing files…</p>
            ) : dragOver ? (
              <p className="text-sm font-medium text-zinc-200">Release to upload</p>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-300">
                  {dragOver ? "Release to upload" : "Drop files or click to browse"}
                </p>
                <p className="mt-0.5 text-xs text-zinc-600">PDF · Word · Excel · CSV · TXT</p>
              </>
            )}
          </div>

          {!uploading && !dragOver && (
            <div className="flex shrink-0 items-center gap-1">
              {["PDF", "DOC", "XLS"].map((t) => (
                <span
                  key={t}
                  className="rounded border border-zinc-700/40 bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </label>

        {/* ── File list ── */}
        <div className="mt-5 px-6 pb-6">
          {filesLoading ? (
            <div className="space-y-px">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="mb-px h-14 animate-pulse rounded-xl border border-zinc-800/60 bg-zinc-900/60"
                />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                <FolderOpen size={22} className="text-zinc-700" />
              </div>
              <p className="text-sm font-medium text-zinc-500">No files yet</p>
              <p className="mt-1 max-w-[200px] text-center text-xs text-zinc-700">
                Upload documents to start building your knowledge base
              </p>
            </div>
          ) : (
            <>
              <p className="mb-3 px-1 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
                {files.length} indexed file{files.length !== 1 ? "s" : ""}
              </p>

              {/* ── ROW LIST ── */}
              <div className="overflow-hidden rounded-xl border border-zinc-800/80">
                <AnimatePresence>
                  {files.map((f, i) => {
                    const cat = getFileCategory(f.file_name);
                    const Icon = cat.icon;
                    const isLast = i === files.length - 1;

                    return (
                      <motion.div
                        key={`${f.file_name}-${i}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.15 }}
                        className={`group flex items-center gap-3 bg-zinc-900/30 px-4 py-3 transition-all duration-150 hover:bg-zinc-900/70 ${!isLast ? "border-b border-zinc-800/60" : ""}`}
                      >
                        {/* File type icon */}
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                        >
                          <Icon size={13} style={{ color: cat.color }} />
                        </div>

                        {/* Name */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-zinc-200">
                            {f.file_name}
                          </p>
                        </div>

                        {/* Badge */}
                        <span
                          className="hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline"
                          style={{
                            background: cat.bg,
                            color: cat.color,
                            border: `1px solid ${cat.border}`,
                          }}
                        >
                          {cat.label}
                        </span>

                        {/* Time */}
                        <div className="flex hidden shrink-0 items-center gap-1 md:flex">
                          <Clock size={9} className="text-zinc-700" />
                          <span className="text-[11px] text-zinc-600">
                            {timeAgo(f.uploaded_at)}
                          </span>
                        </div>

                        {/* Indexed check */}
                        <CheckCircle2
                          size={13}
                          className="shrink-0 text-emerald-500/50 transition-colors group-hover:text-emerald-500"
                        />

                        {/* Delete */}
                        <button
                          onClick={() => confirmDelete(f.file_name)}
                          disabled={deleting === f.file_name}
                          title="Delete"
                          className="shrink-0 rounded-lg p-1.5 text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                        >
                          {deleting === f.file_name ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
