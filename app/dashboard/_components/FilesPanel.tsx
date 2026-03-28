"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, Clock, Trash2, Loader2,
  CheckCircle2, Database, FileSpreadsheet, FileType2,
  File, FolderOpen, Plus
} from "lucide-react";
import { UploadedFile, timeAgo } from "./types";

function getFileCategory(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return { label: "PDF", color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)", icon: FileType2 };
  if (["doc", "docx"].includes(ext)) return { label: "Word", color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.18)", icon: FileText };
  if (["xls", "xlsx", "csv"].includes(ext)) return { label: "Sheet", color: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.18)", icon: FileSpreadsheet };
  if (ext === "txt") return { label: "Text", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.18)", icon: FileText };
  return { label: "File", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.18)", icon: File };
}

export default function FilesPanel({ files, filesLoading, uploading, onUpload, onDelete }: {
  files: UploadedFile[]; filesLoading: boolean; uploading: boolean;
  onUpload: (f: File) => void; onDelete: (name: string) => void;
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="flex flex-col flex-1 overflow-hidden bg-[#09090b]"
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <Database size={14} className="text-zinc-500" />
          <h1 className="text-sm font-semibold text-zinc-100">Knowledge Base</h1>
          {files.length > 0 && (
            <span className="text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50 px-2 py-0.5 rounded-full">
              {files.length}
            </span>
          )}
        </div>

        <label className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all bg-zinc-100 hover:bg-white text-zinc-900 border border-zinc-200/10">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          {uploading ? "Uploading…" : "Add files"}
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv" multiple
            onChange={e => Array.from(e.target.files || []).forEach(onUpload)} />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Drop Zone ── */}
        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex items-center gap-4 mx-6 mt-5 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-200 ${
            dragOver ? "border-zinc-500 bg-zinc-800/50" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
          }`}
          style={{ border: "2px dashed" }}
        >
          <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv" className="hidden" multiple
            onChange={e => Array.from(e.target.files || []).forEach(onUpload)} />

          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center shrink-0">
            {uploading
              ? <Loader2 size={16} className="text-zinc-400 animate-spin" />
              : <Upload size={16} className="text-zinc-500" />
            }
          </div>

          <div className="flex-1 min-w-0">
            {uploading ? (
              <p className="text-sm text-zinc-400 animate-pulse">Processing files…</p>
            ) : dragOver ? (
              <p className="text-sm font-medium text-zinc-200">Release to upload</p>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-300">
                  {dragOver ? "Release to upload" : "Drop files or click to browse"}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">PDF · Word · Excel · CSV · TXT</p>
              </>
            )}
          </div>

          {!uploading && !dragOver && (
            <div className="flex items-center gap-1 shrink-0">
              {["PDF", "DOC", "XLS"].map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-600 border border-zinc-700/40 font-mono">
                  {t}
                </span>
              ))}
            </div>
          )}
        </label>

        {/* ── File list ── */}
        <div className="px-6 mt-5 pb-6">
          {filesLoading ? (
            <div className="space-y-px">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-14 rounded-xl animate-pulse bg-zinc-900/60 border border-zinc-800/60 mb-px" />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <FolderOpen size={22} className="text-zinc-700" />
              </div>
              <p className="text-sm font-medium text-zinc-500">No files yet</p>
              <p className="text-xs text-zinc-700 mt-1 text-center max-w-[200px]">
                Upload documents to start building your knowledge base
              </p>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3 px-1">
                {files.length} indexed file{files.length !== 1 ? "s" : ""}
              </p>

              {/* ── ROW LIST ── */}
              <div className="rounded-xl border border-zinc-800/80 overflow-hidden">
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
                        className={`flex items-center gap-3 px-4 py-3 group transition-all duration-150 bg-zinc-900/30 hover:bg-zinc-900/70 ${!isLast ? "border-b border-zinc-800/60" : ""}`}
                      >
                        {/* File type icon */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                        >
                          <Icon size={13} style={{ color: cat.color }} />
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-zinc-200 truncate">{f.file_name}</p>
                        </div>

                        {/* Badge */}
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 hidden sm:inline"
                          style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}
                        >
                          {cat.label}
                        </span>

                        {/* Time */}
                        <div className="flex items-center gap-1 shrink-0 hidden md:flex">
                          <Clock size={9} className="text-zinc-700" />
                          <span className="text-[11px] text-zinc-600">{timeAgo(f.uploaded_at)}</span>
                        </div>

                        {/* Indexed check */}
                        <CheckCircle2 size={13} className="text-emerald-500/50 group-hover:text-emerald-500 transition-colors shrink-0" />

                        {/* Delete */}
                        <button
                          onClick={() => confirmDelete(f.file_name)}
                          disabled={deleting === f.file_name}
                          title="Delete"
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all text-zinc-600 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 shrink-0"
                        >
                          {deleting === f.file_name
                            ? <Loader2 size={13} className="animate-spin" />
                            : <Trash2 size={13} />
                          }
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